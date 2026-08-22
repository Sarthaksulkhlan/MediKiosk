import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { AppView, PatientRecord } from '../types';
import {
  speechService,
  extractClinicalEntities,
  SupportedLanguage,
} from '../utils/speechRecognition';
import { AuraAIEngine, AuraMessage } from '../utils/auraEngine';

interface PatientDashboardProps {
  setCurrentView: (view: AppView) => void;
  onNewCaseSubmitted?: (patient: Partial<PatientRecord>) => void;
}

interface PatientCase {
  id: string;
  title: string;
  date: string;
  status: 'In Progress' | 'Completed';
  language: string;
  chiefComplaint: string;
  duration: string;
  associated: string;
  narrative: string;
  timelineAdded?: string;
  auraHistory?: AuraMessage[];
}

interface UploadedRecord {
  id: string;
  title: string;
  visitDate: string;
  doctor: string;
  medicines: { name: string; dosage: string; frequency: string }[];
  fileType: 'PDF' | 'JPG' | 'PNG';
  fileName: string;
  rawTextPreview: string;
}

const LANGUAGE_CONFIG: Record<
  'EN' | 'HI',
  { langLabel: string; placeholder: string; demoPhrase: string }
> = {
  EN: {
    langLabel: 'English',
    placeholder: 'Speak or type what brings you in today...',
    demoPhrase: 'I have had fever for three days and headache since yesterday.',
  },
  HI: {
    langLabel: 'Hindi (हिन्दी)',
    placeholder: 'कृपया बताएं कि आप आज कैसा महसूस कर रहे हैं...',
    demoPhrase: 'मुझे पिछले तीन दिनों से बुखार और सिरदर्द हो रहा है।',
  },
};

