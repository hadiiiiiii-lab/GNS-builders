import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Calendar,
  AlertCircle,
  Play,
  Pause,
  CheckCircle2,
  PhoneCall,
  Radio,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useDemoContext } from '../context/DemoContext';
import { askAiReceptionist } from '../services/aiReceptionistService';
import { ChatMessage } from '../types/demo';
import { PropertyItem } from '../data/gnsData';

interface EnquiryAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export type VoiceAgentState =
  | 'idle'
  | 'requesting_permission'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'permission_denied'
  | 'unsupported'
  | 'error';

export interface VoiceErrorDetails {
  stage: 'capture' | 'recognition' | 'network' | 'output';
  code: string;
  title: string;
  message: string;
  suggestion?: string;
  isIframeRestricted?: boolean;
}

const SAMPLE_CALL_STEPS = [
  { role: 'assistant', text: 'Hello, thank you for calling GNS Real Estate Dubai. How may I assist your property search today?', delay: 2800 },
  { role: 'user', text: "Hi, I am looking for a two-bedroom apartment near the water, ideally Creek Harbour or close to Downtown.", delay: 3500 },
  { role: 'assistant', text: "Certainly. We have exceptional waterfront opportunities, particularly Oria at Dubai Creek Harbour by Emaar, offering one to three bedroom residences overlooking the creek promenade. What is your approximate target budget?", delay: 4200 },
  { role: 'user', text: 'Around 2.5 to 3 million dirhams. And I would prefer something completing within this year.', delay: 3500 },
  { role: 'assistant', text: "Understood. Oria fits that exact criteria with panoramic skyline vistas. I can arrange an in-person viewing of the creek promenade layout and available tranches. Would Thursday at 4:00 PM work for you?", delay: 4200 },
  { role: 'user', text: "Yes, Thursday at 4 PM works well. My name is Sarah Jenkins, phone +971 55 319 4018.", delay: 3500 },
  { role: 'assistant', text: "Thank you Sarah. I have recorded your viewing request for Oria at Dubai Creek Harbour for Thursday at 4:00 PM. A GNS property advisor will reach out to confirm your slot.", delay: 3200 },
];

const SAMPLE_RESPONSES = [
  { label: '2-Bed in Creek Harbour', query: 'Show me two-bedroom apartments in Dubai Creek Harbour' },
  { label: 'Town Square Villas', query: 'What luxury villas or townhouses are in Town Square under 3M?' },
  { label: 'Schedule Oria Viewing', query: 'I want to schedule an in-person viewing for Oria' },
  { label: 'Rental Lease Terms', query: 'What are Dubai rental lease payment terms?' },
  { label: 'Voice Receptionist Status', query: 'Voice agent status: is the receptionist active and ready?' },
];

