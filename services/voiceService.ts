import { VoiceStatus } from '../types';

export type VoiceEventListener = (status: VoiceStatus, text?: string) => void;

class VoiceService {
  private status: VoiceStatus = 'Ready';
  private isMuted: boolean = false;
  private volume: number = 80;
  private isSpeakerEnabled: boolean = true;
  private listeners: VoiceEventListener[] = [];
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';

          this.recognition.onstart = () => {
            this.setStatus('Listening...');
          };

          this.recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              transcript += event.results[i][0].transcript;
            }
            if (transcript) {
              this.notifyListeners('Listening...', transcript);
            }
          };

          this.recognition.onerror = () => {
            this.setStatus('Ready');
          };

          this.recognition.onend = () => {
            if (this.status === 'Listening...') {
              this.setStatus('Ready');
            }
          };
        } catch (e) {
          console.warn('SpeechRecognition initialization notice:', e);
        }
      }
    }
  }

  public subscribe(listener: VoiceEventListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(status: VoiceStatus, text?: string) {
    this.listeners.forEach(l => l(status, text));
  }

  public setStatus(status: VoiceStatus) {
    this.status = status;
    this.notifyListeners(status);
  }

  public getStatus(): VoiceStatus {
    return this.status;
  }

  public startListening(onResult?: (text: string) => void) {
    if (this.isMuted) return;

    if (this.recognition) {
      try {
        this.recognition.start();
        this.setStatus('Listening...');
      } catch (e) {
        // Fallback simulation mode for iframe environments
        this.simulateListening(onResult);
      }
    } else {
      this.simulateListening(onResult);
    }
  }

  private simulateListening(onResult?: (text: string) => void) {
    this.setStatus('Listening...');
    setTimeout(() => {
      if (this.status === 'Listening...') {
        this.setStatus('Thinking...');
        setTimeout(() => {
          if (onResult) onResult("What is our current system status?");
          this.setStatus('Ready');
        }, 1200);
      }
    }, 2500);
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore error
      }
    }
    this.setStatus('Ready');
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.isSpeakerEnabled || this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    // Clean Markdown formatting out of spoken text
    const cleanText = text.replace(/[*_#`~-]/g, '').trim();

    if (this.synthesis && 'SpeechSynthesisUtterance' in window) {
      try {
        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 0.95; // Futuristic slightly lower pitch
        utterance.volume = this.volume / 100;

        utterance.onstart = () => {
          this.setStatus('Speaking...');
        };

        utterance.onend = () => {
          this.setStatus('Ready');
          if (onEnd) onEnd();
        };

        utterance.onerror = () => {
          this.setStatus('Ready');
          if (onEnd) onEnd();
        };

        this.synthesis.speak(utterance);
        return;
      } catch {
        // Fallback
      }
    }

    // Simulated speech timing for fallback
    this.setStatus('Speaking...');
    const duration = Math.min(6000, Math.max(1500, cleanText.length * 50));
    setTimeout(() => {
      this.setStatus('Ready');
      if (onEnd) onEnd();
    }, duration);
  }

  public stopSpeaking() {
    if (this.synthesis) {
      try {
        this.synthesis.cancel();
      } catch {
        // ignore error
      }
    }
    this.setStatus('Ready');
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeaking();
      this.stopListening();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(100, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleSpeaker(): boolean {
    this.isSpeakerEnabled = !this.isSpeakerEnabled;
    if (!this.isSpeakerEnabled) {
      this.stopSpeaking();
    }
    return this.isSpeakerEnabled;
  }

  public getIsSpeakerEnabled(): boolean {
    return this.isSpeakerEnabled;
  }
}

export const voiceService = new VoiceService();