const INITIAL_CASES: PatientCase[] = [
  {
    id: 'case-1',
    title: 'Fever with Headache',
    date: '21 Aug 2026',
    status: 'In Progress',
    language: 'English',
    chiefComplaint: 'Fever',
    duration: '3 days',
    associated: 'Headache',
    narrative: 'I have had fever for three days and headache since yesterday.',
    timelineAdded: 'Today',
    auraHistory: [
      {
        id: 'c1-m1',
        sender: 'aura',
        text: 'Hello Eleanor. I have recorded that you are experiencing **Fever** for **3 days**, with associated **Headache**.',
      },
      {
        id: 'c1-m2',
        sender: 'aura',
        text: 'Has the temperature been steady throughout the day, or does it spike mainly in the evening?',
      },
      {
        id: 'c1-m3',
        sender: 'patient',
        text: 'It mostly spikes in the evenings with chills.',
      },
    ],
  },
  {
    id: 'case-2',
    title: 'Lumbar Back Stiffness',
    date: '12 Aug 2026',
    status: 'Completed',
    language: 'English',
    chiefComplaint: 'Back pain',
    duration: '5 days',
    associated: 'None identified',
    narrative: 'I have had lower back pain for 5 days after prolonged sitting.',
    timelineAdded: '12 Aug 2026',
  },
  {
    id: 'case-3',
    title: 'Follow-up Seasonal Rhinitis',
    date: '03 Aug 2026',
    status: 'Completed',
    language: 'English',
    chiefComplaint: 'Cough',
    duration: '1 week',
    associated: 'Sore throat',
    narrative: 'Mild dry cough and sore throat for 1 week.',
    timelineAdded: '03 Aug 2026',
  },
];

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  setCurrentView,
  onNewCaseSubmitted,
}) => {
  // Navigation & Case State
  const [activeTab, setActiveTab] = useState<'new-case' | 'continue-case'>('new-case');
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'HI'>('EN');
  const [cases, setCases] = useState<PatientCase[]>(INITIAL_CASES);
  const [activeCaseId, setActiveCaseId] = useState<string>('case-1');

  // Live Voice Transcript & Clinical Extraction State
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechStatus, setSpeechStatus] = useState<string>('Voice Ready');
  const [transcript, setTranscript] = useState(
    'I have had fever for three days and headache since yesterday.'
  );

  // Strictly dynamic clinical entities (never hardcoded, derived only from transcript)
  const [extractedEntities, setExtractedEntities] = useState(() =>
    extractClinicalEntities('I have had fever for three days and headache since yesterday.')
  );

  // Aura AI Healthcare Assistant State
  const [auraMessages, setAuraMessages] = useState<AuraMessage[]>([
    {
      id: 'init-1',
      sender: 'aura',
      text: 'Hello Eleanor. I am Aura, MediKiosk’s Healthcare Assistant. I am here to help you organize your symptoms into a structured clinical summary before your consultation with Dr. Sharma.',
    },
    {
      id: 'init-2',
      sender: 'aura',
      text: 'I have recorded that you are experiencing **Fever** for **3 days**, with associated **Headache**.\n\nWhere exactly do you feel the pain or discomfort most intensely right now?',
      quickReplies: ['Mild discomfort', 'Moderate intensity', 'Severe'],
    },
  ]);
  const [auraInput, setAuraInput] = useState('');
  const [isAuraRecording, setIsAuraRecording] = useState(false);
  const [isIntakeComplete, setIsIntakeComplete] = useState(false);
  const [isLiveExtracting, setIsLiveExtracting] = useState(false);

  // Auto-scroll ref for Aura AI conversation
  const auraScrollRef = useRef<HTMLDivElement>(null);

  // Medical Records & Upload State
  const [uploadedRecord, setUploadedRecord] = useState<UploadedRecord>({
    id: 'opd-doc-1',
    title: 'Previous OPD Prescription',
    visitDate: '21 Aug 2026',
    doctor: 'Dr. Sharma',
    medicines: [
      { name: 'Medicine A', dosage: '500 mg', frequency: 'Twice daily' },
      { name: 'Medicine B', dosage: '10 mg', frequency: 'Once daily' },
    ],
    fileType: 'PDF',
    fileName: 'OPD_Prescription_Sharma_21Aug.pdf',
    rawTextPreview:
      'R/x OPD SLIP - DEPT OF GENERAL MEDICINE\nPatient: Eleanor Vance | Age: 29 | Female\nDiagnosis: Viral Pyrexia with Cephalalgia\n1. Tab Medicine A 500mg - 1-0-1 x 3 days\n2. Tab Medicine B 10mg - 0-0-1 x 5 days\nReview in 3 days if fever persists.',
  });
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrStep, setOcrStep] = useState<number>(4);
  const [showOriginalDocModal, setShowOriginalDocModal] = useState(false);

  // Medical Timeline
  const [timelineEvents, setTimelineEvents] = useState([
    {
      date: '21 Aug 2026',
      title: 'OPD Consultation',
      badge: 'Prescription uploaded',
      desc: 'Dr. Sharma · Prescription & clinical history synchronized to EMR.',
      type: 'prescription',
    },
    {
      date: '18 Aug 2026',
      title: 'Laboratory Report',
      badge: 'CBC',
      desc: 'Hemogram normal · Platelet count: 240,000/µL · Normal inflammatory markers.',
      type: 'lab',
    },
    {
      date: '12 Aug 2026',
      title: 'Previous Consultation',
      badge: 'Completed',
      desc: 'General medicine assessment for seasonal allergy review.',
      type: 'consult',
    },
  ]);

  // Sync state (Honest wording: "Prepared for Physician Review")
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  // Auto-scroll Aura AI chat on new messages
  useEffect(() => {
    if (auraScrollRef.current) {
      auraScrollRef.current.scrollTop = auraScrollRef.current.scrollHeight;
    }
  }, [auraMessages, interimTranscript]);

  // Update extracted clinical entities dynamically whenever transcript changes
  const handleTranscriptChange = (newText: string) => {
    setTranscript(newText);
    setIsLiveExtracting(true);
    const entities = extractClinicalEntities(newText);
    setExtractedEntities(entities);
    setTimeout(() => setIsLiveExtracting(false), 400);
  };

  // Switch Language
  const handleSelectLanguage = (lang: 'EN' | 'HI') => {
    setSelectedLanguage(lang);
    if (isRecording) {
      speechService.stop();
      setIsRecording(false);
      setInterimTranscript('');
    }
    // Update narrative to sample phrase in that language if empty or switching
    const config = LANGUAGE_CONFIG[lang];
    if (config) {
      handleTranscriptChange(config.demoPhrase);
      const entities = extractClinicalEntities(config.demoPhrase);
      const refreshedAura = AuraAIEngine.generateInitialGreeting('Eleanor', config.demoPhrase, entities, lang);
      setAuraMessages(refreshedAura);
      setIsIntakeComplete(false);
    }
  };

  // Clear or start fresh transcript
  const handleClearTranscript = () => {
    if (isRecording) {
      speechService.stop();
      setIsRecording(false);
      setInterimTranscript('');
    }
    setTranscript('');
    setExtractedEntities(extractClinicalEntities(''));
    const initialGreeting = AuraAIEngine.generateInitialGreeting('Eleanor', '', {
      chiefComplaint: 'No clinical complaint identified',
      duration: 'Not mentioned',
      associatedSymptom: 'None identified',
    }, selectedLanguage);
    setAuraMessages(initialGreeting);
    setIsIntakeComplete(false);
  };

  // Toggle Main Voice Recording
  const toggleVoiceRecording = () => {
    if (isRecording) {
      speechService.stop();
      setIsRecording(false);
      setInterimTranscript('');
      setSpeechStatus('Voice Ready');
      const entities = extractClinicalEntities(transcript);
      setExtractedEntities(entities);

      // Refresh Aura's conversational greeting context with the updated narrative
      if (transcript.trim().length > 0) {
        const refreshedAura = AuraAIEngine.generateInitialGreeting('Eleanor', transcript, entities, selectedLanguage);
        setAuraMessages(refreshedAura);
        setIsIntakeComplete(false);
      }
    } else {
      setIsRecording(true);
      setSpeechStatus(`Listening in ${LANGUAGE_CONFIG[selectedLanguage].langLabel}...`);
      setInterimTranscript('');

      const started = speechService.start(
        selectedLanguage as SupportedLanguage,
        {
          onStart: () => {
            setIsRecording(true);
            setSpeechStatus('Listening... Speak naturally');
          },
          onResult: (finalText, interim) => {
            if (finalText) {
              setTranscript(finalText);
              setIsLiveExtracting(true);
              const entities = extractClinicalEntities(finalText);
              setExtractedEntities(entities);
              setTimeout(() => setIsLiveExtracting(false), 300);
            }
            setInterimTranscript(interim);
          },
          onError: (err) => {
            console.warn('Speech recognition status:', err);
            if (err === 'not-allowed') {
              setSpeechStatus('Mic permission needed or enter text below');
            }
          },
          onEnd: () => {
            setIsRecording(false);
            setInterimTranscript('');
            setSpeechStatus('Voice Ready');
          },
        },
        transcript
      );

      if (!started && !speechService.isSupported()) {
        const demo = LANGUAGE_CONFIG[selectedLanguage].demoPhrase;
        setTimeout(() => {
          setTranscript(demo);
          setExtractedEntities(extractClinicalEntities(demo));
          setIsRecording(false);
          setSpeechStatus('Voice Ready');
        }, 2200);
      }
    }
  };

  // Aura AI Input Voice Toggle
  const toggleAuraVoice = () => {
    if (isAuraRecording) {
      speechService.stop();
      setIsAuraRecording(false);
    } else {
      setIsAuraRecording(true);
      speechService.start(
        selectedLanguage as SupportedLanguage,
        {
          onStart: () => setIsAuraRecording(true),
          onResult: (finalText, interim) => {
            const combined = finalText || interim;
            setAuraInput(combined);
          },
          onError: () => setIsAuraRecording(false),
          onEnd: () => setIsAuraRecording(false),
        },
        ''
      );
    }
  };

  // Send answer to Aura AI
  const handleSendAuraAnswer = (customText?: string) => {
    const textToSend = customText || auraInput;
    if (!textToSend.trim()) return;

    if (isAuraRecording) {
      speechService.stop();
      setIsAuraRecording(false);
    }

    const patientMsg: AuraMessage = {
      id: `pat-${Date.now()}`,
      sender: 'patient',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...auraMessages, patientMsg];
    setAuraMessages(updatedHistory);
    setAuraInput('');

    // Process intelligent adaptive response
    setTimeout(() => {
      const result = AuraAIEngine.processNextStep(textToSend, updatedHistory, extractedEntities, selectedLanguage);
      setAuraMessages([...updatedHistory, result.nextMessage]);
      if (result.isComplete) {
        setIsIntakeComplete(true);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      }
    }, 600);
  };

  // Load a historical or in-progress case
  const handleLoadCase = (c: PatientCase) => {
    setActiveCaseId(c.id);
    setActiveTab('new-case');
    setTranscript(c.narrative);
    const entities = extractClinicalEntities(c.narrative);
    setExtractedEntities(entities);

    if (c.auraHistory && c.auraHistory.length > 0) {
      setAuraMessages(c.auraHistory);
      setIsIntakeComplete(c.status === 'Completed');
    } else {
      const initial = AuraAIEngine.generateInitialGreeting('Eleanor', c.narrative, entities, selectedLanguage);
      setAuraMessages(initial);
      setIsIntakeComplete(c.status === 'Completed');
    }
  };

  // Document Upload Simulation
  const handleSimulateUpload = (fileName: string) => {
    setIsOcrProcessing(true);
    setOcrStep(1);

    setTimeout(() => {
      setOcrStep(2);
      setTimeout(() => {
        setOcrStep(3);
        setTimeout(() => {
          setOcrStep(4);
          setIsOcrProcessing(false);
          setUploadedRecord({
            id: `doc-${Date.now()}`,
            title: 'Uploaded Document',
            visitDate: '21 Aug 2026',
            doctor: 'Dr. Sharma',
            medicines: [
              { name: 'Medicine A', dosage: '500 mg', frequency: 'Twice daily' },
              { name: 'Medicine B', dosage: '10 mg', frequency: 'Once daily' },
            ],
            fileType: 'PDF',
            fileName: fileName,
            rawTextPreview: `PRESCRIPTION SCAN - ${fileName}\nVisit Date: 21 Aug 2026\nAttending: Dr. Sharma\nRx: Medicine A (500mg) - 1-0-1 | Medicine B (10mg) - 0-0-1\nFollow-up: 3 days`,
          });

          setTimelineEvents((prev) => [
            {
              date: '21 Aug 2026',
              title: 'Uploaded Document',
              badge: 'OCR Verified',
              desc: `OCR parsed ${fileName} · Prescribed by Dr. Sharma (Medicine A & B).`,
              type: 'prescription',
            },
            ...prev,
          ]);

          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        }, 600);
      }, 600);
    }, 600);
  };

  // Prepare & Send to Physician Queue
  const handleSyncToDoctorEMR = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncComplete(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

      if (onNewCaseSubmitted) {
        onNewCaseSubmitted({
          name: 'Eleanor Vance',
          age: 29,
          gender: 'Female',
          patientId: 'MK-6420D',
          chiefComplaint:
            extractedEntities.chiefComplaint !== 'No clinical complaint identified'
              ? `${extractedEntities.chiefComplaint}${
                  extractedEntities.associatedSymptom !== 'None identified'
                    ? `, ${extractedEntities.associatedSymptom}`
                    : ''
                }`
              : 'Pre-consultation Health Intake',
          language:
            selectedLanguage === 'HI'
              ? 'Hindi'
              : selectedLanguage === 'GU'
              ? 'Gujarati'
              : selectedLanguage === 'TA'
              ? 'Tamil'
              : 'English',
          languageCode: selectedLanguage === 'TA' ? 'TA' : (selectedLanguage as any),
          aiSummary: {
            status: 'Draft - Review Required',
            text: `Patient completed guided self-intake with Aura AI. Stated complaint: ${
              extractedEntities.chiefComplaint
            } (${extractedEntities.duration}). Associated findings: ${
              extractedEntities.associatedSymptom
            }. Full clinical intake transcript prepared for physician review.`,
            lastUpdated: 'Just now',
          },
          hpi: {
            onset:
              extractedEntities.duration !== 'Not mentioned'
                ? extractedEntities.duration
                : 'Recent onset',
            severity: 'Patient reported, pending physician review',
            associated: extractedEntities.associatedSymptom,
            alleviating: 'Rest and fluids as noted in intake',
            rawNarrative: transcript,
          },
          vitals: {
            temperature: '98.7°F',
            bloodPressure: '116/74 mmHg',
            heartRate: '74 bpm',
            oxygenSaturation: '99%',
            recordedAt: 'Just now via Patient Portal',
          },
          documents: [
            {
              id: 'doc-eleanor-opd',
              title: 'OPD Prescription (21 Aug 2026)',
              type: 'prescription',
              date: '21 Aug 2026',
              status: 'OCR Verified',
              summary: 'Medicine A (500mg TDS), Medicine B (Once daily). Attending: Dr. Sharma.',
              details: {
                doctor: 'Dr. Sharma',
                notes: 'Medicine A — 500 mg — Twice daily\nMedicine B — Once daily',
              },
            },
            {
              id: 'doc-eleanor-cbc',
              title: 'CBC Laboratory Report',
              type: 'lab',
              date: '18 Aug 2026',
              status: 'Completed',
              summary: 'Normal hemogram and platelet counts.',
            },
          ],
        });
      }
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1360px] mx-auto relative z-10">
      {/* 1. COMPACT PATIENT HEADER & QUICK CONTROLS */}
      <header className="mb-6 pb-4 border-b border-[#E8D8B8]/70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#24302F] text-[#FAF7F0] flex items-center justify-center font-bold text-base shadow-xs flex-shrink-0">
              EV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#24302F] tracking-tight">
                  Good morning, Eleanor.
                </h1>
                <span className="inline-flex items-center gap-1.5 bg-[#FAF7F0] px-2.5 py-1 rounded-full border border-[#E8D8B8] text-xs font-medium text-[#24302F]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-mono font-bold text-[#B89A5A]">MK-6420D</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#4D5652]">
                Let&apos;s prepare your story for your consultation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Primary Action Buttons: Start New Case & Continue Case */}
            <button
              onClick={() => setActiveTab('new-case')}
              className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'new-case'
                  ? 'bg-[#24302F] text-[#FAF7F0] shadow-sm'
                  : 'bg-[#FAF7F0] text-[#4D5652] hover:text-[#24302F] border border-[#E8D8B8]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>Start New Case</span>
            </button>

            <button
              onClick={() => setActiveTab('continue-case')}
              className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'continue-case'
                  ? 'bg-[#24302F] text-[#FAF7F0] shadow-sm'
                  : 'bg-[#FAF7F0] text-[#4D5652] hover:text-[#24302F] border border-[#E8D8B8]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span>Continue Case</span>
            </button>

            {/* Quick Demo Switch to Doctor Queue */}
            <button
              onClick={() => setCurrentView('doctor-dashboard')}
              className="inline-flex items-center gap-1.5 bg-[#FAF7F0] hover:bg-[#F3EBDD] text-[#24302F] border border-[#E8D8B8] px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="Open Doctor EMR Queue"
            >
              <span>Physician View</span>
              <span className="material-symbols-outlined text-[15px] text-[#B89A5A]">
                open_in_new
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. PRIMARY INTAKE GRID: 8 COLS (VOICE + EXTRACTION + AURA AI) & 4 COLS (MEDICAL RECORDS & TIMELINE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* LEFT COLUMN: HERO INTAKE & AURA AI (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {activeTab === 'new-case' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* CARD 1: VOICE-FIRST CLINICAL INTAKE WITH WEBSPEECH API */}
              <div className="bg-[#FAF7F0] rounded-3xl p-5 sm:p-7 border border-[#E8D8B8] shadow-xs relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#24302F] flex items-center gap-2">
                      <span>New Consultation Case</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#4D5652]">
                      Speak your symptoms naturally in your preferred language or type below.
                    </p>
                  </div>

                  {/* Language Selector Chips */}
                  <div className="flex items-center gap-1 p-1 bg-white/90 rounded-2xl border border-[#E8D8B8] self-start sm:self-auto">
                    {(['EN', 'HI'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleSelectLanguage(lang)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedLanguage === lang
                            ? 'bg-[#24302F] text-[#FAF7F0] shadow-xs'
                            : 'text-[#4D5652] hover:bg-[#F3EBDD]'
                        }`}
                      >
                        {lang === 'EN' ? 'English (EN)' : 'Hindi (हिन्दी)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Central Microphone Button with Real-Time WebSpeech Pulse */}
                <div className="flex flex-col items-center justify-center py-4 relative z-10">
                  <div className="relative mb-3 flex items-center justify-center">
                    {isRecording && (
                      <>
                        <div className="absolute w-32 h-32 rounded-full border-2 border-[#B89A5A]/60 animate-ping pointer-events-none" />
                        <div className="absolute w-44 h-44 rounded-full border border-[#D8BE88]/40 animate-pulse pointer-events-none" />
                      </>
                    )}

                    <button
                      onClick={toggleVoiceRecording}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer group relative ${
                        isRecording
                          ? 'bg-[#B89A5A] text-white scale-105 shadow-[0_0_28px_rgba(184,154,90,0.5)]'
                          : 'bg-[#24302F] text-[#FAF7F0] hover:bg-[#1B2423] hover:scale-105'
                      }`}
                      title={isRecording ? 'Click to stop listening' : 'Click to speak'}
                    >
                      <span className="material-symbols-outlined text-[36px] sm:text-[42px] transition-transform group-hover:scale-110">
                        {isRecording ? 'graphic_eq' : 'mic'}
                      </span>
                    </button>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-wider text-[#73787A] flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isRecording ? 'bg-amber-600 animate-ping' : 'bg-emerald-500'
                      }`}
                    />
                    <span>
                      {isRecording
                        ? `Listening to your voice in ${LANGUAGE_CONFIG[selectedLanguage].langLabel}...`
                        : `Tap microphone to speak in ${LANGUAGE_CONFIG[selectedLanguage].langLabel}`}
                    </span>
                  </p>
                </div>

                {/* Live Real-Time Transcript Input Area */}
                <div className="bg-white rounded-2xl p-4 border border-[#E8D8B8] shadow-2xs mb-5 relative z-10">
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#E8D8B8]/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D5652] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[13px] text-[#B89A5A]">
                        record_voice_over
                      </span>
                      Patient Stated Narrative ({LANGUAGE_CONFIG[selectedLanguage].langLabel})
                    </span>
                    <div className="flex items-center gap-2">
                      {transcript.trim().length > 0 && (
                        <button
                          onClick={handleClearTranscript}
                          className="text-[10px] text-[#73787A] hover:text-red-700 transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                      <span className="text-[10px] text-[#73787A]">Live WebSpeech Sync</span>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      value={transcript}
                      onChange={(e) => handleTranscriptChange(e.target.value)}
                      placeholder={LANGUAGE_CONFIG[selectedLanguage].placeholder}
                      rows={2}
                      className="w-full bg-transparent border-none outline-none font-display text-sm sm:text-base text-[#24302F] font-semibold italic leading-relaxed resize-none p-0 focus:ring-0"
                    />
                    {interimTranscript && (
                      <div className="mt-1 text-xs text-amber-800 italic bg-amber-50 p-2 rounded-xl border border-amber-200 animate-pulse">
                        Live speech stream: &ldquo;{interimTranscript}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

                {/* CARD 2: PREMIUM DYNAMICALLY EXTRACTED CLINICAL ENTITIES (NO FAKE / DEMO HARDCODING) */}
                <div className="mb-2 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#24302F] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">
                          fact_check
                        </span>
                        Dynamically Extracted Clinical Entities
                      </span>
                      {isLiveExtracting && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                          Live extraction
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#73787A] italic">
                      Zero autonomous diagnosis &bull; Deterministic
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Chief Complaint Card */}
                    <div
                      className={`p-3.5 rounded-2xl border transition-all ${
                        extractedEntities.chiefComplaint === 'No clinical complaint identified'
                          ? 'bg-white/60 border-[#E8D8B8]'
                          : 'bg-white border-[#D8BE88] shadow-xs'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block mb-1">
                        CHIEF COMPLAINT
                      </span>
                      <span
                        className={`text-sm font-bold block ${
                          extractedEntities.chiefComplaint === 'No clinical complaint identified'
                            ? 'text-[#73787A] italic font-normal'
                            : 'text-[#24302F]'
                        }`}
                      >
                        {extractedEntities.chiefComplaint}
                      </span>
                    </div>

                    {/* Duration Card */}
                    <div
                      className={`p-3.5 rounded-2xl border transition-all ${
                        extractedEntities.duration === 'Not mentioned'
                          ? 'bg-white/60 border-[#E8D8B8]'
                          : 'bg-white border-[#D8BE88] shadow-xs'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block mb-1">
                        DURATION
                      </span>
                      <span
                        className={`text-sm font-bold block ${
                          extractedEntities.duration === 'Not mentioned'
                            ? 'text-[#73787A] italic font-normal'
                            : 'text-[#24302F]'
                        }`}
                      >
                        {extractedEntities.duration}
                      </span>
                    </div>

                    {/* Associated Symptoms Card */}
                    <div
                      className={`p-3.5 rounded-2xl border transition-all ${
                        extractedEntities.associatedSymptom === 'None identified'
                          ? 'bg-white/60 border-[#E8D8B8]'
                          : 'bg-white border-[#D8BE88] shadow-xs'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block mb-1">
                        ASSOCIATED SYMPTOMS
                      </span>
                      <span
                        className={`text-sm font-bold block ${
                          extractedEntities.associatedSymptom === 'None identified'
                            ? 'text-[#73787A] italic font-normal'
                            : 'text-[#24302F]'
                        }`}
                      >
                        {extractedEntities.associatedSymptom}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: AURA AI — MEDIKIOSK'S HEALTHCARE ASSISTANT (PRIMARY HERO COMPONENT) */}
              <div className="bg-white rounded-3xl border border-[#E8D8B8] shadow-sm overflow-hidden flex flex-col">
                {/* Aura AI Header */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FAF7F0] to-white border-b border-[#E8D8B8] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#24302F] text-[#D8BE88] flex items-center justify-center shadow-xs flex-shrink-0">
                      <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-[#24302F]">Aura AI</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F3EBDD] text-[#4D5652] px-2 py-0.5 rounded-full border border-[#E8D8B8]">
                          MediKiosk&apos;s Healthcare Assistant
                        </span>
                      </div>
                      <p className="text-xs text-[#73787A]">
                        Your guided health intake assistant &bull; Preparing details for physician
                        review
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Language selector for Aura AI (English & Hindi) */}
                    <div className="flex items-center gap-1 p-1 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
                      <button
                        onClick={() => handleSelectLanguage('EN')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedLanguage === 'EN'
                            ? 'bg-[#24302F] text-[#FAF7F0] shadow-xs'
                            : 'text-[#4D5652] hover:bg-[#F3EBDD]'
                        }`}
                        title="Converse in English"
                      >
                        EN
                      </button>
                      <button
                        onClick={() => handleSelectLanguage('HI')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedLanguage === 'HI'
                            ? 'bg-[#24302F] text-[#FAF7F0] shadow-xs'
                            : 'text-[#4D5652] hover:bg-[#F3EBDD]'
                        }`}
                        title="हिन्दी में बातचीत करें"
                      >
                        HI (हिन्दी)
                      </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#73787A] ml-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isIntakeComplete ? 'bg-emerald-500' : 'bg-teal-600 animate-pulse'
                        }`}
                      />
                      <span>{isIntakeComplete ? 'Intake Complete' : 'Active Intake'}</span>
                    </div>
                  </div>
                </div>

                {/* Aura Conversation Stream (Fixed/Max-Height Internal Scrollable Area) */}
                <div
                  ref={auraScrollRef}
                  className="p-4 sm:p-5 space-y-4 max-h-[380px] sm:max-h-[420px] overflow-y-auto bg-[#FAF7F0]/30 scroll-smooth"
                >
                  {auraMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.sender === 'patient' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.sender === 'aura' && (
                        <div className="w-8 h-8 rounded-2xl bg-[#24302F] text-[#D8BE88] flex items-center justify-center flex-shrink-0 shadow-2xs">
                          <span className="material-symbols-outlined text-[18px]">
                            auto_awesome
                          </span>
                        </div>
                      )}

                      <div className="max-w-[85%] sm:max-w-[80%] flex flex-col gap-1.5">
                        <div
                          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            msg.sender === 'patient'
                              ? 'bg-[#24302F] text-[#FAF7F0] rounded-tr-xs shadow-xs ml-auto'
                              : msg.isRedFlagWarning
                              ? 'bg-amber-50 text-amber-950 border border-amber-300 rounded-tl-xs shadow-xs'
                              : 'bg-white text-[#24302F] border border-[#E8D8B8] rounded-tl-xs shadow-xs'
                          }`}
                        >
                          <div className="whitespace-pre-line">
                            {msg.text.split('\n\n').map((para, i) => (
                              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                                {para.split(/(\*\*.*?\*\*)/g).map((chunk, j) => {
                                  if (chunk.startsWith('**') && chunk.endsWith('**')) {
                                    return (
                                      <strong key={j} className="font-bold text-[#24302F]">
                                        {chunk.slice(2, -2)}
                                      </strong>
                                    );
                                  }
                                  return chunk;
                                })}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Quick Replies below AI Message */}
                        {msg.quickReplies && msg.quickReplies.length > 0 && !isIntakeComplete && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {msg.quickReplies.map((reply, rIdx) => (
                              <button
                                key={rIdx}
                                onClick={() => handleSendAuraAnswer(reply)}
                                className="text-[11px] bg-white hover:bg-[#FAF7F0] border border-[#D8BE88] px-3 py-1 rounded-xl text-[#24302F] font-medium transition-colors cursor-pointer shadow-2xs"
                              >
                                &ldquo;{reply}&rdquo;
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {msg.sender === 'patient' && (
                        <div className="w-8 h-8 rounded-2xl bg-[#B89A5A] text-white flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-2xs">
                          EV
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Aura AI Footer / Completed State & Review Dispatch */}
                <div className="p-4 bg-white border-t border-[#E8D8B8]">
                  {isIntakeComplete ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FAF7F0] p-4 rounded-2xl border border-[#D8BE88]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        </div>
                        <div>
                          <strong className="text-xs sm:text-sm text-[#24302F] block">
                            ✓ Intake Complete &bull; Prepared for Physician Review
                          </strong>
                          <span className="text-[11px] text-[#73787A]">
                            Dr. Sharma will review this structured record during your consultation.
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleSyncToDoctorEMR}
                        disabled={isSyncing}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
                      >
                        {isSyncing ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            <span>Formatting Case...</span>
                          </>
                        ) : syncComplete ? (
                          <>
                            <span className="material-symbols-outlined text-[16px] text-emerald-400">
                              check_circle
                            </span>
                            <span>Ready in Physician Queue</span>
                          </>
                        ) : (
                          <>
                            <span>Send to Physician Queue</span>
                            <span className="material-symbols-outlined text-[16px] text-[#D8BE88]">
                              arrow_forward
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleAuraVoice}
                        className={`p-3 rounded-2xl transition-all cursor-pointer border flex items-center justify-center ${
                          isAuraRecording
                            ? 'bg-[#B89A5A] text-white border-[#B89A5A] animate-pulse shadow-md'
                            : 'bg-[#FAF7F0] text-[#4D5652] hover:bg-[#F3EBDD] border-[#E8D8B8]'
                        }`}
                        title={isAuraRecording ? 'Stop speaking' : 'Speak to Aura AI'}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {isAuraRecording ? 'graphic_eq' : 'mic'}
                        </span>
                      </button>

                      <input
                        type="text"
                        value={auraInput}
                        onChange={(e) => setAuraInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendAuraAnswer()}
                        placeholder={
                          isAuraRecording
                            ? 'Listening... Speak your response now'
                            : 'Type or speak response to Aura AI...'
                        }
                        className="flex-grow bg-[#FAF7F0] border border-[#E8D8B8] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#24302F] outline-none focus:border-[#B89A5A]"
                      />

                      <button
                        onClick={() => handleSendAuraAnswer()}
                        className="bg-[#24302F] text-[#FAF7F0] hover:bg-[#1B2423] px-4 py-3 rounded-2xl transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">send</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: CONTINUE CASE (HISTORICAL AND IN-PROGRESS CASES) */}
          {activeTab === 'continue-case' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8D8B8] shadow-xs">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E8D8B8]/70">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#24302F]">
                      Your Consultation Cases
                    </h2>
                    <p className="text-xs sm:text-sm text-[#4D5652]">
                      Select an existing consultation case to continue or review prior notes.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#B89A5A] bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#E8D8B8]">
                    {cases.length} Total Records
                  </span>
                </div>

                <div className="space-y-3.5">
                  {cases.map((c) => (
                    <div
                      key={c.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        activeCaseId === c.id
                          ? 'bg-[#FAF7F0] border-[#B89A5A] shadow-xs ring-1 ring-[#B89A5A]/30'
                          : 'bg-white border-[#E8D8B8] hover:border-[#B89A5A]/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-display text-base font-bold text-[#24302F]">
                            {c.title}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              c.status === 'In Progress'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>

                        <p className="text-xs text-[#73787A] mb-1">
                          Date: <strong className="text-[#24302F]">{c.date}</strong> &bull; Chief
                          Complaint: {c.chiefComplaint} ({c.duration})
                        </p>
                        <p className="text-xs text-[#4D5652] italic line-clamp-1">
                          &ldquo;{c.narrative}&rdquo;
                        </p>
                      </div>

                      <button
                        onClick={() => handleLoadCase(c)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer flex-shrink-0 ${
                          c.status === 'In Progress'
                            ? 'bg-[#24302F] text-[#FAF7F0] hover:bg-[#1B2423] shadow-xs'
                            : 'bg-[#FAF7F0] text-[#24302F] border border-[#E8D8B8] hover:bg-[#F3EBDD]'
                        }`}
                      >
                        <span>{c.status === 'In Progress' ? 'Continue Case' : 'View Notes'}</span>
                        <span className="material-symbols-outlined text-[15px] text-[#D8BE88]">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN: MEDICAL RECORDS OCR & TIMELINE (4 cols - MOVED HIGHER & ALIGNED) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* SECTION 1: MEDICAL RECORDS & OPD SLIP UPLOAD */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B89A5A] text-xl">
                  folder_shared
                </span>
                <h3 className="font-display text-lg font-bold text-[#24302F]">Medical Records</h3>
              </div>
            </div>

            <p className="text-xs text-[#4D5652] leading-relaxed mb-4">
              Upload previous prescriptions, OPD slips, lab reports or discharge summaries.
            </p>

            {/* Document Upload Button (PDF, JPG, PNG) */}
            <div className="mb-4">
              <label className="block w-full border-2 border-dashed border-[#D8BE88] hover:border-[#B89A5A] rounded-2xl p-4 text-center cursor-pointer transition-all bg-[#FAF7F0]/60 hover:bg-[#FAF7F0]">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleSimulateUpload(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                />
                <span className="material-symbols-outlined text-2xl text-[#B89A5A] mb-1">
                  upload_file
                </span>
                <span className="text-xs font-bold text-[#24302F] block">+ Upload Document</span>
                <span className="text-[10px] text-[#73787A] block mt-0.5">
                  Supports PDF, JPG, PNG
                </span>
              </label>
            </div>

            {/* OCR Pipeline Status */}
            {isOcrProcessing && (
              <div className="bg-[#FAF7F0] p-3 rounded-2xl border border-[#E8D8B8] mb-4 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#24302F] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#B89A5A] animate-ping" />
                  <span>Processing OCR...</span>
                </div>
                <div className="space-y-1 text-[11px] text-[#4D5652]">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <span className="material-symbols-outlined text-[13px]">check</span>
                    <span>Document uploaded</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      ocrStep >= 2 ? 'text-emerald-700 font-semibold' : 'text-[#73787A]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {ocrStep >= 2 ? 'check' : 'hourglass_top'}
                    </span>
                    <span>OCR complete</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      ocrStep >= 3 ? 'text-emerald-700 font-semibold' : 'text-[#73787A]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {ocrStep >= 3 ? 'check' : 'hourglass_top'}
                    </span>
                    <span>Clinical information extracted</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      ocrStep >= 4 ? 'text-emerald-700 font-semibold' : 'text-[#73787A]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {ocrStep >= 4 ? 'check' : 'hourglass_top'}
                    </span>
                    <span>Added to medical timeline</span>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Extracted Record Card */}
            <div className="bg-[#FAF7F0] rounded-2xl p-4 border border-[#E8D8B8]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] bg-white px-2 py-0.5 rounded border border-[#E8D8B8]">
                  PREVIOUS PRESCRIPTION
                </span>
                <span className="text-[11px] text-[#73787A]">{uploadedRecord.visitDate}</span>
              </div>

              <div className="text-xs space-y-1 mb-2.5">
                <div>
                  <span className="text-[#73787A]">Visit Date: </span>
                  <strong className="text-[#24302F]">{uploadedRecord.visitDate}</strong>
                </div>
                <div>
                  <span className="text-[#73787A]">Doctor: </span>
                  <strong className="text-[#24302F]">{uploadedRecord.doctor}</strong>
                </div>
              </div>

              <div className="text-xs mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block mb-1">
                  Medicines:
                </span>
                <div className="space-y-1.5">
                  {uploadedRecord.medicines.map((med, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2 rounded-xl border border-[#E8D8B8] text-[11px] text-[#24302F]"
                    >
                      <span className="font-semibold">{med.name}</span> — <span>{med.dosage}</span>{' '}
                      — <span>{med.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowOriginalDocModal(true)}
                className="w-full text-xs font-semibold text-[#24302F] hover:text-[#B89A5A] py-1 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Original Document</span>
                <span className="material-symbols-outlined text-[14px]">visibility</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: MEDICAL TIMELINE */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#E8D8B8]/60">
              <span className="material-symbols-outlined text-[#B89A5A] text-xl">timeline</span>
              <h3 className="font-display text-lg font-bold text-[#24302F]">Medical Timeline</h3>
            </div>

            <div className="relative pl-5 space-y-4 border-l-2 border-[#E8D8B8] ml-2">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#FAF7F0] border-2 border-[#B89A5A] flex items-center justify-center" />

                  <div className="text-xs">
                    <span className="text-[10px] font-mono text-[#73787A] block font-semibold">
                      {evt.date}
                    </span>
                    <div className="flex items-center gap-1.5 my-0.5">
                      <strong className="text-xs font-bold text-[#24302F]">{evt.title}</strong>
                      <span className="text-[9px] font-bold bg-[#F3EBDD] text-[#4D5652] px-1.5 py-0.5 rounded border border-[#E8D8B8]">
                        {evt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4D5652] leading-snug">{evt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ORIGINAL DOCUMENT MODAL */}
      <AnimatePresence>
        {showOriginalDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#FAF7F0] rounded-3xl p-6 max-w-lg w-full border border-[#E8D8B8] shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8] mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#B89A5A] text-xl">
                    description
                  </span>
                  <h4 className="font-display font-bold text-base text-[#24302F]">
                    {uploadedRecord.fileName}
                  </h4>
                </div>
                <button
                  onClick={() => setShowOriginalDocModal(false)}
                  className="w-7 h-7 rounded-full bg-[#F3EBDD] hover:bg-[#E8D8B8] flex items-center justify-center text-[#24302F] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E8D8B8] font-mono text-xs text-[#24302F] leading-relaxed whitespace-pre-line shadow-inner mb-4">
                {uploadedRecord.rawTextPreview}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowOriginalDocModal(false)}
                  className="bg-[#24302F] text-[#FAF7F0] px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
