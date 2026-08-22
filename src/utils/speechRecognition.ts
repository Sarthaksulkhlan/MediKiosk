// Speech Recognition & Clinical NLP Extraction Utility
export { extractClinicalEntities, extractDurationOnly } from './clinicalNLP';
export type { ExtractedClinicalEntities } from './clinicalNLP';

export type SupportedLanguage = 'EN' | 'HI';

const LANG_CODE_MAP: Record<SupportedLanguage, string> = {
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
  private interimTranscript = '';
  private currentLang: SupportedLanguage = 'EN';
  private recentFinalSegments: string[] = [];

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        if (this.recognition) {
          try {
            this.recognition.abort();
          } catch (e) {}
        }
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        this.setupListeners();
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
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
        const res = event.results[i];
        const transcriptSegment = res[0]?.transcript || '';

        if (res.isFinal) {
          const trimmed = transcriptSegment.trim();
          if (trimmed) {
            // Deduplicate to avoid duplicate browser final dispatch events
            if (!this.isDuplicateFinal(trimmed)) {
              this.commitFinalSegment(trimmed);
            }
          }
        } else {
          interim += transcriptSegment;
        }
      }

      this.interimTranscript = interim;

      if (this.handlers.onResult) {
        this.handlers.onResult(this.finalTranscript, this.interimTranscript);
      }
    };

    this.recognition.onerror = (event: any) => {
      // 'no-speech' is a normal transient condition in continuous recognition
      if (event.error !== 'no-speech') {
        console.warn('Speech recognition error event:', event.error);
        if (this.handlers.onError) {
          this.handlers.onError(event.error);
        }
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.interimTranscript = '';
      if (this.handlers.onEnd) {
        this.handlers.onEnd();
      }
    };
  }

  private isDuplicateFinal(segment: string): boolean {
    const normalized = segment.toLowerCase().replace(/[.,!?;:]/g, '').trim();
    if (!normalized) return true;

    // Check if the most recent committed segments match this exact phrase
    const lastCommitted = this.recentFinalSegments[this.recentFinalSegments.length - 1];
    if (lastCommitted) {
      const normalizedLast = lastCommitted.toLowerCase().replace(/[.,!?;:]/g, '').trim();
      if (normalized === normalizedLast) {
        return true;
      }
    }

    // Check if finalTranscript already ends with this phrase
    const normFinal = this.finalTranscript.toLowerCase().replace(/[.,!?;:]/g, '').trim();
    if (normFinal.endsWith(normalized)) {
      return true;
    }

    return false;
  }

  private commitFinalSegment(segment: string) {
    const cleanSegment = segment.trim();
    if (!cleanSegment) return;

    this.recentFinalSegments.push(cleanSegment);
    if (this.recentFinalSegments.length > 20) {
      this.recentFinalSegments.shift();
    }

    if (!this.finalTranscript) {
      this.finalTranscript = cleanSegment;
    } else {
      // Ensure appropriate spacing between sentences
      const endsWithPunctuation = /[.!?\n]$/.test(this.finalTranscript.trim());
      const prefix = endsWithPunctuation ? ' ' : ' ';
      this.finalTranscript = `${this.finalTranscript.trim()}${prefix}${cleanSegment}`;
    }
  }

  public start(
    lang: SupportedLanguage = 'EN',
    handlers: SpeechRecognizerHandlers,
    initialText = ''
  ): boolean {
    this.handlers = handlers;
    this.finalTranscript = initialText ? initialText.trim() : '';
    this.interimTranscript = '';
    this.recentFinalSegments = [];
    this.currentLang = lang;

    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      if (handlers.onError) {
        handlers.onError('Speech recognition not supported in this browser.');
      }
      return false;
    }

    try {
      this.recognition.lang = LANG_CODE_MAP[this.currentLang] || 'en-US';
      this.recognition.start();
      return true;
    } catch (err: any) {
      // If already started or aborting, recreate fresh recognition session
      try {
        this.recognition.abort();
        this.initRecognition();
        if (this.recognition) {
          this.recognition.lang = LANG_CODE_MAP[this.currentLang] || 'en-US';
          this.recognition.start();
          return true;
        }
      } catch (retryErr) {
        console.warn('Speech recognition restart notice:', retryErr);
      }
      return false;
    }
  }

  public setLanguage(lang: SupportedLanguage): boolean {
    this.currentLang = lang;
    const wasListening = this.isListening;

    if (wasListening) {
      try {
        this.recognition?.stop();
      } catch (e) {}

      setTimeout(() => {
        try {
          if (this.recognition) {
            this.recognition.lang = LANG_CODE_MAP[this.currentLang] || 'en-US';
            this.recognition.start();
          }
        } catch (e) {}
      }, 150);
    }
    return true;
  }

  public stop(): string {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
    this.interimTranscript = '';
    return this.finalTranscript;
  }

  public reset(initialText = '') {
    this.stop();
    this.finalTranscript = initialText;
    this.interimTranscript = '';
    this.recentFinalSegments = [];
  }

  public getActiveTranscript(): string {
    return this.finalTranscript;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

// Global Singleton for easy app-wide reuse
export const speechService = new SpeechRecognitionService();
export const SpeechRecognitionManager = SpeechRecognitionService;


