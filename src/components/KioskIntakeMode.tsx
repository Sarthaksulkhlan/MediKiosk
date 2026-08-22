import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Logo } from './Logo';
import { AppView, PatientRecord } from '../types';
import {
  speechService,
  extractClinicalEntities,
  SupportedLanguage,
} from '../utils/speechRecognition';

interface KioskIntakeModeProps {
  onIntakeCompleted: (patient: PatientRecord) => void;
  setCurrentView: (view: AppView) => void;
}

const LANGUAGES = [
  {
    code: 'EN',
    name: 'English',
    greeting: 'Please tell us what brings you in today.',
    sample: 'I have had a high fever for three days with persistent headache and morning body ache.',
  },
  {
    code: 'HI',
    name: 'हिन्दी',
    greeting: 'कृपया बताएं कि आप आज कैसा महसूस कर रहे हैं।',
    sample: 'मुझे पिछले तीन दिनों से तेज बुखार और सिरदर्द हो रहा है, सुबह बदन दर्द रहता है।',
  },
];

export const KioskIntakeMode: React.FC<KioskIntakeModeProps> = ({
  onIntakeCompleted,
  setCurrentView,
}) => {
  const [step, setStep] = useState<'language' | 'mode' | 'voice' | 'vitals' | 'confirmation'>('language');
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [inputMode, setInputMode] = useState<'voice' | 'touch'>('voice');
  const [patientName, setPatientName] = useState('Eleanor Vance');
  const [patientAge, setPatientAge] = useState('29');
  const [patientGender, setPatientGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [spokenNarrative, setSpokenNarrative] = useState('');
  const [vitalsProgress, setVitalsProgress] = useState(0);
  const [tokenNumber, setTokenNumber] = useState('MK-6420D');

  const toggleVoiceRecording = () => {
    if (isRecording) {
      speechService.stop();
      setIsRecording(false);
      setInterimText('');
    } else {
      setIsRecording(true);
      setInterimText('');

      const started = speechService.start(
        selectedLang.code as SupportedLanguage,
        {
          onStart: () => setIsRecording(true),
          onResult: (finalText, interim) => {
            if (finalText) {
              setSpokenNarrative(finalText);
            }
            setInterimText(interim);
          },
          onError: (err) => {
            console.warn('Kiosk speech error:', err);
          },
          onEnd: () => {
            setIsRecording(false);
            setInterimText('');
          },
        },
        ''
      );

      if (!started && !speechService.isSupported()) {
        setTimeout(() => {
          setSpokenNarrative(selectedLang.sample);
          setIsRecording(false);
        }, 2500);
      }
    }
  };

  const handleSelectLanguage = (lang: typeof LANGUAGES[0]) => {
    setSelectedLang(lang);
    setSpokenNarrative(lang.sample);
  };

  const handleRunVitalsScan = () => {
    setStep('vitals');
    setVitalsProgress(0);
    const interval = setInterval(() => {
      setVitalsProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  const handleFinalSubmit = () => {
    const extracted = extractClinicalEntities(spokenNarrative);
    const complaintText =
      extracted.chiefComplaint !== 'No clinical complaint identified'
        ? extracted.chiefComplaint
        : spokenNarrative.slice(0, 32) + '...';

    const newRecord: PatientRecord = {
      id: `pat-${Date.now()}`,
      name: patientName || 'Eleanor Vance',
      age: parseInt(patientAge, 10) || 29,
      gender: patientGender,
      patientId: tokenNumber,
      chiefComplaint:
        extracted.associatedSymptom !== 'None identified'
          ? `${complaintText}, ${extracted.associatedSymptom}`
          : complaintText,
      language: selectedLang.name,
      languageCode: selectedLang.code as any,
      vitalsStatus: 'Ready for Review',
      isVitalsAlert: false,
      alertType: 'Normal',
      waitTime: 'Just checked in',
      aiSummary: {
        status: 'Draft - Review Required',
        text: `Waiting Room Kiosk Intake (${selectedLang.name}): Patient reports ${complaintText} (${extracted.duration}). Associated: ${extracted.associatedSymptom}. Automated vitals recorded at Pod Station 2.`,
        lastUpdated: 'Just now',
      },
      hpi: {
        onset: extracted.duration !== 'Not mentioned' ? extracted.duration : 'Recent onset',
        severity: 'Self-reported at Kiosk Station',
        associated: extracted.associatedSymptom,
        alleviating: 'Oral hydration and rest',
        rawNarrative: spokenNarrative,
      },
      pmh: ['No significant chronic illnesses reported'],
      currentMedications: [
        { name: 'Medicine A', dosage: '500 mg', frequency: 'Twice daily' },
        { name: 'Medicine B', dosage: '10 mg', frequency: 'Once daily' },
      ],
      allergies: [],
      clinicalNotes: 'Intake conducted at MediKiosk Touch & Voice Pod Station.',
      vitals: {
        temperature: '98.7°F',
        bloodPressure: '116/74 mmHg',
        heartRate: '74 bpm',
        oxygenSaturation: '99%',
        recordedAt: 'Just now via Kiosk Pod Station',
      },
      documents: [
        {
          id: `doc-kiosk-${Date.now()}`,
          title: 'Kiosk Automated Vitals Report',
          type: 'vitals',
          date: 'Today',
          status: 'verified',
          summary: 'Temp: 98.7°F | BP: 116/74 mmHg | HR: 74 bpm | SpO2: 99%',
        },
      ],
    };

    onIntakeCompleted(newRecord);
    setStep('confirmation');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F0] pt-24 pb-16 px-4 md:px-8 max-w-[1000px] mx-auto flex flex-col justify-center relative z-10">
      {/* Top Kiosk Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8D8B8]">
        <Logo size="md" textColor="text-[#24302F]" />
        <div className="flex items-center gap-3">
          <span className="bg-[#F3EBDD] text-[#24302F] text-xs font-bold px-3 py-1 rounded-full border border-[#E8D8B8] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Kiosk Pod #2 &bull; Active</span>
          </span>
          <button
            onClick={() => setCurrentView('landing')}
            className="text-xs text-[#4D5652] hover:text-[#24302F] bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] px-3.5 py-1.5 rounded-xl font-semibold cursor-pointer transition-colors"
          >
            Exit Kiosk
          </button>
        </div>
      </div>

      {/* Main Kiosk Container */}
      <div className="bg-white/95 rounded-3xl p-6 sm:p-10 shadow-xl border border-[#E8D8B8]">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8 text-xs font-bold text-[#73787A]">
          <span
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              step === 'language' ? 'bg-[#24302F] text-[#FAF7F0]' : 'bg-[#FAF7F0] text-[#4D5652] border border-[#E8D8B8]'
            }`}
          >
            1. Language
          </span>
          <span>&rarr;</span>
          <span
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              step === 'voice' || step === 'mode' ? 'bg-[#24302F] text-[#FAF7F0]' : 'bg-[#FAF7F0] text-[#4D5652] border border-[#E8D8B8]'
            }`}
          >
            2. Tell Symptoms
          </span>
          <span>&rarr;</span>
          <span
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              step === 'vitals' ? 'bg-[#24302F] text-[#FAF7F0]' : 'bg-[#FAF7F0] text-[#4D5652] border border-[#E8D8B8]'
            }`}
          >
            3. Vitals Check
          </span>
        </div>

        {/* Step 1: Language Selection */}
        {step === 'language' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#24302F] text-center mb-2">
              Welcome to MediKiosk Intake
            </h2>
            <p className="text-sm sm:text-base text-[#4D5652] text-center mb-8">
              Choose your preferred language to begin speaking with the kiosk.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang)}
                  className={`p-5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    selectedLang.code === lang.code
                      ? 'bg-[#24302F] text-[#FAF7F0] border-[#24302F] shadow-lg scale-105 ring-2 ring-[#B89A5A]'
                      : 'bg-[#FAF7F0] text-[#24302F] border-[#E8D8B8] hover:border-[#B89A5A]'
                  }`}
                >
                  <span className="font-display text-xl sm:text-2xl font-bold">{lang.name}</span>
                  <span className={`text-xs ${selectedLang.code === lang.code ? 'text-[#D8BE88]' : 'text-[#73787A]'}`}>
                    {lang.code}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E8D8B8] mb-8 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-[#B89A5A] mb-1">
                Selected Language Prompt:
              </p>
              <p className="font-display text-base sm:text-lg font-semibold text-[#24302F]">
                &ldquo;{selectedLang.greeting}&rdquo;
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep('voice')}
                className="bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-8 py-4 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Continue in {selectedLang.name}</span>
                <span className="material-symbols-outlined text-[20px] text-[#D8BE88]">arrow_forward</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Speak or Type Symptoms */}
        {step === 'voice' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24302F] text-center mb-2">
              Tell us what brings you in today
            </h2>
            <p className="text-xs sm:text-sm text-[#4D5652] text-center mb-6">
              You can speak naturally in {selectedLang.name} or type using the on-screen keypad.
            </p>

            {/* Big Voice Button */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative mb-4 flex items-center justify-center">
                {isRecording && (
                  <>
                    <div className="absolute w-36 h-36 rounded-full border-2 border-[#B89A5A] animate-ping" />
                    <div className="absolute w-48 h-48 rounded-full border border-[#D8BE88] animate-pulse" />
                  </>
                )}

                <button
                  onClick={toggleVoiceRecording}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                    isRecording
                      ? 'bg-[#B89A5A] text-white scale-105 shadow-[0_0_30px_rgba(184,154,90,0.5)]'
                      : 'bg-[#24302F] text-[#FAF7F0] hover:scale-105'
                  }`}
                  title={isRecording ? 'Click to stop recording' : 'Click to speak'}
                >
                  <span className="material-symbols-outlined text-[42px]">
                    {isRecording ? 'graphic_eq' : 'mic'}
                  </span>
                </button>
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[#73787A]">
                {isRecording
                  ? `Listening to your voice in ${selectedLang.name}... Speak now`
                  : `Tap microphone to speak in ${selectedLang.name}`}
              </span>
            </div>

            {/* Spoken / Typed Text Area */}
            <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E8D8B8] mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-amber-600 animate-ping' : 'bg-emerald-500'}`} />
                  Patient Stated Symptoms ({selectedLang.name}):
                </span>
                <span className="text-[10px] text-[#73787A]">Live voice-to-text enabled</span>
              </div>

              <div className="relative">
                <textarea
                  value={spokenNarrative}
                  onChange={(e) => setSpokenNarrative(e.target.value)}
                  rows={3}
                  placeholder="Speak your symptoms or use keyboard..."
                  className="w-full bg-white border border-[#E8D8B8] rounded-xl p-3 text-xs sm:text-sm text-[#24302F] outline-none focus:border-[#B89A5A]"
                />
                {interimText && (
                  <div className="mt-1 text-xs text-amber-700 italic bg-amber-50 p-2 rounded-lg border border-amber-200 animate-pulse">
                    Live speech stream: &ldquo;{interimText}&rdquo;
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep('language')}
                className="text-xs font-bold text-[#73787A] hover:text-[#24302F] px-4 py-2 cursor-pointer"
              >
                &larr; Back to Language
              </button>

              <button
                onClick={handleRunVitalsScan}
                className="bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-7 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Proceed to Vitals Check</span>
                <span className="material-symbols-outlined text-[18px] text-[#D8BE88]">arrow_forward</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Automated Vitals Scan */}
        {step === 'vitals' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24302F] text-center mb-2">
              Automated Vitals Pod Check
            </h2>
            <p className="text-xs sm:text-sm text-[#4D5652] text-center mb-6">
              Please place your finger in the SpO2 sensor and look straight at the thermal sensor.
            </p>

            <div className="max-w-md mx-auto mb-8 space-y-4">
              <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E8D8B8]">
                <div className="flex justify-between text-xs font-bold text-[#24302F] mb-1.5">
                  <span>Sensors Calibrating</span>
                  <span>{vitalsProgress}%</span>
                </div>
                <div className="w-full bg-[#E8D8B8] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#24302F] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${vitalsProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
                  <span className="text-[10px] text-[#73787A] block font-semibold">Temperature</span>
                  <span className="font-bold text-sm text-[#24302F]">
                    {vitalsProgress >= 50 ? '98.7°F' : 'Scanning...'}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
                  <span className="text-[10px] text-[#73787A] block font-semibold">Blood Pressure</span>
                  <span className="font-bold text-sm text-[#24302F]">
                    {vitalsProgress >= 75 ? '116/74 mmHg' : 'Scanning...'}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
                  <span className="text-[10px] text-[#73787A] block font-semibold">Heart Rate</span>
                  <span className="font-bold text-sm text-[#24302F]">
                    {vitalsProgress >= 100 ? '74 bpm' : 'Scanning...'}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
                  <span className="text-[10px] text-[#73787A] block font-semibold">SpO₂ Oxygen</span>
                  <span className="font-bold text-sm text-[#24302F]">
                    {vitalsProgress >= 100 ? '99%' : 'Scanning...'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleFinalSubmit}
                disabled={vitalsProgress < 100}
                className={`px-8 py-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                  vitalsProgress >= 100
                    ? 'bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0]'
                    : 'bg-[#E8D8B8] text-[#73787A] cursor-not-allowed'
                }`}
              >
                <span>Complete Check-In &amp; Generate Token</span>
                <span className="material-symbols-outlined text-[18px] text-[#D8BE88]">check_circle</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Confirmation & Token */}
        {step === 'confirmation' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-300">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>

            <h2 className="font-display text-3xl font-bold text-[#24302F] mb-1">
              Check-In Successful!
            </h2>
            <p className="text-xs sm:text-sm text-[#4D5652] mb-6">
              Your clinical narrative and automated vitals have been synchronized to Dr. Sharma&apos;s EMR queue.
            </p>

            <div className="bg-[#FAF7F0] p-6 rounded-3xl border border-[#E8D8B8] max-w-sm mx-auto mb-8 shadow-inner">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#73787A] block mb-1">
                Your Consultation Token
              </span>
              <span className="font-display text-4xl font-extrabold text-[#24302F] tracking-tight block mb-2">
                {tokenNumber}
              </span>
              <span className="text-xs font-semibold text-[#B89A5A] bg-white px-3 py-1 rounded-full border border-[#E8D8B8] inline-block">
                Dr. Sharma &bull; Room 3A &bull; 2 Mins Wait
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setCurrentView('doctor-dashboard')}
                className="w-full sm:w-auto bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-7 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Open in Doctor Portal &rarr;</span>
              </button>

              <button
                onClick={() => {
                  setStep('language');
                  setVitalsProgress(0);
                }}
                className="w-full sm:w-auto bg-[#FAF7F0] hover:bg-[#F3EBDD] text-[#24302F] border border-[#E8D8B8] px-6 py-3.5 rounded-2xl font-semibold text-xs sm:text-sm cursor-pointer"
              >
                Start Another Intake
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
