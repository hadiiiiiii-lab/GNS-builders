import { PropertyItem } from '../data/gnsData';
import { askAiReceptionist, AssistantResponse } from './aiReceptionistService';

export type CallStatus =
  | 'idle'
  | 'requesting_permission'
  | 'connected'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'interrupted'
  | 'permission_denied'
  | 'unsupported'
  | 'error'
  | 'ended';

export interface CallMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  time: string;
  wasInterrupted?: boolean;
}

export interface VoiceAgentEngineCallbacks {
  onStatusChange: (status: CallStatus) => void;
  onAudioLevels: (inputLevel: number, outputLevel: number) => void;
  onTranscript: (interimText: string) => void;
  onNewMessage: (msg: CallMessage) => void;
  onInterrupted: () => void;
  onError: (error: { title: string; message: string; stage: string; isIframeRestricted?: boolean }) => void;
  onPropertiesMatched?: (properties: PropertyItem[]) => void;
}

export class VoiceAgentEngine {
  private status: CallStatus = 'idle';
  private callbacks: VoiceAgentEngineCallbacks;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyserNode: AnalyserNode | null = null;
  private speechSourceNode: AudioBufferSourceNode | null = null;
  private recognition: any = null;
  private ws: WebSocket | null = null;
  private isMuted: boolean = false;
  private animFrameId: number | null = null;
  private conversationHistory: Array<{ role: 'user' | 'assistant'; text: string }> = [];
  private criteria: Record<string, any> = {};
  private properties: PropertyItem[] = [];
  private isAgentSpeaking: boolean = false;
  private consecutiveUserAudioFrames: number = 0;
  private isManuallyStopped: boolean = false;
  private speechActiveUtterance: SpeechSynthesisUtterance | null = null;

  constructor(callbacks: VoiceAgentEngineCallbacks, properties: PropertyItem[]) {
    this.callbacks = callbacks;
    this.properties = properties;
  }

  public updateProperties(properties: PropertyItem[]) {
    this.properties = properties;
  }

  public getStatus(): CallStatus {
    return this.status;
  }

  private setStatus(newStatus: CallStatus) {
    this.status = newStatus;
    this.callbacks.onStatusChange(newStatus);
  }

  /**
   * Start hands-free voice call
   */
  public async startCall(): Promise<void> {
    this.isManuallyStopped = false;
    this.conversationHistory = [];
    this.setStatus('requesting_permission');

    // 1. Check browser support
    const hasMedia = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
    const hasSpeechRec = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    if (!hasMedia && !hasSpeechRec) {
      this.callbacks.onError({
        stage: 'capture',
        title: 'Microphone Not Supported',
        message: 'Your current browser does not support live microphone audio capture.',
      });
      this.setStatus('unsupported');
      return;
    }

    // 2. Request microphone stream
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (err: any) {
      const errName = err?.name || '';
      const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;

      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        this.callbacks.onError({
          stage: 'capture',
          title: 'Microphone Permission Blocked',
          message: isEmbedded
            ? 'The embedded preview frame or browser blocked microphone permissions. Click the lock/site settings in the address bar to grant access.'
            : 'Microphone access was denied. Please allow microphone permissions to speak.',
          isIframeRestricted: isEmbedded,
        });
        this.setStatus('permission_denied');
        return;
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        this.callbacks.onError({
          stage: 'capture',
          title: 'No Microphone Detected',
          message: 'No physical microphone was detected on this device. Please connect an audio input device.',
        });
        this.setStatus('error');
        return;
      }

      this.callbacks.onError({
        stage: 'capture',
        title: 'Audio Initialization Failed',
        message: err?.message || 'Unable to start audio stream.',
      });
      this.setStatus('error');
      return;
    }

    // 3. Initialize AudioContext and Analyser for continuous VAD (Voice Activity Detection)
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const micSource = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.3;
      micSource.connect(this.analyserNode);