export const EnquiryAssistant: React.FC<EnquiryAssistantProps> = ({ isOpen, onToggle, onClose }) => {
  const { properties, openViewingModal, logConversation } = useDemoContext();

  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: 'Hello, welcome to GNS Real Estate. Are you looking to buy, rent or explore off-plan properties?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickChoices: ['Buy a Home', 'Rent a Property', 'Explore Off-plan', 'Book a Viewing'],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [criteria, setCriteria] = useState<Record<string, string>>({});

  // Single source-of-truth State Machine
  const [voiceState, setVoiceState] = useState<VoiceAgentState>('idle');
  const [errorDetails, setErrorDetails] = useState<VoiceErrorDetails | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [currentlySpeakingText, setCurrentlySpeakingText] = useState<string | null>(null);
  const [testOutputSuccess, setTestOutputSuccess] = useState(false);

  // Simulation State
  const [simPlaying, setSimPlaying] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(0);
  const [simTranscript, setSimTranscript] = useState<Array<{ role: string; text: string; time: string }>>([]);

  // Lifecycle Refs
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const permissionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if embedded in iframe
  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;
  const standaloneUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Auto scroll chat
  useEffect(() => {
    if (activeTab === 'chat' && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isOpen, isLoading]);

  // Clean up media stream tracks
  const cleanupMediaStream = useCallback(() => {
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {}
      mediaStreamRef.current = null;
    }
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    activeUtteranceRef.current = null;
    setCurrentlySpeakingText(null);
    if (voiceState === 'speaking') {
      setVoiceState('idle');
    }
  }, [voiceState]);

  // Full audio cleanup
  const cleanupAllAudio = useCallback(() => {
    cleanupMediaStream();
    if (permissionTimeoutRef.current) {
      clearTimeout(permissionTimeoutRef.current);
      permissionTimeoutRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    stopSpeaking();
  }, [cleanupMediaStream, stopSpeaking]);

  // Clean up on unmount or modal close
  useEffect(() => {
    if (!isOpen) {
      cleanupAllAudio();
      if (voiceState === 'requesting_permission' || voiceState === 'listening' || voiceState === 'speaking') {
        setVoiceState('idle');
        setVoiceTranscript('');
      }
    }
  }, [isOpen, cleanupAllAudio, voiceState]);

  // Speech Synthesis helper
  const speakText = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setErrorDetails({
          stage: 'output',
          code: 'synthesis_unsupported',
          title: 'Speech Output Unsupported',
          message: 'Speech synthesis is not supported by your browser.',
        });
        setVoiceState('error');
        return;
      }

      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const preferredVoice =
            voices.find(
              (v) =>
                v.lang.startsWith('en') &&
                (v.name.includes('Natural') ||
                  v.name.includes('Google') ||
                  v.name.includes('Samantha') ||
                  v.name.includes('Daniel') ||
                  v.name.includes('English'))
            ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        utterance.onstart = () => {
          setVoiceState('speaking');
          setCurrentlySpeakingText(text);
        };

        utterance.onend = () => {
          activeUtteranceRef.current = null;
          setCurrentlySpeakingText(null);
          setVoiceState('idle');
          onEnd?.();
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e);
          activeUtteranceRef.current = null;
          setCurrentlySpeakingText(null);
          setVoiceState('idle');
          onEnd?.();
        };

        activeUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Error in speakText:', err);
        setVoiceState('idle');
        setCurrentlySpeakingText(null);
      }
    },
    []
  );

  // Test speaker voice output (Diagnostics stage 4)
  const testSpeakerOutput = () => {
    cleanupAllAudio();
    setErrorDetails(null);
    const greeting = 'Hello, this is the GNS Real Estate voice assistant in Dubai. Voice output is active and operational.';
    speakText(greeting, () => {
      setTestOutputSuccess(true);
      setTimeout(() => setTestOutputSuccess(false), 4000);
    });
  };

  // Main Handle User Send
  const handleUserSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    setInputMessage('');
    setErrorDetails(null);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const history = nextMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role as 'user' | 'assistant', text: m.text }));

      const res = await askAiReceptionist(userText, history, properties, criteria);

      if (res.extractedCriteria) {
        setCriteria((prev) => ({ ...prev, ...(res.extractedCriteria as Record<string, string>) }));
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickChoices: res.quickChoices,
        shortlist: res.shortlist,
        showViewingTrigger: res.suggestViewing,
      };

      setMessages((prev) => [...prev, botMsg]);

      // If in voice tab, speak answer and transition to speaking
      if (activeTab === 'voice') {
        speakText(res.reply);
      } else {
        setVoiceState('idle');
      }
    } catch {
      const fallbackReply = 'Our team will be delighted to guide you with current listings. Would you like to schedule an in-person or virtual viewing?';
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-fallback-${Date.now()}`,
          role: 'assistant',
          text: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickChoices: ['Book a Viewing', 'View Portfolio', 'Speak to an Advisor'],
        },
      ]);
      if (activeTab === 'voice') {
        speakText(fallbackReply);
      } else {
        setVoiceState('idle');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Start Mic: Explicit click only, strictly sequential states
  const handleStartMic = async () => {
    // Prevent duplicate clicks while already requesting or processing
    if (voiceState === 'requesting_permission' || voiceState === 'processing') {
      return;
    }

    cleanupAllAudio();
    setErrorDetails(null);
    setVoiceTranscript('');

    // Check browser compatibility for audio capture & recognition
    const SpeechRecognition =
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition || !navigator.mediaDevices?.getUserMedia) {
      setVoiceState('unsupported');
      setErrorDetails({
        stage: 'recognition',
        code: 'unsupported_browser',
        title: 'Browser Voice Recognition Unsupported',
        message: 'Your browser environment does not support Web Speech Recognition or microphone audio capture.',
        suggestion: 'Please use the typed chat assistant or test sample audio responses below.',
      });
      return;
    }

    // Enter requesting_permission state
    setVoiceState('requesting_permission');

    // 10-second timeout guard to prevent endless requesting state
    permissionTimeoutRef.current = setTimeout(() => {
      cleanupMediaStream();
      setVoiceState('error');
      setErrorDetails({
        stage: 'capture',
        code: 'permission_timeout',
        title: 'Microphone Request Timed Out',
        message: 'The browser permission prompt did not receive a response within 10 seconds.',
        suggestion: 'Please click "Start Mic" again and check for a permission prompt in your address bar.',
        isIframeRestricted: isEmbedded,
      });
    }, 10000);

    try {
      // Stage 1: Explicit Microphone Hardware & Permission Capture
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Permission granted! Clear timeout
      if (permissionTimeoutRef.current) {
        clearTimeout(permissionTimeoutRef.current);
        permissionTimeoutRef.current = null;
      }
      mediaStreamRef.current = stream;

      // Stage 2: Initialize Speech-to-Text Recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setVoiceState('listening');
        setVoiceTranscript('');
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        let isFinal = false;

        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        if (fullTranscript.trim()) {
          setVoiceTranscript(fullTranscript);
        }

        if (isFinal && fullTranscript.trim()) {
          cleanupMediaStream();
          try {
            recognition.stop();
          } catch {}
          setVoiceState('processing');
          handleUserSend(fullTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        cleanupMediaStream();

        if (event.error === 'not-allowed') {
          setVoiceState('permission_denied');
          setErrorDetails({
            stage: 'recognition',
            code: 'recognition_not_allowed',
            title: 'Speech Recognition Denied',
            message: isEmbedded
              ? 'Speech recognition service was denied by the embedded preview container permissions.'
              : 'Speech recognition access was blocked in browser settings.',
            suggestion: isEmbedded
              ? 'Embedded previews may restrict microphone access via permissions policy. Open the standalone preview URL to grant full access.'
              : 'Click the site settings icon in your address bar and enable microphone permissions.',
            isIframeRestricted: isEmbedded,
          });
        } else if (event.error === 'no-speech') {
          setVoiceState('error');
          setErrorDetails({
            stage: 'recognition',
            code: 'no_speech',
            title: 'No Speech Detected',
            message: 'No voice audio was detected during the listening period.',
            suggestion: 'Tap "Start Mic" again and speak directly into your microphone.',
          });
        } else if (event.error === 'audio-capture') {
          setVoiceState('error');
          setErrorDetails({
            stage: 'capture',
            code: 'audio_capture_failed',
            title: 'Microphone Audio Capture Failed',
            message: 'Audio input hardware failed to deliver sound to the speech engine.',
            suggestion: 'Ensure your microphone is properly plugged in and not muted.',
          });
        } else if (event.error === 'network') {
          setVoiceState('error');
          setErrorDetails({
            stage: 'network',
            code: 'network_timeout',
            title: 'Speech Network Service Error',
            message: 'The browser could not connect to the speech recognition service.',
            suggestion: 'Check your internet connection or use typed chat.',
          });
        } else if (event.error !== 'aborted') {
          setVoiceState('error');
          setErrorDetails({
            stage: 'recognition',
            code: event.error || 'speech_error',
            title: 'Speech Recognition Error',
            message: `Speech recognition encountered an issue: ${event.error}`,
            suggestion: 'Please try speaking again or use typed chat.',
          });
        }
      };

      recognition.onend = () => {
        cleanupMediaStream();
        // If it ended without an error or processing, return to idle
        setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      if (permissionTimeoutRef.current) {
        clearTimeout(permissionTimeoutRef.current);
        permissionTimeoutRef.current = null;
      }
      cleanupMediaStream();

      const errorName = err.name || '';

      if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError' || errorName === 'SecurityError') {
        setVoiceState('permission_denied');
        setErrorDetails({
          stage: 'capture',
          code: errorName,
          title: 'Microphone Access Denied',
          message: isEmbedded
            ? 'Microphone access is restricted in this embedded preview frame or by browser security policy.'
            : 'Microphone access was denied in your browser permissions.',
          suggestion: isEmbedded
            ? 'Embedded preview frames often restrict microphone access via parent iframe permissions. You can open the standalone preview URL to grant microphone access.'
            : 'Click the lock or site settings icon in your browser address bar, set Microphone to "Allow", and click Retry.',
          isIframeRestricted: isEmbedded,
        });
      } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
        setVoiceState('error');
        setErrorDetails({
          stage: 'capture',
          code: 'missing_microphone',
          title: 'No Microphone Found',
          message: 'No audio capture device was found on your system.',
          suggestion: 'Please connect a microphone or headset and retry.',
        });
      } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
        setVoiceState('error');
        setErrorDetails({
          stage: 'capture',
          code: 'device_in_use',
          title: 'Microphone Hardware In Use',
          message: 'The microphone is already in use by another application or locked by your operating system.',
          suggestion: 'Close other video or recording applications and try again.',
        });
      } else {
        setVoiceState('error');
        setErrorDetails({
          stage: 'capture',
          code: errorName || 'capture_error',
          title: 'Microphone Initialization Failed',
          message: err.message || 'Unable to access audio input device.',
          suggestion: 'Check your system audio input settings.',
        });
      }
    }
  };

  // Stop Mic explicitly
  const handleStopMic = () => {
    cleanupAllAudio();
    setVoiceState('idle');
    setVoiceTranscript('');
  };

  // Trigger Sample Response (Labelled clearly as "Try a sample response", does not claim live mic)
  const triggerSamplePrompt = (query: string) => {
    cleanupAllAudio();
    setErrorDetails(null);
    setVoiceTranscript(`" ${query} "`);
    setVoiceState('processing');
    handleUserSend(query);
  };

  // Sample Call Simulation Player
  const startSampleCall = () => {
    if (simPlaying) return;
    cleanupAllAudio();
    setErrorDetails(null);
    setSimPlaying(true);
    setSimStepIndex(0);
    setSimTranscript([]);

    const playStep = (index: number) => {
      if (index >= SAMPLE_CALL_STEPS.length) {
        setSimPlaying(false);
        logConversation({
          channel: 'Voice Call Simulation',
          visitorName: 'Sarah Jenkins',
          visitorContact: '+971 55 319 4018',
          summary: 'Simulation: Buyer inquired about 2-bed waterfront property in Creek Harbour. Scheduled viewing for Oria for Thursday at 4 PM.',
          transcript: SAMPLE_CALL_STEPS.map((s) => ({
            role: s.role as 'assistant' | 'user',
            text: s.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          })),
          extractedCriteria: {
            objective: 'Buy',
            location: 'Dubai Creek Harbour',
            budget: 'AED 2.5M – 5M',
            bedrooms: '2 Bedrooms',
            timeline: 'Immediate',
          },
        });
        return;
      }

      const step = SAMPLE_CALL_STEPS[index];
      setSimStepIndex(index);
      setSimTranscript((prev) => [
        ...prev,
        {
          role: step.role,
          text: step.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (step.role === 'assistant') {
        speakText(step.text, () => {
          simTimerRef.current = setTimeout(() => {
            playStep(index + 1);
          }, 800);
        });
      } else {
        simTimerRef.current = setTimeout(() => {
          playStep(index + 1);
        }, step.delay);
      }
    };

    playStep(0);
  };

  const stopSampleCall = () => {
    if (simTimerRef.current) {
      clearTimeout(simTimerRef.current);
    }
    stopSpeaking();
    setSimPlaying(false);
  };

  const resetChat = () => {
    cleanupAllAudio();
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        text: 'Hello, welcome to GNS Real Estate. Are you looking to buy, rent or explore off-plan properties?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickChoices: ['Buy a Home', 'Rent a Property', 'Explore Off-plan', 'Book a Viewing'],
      },
    ]);
    setCriteria({});
    setVoiceTranscript('');
    setErrorDetails(null);
    setVoiceState('idle');
  };

  return (
    <>
      {/* Floating Launcher Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 md:right-10 z-40">
        <button
          onClick={onToggle}
          className="flex items-center gap-2.5 px-4 py-3 bg-[#162E52] text-white rounded-full shadow-xl hover:bg-[#22417C] border border-white/20 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#22417C] group"
          aria-label={isOpen ? 'Close enquiry assistant' : 'Open GNS enquiry assistant'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4 text-[#DEBF84]" />
              <span className="text-xs font-medium tracking-wide">Close</span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DEBF84] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DEBF84]"></span>
              </span>
              <MessageSquare className="w-4 h-4 text-[#DEBF84]" />
              <span className="text-xs font-medium tracking-wide">Ask GNS</span>
              <span className="text-[10px] text-white/50 border-l border-white/20 pl-2 font-mono">
                Voice & Chat
              </span>
            </>
          )}
        </button>
      </div>

      {/* Assistant Flyout Window */}
      {isOpen && (
        <div
          className="fixed bottom-22 right-4 sm:right-6 md:right-10 z-40 w-[94vw] sm:w-[430px] bg-[#FAF9F5] border border-[#DCD9D3] rounded-xs shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[84vh] transition-all"
          role="dialog"
          aria-modal="true"
          aria-label="GNS AI Receptionist Demo"
        >
          {/* Header */}
          <div className="p-4 bg-[#162E52] text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#DEBF84]">
                  GNS Receptionist
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded-xs font-mono text-white/70">
                  Demo
                </span>
              </div>
              <p className="text-[11px] text-white/70 mt-0.5">
                Qualified guidance & property viewings · Dubai
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/demo-workspace"
                onClick={onClose}
                className="text-[10px] text-white/80 hover:text-[#DEBF84] border border-white/20 hover:border-[#DEBF84] px-2 py-1 rounded-xs transition-colors flex items-center gap-1"
                title="Open internal demo workspace"
              >
                <span>Workspace</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={onClose}
                className="p-1 text-white/70 hover:text-white rounded-xs cursor-pointer"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="bg-[#F0EEE9] px-3 py-1.5 border-b border-[#E6E4DF] flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  cleanupAllAudio();
                  setActiveTab('chat');
                }}
                className={`px-3 py-1 text-xs rounded-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-white text-[#162E52] shadow-xs'
                    : 'text-[#63605B] hover:text-[#1A1918]'
                }`}
              >
                Chat Assistant
              </button>
              <button
                onClick={() => setActiveTab('voice')}
                className={`px-3 py-1 text-xs rounded-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'voice'
                    ? 'bg-white text-[#162E52] shadow-xs'
                    : 'text-[#63605B] hover:text-[#1A1918]'
                }`}
              >
                <Radio className="w-3 h-3 text-[#162E52]" />
                <span>Voice Agent</span>
              </button>
            </div>

            {activeTab === 'chat' ? (
              <button
                onClick={resetChat}
                className="text-[11px] text-[#63605B] hover:text-[#162E52] flex items-center gap-1 cursor-pointer"
                title="Restart conversation"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            ) : (
              <button
                onClick={testSpeakerOutput}
                className="text-[11px] text-[#162E52] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                title="Verify speaker audio output"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#162E52]" />
                <span>Test Audio</span>
              </button>
            )}
          </div>

          {/* Tab 1: Chat Stream */}
          {activeTab === 'chat' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xs p-3 text-xs leading-relaxed relative ${
                      msg.role === 'user'
                        ? 'bg-[#162E52] text-white'
                        : 'bg-white border border-[#E6E4DF] text-[#1A1918] shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-black/5">
                      <div
                        className={`text-[9px] ${
                          msg.role === 'user' ? 'text-white/60' : 'text-[#7A7771]'
                        }`}
                      >
                        {msg.time}
                      </div>

                      {/* Read aloud button for assistant responses */}
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => {
                            if (voiceState === 'speaking' && currentlySpeakingText === msg.text) {
                              stopSpeaking();
                            } else {
                              speakText(msg.text);
                            }
                          }}
                          className="text-[10px] text-[#162E52] hover:text-[#22417C] flex items-center gap-1 cursor-pointer ml-3 font-mono"
                          title="Listen to this message"
                        >
                          {voiceState === 'speaking' && currentlySpeakingText === msg.text ? (
                            <>
                              <VolumeX className="w-3 h-3 text-rose-600" />
                              <span className="text-rose-600">Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-[#162E52]" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Shortlist Cards if present */}
                  {msg.shortlist && msg.shortlist.length > 0 && (
                    <div className="mt-2.5 w-full space-y-2 max-w-[95%]">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#736F68] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#162E52]" />
                        <span>Curated GNS Shortlist (Preliminary)</span>
                      </div>

                      <div className="space-y-2">
                        {msg.shortlist.map((prop: PropertyItem) => (
                          <div
                            key={prop.id}
                            className="p-2.5 bg-white border border-[#E6E4DF] rounded-xs shadow-xs hover:border-[#162E52] transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-semibold text-[#1A1918]">{prop.title}</h4>
                                <p className="text-[10px] text-[#736F68]">
                                  {prop.location} · {prop.developer}
                                </p>
                              </div>
                              <span className="text-[10px] font-medium text-[#162E52] bg-[#F2EFE9] px-1.5 py-0.5 rounded-xs shrink-0">
                                {prop.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#4A4742] mt-1.5 line-clamp-2">
                              {prop.description}
                            </p>
                            <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#F2EFE9]">
                              <span className="text-[10px] text-[#63605B]">{prop.priceNote}</span>
                              <button
                                onClick={() =>
                                  openViewingModal({
                                    id: prop.id,
                                    title: prop.title,
                                    location: prop.location,
                                  })
                                }
                                className="text-[10px] font-medium text-[#162E52] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <span>Request Viewing</span>
                                <Calendar className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggest Viewing Button CTA */}
                  {msg.showViewingTrigger && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          openViewingModal({
                            id: msg.showViewingTrigger!.propertyId,
                            title: msg.showViewingTrigger!.propertyTitle,
                            location: '',
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#DEBF84]" />
                        <span>Schedule Viewing Slot</span>
                      </button>
                    </div>
                  )}

                  {/* Quick Choices Buttons */}
                  {msg.quickChoices && msg.quickChoices.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.quickChoices.map((choice) => (
                        <button
                          key={choice}
                          onClick={() => handleUserSend(choice)}
                          className="px-2.5 py-1 text-[11px] bg-white border border-[#DCD9D3] hover:border-[#162E52] hover:bg-[#F2EFE9] text-[#2A2928] rounded-xs transition-colors cursor-pointer"
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#736F68] p-2 bg-white/70 border border-[#E6E4DF] rounded-xs w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#162E52] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#162E52]"></span>
                  </span>
                  <span>Reviewing GNS portfolio...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Tab 2: Voice Receptionist Panel */}
          {activeTab === 'voice' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between space-y-3.5">
              {/* Speaker Audio Test Success Toast */}
              {testOutputSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xs flex items-center gap-2 text-xs text-emerald-800 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Audio output verified! Device speaker and speech synthesis are operational.</span>
                </div>
              )}

              {/* Explicit Error / Permission Notice Banner */}
              {errorDetails && (
                <div
                  className={`p-3 rounded-xs border text-xs space-y-1.5 ${
                    errorDetails.stage === 'capture' || voiceState === 'permission_denied'
                      ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                      : errorDetails.stage === 'network'
                      ? 'bg-blue-50 border-blue-200 text-blue-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                      <span>{errorDetails.title}</span>
                      <span className="text-[10px] uppercase font-mono px-1 py-0.2 bg-black/5 rounded-xs text-[#555]">
                        Stage: {errorDetails.stage}
                      </span>
                    </div>
                    <button
                      onClick={() => setErrorDetails(null)}
                      className="text-black/50 hover:text-black p-0.5"
                      aria-label="Dismiss error"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] leading-relaxed text-[#444]">{errorDetails.message}</p>

                  {errorDetails.suggestion && (
                    <p className="text-[11px] text-[#222] font-medium leading-relaxed">
                      💡 {errorDetails.suggestion}
                    </p>
                  )}

                  {/* Standalone preview action if running in iframe */}
                  {errorDetails.isIframeRestricted && standaloneUrl && (
                    <div className="pt-1.5 flex items-center gap-2">
                      <a
                        href={standaloneUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors"
                      >
                        <span>Open Standalone Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="text-[10px] text-amber-900/80">
                        (Allows direct browser microphone prompt)
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Central Voice Call Console - Strictly driven by voiceState */}
              <div className="py-4 px-4 flex flex-col items-center justify-center space-y-3 bg-white border border-[#E6E4DF] rounded-xs shadow-xs">
                {/* Voice Status Pill - Never shows contradictory "Ready" when blocked */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-[10px] font-mono transition-colors ${
                      voiceState === 'requesting_permission'
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : voiceState === 'listening'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : voiceState === 'processing'
                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                        : voiceState === 'speaking'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : voiceState === 'permission_denied'
                        ? 'bg-amber-100/70 border-amber-400 text-amber-900 font-semibold'
                        : voiceState === 'unsupported' || voiceState === 'error'
                        ? 'bg-rose-100/70 border-rose-300 text-rose-900'
                        : 'bg-[#FAF9F5] border-[#E6E4DF] text-[#736F68]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        voiceState === 'requesting_permission'
                          ? 'bg-amber-500 animate-spin'
                          : voiceState === 'listening'
                          ? 'bg-rose-500 animate-ping'
                          : voiceState === 'processing'
                          ? 'bg-blue-600 animate-pulse'
                          : voiceState === 'speaking'
                          ? 'bg-emerald-600 animate-pulse'
                          : voiceState === 'permission_denied'
                          ? 'bg-amber-600'
                          : voiceState === 'unsupported' || voiceState === 'error'
                          ? 'bg-rose-600'
                          : 'bg-[#162E52]'
                      }`}
                    />
                    {voiceState === 'requesting_permission' && 'Requesting Microphone Permission...'}
                    {voiceState === 'listening' && 'Listening to Microphone'}
                    {voiceState === 'processing' && 'Processing Speech Query...'}
                    {voiceState === 'speaking' && 'Receptionist Speaking'}
                    {voiceState === 'permission_denied' && 'Microphone Permission Blocked'}
                    {voiceState === 'unsupported' && 'Voice Recognition Unsupported'}
                    {voiceState === 'error' && 'Voice Engine Error'}
                    {voiceState === 'idle' && (simPlaying ? 'Simulation Playing' : 'Voice Assistant Ready')}
                  </span>
                </div>

                {/* Animated Equalizer Waveform & Pulse Circle */}
                <div className="relative flex flex-col items-center justify-center my-1">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      voiceState === 'requesting_permission'
                        ? 'bg-amber-100/50 border-2 border-amber-500 animate-pulse'
                        : voiceState === 'listening'
                        ? 'bg-rose-100 border-2 border-rose-500 shadow-md ring-4 ring-rose-50'
                        : voiceState === 'processing'
                        ? 'bg-blue-100 border-2 border-blue-500 animate-pulse'
                        : voiceState === 'speaking' || simPlaying
                        ? 'bg-[#162E52]/10 border-2 border-[#162E52] ring-4 ring-[#162E52]/10'
                        : voiceState === 'permission_denied'
                        ? 'bg-amber-50 border-2 border-amber-400 text-amber-700'
                        : 'bg-[#F0EEE9] border border-[#DCD9D3]'
                    }`}
                  >
                    {voiceState === 'requesting_permission' ? (
                      <RefreshCw className="w-7 h-7 text-amber-700 animate-spin" />
                    ) : voiceState === 'listening' ? (
                      <Mic className="w-7 h-7 text-rose-600 animate-pulse" />
                    ) : voiceState === 'processing' ? (
                      <Sparkles className="w-7 h-7 text-blue-700 animate-spin" />
                    ) : voiceState === 'speaking' || simPlaying ? (
                      <Volume2 className="w-7 h-7 text-[#162E52] animate-bounce" />
                    ) : voiceState === 'permission_denied' ? (
                      <MicOff className="w-7 h-7 text-amber-700" />
                    ) : (
                      <Mic className="w-7 h-7 text-[#162E52]" />
                    )}
                  </div>

                  {/* 5-Bar Equalizer animation during active sound */}
                  {(voiceState === 'listening' || voiceState === 'speaking' || simPlaying) && (
                    <div className="flex items-center gap-1 mt-2.5 h-5">
                      <span className="w-1 bg-[#162E52] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-4" />
                      <span className="w-1 bg-[#162E52] rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s] h-5" />
                      <span className="w-1 bg-[#DEBF84] rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.2s] h-3" />
                      <span className="w-1 bg-[#162E52] rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.15s] h-5" />
                      <span className="w-1 bg-[#162E52] rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.25s] h-4" />
                    </div>
                  )}
                </div>

                {/* Subtitle / Status Explanation */}
                <div className="text-center space-y-1 w-full max-w-xs">
                  <div className="text-xs font-semibold text-[#1A1918]">
                    {voiceState === 'requesting_permission' && 'Please grant microphone access in your browser...'}
                    {voiceState === 'listening' && 'Listening to your voice... Speak now'}
                    {voiceState === 'processing' && 'Analyzing requirements with GNS portfolio...'}
                    {voiceState === 'speaking' && 'Playing spoken response...'}
                    {voiceState === 'permission_denied' && 'Microphone access is unavailable.'}
                    {voiceState === 'unsupported' && 'Voice recognition is not supported in this browser.'}
                    {voiceState === 'error' && 'Voice interaction stopped due to an error.'}
                    {voiceState === 'idle' && (simPlaying ? `Simulating Buyer Call (${simStepIndex + 1}/${SAMPLE_CALL_STEPS.length})` : 'Speak via Mic or try a sample response')}
                  </div>

                  {/* Dynamic Transcript Area - NEVER shows "Connecting..." when blocked */}
                  <div className="p-2 bg-[#FAF9F5] border border-[#E6E4DF] rounded-xs text-[11px] text-[#4A4742] min-h-[38px] flex items-center justify-center text-center">
                    {voiceState === 'requesting_permission' ? (
                      <span className="text-amber-700 italic">Waiting for microphone permission approval...</span>
                    ) : voiceState === 'listening' ? (
                      <span className="text-rose-700 font-medium">{voiceTranscript || 'Listening... Speak clearly into your mic'}</span>
                    ) : voiceState === 'processing' ? (
                      <span className="text-blue-700 italic">{voiceTranscript || 'Evaluating current property listings...'}</span>
                    ) : voiceState === 'permission_denied' ? (
                      <span className="text-amber-800 text-[10px]">Permission blocked. Use typed chat or try a sample response below.</span>
                    ) : voiceTranscript ? (
                      <span className="italic">{voiceTranscript}</span>
                    ) : (
                      <span className="text-[#736F68] italic">“Ask about 2-bed in Creek Harbour, Town Square villas, or viewings...”</span>
                    )}
                  </div>
                </div>

                {/* Microphone Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {voiceState === 'listening' ? (
                    <>
                      <button
                        onClick={handleStopMic}
                        className="px-4 py-2 text-xs font-medium rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs bg-rose-600 text-white hover:bg-rose-700"
                      >
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop Mic</span>
                      </button>

                      {voiceTranscript.trim() && (
                        <button
                          onClick={() => {
                            const captured = voiceTranscript.trim();
                            cleanupMediaStream();
                            try {
                              recognitionRef.current?.stop();
                            } catch {}
                            setVoiceState('processing');
                            handleUserSend(captured);
                          }}
                          className="px-3 py-2 text-xs bg-emerald-700 text-white rounded-xs hover:bg-emerald-800 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                          title="Send captured voice query"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Now</span>
                        </button>
                      )}
                    </>
                  ) : voiceState === 'requesting_permission' ? (
                    <button
                      disabled
                      className="px-4 py-2 text-xs font-medium rounded-xs flex items-center gap-1.5 bg-[#162E52]/70 text-white opacity-80 cursor-wait shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Requesting Access...</span>
                    </button>
                  ) : voiceState === 'permission_denied' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleStartMic}
                        className="px-3.5 py-2 text-xs font-medium rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs bg-[#162E52] text-white hover:bg-[#22417C]"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Permission</span>
                      </button>

                      <button
                        onClick={() => {
                          cleanupAllAudio();
                          setActiveTab('chat');
                        }}
                        className="px-3 py-2 text-xs border border-[#DCD9D3] text-[#1A1918] bg-white hover:bg-[#F2EFE9] rounded-xs cursor-pointer transition-colors"
                      >
                        <span>Use Typed Chat</span>
                      </button>
                    </div>
                  ) : voiceState === 'speaking' ? (
                    <button
                      onClick={stopSpeaking}
                      className="px-4 py-2 text-xs border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Stop Audio</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStartMic}
                      disabled={voiceState === 'processing'}
                      className="px-4 py-2 text-xs font-medium rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs bg-[#162E52] text-white hover:bg-[#22417C] disabled:opacity-50"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Start Mic</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sample Responses Section (Accurately labelled: tests response synthesis, does not claim live mic) */}
              <div className="p-3 bg-white border border-[#E6E4DF] rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1A1918] flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-[#162E52]" />
                    <span>Sample Responses (Audio Output Test)</span>
                  </span>
                  <span className="text-[10px] text-[#162E52] bg-[#F2EFE9] border border-[#DCD9D3] px-1.5 py-0.5 rounded-xs font-mono">
                    Try a sample response
                  </span>
                </div>
                <p className="text-[11px] text-[#736F68] leading-relaxed">
                  Test how the AI receptionist formats Dubai property recommendations and speaks responses. These samples verify response logic and speech synthesis (they do not test your microphone hardware or place phone calls).
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SAMPLE_RESPONSES.map((prompt) => (
                    <button
                      key={prompt.label}
                      onClick={() => triggerSamplePrompt(prompt.query)}
                      className="px-2.5 py-1.5 text-[11px] text-left bg-[#FAF9F5] border border-[#DCD9D3] hover:border-[#162E52] hover:bg-[#F2EFE9] text-[#1A1918] rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer group"
                    >
                      <Volume2 className="w-3 h-3 text-[#162E52] group-hover:scale-110 transition-transform" />
                      <span>{prompt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Fictional Buyer Call Simulation */}
              <div className="p-3 bg-[#F0EEE9] border border-[#E6E4DF] rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1A1918] flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 text-[#162E52]" />
                    <span>Sample Buyer Call Simulation (Sarah Jenkins)</span>
                  </span>
                  <span className="text-[10px] text-[#736F68] font-mono">2-Bed Creek Call</span>
                </div>
                <p className="text-[11px] text-[#63605B]">
                  Hear a full scripted phone interaction demonstrating qualification, unit suggestions, and slot scheduling.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  {simPlaying ? (
                    <button
                      onClick={stopSampleCall}
                      className="px-3 py-1.5 text-xs bg-rose-600 text-white rounded-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Simulation</span>
                    </button>
                  ) : (
                    <button
                      onClick={startSampleCall}
                      className="px-3 py-1.5 text-xs bg-[#162E52] text-white rounded-xs flex items-center gap-1 cursor-pointer hover:bg-[#22417C]"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Play Full Simulation</span>
                    </button>
                  )}
                </div>

                {simTranscript.length > 0 && (
                  <div className="mt-2 p-2 bg-white border border-[#DCD9D3] rounded-xs max-h-36 overflow-y-auto space-y-1.5 text-[11px]">
                    {simTranscript.map((st, idx) => (
                      <div
                        key={idx}
                        className={`p-1.5 rounded-xs leading-snug ${
                          st.role === 'assistant' ? 'bg-[#FAF9F5] border-l-2 border-[#162E52]' : 'bg-blue-50/50'
                        }`}
                      >
                        <strong className={st.role === 'user' ? 'text-blue-900' : 'text-[#162E52]'}>
                          {st.role === 'user' ? 'Buyer (Sarah): ' : 'GNS AI: '}
                        </strong>
                        <span className="text-[#3A3834]">{st.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          {activeTab === 'chat' && (
            <div className="p-3 bg-[#FAF9F5] border-t border-[#E6E4DF] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserSend(inputMessage);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask about properties, viewings or requirements..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 p-2 text-xs bg-white border border-[#DCD9D3] rounded-xs focus:outline-2 focus:outline-[#162E52] text-[#1A1918]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('voice');
                    handleStartMic();
                  }}
                  className="p-2 border border-[#DCD9D3] bg-white text-[#63605B] hover:text-[#162E52] rounded-xs cursor-pointer transition-colors"
                  title="Voice input (switch to voice tab)"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 bg-[#162E52] text-white rounded-xs disabled:opacity-40 hover:bg-[#22417C] cursor-pointer transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-2 text-[10px] text-[#7A7771] flex items-center justify-between">
                <span>Grounded strictly in verified GNS portfolio</span>
                <Link
                  to="/demo-workspace"
                  onClick={onClose}
                  className="underline hover:text-[#162E52]"
                >
                  Demo Operations →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
