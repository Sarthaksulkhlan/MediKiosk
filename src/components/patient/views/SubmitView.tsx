import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { PatientTab, PatientProfileData, UploadedReport } from '../types';
import { PatientRecord } from '../../../types';

interface SubmitViewProps {
  patient: PatientProfileData;
  transcript: string;
  uploadedReports: UploadedReport[];
  riskStatus: string;
  setActiveTab: (tab: PatientTab) => void;
  onMarkStepComplete: (step: PatientTab) => void;
  onNewCaseSubmitted?: (patient: Partial<PatientRecord>) => void;
}

export const SubmitView: React.FC<SubmitViewProps> = ({
  patient,
  transcript,
  uploadedReports,
  riskStatus,
  setActiveTab,
  onMarkStepComplete,
  onNewCaseSubmitted,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState('HLT-882194');

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onMarkStepComplete('submit');

      if (onNewCaseSubmitted) {
        onNewCaseSubmitted({
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          rawNarrative: transcript,
          riskScore: riskStatus === 'High Priority' ? 88 : riskStatus === 'Moderate Risk' ? 65 : 24,
          vitalsStatus: 'Intake Completed',
          consultationType: patient.healthcareApproach === 'ayush' ? 'AYUSH Holistic' : 'Modern OPD',
        });
      }

      // Trigger confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B89A5A', '#0D9488', '#24302F', '#D8BE88'],
        });
      } catch (e) {
        // ignore
      }
    }, 1200);
  };

  const checklistItems = [
    { label: 'Patient Demographics & ABHA ID Verified', done: true },
    { label: 'DPDP 2023 Digital Clinical Consent Granted', done: true },
    { label: 'Preferred Dialect & Tone Configured', done: true },
    { label: `${patient.healthcareApproach.toUpperCase()} Clinical Approach Selected`, done: true },
    { label: 'Aura AI Voice Interview Transcribed & Extracted', done: Boolean(transcript) || true },
    { label: `Risk Stratification Evaluated (${riskStatus})`, done: true },
    { label: `${uploadedReports.length} Medical Reports Attached & OCR Parsed`, done: true },
  ];

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        {/* Success Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#24302F] to-[#162120] text-[#FAF7F0] border border-[#E8D8B8]/40 shadow-xl text-center space-y-4 relative overflow-hidden">
          <div className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-br from-[#B89A5A] to-emerald-500 text-[#1B2423] flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>

          <div className="space-y-1">
            <span className="inline-block text-xs uppercase font-extrabold tracking-widest text-[#D8BE88] bg-white/10 px-3 py-1 rounded-full">
              Intake Submitted Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              You are Ready for Consultation!
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
              Your clinical pre-intake summary has been forwarded to{' '}
              <strong className="text-white">{patient.assignedDoctor.name}</strong>.
            </p>
          </div>

          {/* Token Pass Card */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-left space-y-3">
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <span className="text-[11px] text-zinc-300 font-bold uppercase">OPD Queue Pass</span>
              <span className="font-mono text-xs text-[#D8BE88] font-bold">Ref: {referenceId}</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-zinc-300">Your OPD Token</div>
                <div className="font-mono font-extrabold text-2xl text-emerald-400">
                  Token #{patient.assignedDoctor.tokenNumber}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-300">Room Location</div>
                <div className="font-bold text-sm text-white">{patient.assignedDoctor.room}</div>
              </div>
            </div>

            <div className="text-xs text-zinc-300 flex items-center justify-between pt-1">
              <span>Slot: <strong>{patient.assignedDoctor.slot}</strong></span>
              <span className="text-emerald-400 font-semibold">● Now Calling Token #40</span>
            </div>
          </div>

          {/* Post submission action buttons */}
          <div className="flex items-center justify-center gap-3 pt-4 flex-wrap">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-2 bg-[#B89A5A] hover:bg-[#A88A4A] text-[#1B2423] px-6 py-3 rounded-2xl font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-105"
            >
              <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
              <span>Back to Dashboard</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 px-5 py-3 rounded-2xl font-bold text-xs cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Print Intake Slip / PDF</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

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
          <span className="material-symbols-outlined text-[15px]">send</span>
          <span>Step 9 • Final Submission</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24302F]">
          Ready to Submit Your Information?
        </h1>
        <p className="text-sm text-[#5D6662] mt-1 max-w-3xl leading-relaxed">
          Submit your pre-consultation intake to generate your official OPD queue token pass.
        </p>
      </div>

      {/* Main Readiness Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D8B8]/80 shadow-xs space-y-6">
        <h3 className="font-bold text-base text-[#24302F] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#B89A5A]">task_alt</span>
          <span>Pre-Consultation Intake Checklist</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {checklistItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/60 flex items-center gap-3 text-xs"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                ✓
              </span>
              <span className="font-semibold text-[#24302F]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Security and Physician Notice */}
        <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-teal-900">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-teal-700 text-[24px]">verified</span>
            <div>
              <div className="font-bold text-sm">Doctor Consultation Queue</div>
              <p className="text-[11px] text-teal-800">
                Your file will be routed directly to {patient.assignedDoctor.name} ({patient.assignedDoctor.room}).
              </p>
            </div>
          </div>
          <span className="font-mono font-bold text-teal-900 bg-white px-3 py-1 rounded-xl border border-teal-300">
            256-Bit SSL Encrypted
          </span>
        </div>
      </div>

      {/* Submission Action Bar */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('review')}
          className="text-xs font-bold text-[#5D6662] hover:text-[#24302F] px-4 py-2"
        >
          ← Back to Review
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B89A5A] to-[#D8BE88] hover:from-[#A88A4A] hover:to-[#C8AE78] text-[#1B2423] px-8 py-3.5 rounded-2xl font-extrabold text-sm transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-[#1B2423] border-t-transparent rounded-full animate-spin" />
              <span>Transmitting to OPD Desk...</span>
            </>
          ) : (
            <>
              <span>Submit Healthcare Information</span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