      this.startVADLoop();
    } catch (e) {
      console.warn('Web Audio Context analyser could not initialize, falling back to recognition-only VAD:', e);
    }

    // 4. Initialize WebSocket connection to backend
    this.connectWebSocket();

    // 5. Initialize Continuous Speech Recognition
    this.setupSpeechRecognition();

    this.setStatus('connected');

    // 6. Greet the user naturally
    const welcomeText =
      'Hello, welcome to GNS Real Estate Dubai. I am your property advisor. How may I assist your property search today?';
    this.playAgentSpeech(welcomeText, false);
  }

  /**
   * Connect WebSocket bridge for real-time duplex signaling
   */
  private connectWebSocket() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/voice/live`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'interrupted') {
            this.handleInterruption();
          }
        } catch {}
      };

      this.ws.onerror = () => {
        // WebSocket optional fallback; HTTP endpoint continues seamlessly
      };
    } catch {
      // WebSocket optional fallback
    }
  }

  /**
   * Continuous Speech Recognition setup
   */
  private setupSpeechRecognition() {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        // If agent is speaking and user uttered anything, TRIGGER IMMEDIATE INTERRUPTION!
        if (this.isAgentSpeaking && (interim.trim().length > 0 || final.trim().length > 0)) {
          this.handleInterruption();
        }

        if (interim) {
          this.callbacks.onTranscript(interim);
        }

        if (final.trim()) {
          this.handleUserSpokenSentence(final.trim());
        }
      };

      this.recognition.onerror = (e: any) => {
        if (e.error === 'no-speech') return;
        if (e.error === 'aborted' && this.isManuallyStopped) return;
        console.warn('Speech recognition warning:', e.error);
      };

      this.recognition.onend = () => {
        // Auto-restart while call is active for seamless hands-free operation
        if (
          !this.isManuallyStopped &&
          this.status !== 'idle' &&
          this.status !== 'ended' &&
          this.status !== 'error' &&
          this.status !== 'permission_denied'
        ) {
          try {
            this.recognition?.start();
          } catch {}
        }
      };

      this.recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition startup error:', err);
    }
  }

  /**
   * Continuous Voice Activity Detection (VAD) loop
   */
  private startVADLoop() {
    const dataArray = new Uint8Array(this.analyserNode?.frequencyBinCount || 128);

    const checkAudioLevel = () => {
      if (this.isManuallyStopped) return;

      let inputLevel = 0;
      if (this.analyserNode && !this.isMuted) {
        this.analyserNode.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        inputLevel = Math.min(1, avg / 128);

        // Instant interruption detection via audio energy:
        // If agent is currently speaking, and user mic volume exceeds threshold for > 2 consecutive ticks (~60-100ms)
        if (this.isAgentSpeaking && inputLevel > 0.18) {
          this.consecutiveUserAudioFrames++;
          if (this.consecutiveUserAudioFrames >= 3) {
            this.handleInterruption();
            this.consecutiveUserAudioFrames = 0;
          }
        } else {
          this.consecutiveUserAudioFrames = Math.max(0, this.consecutiveUserAudioFrames - 1);
        }
      }

      const outputLevel = this.isAgentSpeaking ? 0.35 + Math.random() * 0.45 : 0;
      this.callbacks.onAudioLevels(inputLevel, outputLevel);

      this.animFrameId = requestAnimationFrame(checkAudioLevel);
    };

    this.animFrameId = requestAnimationFrame(checkAudioLevel);
  }

  /**
   * Instant interruption: stops audio playback and queue within <100ms
   */
  public handleInterruption() {
    if (!this.isAgentSpeaking) return;

    console.log('[VoiceAgentEngine] User interruption detected! Aborting playback queue immediately.');

    // 1. Immediately kill Web Audio playback node
    if (this.speechSourceNode) {
      try {
        this.speechSourceNode.stop();
        this.speechSourceNode.disconnect();
      } catch {}
      this.speechSourceNode = null;
    }

    // 2. Immediately cancel Web Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.speechActiveUtterance = null;
    this.isAgentSpeaking = false;

    // 3. Notify backend over WebSocket
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'interrupt', timestamp: Date.now() }));
      } catch {}
    }

    // 4. Update UI status to 'interrupted' then back to 'listening'
    this.setStatus('interrupted');
    this.callbacks.onInterrupted();

    setTimeout(() => {
      if (this.status === 'interrupted') {
        this.setStatus('listening');
      }
    }, 400);
  }

  /**
   * Handles user's spoken sentence once detected
   */
  public async handleUserSpokenSentence(userText: string) {
    if (!userText.trim() || this.isManuallyStopped) return;

    this.callbacks.onTranscript('');

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: CallMessage = {
      id: `call-user-${Date.now()}`,
      role: 'user',
      text: userText,
      time: now,
    };
    this.callbacks.onNewMessage(userMsg);
    this.conversationHistory.push({ role: 'user', text: userText });

    this.setStatus('processing');

    try {
      // Query intelligence engine (Grounded in GNS data, conversational prompt, rental rules)
      const res: AssistantResponse = await askAiReceptionist(
        userText,
        this.conversationHistory,
        this.properties,
        this.criteria
      );

      if (res.extractedCriteria) {
        this.criteria = { ...this.criteria, ...res.extractedCriteria };
      }
      if (res.shortlist && res.shortlist.length > 0 && this.callbacks.onPropertiesMatched) {
        this.callbacks.onPropertiesMatched(res.shortlist);
      }

      await this.playAgentSpeech(res.reply, true);
    } catch (err: any) {
      console.warn('Failed to process spoken query:', err);
      await this.playAgentSpeech(
        'Ji, I am listening. Could you please specify your preferred area in Dubai or budget?',
        true
      );
    }
  }

  /**
   * Synthesize and play agent response
   */
  public async playAgentSpeech(text: string, isReplyToUser: boolean = true): Promise<void> {
    if (this.isManuallyStopped) return;

    // Add message to transcript
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const agentMsg: CallMessage = {
      id: `call-agent-${Date.now()}`,
      role: 'assistant',
      text,
      time: now,
    };
    this.callbacks.onNewMessage(agentMsg);
    this.conversationHistory.push({ role: 'assistant', text });

    this.setStatus('speaking');
    this.isAgentSpeaking = true;

    // Tier 1: Attempt Server-Side High-Fidelity Gemini TTS
    let playedViaServerTts = false;
    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'Kore' }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audio && this.audioContext) {
          // Play decoded WAV buffer via Web Audio API
          const binary = atob(data.audio);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }

          const audioBuffer = await this.audioContext.decodeAudioData(bytes.buffer);

          if (!this.isAgentSpeaking || this.isManuallyStopped) {
            return; // was interrupted while decoding
          }

          this.speechSourceNode = this.audioContext.createBufferSource();
          this.speechSourceNode.buffer = audioBuffer;
          this.speechSourceNode.connect(this.audioContext.destination);

          await new Promise<void>((resolve) => {
            if (!this.speechSourceNode) {
              resolve();
              return;
            }
            this.speechSourceNode.onended = () => {
              this.speechSourceNode = null;
              resolve();
            };
            this.speechSourceNode.start(0);
          });

          playedViaServerTts = true;
        }
      }
    } catch (e) {
      console.warn('Server TTS playback fallback to client speech synthesis:', e);
    }

    // Tier 2: Client-side SpeechSynthesis fallback with optimized South Asian voice selection
    if (!playedViaServerTts && !this.isManuallyStopped && this.isAgentSpeaking) {
      await this.speakViaClientSpeechSynthesis(text);
    }

    this.isAgentSpeaking = false;
    if (!this.isManuallyStopped && (this.status === 'speaking' || this.status === 'processing')) {
      this.setStatus('listening');
    }
  }

  /**
   * Client-side speech synthesis with regionally natural voice selection
   */
  private speakViaClientSpeechSynthesis(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
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
          // Prioritize natural South Asian (Indian/Pakistani) or clear British English voices
          const preferredVoice =
            voices.find((v) => v.lang === 'en-IN' || v.name.toLowerCase().includes('india')) ||
            voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
            voices.find((v) => v.lang === 'en-GB') ||
            voices.find((v) => v.lang.startsWith('en'));

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }

        utterance.onend = () => {
          this.speechActiveUtterance = null;
          resolve();
        };

        utterance.onerror = (e) => {
          console.warn('Client speech error:', e);
          this.speechActiveUtterance = null;
          resolve();
        };

        this.speechActiveUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        resolve();
      }
    });
  }

  /**
   * Toggle mute
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !this.isMuted;
      });
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * End call and clean up all resources
   */
  public endCall() {
    this.isManuallyStopped = true;
    this.isAgentSpeaking = false;

    // 1. Cancel speech synthesis & audio nodes
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.speechActiveUtterance = null;

    if (this.speechSourceNode) {
      try {
        this.speechSourceNode.stop();
        this.speechSourceNode.disconnect();
      } catch {}
      this.speechSourceNode = null;
    }

    // 2. Stop microphone tracks
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((track) => track.stop());
      } catch {}
      this.mediaStream = null;
    }

    // 3. Stop speech recognition
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {}
      this.recognition = null;
    }

    // 4. Close WebSocket
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }

    // 5. Close AudioContext
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }

    // 6. Stop animation loop
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    this.setStatus('ended');
    setTimeout(() => {
      this.setStatus('idle');
    }, 1200);
  }
}
