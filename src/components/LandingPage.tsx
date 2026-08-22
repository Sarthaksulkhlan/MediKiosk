import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, UserRole } from '../types';

interface LandingPageProps {
  setCurrentView: (view: AppView) => void;
  setUserRole: (role: UserRole) => void;
  onOpenGetStartedModal: () => void;
}

interface LanguageSample {
  code: string;
  label: string;
  native: string;
  quote: string;
  englishTranslation: string;
  chiefComplaint: string;
  duration: string;
  associated: string;
  vitals: string;
  summary: string;
}

const LANGUAGE_SAMPLES: LanguageSample[] = [
  {
    code: 'HI',
    label: 'Hindi',
    native: 'हिन्दी',
    quote: 'पिछले तीन दिनों से मुझे तेज बुखार और सिरदर्द महसूस हो रहा है, सुबह के समय बदन में भारीपन रहता है...',
    englishTranslation: 'For the past three days I have had a high fever and headache, with body heaviness in the mornings...',
    chiefComplaint: 'Acute Fever with Cephalalgia',
    duration: '3 days',
    associated: 'Body aches, mild chills upon waking',
    vitals: 'Temp: 102.1°F • BP: 122/80 mmHg • HR: 82 bpm',
    summary: '3-day history of acute fever and bilateral headache. Denies nausea, photophobia, or neck stiffness. Currently taking OTC Paracetamol.',
  },
  {
    code: 'EN',
    label: 'English',
    native: 'English',
    quote: "I've been having a throbbing migraine for the last two days, with sensitivity to bright light and morning nausea...",
    englishTranslation: "I've been having a throbbing migraine for the last two days, with sensitivity to bright light and morning nausea...",
    chiefComplaint: 'Throbbing Cephalalgia with Photophobia',
    duration: '2 days',
    associated: 'Light sensitivity, mild morning nausea',
    vitals: 'Temp: 98.6°F • BP: 120/78 mmHg • HR: 74 bpm',
    summary: '2-day history of throbbing unilateral cephalalgia with photophobia and mild nausea. Relieved in dark room. No aura reported.',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    title: 'Check In & Consent',
    description: 'Patient selects their native language and provides explicit digital consent to capture their clinical narrative.',
    tag: 'Multilingual & Consent-First',
    detail: 'Zero literacy barriers with multi-dialect support and accessible audio guidance.',
  },
  {
    number: '02',
    title: 'Tell Your Story',
    description: 'Patient speaks naturally via conversational voice or guided touch intake without medical jargon pressure.',
    tag: 'Voice-First AI',
    detail: 'Continuous speech recognition captures full context including symptoms, duration, and lifestyle.',
  },
  {
    number: '03',
    title: 'Bring Your Records',
    description: 'Past handwritten prescriptions, diagnostic lab reports, and discharge summaries are scanned and digitized.',
    tag: 'OCR & Document Intelligence',
    detail: 'Converts legacy paper records into indexed clinical timelines with verified metadata.',
  },
  {
    number: '04',
    title: 'Understand & Organize',
    description: 'MediKiosk structures the raw narrative into clean clinical domains: Chief Complaint, HPI, Medications, and Allergies.',
    tag: 'Clinical Structuring',
    detail: 'Strict privacy isolation ensures no autonomous diagnoses are made; pure structured intake.',
  },
  {
    number: '05',
    title: 'Doctor Ready',
    description: 'A concise pre-consultation draft summary is ready in the physician’s EMR before the patient even walks through the door.',
    tag: 'Physician Review Draft',
    detail: 'Saves 4–6 minutes per patient, restoring precious face-to-face consultation time.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  setCurrentView,
  setUserRole,
  onOpenGetStartedModal,
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageSample>(LANGUAGE_SAMPLES[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const handlePlayVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingAudio) {
        setIsPlayingAudio(false);
        return;
      }
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2400);
    }
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative z-10 overflow-hidden">
      {/* 1. CONTINUOUS HORIZONTAL LIVE INFORMATION TICKER */}
      {/* Positioned between the Get Started navbar header and the AI-Powered Clinical Intake hero */}
      <section className="w-full mt-20 bg-[#F3EBDD]/80 border-b border-[#E8D8B8]/80 py-2.5 overflow-hidden relative z-30 shadow-[0_1px_6px_rgba(36,48,47,0.02)]">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest text-[#4D5652]">
          {/* Loop Segment 1 - Grounded Real Project Capabilities */}
          <span className="inline-flex items-center gap-2 text-[#24302F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89A5A]" /> MULTILINGUAL VOICE INTAKE
          </span>
          <span className="text-[#B89A5A]">✦</span>
          <span>SYMPTOM &amp; TIMELINE STRUCTURING</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>PRESCRIPTION &amp; REPORT OCR</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>PHYSICIAN PRE-CONSULT DRAFT</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>PATIENT CONSENT-DRIVEN</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>ZERO AUTONOMOUS DIAGNOSIS</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>TRIAGE QUEUE SYNCHRONIZATION</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>PHYSICIAN-IN-THE-LOOP VERIFICATION</span>
          <span className="text-[#B89A5A]">✦</span>

          {/* Loop Segment 2 (Duplicate for Seamless Infinite Scroll) */}
          <span className="inline-flex items-center gap-2 text-[#24302F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89A5A]" /> MULTILINGUAL VOICE INTAKE
          </span>
          <span className="text-[#B89A5A]">✦</span>
          <span>SYMPTOM &amp; TIMELINE STRUCTURING</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>PRESCRIPTION &amp; REPORT OCR</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>PHYSICIAN PRE-CONSULT DRAFT</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>PATIENT CONSENT-DRIVEN</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>ZERO AUTONOMOUS DIAGNOSIS</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>TRIAGE QUEUE SYNCHRONIZATION</span>
          <span className="text-[#B89A5A]">✦</span>
          <span>PHYSICIAN-IN-THE-LOOP VERIFICATION</span>
          <span className="text-[#B89A5A]">✦</span>
        </div>
      </section>

      {/* 2. TOP HERO SECTION */}
      <section className="relative pt-8 pb-14 md:pt-14 md:pb-20 px-6 md:px-10 max-w-[1400px] mx-auto overflow-hidden">
        {/* LIVE CONCENTRIC ACOUSTIC RADAR RIPPLE EFFECT BEHIND HERO */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] h-[550px] flex items-center justify-center pointer-events-none -z-10 overflow-visible">
          {/* Volumetric Warm Golden Acoustic Glow Hub */}
          <div className="w-80 h-80 rounded-full bg-gradient-to-tr from-[#B89A5A]/30 via-[#E8D8B8]/50 to-[#D8BE88]/25 blur-3xl animate-acoustic-glow" />

          {/* 4 Expanding Concentric Glowing Ripple Rings */}
          <div className="absolute w-[240px] sm:w-[280px] h-[240px] sm:h-[280px] rounded-full border-2 border-[#B89A5A]/60 shadow-[0_0_20px_rgba(184,154,90,0.35)] animate-ripple-1" />
          <div className="absolute w-[360px] sm:w-[420px] h-[360px] sm:h-[420px] rounded-full border-2 border-[#B89A5A]/45 shadow-[0_0_24px_rgba(184,154,90,0.25)] animate-ripple-2" />
          <div className="absolute w-[480px] sm:w-[560px] h-[480px] sm:h-[560px] rounded-full border-2 border-[#D8BE88]/40 shadow-[0_0_28px_rgba(216,190,136,0.2)] animate-ripple-3" />
          <div className="absolute w-[600px] sm:w-[700px] h-[600px] sm:h-[700px] rounded-full border border-[#E8D8B8]/35 shadow-[0_0_32px_rgba(232,216,184,0.15)] animate-ripple-4" />

          {/* Rotating Acoustic Radar Calibration Circle */}
          <div className="absolute w-[420px] sm:w-[500px] h-[420px] sm:h-[500px] rounded-full border border-dashed border-[#B89A5A]/35 animate-radar-sweep opacity-75" />
          <div className="absolute w-[520px] sm:w-[620px] h-[520px] sm:h-[620px] rounded-full border border-[#E8D8B8]/40 animate-radar-sweep-reverse opacity-50" />

          {/* Crosshair Frequency Axis Marks */}
          <div className="absolute w-[500px] sm:w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#B89A5A]/30 to-transparent" />
          <div className="absolute h-[500px] sm:h-[600px] w-[1px] bg-gradient-to-b from-transparent via-[#B89A5A]/30 to-transparent" />
        </div>

        {/* ELEGANT MINIMAL ORBITAL ACCENT PILLS (Very small & refined) */}
        <div className="hidden lg:block absolute left-8 top-[36%] -translate-y-1/2 z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F0]/90 backdrop-blur-sm border border-[#E8D8B8] shadow-xs text-xs text-[#24302F]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-[11px]">24kHz Hindi &amp; English Voice</span>
          </motion.div>
        </div>

        <div className="hidden lg:block absolute left-12 bottom-[22%] z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F0]/90 backdrop-blur-sm border border-[#E8D8B8] shadow-xs text-xs text-[#4D5652]"
          >
            <span className="material-symbols-outlined text-[13px] text-[#B89A5A]">document_scanner</span>
            <span className="text-[11px] font-medium">Lab &amp; Rx OCR Extraction</span>
          </motion.div>
        </div>

        <div className="hidden lg:block absolute right-8 top-[36%] -translate-y-1/2 z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#24302F]/90 backdrop-blur-sm border border-[#B89A5A]/40 shadow-xs text-xs text-[#FAF7F0]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89A5A] animate-pulse" />
            <span className="font-semibold text-[11px] text-[#D8BE88]">Doctor-Ready SOAP Draft</span>
          </motion.div>
        </div>

        <div className="hidden lg:block absolute right-12 bottom-[22%] z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F0]/90 backdrop-blur-sm border border-[#E8D8B8] shadow-xs text-xs text-[#4D5652]"
          >
            <span className="material-symbols-outlined text-[13px] text-emerald-600">verified_user</span>
            <span className="text-[11px] font-medium">14/14 Red Flags Checked</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center flex flex-col items-center z-10"
        >
          {/* Small Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EBDD] border border-[#E8D8B8] text-[#4D5652] text-xs font-semibold uppercase tracking-wider mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#B89A5A] animate-pulse" />
            <span>AI-Powered Clinical Intake</span>
          </div>

          {/* Main Headline (Each part on its own line, balanced scale) */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] text-[#24302F] font-bold leading-[1.1] tracking-tight mb-6 text-center">
            <div>Your story,</div>
            <div className="relative inline-block text-[#B89A5A]">
              heard before
              <svg className="absolute -bottom-1.5 left-0 w-full h-3 text-[#D8BE88]/50 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 14 Q50 18 100 12" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div>your consultation.</div>
          </h1>

          {/* Supporting Copy (Centered & comfortable width) */}
          <p className="text-base sm:text-lg lg:text-[20px] text-[#4D5652] leading-relaxed mb-8 max-w-2xl font-normal text-center">
            An AI-powered multilingual clinical intake platform that talks to patients, understands their medical history, digitizes their old reports, detects emergency symptoms, and delivers a verified physician-ready summary before the consultation begins.
          </p>

          {/* CTAs (Centered & comfortable size) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
            <div className="relative inline-flex w-full sm:w-auto">
              <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#B89A5A]/35 to-[#D8BE88]/35 blur-sm animate-pulse -z-10" />
              <button
                onClick={onOpenGetStartedModal}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-7.5 py-3.5 rounded-full font-medium text-sm sm:text-base transition-all duration-300 shadow-[0_4px_20px_rgba(36,48,47,0.15)] hover:shadow-[0_8px_30px_rgba(184,154,90,0.3)] hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
              >
                <span>Experience MediKiosk</span>
                <span className="material-symbols-outlined text-[18px] text-[#D8BE88] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>

            <button
              onClick={scrollToHowItWorks}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-[#4D5652] hover:text-[#24302F] hover:bg-[#F3EBDD]/60 transition-colors cursor-pointer border border-[#E8D8B8]/60 sm:border-transparent hover:border-[#E8D8B8]"
            >
              <span>See how it works</span>
              <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
            </button>
          </div>

          {/* Minimal Trust Indicator (Centered) */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#73787A] pt-4.5 border-t border-[#E8D8B8]/60 max-w-3xl w-full">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">verified_user</span>
              <span>Consent-First</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#4D5652]">translate</span>
              <span>Hindi &amp; English Voice Intake</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#4D5652]">document_scanner</span>
              <span>Report &amp; Prescription OCR</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#4D5652]">stethoscope</span>
              <span>Physician-in-the-Loop</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. THE OUTPATIENT CHALLENGE */}
      <section className="py-16 md:py-20 px-6 md:px-10 max-w-[1280px] mx-auto border-t border-[#E8D8B8]/50">
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#B89A5A] block mb-3">
            The Outpatient Challenge
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-bold text-[#24302F] leading-tight">
            Every patient has a story. <br />
            Doctors don&apos;t always have enough time to hear it.
          </h2>
          <p className="text-base text-[#4D5652] mt-4 leading-relaxed">
            In high-volume clinical settings, physicians face extreme time constraints while patients struggle
            to articulate their complex medical history in fragmented moments.
          </p>
        </div>

        {/* 4 Editorial Stat Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-7 rounded-3xl bg-white/70 border border-[#E8D8B8]/70 shadow-xs hover:border-[#B89A5A] transition-all">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#24302F] block mb-2">
              2–5 <span className="text-2xl font-normal text-[#B89A5A]">min</span>
            </span>
            <h3 className="text-sm font-bold text-[#24302F] mb-1">Consultation Pressure</h3>
            <p className="text-xs text-[#4D5652] leading-relaxed">
              Typical consultation window in high-density outpatient triage.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white/70 border border-[#E8D8B8]/70 shadow-xs hover:border-[#B89A5A] transition-all">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#24302F] block mb-2">
              Thousands
            </span>
            <h3 className="text-sm font-bold text-[#24302F] mb-1">High-Volume OPDs</h3>
            <p className="text-xs text-[#4D5652] leading-relaxed">
              Patients waiting in crowded hospital halls every single morning.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white/70 border border-[#E8D8B8]/70 shadow-xs hover:border-[#B89A5A] transition-all">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#24302F] block mb-2">
              Multiple
            </span>
            <h3 className="text-sm font-bold text-[#24302F] mb-1">Paper Prescriptions</h3>
            <p className="text-xs text-[#4D5652] leading-relaxed">
              Disorganized lab slips, physical prescriptions &amp; prior imaging slips.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-white/70 border border-[#E8D8B8]/70 shadow-xs hover:border-[#B89A5A] transition-all">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#B89A5A] block mb-2">
              One
            </span>
            <h3 className="text-sm font-bold text-[#24302F] mb-1">Fragmented Story</h3>
            <p className="text-xs text-[#4D5652] leading-relaxed">
              Critical medical context lost between the waiting room and the desk.
            </p>
          </div>
        </div>

        <div className="mt-4 text-right">
          <span className="text-[11px] text-[#73787A] italic">
            *Contextual figures documented in outpatient workflow studies and triage bottleneck observations.
          </span>
        </div>
      </section>

      {/* 5. "HOW MEDIKIOSK WORKS" SECTION */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 md:px-10 bg-[#F3EBDD]/40 border-y border-[#E8D8B8]/60">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B89A5A] block mb-2">
              The Intelligent Patient Journey
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#24302F]">
              How MediKiosk Works
            </h2>
            <p className="text-sm sm:text-base text-[#4D5652] mt-2">
              From waiting room arrival to the physician’s desk in five seamless, human-centric steps.
            </p>
          </div>

          {/* 5 Horizontal Stepped Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
              <button
                key={step.number}
                onClick={() => setActiveStepIndex(idx)}
                className={`text-left p-6 rounded-3xl transition-all duration-300 border cursor-pointer ${
                  activeStepIndex === idx
                    ? 'bg-[#24302F] text-[#FAF7F0] border-[#24302F] shadow-lg scale-102'
                    : 'bg-white/80 text-[#24302F] border-[#E8D8B8]/70 hover:border-[#B89A5A]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`font-display text-2xl font-bold ${
                      activeStepIndex === idx ? 'text-[#D8BE88]' : 'text-[#73787A]'
                    }`}
                  >
                    {step.number}
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                      activeStepIndex === idx
                        ? 'bg-[#FAF7F0]/15 text-[#D8BE88]'
                        : 'bg-[#F3EBDD] text-[#4D5652]'
                    }`}
                  >
                    Step {idx + 1}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{step.title}</h3>
                <p
                  className={`text-xs leading-relaxed ${
                    activeStepIndex === idx ? 'text-[#FAF7F0]/80' : 'text-[#4D5652]'
                  }`}
                >
                  {step.description}
                </p>
              </button>
            ))}
          </div>

          {/* Active Step Feature Showcase Card */}
          <div className="glass-card-warm rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto border border-[#E8D8B8]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E8D8B8]/60">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#B89A5A] block">
                  Active Stage: Step {HOW_IT_WORKS_STEPS[activeStepIndex].number}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#24302F]">
                  {HOW_IT_WORKS_STEPS[activeStepIndex].title}
                </h3>
              </div>
              <span className="bg-[#FAF7F0] text-[#24302F] border border-[#E8D8B8] text-xs font-semibold px-3.5 py-1.5 rounded-full">
                {HOW_IT_WORKS_STEPS[activeStepIndex].tag}
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#4D5652] py-6 leading-relaxed">
              {HOW_IT_WORKS_STEPS[activeStepIndex].detail}
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={onOpenGetStartedModal}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#24302F] hover:text-[#B89A5A] transition-colors cursor-pointer"
              >
                <span>Experience this in the live interactive workflow</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DOCUMENT INTELLIGENCE SECTION */}
      <section className="py-20 md:py-28 px-6 md:px-10 max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Description */}
          <div className="lg:col-span-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B89A5A] block mb-2">
              Paper Records to Structured History
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#24302F] leading-tight mb-4">
              Document Intelligence. <br />
              Digitized in seconds.
            </h2>
            <p className="text-base text-[#4D5652] leading-relaxed mb-6">
              Patients frequently bring stacks of handwritten prescriptions, past discharge papers, and lab reports.
              MediKiosk extracts medications, dosages, and diagnostic timelines without manual physician typing.
            </p>

            <div className="space-y-3.5 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F3EBDD] text-[#B89A5A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-xs text-[#24302F]">
                  <strong>Handwriting OCR:</strong> Captures doctor signatures, drug names &amp; frequency.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F3EBDD] text-[#B89A5A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-xs text-[#24302F]">
                  <strong>Lab Report Normalizer:</strong> Compares past CBC, lipid profiles, and HbA1c against standard clinical thresholds.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F3EBDD] text-[#B89A5A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-xs text-[#24302F]">
                  <strong>Privacy Redaction:</strong> Protects unrelated personal identifiers automatically.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setUserRole('patient');
                setCurrentView('patient-dashboard');
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#24302F] hover:text-[#B89A5A] transition-colors cursor-pointer"
            >
              <span>Test document capture in Patient Portal</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Right Visual: Paper -> Extraction -> Timeline Card */}
          <div className="lg:col-span-7">
            <div className="glass-card-warm rounded-3xl p-6 sm:p-8 border border-[#E8D8B8] shadow-md">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8D8B8]/60">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#B89A5A]">history_edu</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#24302F]">
                    Medical Timeline Output
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-[#4D5652] bg-[#F3EBDD] px-3 py-1 rounded-full">
                  Extracted from 3 Paper Files
                </span>
              </div>

              {/* Timeline Items */}
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8D8B8]">
                {/* Event 1 */}
                <div className="relative pl-8">
                  <span className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#B89A5A] border-2 border-[#FAF7F0]" />
                  <div className="bg-white/80 p-3.5 rounded-2xl border border-[#E8D8B8]/60">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#24302F]">Prescription • Dr. R. Verma</span>
                      <span className="text-[10px] text-[#73787A]">12 Aug 2026</span>
                    </div>
                    <p className="text-xs text-[#4D5652]">
                      Paracetamol 500mg (1-0-1 PRN) &bull; Pantoprazole 40mg OD &bull; Indication: Acute Viral Fever
                    </p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative pl-8">
                  <span className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#4D5652] border-2 border-[#FAF7F0]" />
                  <div className="bg-white/80 p-3.5 rounded-2xl border border-[#E8D8B8]/60">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#24302F]">Lab Report • Diagnostic CBC</span>
                      <span className="text-[10px] text-[#73787A]">18 Aug 2026</span>
                    </div>
                    <p className="text-xs text-[#4D5652]">
                      Hemoglobin: 13.8 g/dL (Normal) &bull; Platelets: 240k/µL &bull; WBC: 8,400 cells/µL
                    </p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative pl-8">
                  <span className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#24302F] border-2 border-[#FAF7F0]" />
                  <div className="bg-white/80 p-3.5 rounded-2xl border border-[#E8D8B8]/60">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#24302F]">MediKiosk Intake • Today&apos;s Visit</span>
                      <span className="text-[10px] text-[#B89A5A] font-semibold">22 Aug 2026 (Live)</span>
                    </div>
                    <p className="text-xs text-[#4D5652]">
                      Patient reports resolution of fever, follow-up on residual cephalalgia. Vitals within bounds.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VOICE-FIRST EXPERIENCE SECTION */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-[#FAF7F0] border-t border-[#E8D8B8]/60">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B89A5A] block mb-2">
              Conversational Intake
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#24302F]">
              Speak naturally. <br />
              MediKiosk structures the story.
            </h2>
            <p className="text-sm sm:text-base text-[#4D5652] mt-2">
              Patients don&apos;t think in clinical forms. They tell stories. We capture the natural dialect and convert it into structured physician domains.
            </p>
          </div>

          {/* Interactive Voice Extraction Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Raw Spoken Voice Side */}
            <div className="glass-card-warm rounded-3xl p-6 sm:p-8 border border-[#E8D8B8]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4D5652]">
                  Raw Patient Input
                </span>
                {/* Language Toggle Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-[#F3EBDD] rounded-full border border-[#E8D8B8]">
                  {LANGUAGE_SAMPLES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang);
                        if (isPlayingAudio) {
                          window.speechSynthesis.cancel();
                          setIsPlayingAudio(false);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        selectedLang.code === lang.code
                          ? 'bg-[#24302F] text-[#FAF7F0] shadow-xs'
                          : 'text-[#4D5652] hover:text-[#24302F]'
                      }`}
                    >
                      {lang.label} ({lang.native})
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/90 p-5 rounded-2xl border border-[#E8D8B8]/60 mb-6">
                <p className="font-display text-lg text-[#24302F] italic leading-relaxed">
                  &ldquo;{selectedLang.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePlayVoice(selectedLang.quote)}
                  className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isPlayingAudio ? 'volume_up' : 'play_arrow'}
                  </span>
                  <span>{isPlayingAudio ? 'Playing Speech...' : 'Listen to Sample'}</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-[#73787A]">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Speech-to-Text Indexed</span>
                </div>
              </div>
            </div>

            {/* Understood Structured Data Side */}
            <div className="glass-card-warm rounded-3xl p-6 sm:p-8 border border-[#E8D8B8]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#24302F]">
                  Understood &amp; Structured
                </span>
                <span className="text-[10px] font-bold bg-[#E8D8B8]/50 text-[#24302F] px-2.5 py-0.5 rounded-full">
                  SOAP Extracted
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white/80 rounded-xl border border-[#E8D8B8]/60">
                  <span className="text-[10px] uppercase font-bold text-[#73787A] block">Chief Complaint</span>
                  <span className="font-bold text-[#24302F] text-sm">{selectedLang.chiefComplaint}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/80 rounded-xl border border-[#E8D8B8]/60">
                    <span className="text-[10px] uppercase font-bold text-[#73787A] block">Duration</span>
                    <span className="font-semibold text-[#24302F]">{selectedLang.duration}</span>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-[#E8D8B8]/60">
                    <span className="text-[10px] uppercase font-bold text-[#73787A] block">Vitals Status</span>
                    <span className="font-semibold text-[#B89A5A]">Synchronized</span>
                  </div>
                </div>

                <div className="p-3 bg-white/80 rounded-xl border border-[#E8D8B8]/60">
                  <span className="text-[10px] uppercase font-bold text-[#73787A] block">Associated Symptoms</span>
                  <span className="text-[#4D5652]">{selectedLang.associated}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8D8B8]/50 text-[11px] text-[#73787A] italic">
                *Captures and structures patient narratives without providing autonomous diagnosis.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PHYSICIAN SECTION */}
      <section className="py-20 md:py-28 px-6 md:px-10 max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B89A5A] block mb-2">
              For the Physician
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#24302F] leading-tight mb-4">
              Less time searching. <br />
              More time caring.
            </h2>
            <p className="text-base text-[#4D5652] leading-relaxed mb-6">
              When the patient sits down, Dr. Sharma already has the synthesized timeline, previous prescriptions,
              and triage vitals presented cleanly in a standard SOAP draft format.
            </p>

            <div className="p-4 rounded-2xl bg-[#F3EBDD]/60 border border-[#E8D8B8] mb-6">
              <span className="text-xs font-bold text-[#24302F] block mb-1">
                Zero Cognitive Overhead
              </span>
              <p className="text-xs text-[#4D5652] leading-relaxed">
                The physician remains the ultimate authority: review the draft, modify clinical notes with one click,
                and digitally sign the prescription.
              </p>
            </div>

            <button
              onClick={() => {
                setUserRole('doctor');
                setCurrentView('doctor-dashboard');
              }}
              className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-6 py-3 rounded-full text-xs font-medium transition-all shadow-xs hover:shadow cursor-pointer"
            >
              <span>Explore Doctor Portal</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Right Side: Doctor Summary Glass Interface Mock */}
          <div className="lg:col-span-7">
            <div className="glass-card-warm rounded-3xl p-6 sm:p-8 border border-[#E8D8B8] shadow-lg">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#E8D8B8]/60 gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#73787A] block">
                    Patient Intake Card #MK-08
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#24302F]">
                    Eleanor Vance &bull; 34 Y / F
                  </h3>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F3EBDD] text-[#4D5652] border border-[#E8D8B8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B89A5A]" />
                  Draft &bull; Review Required
                </span>
              </div>

              {/* SOAP Domains */}
              <div className="space-y-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-white/80 border border-[#E8D8B8]/60">
                  <span className="font-bold text-[#B89A5A] uppercase text-[10px] block mb-1">
                    Subjective (Patient Narrative Summary)
                  </span>
                  <p className="text-[#24302F] leading-relaxed">
                    Patient reports 3-day history of acute bilateral cephalalgia and fever up to 102.1°F.
                    Associated with mild morning stiffness. No photophobia or signs of meningism.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/80 border border-[#E8D8B8]/60">
                    <span className="font-bold text-[#73787A] uppercase text-[10px] block mb-0.5">
                      Current Medications
                    </span>
                    <span className="text-[#24302F]">Paracetamol 500mg PRN, Amlodipine 5mg</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 border border-[#E8D8B8]/60">
                    <span className="font-bold text-[#73787A] uppercase text-[10px] block mb-0.5">
                      Documented Allergies
                    </span>
                    <span className="text-red-700 font-medium">Penicillin (Mild Urticaria)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/80 border border-[#E8D8B8]/60">
                  <span className="font-bold text-[#73787A] uppercase text-[10px] block mb-0.5">
                    Biometric Vitals Synchronized
                  </span>
                  <span className="text-[#24302F]">
                    Temp: 102.1°F &bull; BP: 120/78 mmHg &bull; Pulse: 76 bpm &bull; SpO2: 99%
                  </span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-6 pt-4 border-t border-[#E8D8B8]/60 flex items-center justify-between">
                <span className="text-[11px] text-[#73787A]">Verified by MediKiosk Intake Engine</span>
                <button
                  onClick={() => {
                    setUserRole('doctor');
                    setCurrentView('doctor-dashboard');
                  }}
                  className="bg-[#24302F] hover:bg-[#1B2423] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Open in EMR &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PRIVACY & TRUST SECTION */}
      <section className="py-20 px-6 md:px-10 bg-[#F3EBDD]/40 border-t border-[#E8D8B8]/60">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B89A5A] block mb-2">
              Trust &amp; Governance
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#24302F]">
              Healthcare Requires Trust
            </h2>
            <p className="text-sm sm:text-base text-[#4D5652] mt-2">
              Engineered with strict clinical ethics, patient consent boundaries, and zero autonomous prescribing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white/80 border border-[#E8D8B8]/70">
              <span className="material-symbols-outlined text-2xl text-[#B89A5A] mb-3">lock</span>
              <h3 className="text-base font-bold text-[#24302F] mb-1.5">Privacy-First</h3>
              <p className="text-xs text-[#4D5652] leading-relaxed">
                Ephemeral session processing and end-to-end data isolation protect confidential patient disclosures.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/80 border border-[#E8D8B8]/70">
              <span className="material-symbols-outlined text-2xl text-[#B89A5A] mb-3">check_circle</span>
              <h3 className="text-base font-bold text-[#24302F] mb-1.5">Explicit Consent</h3>
              <p className="text-xs text-[#4D5652] leading-relaxed">
                Patients review and confirm their recorded audio and digitized files before physician submission.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/80 border border-[#E8D8B8]/70">
              <span className="material-symbols-outlined text-2xl text-[#B89A5A] mb-3">translate</span>
              <h3 className="text-base font-bold text-[#24302F] mb-1.5">Linguistic Equity</h3>
              <p className="text-xs text-[#4D5652] leading-relaxed">
                Native voice recognition bridges the literacy divide in overburdened public healthcare institutions.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/80 border border-[#E8D8B8]/70">
              <span className="material-symbols-outlined text-2xl text-[#B89A5A] mb-3">verified</span>
              <h3 className="text-base font-bold text-[#24302F] mb-1.5">Physician-Reviewed</h3>
              <p className="text-xs text-[#4D5652] leading-relaxed">
                AI outputs serve strictly as structured drafts. All diagnoses and prescriptions remain with the doctor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="py-24 px-6 md:px-10 max-w-[1280px] mx-auto text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#F3EBDD] to-[#FAF7F0] border border-[#E8D8B8] shadow-sm max-w-4xl mx-auto relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B89A5A] block mb-3">
              Modern Clinical Intake
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#24302F] mb-4 leading-tight">
              Give every patient <br />
              the time to tell their story.
            </h2>
            <p className="text-base text-[#4D5652] max-w-xl mx-auto mb-8 leading-relaxed">
              MediKiosk prepares the story before the consultation begins. Experience the workflow across patient, physician, and kiosk environments.
            </p>
            <button
              onClick={onOpenGetStartedModal}
              className="inline-flex items-center gap-2.5 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-8 py-4 rounded-full font-medium text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Get Started</span>
              <span className="material-symbols-outlined text-[18px] text-[#D8BE88]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
