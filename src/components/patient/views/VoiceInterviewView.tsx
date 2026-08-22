import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { PatientTab, PatientProfileData } from '../types';
import { AuraAIEngine, AuraMessage } from '../../../utils/auraEngine';
import { ClinicalNLPParser } from '../../../utils/clinicalNLP';
import { speechService, SupportedLanguage } from '../../../utils/speechRecognition';

interface VoiceInterviewViewProps {
  patient: PatientProfileData;
  transcript: string;
  onUpdateTranscript: (text: string) => void;
  setActiveTab: (tab: PatientTab) => void;
  onMarkStepComplete: (step: PatientTab) => void;
  selectedLanguage: string;
}

export const VoiceInterviewView: React.FC<VoiceInterviewViewProps> = ({
  patient,
  transcript,
  onUpdateTranscript,
  setActiveTab,
  onMarkStepComplete,
  selectedLanguage,
}) => {
  const isHindi = selectedLanguage.toLowerCase().includes('hindi') || selectedLanguage.toLowerCase().includes('हिंदी');
  const langCode: SupportedLanguage = isHindi ? 'HI' : 'EN';

  // Chat conversation state
  const [messages, setMessages] = useState<AuraMessage[]>(() => {
    const extracted = ClinicalNLPParser.extractEntities(transcript);
    return AuraAIEngine.generateInitialGreeting(patient.name, transcript, extracted, langCode);
  });

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(1);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Parse clinical entities live
  const extractedEntities = ClinicalNLPParser.extractEntities(transcript);

  useEffect(() => {
    setIsSpeechSupported(speechService.isSupported());

    return () => {
      speechService.stop();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      const finalRecorded = speechService.stop();
      setIsListening(false);
      if (finalRecorded) {
        setInputText(finalRecorded);
      }
    } else {
      const started = speechService.start(
        langCode,
        {
          onStart: () => setIsListening(true),
          onResult: (finalText, interimText) => {
            if (finalText) {
              setInputText(finalText);
              handleSendMessage(finalText);
            } else if (interimText) {
              setInputText(interimText);
            }
          },
          onError: (err) => {
            console.warn('Speech error:', err);
            setIsListening(false);
          },
          onEnd: () => {
            setIsListening(false);
          },
        },
        transcript
      );

      if (!started) {
        // Fallback simulation if speech recognition is blocked
        setIsListening(true);
        setTimeout(() => {
          const sampleText = isHindi
            ? 'मुझे दो दिन से तेज सिरदर्द और उल्टी जैसी लग रही है'
            : 'I have severe throbbing headache on my forehead since 2 days';
          setInputText(sampleText);
          setIsListening(false);
        }, 2000);
      }
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Append patient statement to conversation
    const userMsg: AuraMessage = {
      id: `patient-${Date.now()}`,
      sender: 'patient',
      text: text.trim(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');

    // Append to running transcript
    const updatedTranscript = transcript ? `${transcript} | ${text.trim()}` : text.trim();
    onUpdateTranscript(updatedTranscript);

    setIsProcessing(true);

    // Aura AI engine response
    setTimeout(() => {
      const liveExtracted = ClinicalNLPParser.extractEntities(updatedTranscript);
      const { nextMessage, isComplete } = AuraAIEngine.processNextStep(
        text.trim(),
        newHistory,
        liveExtracted,
        langCode
      );

      setMessages((prev) => [...prev, nextMessage]);
      setIsProcessing(false);
      setCurrentStepIndex((prev) => Math.min(prev + 1, 12));

      // Play audio response with SpeechSynthesis
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const cleanText = nextMessage.text.replace(/\*\*/g, '').replace(/•/g, '');
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = isHindi ? 'hi-IN' : 'en-US';
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          // ignore
        }
      }

      if (isComplete || newHistory.length >= 8) {
        setIsInterviewFinished(true);
        onMarkStepComplete('ai-interview');
      }
    }, 900);
  };

  const handleSpeakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\*\*/g, '').replace(/•/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = isHindi ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFinishAndProceed = () => {
    onMarkStepComplete('ai-interview');
    setActiveTab('red-flags');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="border-b border-[#E8D8B8]/70 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B89A5A]/15 text-[#8C6B28] text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[15px]">smart_toy</span>
          <span>Step 5 • AI Voice Intake</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24302F]">AI Health Interview</h1>
        <p className="text-sm text-[#5D6662] mt-1 max-w-3xl leading-relaxed">
          Tell us what you're experiencing. You can speak naturally into the microphone or type below. Aura will organize your responses for Dr. Sharma.
        </p>
      </div>

      {/* Progress Bar & Language Pill */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8D8B8]/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
            {currentStepIndex}/12
          </span>
          <div>
            <div className="text-xs font-bold text-[#24302F]">
              Interview Progress — Question {currentStepIndex} of 12
            </div>
            <div className="text-[11px] text-[#6B7570]">
              Active Language: <strong className="text-[#8C6B28]">{selectedLanguage}</strong> (Voice Recognition Active)
            </div>
          </div>
        </div>

        <div className="w-full sm:w-48 h-2 rounded-full bg-[#FAF7F0] border border-[#E8D8B8] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B89A5A] to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (currentStepIndex / 8) * 100)}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Aura AI Chatbox + Live Clinical Extraction Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat / Voice Console (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E8D8B8]/80 shadow-xs flex flex-col h-[560px] overflow-hidden">
          {/* Top Assistant Status Bar */}
          <div className="p-4 bg-[#FAF7F0] border-b border-[#E8D8B8]/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-[#24302F] text-[#FAF7F0] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[#D8BE88] text-[20px]">
                    smart_toy
                  </span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#24302F] flex items-center gap-1.5">
                  <span>Aura Healthcare Assistant</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-semibold">
                    Clinical AI
                  </span>
                </h4>
                <p className="text-[11px] text-[#6B7570]">
                  {isListening
                    ? 'Listening carefully to your voice...'
                    : isProcessing
                    ? 'Analyzing clinical context...'
                    : 'Ready for your response'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessages(AuraAIEngine.generateInitialGreeting(patient.name, '', extractedEntities, langCode))}
                title="Restart conversation"
                className="p-1.5 rounded-lg text-[#6B7570] hover:bg-[#E8D8B8]/50"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
            {messages.map((msg) => {
              const isAura = msg.sender === 'aura';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isAura ? 'justify-start' : 'justify-end'}`}
                >
                  {isAura && (
                    <div className="w-8 h-8 rounded-xl bg-[#24302F] text-[#D8BE88] flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                      A
                    </div>
                  )}

                  <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
                    <div
                      className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isAura
                          ? 'bg-[#FAF7F0] text-[#24302F] border border-[#E8D8B8] rounded-tl-sm'
                          : 'bg-[#24302F] text-[#FAF7F0] rounded-tr-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {isAura && (
                        <div className="mt-2 pt-2 border-t border-[#E8D8B8]/60 flex items-center justify-between">
                          <button
                            onClick={() => handleSpeakMessage(msg.text)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C6B28] hover:underline cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">volume_up</span>
                            <span>Listen</span>
                          </button>
                          <span className="text-[10px] text-[#8A9590]">Aura AI Engine</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Replies */}
                    {msg.quickReplies && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {msg.quickReplies.map((reply, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(reply)}
                            className="text-xs bg-white hover:bg-[#FAF7F0] text-[#24302F] border border-[#E8D8B8] px-3 py-1.5 rounded-full font-medium transition-all shadow-2xs cursor-pointer hover:border-[#B89A5A]"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isProcessing && (
              <div className="flex items-center gap-2 text-xs text-[#7B8580] bg-[#FAF7F0] p-3 rounded-2xl border border-[#E8D8B8] w-fit">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                <span>Aura is organizing your clinical response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice Waveform & Microphone Center */}
          <div className="p-4 bg-[#FAF7F0] border-t border-[#E8D8B8]/70 space-y-3">
            {/* Waveform visualization when listening */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[40, 75, 90, 60, 100, 45, 80, 55, 95, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-[#B89A5A] to-purple-600 rounded-full animate-pulse"
                    style={{
                      height: `${(h / 100) * 28}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Main Input Control Bar */}
            <div className="flex items-center gap-2">
              {/* Voice Mic Button */}
              <button
                onClick={toggleListening}
                className={`p-3.5 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white animate-bounce'
                    : 'bg-[#24302F] text-[#D8BE88] hover:bg-[#1B2423]'
                }`}
                title={isListening ? 'Click to stop listening' : 'Tap to speak'}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isListening ? 'mic' : 'mic_none'}
                </span>
              </button>

              {/* Text input */}
              <input
                type="text"
                placeholder={
                  isListening
                    ? isHindi
                      ? 'सुन रहे हैं... बोलिए'
                      : 'Listening... speak now'
                    : isHindi
                    ? 'यहाँ लिखें या माइक दबाएं...'
                    : 'Type symptoms or tap mic to speak...'
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 bg-white border border-[#E8D8B8] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#24302F] focus:outline-none focus:border-[#B89A5A] shadow-inner"
              />

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer shrink-0 ${
                  inputText.trim()
                    ? 'bg-[#B89A5A] text-[#1B2423] hover:bg-[#A88A4A] shadow-md'
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Clinical Entity Extraction Panel (1 Col) */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
              <h3 className="font-bold text-sm text-[#24302F] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B89A5A]">biomedical</span>
                <span>Live Clinical Entities</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Extracting
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/60">
                <div className="text-[10px] font-bold uppercase text-[#6B7570]">Chief Complaint</div>
                <div className="font-extrabold text-[#24302F] mt-0.5 text-sm">
                  {extractedEntities.chiefComplaint || 'Pending Patient Narrative'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/60">
                <div className="text-[10px] font-bold uppercase text-[#6B7570]">Duration / Onset</div>
                <div className="font-bold text-[#24302F] mt-0.5">
                  {extractedEntities.duration || 'Not specified'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/60">
                <div className="text-[10px] font-bold uppercase text-[#6B7570]">Associated Symptoms</div>
                <div className="font-bold text-[#24302F] mt-0.5">
                  {extractedEntities.associatedSymptom || 'None identified'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/60">
                <div className="text-[10px] font-bold uppercase text-[#6B7570]">
                  Target Department
                </div>
                <div className="font-bold text-teal-800 mt-0.5">
                  General Medicine
                </div>
              </div>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
              <span>Voice Tips</span>
            </div>
            <p className="text-[11px] leading-relaxed text-teal-950">
              Speak clearly in a quiet environment. You can mention when the pain started, whether it's sharp or dull, and if you took any paracetamol.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8D8B8]/80 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('healthcare-system')}
          className="text-xs font-bold text-[#5D6662] hover:text-[#24302F] px-4 py-2"
        >
          ← Back
        </button>

        <button
          onClick={handleFinishAndProceed}
          className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md hover:-translate-y-0.5"
        >
          <span>Proceed to Risk Assessment</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </motion.div>
  );
};
