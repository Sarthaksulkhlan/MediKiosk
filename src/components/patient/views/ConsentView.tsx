import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ConsentSettings, PatientTab } from '../types';

interface ConsentViewProps {
  consentSettings: ConsentSettings;
  onUpdateConsent: (updated: ConsentSettings) => void;
  setActiveTab: (tab: PatientTab) => void;
  onMarkStepComplete: (step: PatientTab) => void;
}

export const ConsentView: React.FC<ConsentViewProps> = ({
  consentSettings,
  onUpdateConsent,
  setActiveTab,
  onMarkStepComplete,
}) => {
  const [settings, setSettings] = useState<ConsentSettings>(consentSettings);
  const [understoodAcknowledged, setUnderstoodAcknowledged] = useState(true);

  const toggleOption = (key: keyof Omit<ConsentSettings, 'signedAt' | 'signatureHash'>) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleGiveConsent = () => {
    const updated: ConsentSettings = {
      ...settings,
      signedAt: '22 Aug 2026, 10:14 AM',
      signatureHash: 'SHA256:e8f901c0b32948',
    };
    onUpdateConsent(updated);
    onMarkStepComplete('consent');
    setActiveTab('ai-interview');
  };

  const consentCards = [
    {
      id: 'personalInfo' as const,
      title: 'Personal Information',
      icon: 'person',
      subtitle: 'Name, age, gender, and contact details',
      desc: 'Used to verify your identity against your official Ayushman Bharat (ABHA) record and route clinical care.',
      required: true,
    },
    {
      id: 'medicalInfo' as const,
      title: 'Medical Information',
      icon: 'medical_information',
      subtitle: 'Reported symptoms, chronic conditions, and active medications',
      desc: 'Helps formulate your clinical timeline and pre-consultation draft for the attending doctor.',
      required: true,
    },
    {
      id: 'reportsData' as const,
      title: 'Medical Reports & Scans',
      icon: 'description',
      subtitle: 'Uploaded laboratory reports, previous OPD prescriptions, and scans',
      desc: 'Enables our secure optical character extraction to assist the physician during review.',
      required: false,
    },
    {
      id: 'aiProcessing' as const,
      title: 'AI Clinical Processing',
      icon: 'smart_toy',
      subtitle: 'Aura AI speech transcription and structured entity extraction',
      desc: 'Allows our ambient medical AI model to convert natural speech into structured SOAP pre-consult notes.',
      required: false,
    },
  ];

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
          <span className="material-symbols-outlined text-[15px]">verified_user</span>
          <span>Step 1 • Patient Consent</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24302F]">Your Consent Matters</h1>
        <p className="text-sm text-[#5D6662] mt-1 max-w-3xl leading-relaxed">
          We respect your privacy and give you full transparency. Choose what data you wish to share for your consultation. You can modify these settings at any time.
        </p>
      </div>

      {/* 4 Consent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {consentCards.map((card) => {
          const isAllowed = settings[card.id];

          return (
            <div
              key={card.id}
              onClick={() => toggleOption(card.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isAllowed
                  ? 'bg-white border-[#E8D8B8] shadow-xs hover:border-[#B89A5A]'
                  : 'bg-[#FAF7F0]/60 border-zinc-200 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                        isAllowed
                          ? 'bg-[#24302F] text-[#FAF7F0]'
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#24302F]">{card.title}</h3>
                      <p className="text-xs text-[#7B8580]">{card.subtitle}</p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div
                    className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                      isAllowed ? 'bg-emerald-600 justify-end' : 'bg-zinc-300 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                  </div>
                </div>

                <p className="text-xs text-[#5D6662] mt-4 leading-relaxed">{card.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8D8B8]/50 flex items-center justify-between text-xs">
                <span className="text-[#8A9590] font-medium">
                  {card.required ? 'Essential for Consultation' : 'Optional Service'}
                </span>
                <span
                  className={`font-bold ${
                    isAllowed ? 'text-emerald-700' : 'text-zinc-500'
                  }`}
                >
                  {isAllowed ? '✓ Allowed' : 'Disabled'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Understand & Acknowledge Checkbox */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-3">
        <label className="flex items-start gap-3.5 cursor-pointer">
          <input
            type="checkbox"
            checked={understoodAcknowledged}
            onChange={(e) => setUnderstoodAcknowledged(e.target.checked)}
            className="mt-1 w-5 h-5 text-[#24302F] rounded border-[#E8D8B8] focus:ring-[#B89A5A] cursor-pointer"
          />
          <div>
            <h4 className="text-sm font-bold text-[#24302F]">
              I understand how my information will be used.
            </h4>
            <p className="text-xs text-[#6B7570] mt-0.5">
              By continuing, you agree that your authorized health details will be shared securely with your assigned hospital team and Dr. Rajesh Sharma.
            </p>
          </div>
        </label>

        {/* Digital Signature Badge */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700 text-[20px]">
              fingerprint
            </span>
            <span>
              <strong>Digitally Authenticated:</strong> Aadhaar OTP e-Sign verified
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
            DPDP ACT 2023 COMPLIANT
          </span>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8D8B8]/80 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-xs font-bold text-[#5D6662] hover:text-[#24302F] px-4 py-2 cursor-pointer"
        >
          ← Back
        </button>

        <button
          onClick={handleGiveConsent}
          disabled={!understoodAcknowledged}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md ${
            understoodAcknowledged
              ? 'bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] cursor-pointer hover:-translate-y-0.5'
              : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <span>Give Consent &amp; Continue</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </motion.div>
  );
};
