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
  PhoneOff,
  Radio,
  RefreshCw,
  HandMetal,
  StopCircle,
} from 'lucide-react';
import { useDemoContext } from '../context/DemoContext';
import { askAiReceptionist } from '../services/aiReceptionistService';
import { VoiceAgentEngine, CallStatus, CallMessage } from '../services/voiceAgentEngine';
import { ChatMessage } from '../types/demo';
import { PropertyItem } from '../data/gnsData';

interface EnquiryAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export interface VoiceErrorDetails {
  stage: 'capture' | 'recognition' | 'network' | 'output';
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

const ONE_CLICK_TESTS = [
  { label: '2-Bed in Creek Harbour', query: 'Show me two-bedroom apartments in Dubai Creek Harbour', desc: 'Waterfront inquiry' },
  { label: 'Town Square 3-Bed Villas', query: 'What villas or townhouses are available in Town Square?', desc: 'Family investment' },
  { label: 'Interrupt & Switch to Rent', query: 'Wait, stop! Actually I want to rent instead, what are annual cheque terms?', desc: 'Interruption test' },
  { label: 'Urdu/Hindi: Voice Agent Check', query: 'Voice agent check: kya aap online aur active hain?', desc: 'Regional voice & language' },
  { label: 'Schedule Oria Viewing', query: 'I would like to schedule an in-person viewing for Oria', desc: 'Viewing request' },
];

export const EnquiryAssistant: React.FC<EnquiryAssistantProps> = ({ isOpen, onToggle, onClose }) => {
  const { properties, openViewingModal, logConversation } = useDemoContext();

  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');

  // Text Chat State
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

  // Real-Time Voice Agent State
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [errorDetails, setErrorDetails] = useState<VoiceErrorDetails | null>(null);
  const [callMessages, setCallMessages] = useState<CallMessage[]>([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [inputAudioLevel, setInputAudioLevel] = useState(0);
  const [outputAudioLevel, setOutputAudioLevel] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [interruptedNotice, setInterruptedNotice] = useState(false);
  const [suggestedProperties, setSuggestedProperties] = useState<PropertyItem[]>([]);
  const [speakerTestSuccess, setSpeakerTestSuccess] = useState(false);

  // Scripted Call Simulation State
  const [simPlaying, setSimPlaying] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(0);
  const [simTranscript, setSimTranscript] = useState<Array<{ role: string; text: string; time: string }>>([]);

  // Lifecycle Refs
  const engineRef = useRef<VoiceAgentEngine | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const callEndRef = useRef<HTMLDivElement>(null);

  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;
  const standaloneUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === 'chat' && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isOpen, isLoading]);

  // Auto-scroll call transcript
  useEffect(() => {
    if (activeTab === 'voice' && isOpen) {
      callEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [callMessages, interimTranscript, activeTab, isOpen]);

  // Call duration timer
  useEffect(() => {
    const isCallActive =
      callStatus === 'connected' ||
      callStatus === 'listening' ||
      callStatus === 'processing' ||
      callStatus === 'speaking' ||
      callStatus === 'interrupted';

    if (isCallActive) {
      if (!timerIntervalRef.current) {
        timerIntervalRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      }
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (callStatus === 'idle') {
        setCallDuration(0);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [callStatus]);

  // Initialize VoiceAgentEngine
  const getOrCreateEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new VoiceAgentEngine(
        {
          onStatusChange: (status) => setCallStatus(status),
          onAudioLevels: (inLevel, outLevel) => {
            setInputAudioLevel(inLevel);
            setOutputAudioLevel(outLevel);
          },
          onTranscript: (interim) => setInterimTranscript(interim),
          onNewMessage: (msg) => {
            setCallMessages((prev) => [...prev, msg]);
          },
          onInterrupted: () => {
            setInterruptedNotice(true);
            setTimeout(() => setInterruptedNotice(false), 2000);
          },
          onError: (err) => {
            setErrorDetails({
              stage: err.stage as any,
              title: err.title,
              message: err.message,
              isIframeRestricted: err.isIframeRestricted,
            });
          },
          onPropertiesMatched: (props) => {
            setSuggestedProperties(props);
          },
        },
        properties
      );
    } else {
      engineRef.current.updateProperties(properties);
    }
    return engineRef.current;
  }, [properties]);

  // Stop everything safely
  const stopAllVoiceSessions = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.endCall();
    }
    if (simTimerRef.current) {
      clearTimeout(simTimerRef.current);
      simTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setSimPlaying(false);
    setInputAudioLevel(0);
    setOutputAudioLevel(0);
  }, []);

  // Clean up when modal closes or unmounts
  useEffect(() => {
    if (!isOpen) {
      stopAllVoiceSessions();
      setCallStatus('idle');
      setInterimTranscript('');
      setErrorDetails(null);
    }
  }, [isOpen, stopAllVoiceSessions]);

  // Start hands-free voice call
  const handleStartCall = async () => {
    setErrorDetails(null);
    setCallMessages([]);
    setSuggestedProperties([]);
    setCallDuration(0);
    setIsMuted(false);

    const engine = getOrCreateEngine();
    await engine.startCall();
  };

  // End voice call
  const handleEndCall = () => {
    stopAllVoiceSessions();
  };

  // Mute toggle
  const handleToggleMute = () => {
    if (engineRef.current) {
      const muted = engineRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  // Manual interrupt button
  const handleInterruptAgent = () => {
    if (engineRef.current) {
      engineRef.current.handleInterruption();
    }
  };

  // Test Speaker Audio
  const handleTestSpeaker = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setErrorDetails({
        stage: 'output',
        title: 'Speaker Output Unsupported',
        message: 'Speech synthesis is not supported in this browser.',
      });
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        'Assalamu alaikum and hello. This is GNS Real Estate Dubai. Audio output and speech synthesis are fully active.'
      );
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang === 'en-IN' || v.name.toLowerCase().includes('india')) ||
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setSpeakerTestSuccess(true);
        setTimeout(() => setSpeakerTestSuccess(false), 3500);
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  // 1-Click Interactive Test Prompt (handles voice response without requiring mic hardware)
  const triggerOneClickTest = async (query: string) => {
    setErrorDetails(null);

    // If call is not currently active, initialize a connected session
    if (
      callStatus !== 'connected' &&
      callStatus !== 'listening' &&
      callStatus !== 'speaking' &&
      callStatus !== 'processing'
    ) {
      setCallStatus('connected');
    }

    const engine = getOrCreateEngine();
    await engine.handleUserSpokenSentence(query);
  };

  // Chat send message
  const handleUserSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    setInputMessage('');

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
    } catch {
      const fallbackReply =
        'Our team will be delighted to guide you with current listings. Would you like to schedule an in-person or virtual viewing?';
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
    } finally {
      setIsLoading(false);
    }
  };

  // Sample Call Simulation
  const startSampleCall = () => {
    if (simPlaying) return;
    stopAllVoiceSessions();
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
        const utter = new SpeechSynthesisUtterance(step.text);
        utter.onend = () => {
          simTimerRef.current = setTimeout(() => {
            playStep(index + 1);
          }, 800);
        };
        utter.onerror = () => {
          simTimerRef.current = setTimeout(() => {
            playStep(index + 1);
          }, 1000);
        };
        window.speechSynthesis.speak(utter);
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSimPlaying(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const isCallActive =
    callStatus === 'connected' ||
    callStatus === 'listening' ||
    callStatus === 'processing' ||
    callStatus === 'speaking' ||
    callStatus === 'interrupted';

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
              <PhoneCall className="w-4 h-4 text-[#DEBF84]" />
              <span className="text-xs font-medium tracking-wide">Ask GNS</span>
              <span className="text-[10px] text-white/50 border-l border-white/20 pl-2 font-mono">
                Voice & Chat
              </span>
            </>
          )}
        </button>
      </div>

      {/* Assistant Window */}
      {isOpen && (
        <div
          className="fixed bottom-22 right-4 sm:right-6 md:right-10 z-40 w-[94vw] sm:w-[450px] bg-[#FAF9F5] border border-[#DCD9D3] rounded-xs shadow-2xl overflow-hidden flex flex-col h-[670px] max-h-[85vh] transition-all"
          role="dialog"
          aria-modal="true"
          aria-label="GNS AI Receptionist & Voice Advisor"
        >
          {/* Header */}
          <div className="p-3.5 bg-[#162E52] text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#DEBF84]">
                  GNS Real Estate
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded-xs font-mono text-white/70">
                  AI Receptionist
                </span>
              </div>
              <p className="text-[11px] text-white/70 mt-0.5">
                Qualified advisory, viewings & voice calls · Dubai
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
                onClick={() => setActiveTab('chat')}
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
                <PhoneCall className="w-3 h-3 text-[#162E52]" />
                <span>Voice Agent</span>
                {isCallActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                )}
              </button>
            </div>

            {activeTab === 'voice' && (
              <button
                onClick={handleTestSpeaker}
                className="text-[11px] text-[#162E52] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                title="Test speaker output"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#162E52]" />
                <span>Audio Check</span>
              </button>
            )}
          </div>

          {/* Tab 1: Text Chat */}
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
                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-black/5 text-[9px] text-[#7A7771]">
                      <span>{msg.time}</span>
                    </div>
                  </div>

                  {/* Curated Shortlist */}
                  {msg.shortlist && msg.shortlist.length > 0 && (
                    <div className="mt-2.5 w-full space-y-2 max-w-[95%]">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#736F68] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#162E52]" />
                        <span>Curated GNS Shortlist</span>
                      </div>
                      <div className="space-y-2">
                        {msg.shortlist.map((prop: PropertyItem) => (
                          <div
                            key={prop.id}
                            className="p-2.5 bg-white border border-[#E6E4DF] rounded-xs shadow-xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-semibold text-[#1A1918]">{prop.title}</h4>
                                <p className="text-[10px] text-[#736F68]">
                                  {prop.location} · {prop.developer}
                                </p>
                              </div>
                              <span className="text-[10px] font-medium text-[#162E52] bg-[#F2EFE9] px-1.5 py-0.5 rounded-xs">
                                {prop.type}
                              </span>
                            </div>
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

                  {/* Suggest Viewing Button */}
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

                  {/* Quick Choices */}
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

          {/* Tab 2: Full-Duplex Real-Time Voice Agent */}
          {activeTab === 'voice' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between space-y-3">
              {/* Audio Verification Success Toast */}
              {speakerTestSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xs flex items-center gap-2 text-xs text-emerald-800 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Speaker verified! Real-time voice delivery is functioning properly.</span>
                </div>
              )}

              {/* Interruption Notice Pill */}
              {interruptedNotice && (
                <div className="p-2 bg-amber-50 border border-amber-300 rounded-xs flex items-center justify-between text-xs text-amber-900 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-medium">
                    <HandMetal className="w-3.5 h-3.5 text-amber-700" />
                    <span>Agent interrupted! Playback stopped immediately & listening to your voice.</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-700">Instant Flush</span>
                </div>
              )}

              {/* Explicit Permission / Device Notice */}
              {errorDetails && (
                <div
                  className={`p-3 rounded-xs border text-xs space-y-1.5 ${
                    errorDetails.stage === 'capture' || callStatus === 'permission_denied'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                      <span>{errorDetails.title}</span>
                    </div>
                    <button
                      onClick={() => setErrorDetails(null)}
                      className="text-black/50 hover:text-black p-0.5"
                      aria-label="Dismiss notice"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#444]">{errorDetails.message}</p>

                  {errorDetails.isIframeRestricted && standaloneUrl && (
                    <div className="pt-1 flex items-center gap-2">
                      <a
                        href={standaloneUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#162E52] hover:bg-[#22417C] rounded-xs shadow-xs transition-colors"
                      >
                        <span>Open Standalone Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Main Call Deck */}
              <div className="bg-white border border-[#E6E4DF] rounded-xs p-4 shadow-xs space-y-3">
                {/* Call Header / Status / Timer */}
                <div className="flex items-center justify-between border-b border-[#F0EEE9] pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        callStatus === 'speaking'
                          ? 'bg-emerald-500 animate-pulse'
                          : callStatus === 'listening'
                          ? 'bg-rose-500 animate-ping'
                          : callStatus === 'processing'
                          ? 'bg-blue-500 animate-spin'
                          : callStatus === 'interrupted'
                          ? 'bg-amber-500'
                          : isCallActive
                          ? 'bg-emerald-600'
                          : 'bg-[#999]'
                      }`}
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#1A1918] block">
                        {callStatus === 'requesting_permission' && 'Requesting Mic Access...'}
                        {callStatus === 'listening' && 'Listening hands-free...'}
                        {callStatus === 'processing' && 'Thinking & consulting inventory...'}
                        {callStatus === 'speaking' && 'Advisor Speaking (Interruptible)'}
                        {callStatus === 'interrupted' && 'Interrupted — Listening to you'}
                        {callStatus === 'permission_denied' && 'Microphone Access Denied'}
                        {callStatus === 'error' && 'Voice Session Error'}
                        {callStatus === 'idle' && 'Voice Advisory Ready'}
                        {callStatus === 'ended' && 'Call Completed'}
                      </span>
                      <span className="text-[10px] text-[#736F68]">
                        South Asian / Indian English · Full Duplex
                      </span>
                    </div>
                  </div>

                  {isCallActive && (
                    <div className="text-right">
                      <span className="text-xs font-mono font-semibold text-[#162E52] bg-[#F2EFE9] px-2 py-0.5 rounded-xs">
                        {formatTimer(callDuration)}
                      </span>
                      <span className="block text-[9px] text-[#736F68] mt-0.5">Live Call</span>
                    </div>
                  )}
                </div>

                {/* Animated Waveform & Energy Visualizers */}
                {isCallActive && (
                  <div className="bg-[#FAF9F5] border border-[#E6E4DF] p-2.5 rounded-xs space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-[#736F68]">
                      <span>Microphone Input (You)</span>
                      <div className="flex items-center gap-1 h-3">
                        {[0.2, 0.4, 0.6, 0.8, 1.0].map((step, idx) => (
                          <span
                            key={idx}
                            className={`w-1 rounded-full transition-all duration-75 ${
                              inputAudioLevel >= step
                                ? 'bg-rose-600 h-3'
                                : 'bg-neutral-300 h-1.5'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#736F68]">
                      <span>Advisor Voice (Output)</span>
                      <div className="flex items-center gap-1 h-3">
                        {[0.2, 0.4, 0.6, 0.8, 1.0].map((step, idx) => (
                          <span
                            key={idx}
                            className={`w-1 rounded-full transition-all duration-75 ${
                              outputAudioLevel >= step
                                ? 'bg-[#162E52] h-3'
                                : 'bg-neutral-300 h-1.5'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Call Action Controls */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {!isCallActive ? (
                    <button
                      onClick={handleStartCall}
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs text-xs font-medium flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Start Hands-Free Voice Call</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleToggleMute}
                        className={`px-3 py-2 text-xs rounded-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
                          isMuted
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-white border-[#DCD9D3] text-[#1A1918] hover:bg-[#F2EFE9]'
                        }`}
                        title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                      >
                        {isMuted ? <MicOff className="w-3.5 h-3.5 text-amber-700" /> : <Mic className="w-3.5 h-3.5" />}
                        <span>{isMuted ? 'Muted' : 'Mute'}</span>
                      </button>

                      {callStatus === 'speaking' && (
                        <button
                          onClick={handleInterruptAgent}
                          className="px-3 py-2 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer animate-pulse"
                          title="Interrupt the agent immediately"
                        >
                          <HandMetal className="w-3.5 h-3.5" />
                          <span>Interrupt & Speak</span>
                        </button>
                      )}

                      <button
                        onClick={handleEndCall}
                        className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <PhoneOff className="w-3.5 h-3.5" />
                        <span>End Call</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Live Spoken Call Transcript */}
              {isCallActive && (
                <div className="flex-1 bg-white border border-[#E6E4DF] rounded-xs p-3 overflow-y-auto max-h-48 space-y-2 text-xs">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#736F68] border-b border-[#F0EEE9] pb-1">
                    Live Call Transcript
                  </div>

                  {callMessages.length === 0 && !interimTranscript && (
                    <p className="text-[11px] text-[#736F68] italic">
                      Advisor connected. Speak naturally into your microphone...
                    </p>
                  )}

                  {callMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded-xs text-[11px] leading-relaxed ${
                        msg.role === 'assistant'
                          ? 'bg-[#FAF9F5] border-l-2 border-[#162E52]'
                          : 'bg-blue-50/60 border-l-2 border-blue-600'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] text-[#736F68] mb-0.5">
                        <strong className={msg.role === 'assistant' ? 'text-[#162E52]' : 'text-blue-900'}>
                          {msg.role === 'assistant' ? 'GNS Advisor' : 'You'}
                        </strong>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-[#2A2928]">{msg.text}</p>
                    </div>
                  ))}

                  {/* Real-time Interim User Utterance */}
                  {interimTranscript && (
                    <div className="p-2 rounded-xs bg-blue-50/30 border-l-2 border-dashed border-blue-400 text-[11px] text-[#444] animate-pulse">
                      <span className="text-[9px] text-blue-700 block font-semibold">You (speaking...):</span>
                      <span>{interimTranscript}</span>
                    </div>
                  )}

                  <div ref={callEndRef} />
                </div>
              )}

              {/* Matched Property Cards inside Voice Call */}
              {suggestedProperties.length > 0 && (
                <div className="bg-[#FAF9F5] border border-[#DEBF84]/60 p-2.5 rounded-xs space-y-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#162E52] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#DEBF84]" />
                    <span>Discussed Properties</span>
                  </span>
                  <div className="space-y-1.5">
                    {suggestedProperties.map((prop) => (
                      <div
                        key={prop.id}
                        className="bg-white p-2 border border-[#E6E4DF] rounded-xs flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-[#1A1918]">{prop.title}</div>
                          <div className="text-[10px] text-[#736F68]">{prop.location}</div>
                        </div>
                        <button
                          onClick={() =>
                            openViewingModal({
                              id: prop.id,
                              title: prop.title,
                              location: prop.location,
                            })
                          }
                          className="px-2 py-1 text-[10px] bg-[#162E52] text-white hover:bg-[#22417C] rounded-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Book Viewing</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 1-Click Interactive Test Scenarios (Never stuck even if mic blocked) */}
              <div className="p-3 bg-white border border-[#E6E4DF] rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1A1918] flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-[#162E52]" />
                    <span>Instant Voice Queries & Scenarios</span>
                  </span>
                  <span className="text-[10px] text-[#162E52] bg-[#F2EFE9] border border-[#DCD9D3] px-1.5 py-0.5 rounded-xs font-mono">
                    1-Click Test
                  </span>
                </div>
                <p className="text-[11px] text-[#736F68] leading-relaxed">
                  Test property queries, bilingual Urdu/Hindi code-switching, and instant mid-sentence interruption without requiring external audio hardware.
                </p>

                <div className="grid grid-cols-1 gap-1.5 pt-1">
                  {ONE_CLICK_TESTS.map((test) => (
                    <button
                      key={test.label}
                      onClick={() => triggerOneClickTest(test.query)}
                      className="px-2.5 py-1.5 text-[11px] text-left bg-[#FAF9F5] border border-[#DCD9D3] hover:border-[#162E52] hover:bg-[#F2EFE9] text-[#1A1918] rounded-xs transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-1.5">
                        <Volume2 className="w-3 h-3 text-[#162E52] shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{test.label}</span>
                      </div>
                      <span className="text-[10px] text-[#736F68] font-mono">{test.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scripted Simulation */}
              <div className="p-3 bg-[#F0EEE9] border border-[#E6E4DF] rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1A1918] flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 text-[#162E52]" />
                    <span>Full Scripted Phone Call Simulation</span>
                  </span>
                  <span className="text-[10px] text-[#736F68] font-mono">Buyer Call</span>
                </div>

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
                      <span>Play Sarah Jenkins Call</span>
                    </button>
                  )}
                </div>

                {simTranscript.length > 0 && (
                  <div className="mt-2 p-2 bg-white border border-[#DCD9D3] rounded-xs max-h-32 overflow-y-auto space-y-1.5 text-[11px]">
                    {simTranscript.map((st, idx) => (
                      <div
                        key={idx}
                        className={`p-1.5 rounded-xs leading-snug ${
                          st.role === 'assistant'
                            ? 'bg-[#FAF9F5] border-l-2 border-[#162E52]'
                            : 'bg-blue-50/50'
                        }`}
                      >
                        <strong className={st.role === 'user' ? 'text-blue-900' : 'text-[#162E52]'}>
                          {st.role === 'user' ? 'Buyer (Sarah): ' : 'GNS Advisor: '}
                        </strong>
                        <span className="text-[#3A3834]">{st.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Chat Input Bar */}
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
                    handleStartCall();
                  }}
                  className="p-2 border border-[#DCD9D3] bg-white text-[#63605B] hover:text-[#162E52] rounded-xs cursor-pointer transition-colors"
                  title="Switch to Voice Call"
                >
                  <PhoneCall className="w-4 h-4" />
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
