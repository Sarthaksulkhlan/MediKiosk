// Speech Recognition & Clinical NLP Extraction Utility
export { extractClinicalEntities, extractDurationOnly } from './clinicalNLP';
export type { ExtractedClinicalEntities } from './clinicalNLP';

export type SupportedLanguage = 'EN' | 'HI';

const LANG_CODE_MAP: Record<string, string> = {
  EN: 'en-US',
  HI: 'hi-IN',
};

export interface SpeechRecognizerHandlers {
  onStart?: () => void;
  onResult?: (finalText: string, interimText: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening = false;
  private handlers: SpeechRecognizerHandlers = {};
  private finalTranscript = '';
  private currentLang = 'en-US';

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.setupListeners();
    }
  }

  public isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  private setupListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.handlers.onStart) {
        this.handlers.onStart();
      }
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += (this.finalTranscript ? ' ' : '') + transcriptSegment.trim();
        } else {
          interim += transcriptSegment;
        }
      }

      if (this.handlers.onResult) {
        this.handlers.onResult(this.finalTranscript, interim);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition status/event:', event.error);
      if (event.error !== 'no-speech' && this.handlers.onError) {
        this.handlers.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.handlers.onEnd) {
        this.handlers.onEnd();
      }
    };
  }

  public start(
    lang: SupportedLanguage = 'EN',
    handlers: SpeechRecognizerHandlers,
    initialText = ''
  ): boolean {
    this.handlers = handlers;
    this.finalTranscript = initialText;
    this.currentLang = LANG_CODE_MAP[lang] || 'en-US';

    if (!this.recognition) {
      if (handlers.onError) {
        handlers.onError('Speech recognition not supported in this browser.');
      }
      return false;
    }

    try {
      this.recognition.lang = this.currentLang;
      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn('Speech start warning:', err);
      // Already running or permission error
      if (err.name === 'InvalidStateError') {
        try {
          this.recognition.stop();
          setTimeout(() => {
            try {
              this.recognition.lang = this.currentLang;
              this.recognition.start();
            } catch (e) {}
          }, 200);
          return true;
        } catch (e) {}
      }
      return false;
    }
  }

  public stop(): string {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
    return this.finalTranscript;
  }

  public getActiveTranscript(): string {
    return this.finalTranscript;
  }
}

// Global Singleton for easy app-wide reuse
export const speechService = new SpeechRecognitionService();
export const SpeechRecognitionManager = SpeechRecognitionService;

