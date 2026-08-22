import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PatientTab, PatientProfileData, UploadedReport, ConsentSettings } from '../types';
import { ClinicalNLPParser } from '../../../utils/clinicalNLP';

interface ReviewViewProps {
  patient: PatientProfileData;
  transcript: string;
  uploadedReports: UploadedReport[];
  consentSettings: ConsentSettings;
  riskStatus: string;
  setActiveTab: (tab: PatientTab) => void;
  onMarkStepComplete: (step: PatientTab) => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  patient,
  transcript,
  uploadedReports,
  consentSettings,
  riskStatus,
  setActiveTab,
  onMarkStepComplete,
}) => {
  const [confirmedCorrect, setConfirmedCorrect] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>('symptoms');

  const extracted = ClinicalNLPParser.extractEntities(transcript);

  const toggleSection = (sec: string) => {
    setOpenSection(openSection === sec ? null : sec);
  };

  const handleContinue = () => {
    onMarkStepComplete('review');
    setActiveTab('submit');
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
          <span className="material-symbols-outlined text-[15px]">search_check</span>
          <span>Step 8 • Clinical Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24302F]">
          Review Your Information
        </h1>
        <p className="text-sm text-[#5D6662] mt-1 max-w-3xl leading-relaxed">
          Please verify your details and recorded symptoms before final submission to Dr. Sharma's clinical OPD desk.
        </p>
      </div>

      {/* Accordion Review Sections */}
      <div className="space-y-3">
        {/* Section 1: Personal Demographics & ABHA */}
        <div className="bg-white rounded-3xl border border-[#E8D8B8]/80 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleSection('personal')}
            className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F0]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8] text-[#8C6B28] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">person</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#24302F]">1. Personal Information &amp; ABHA</h3>
                <p className="text-xs text-[#6B7570]">
                  {patient.name} • {patient.age} Yrs • {patient.gender} • ABHA: {patient.abhaId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('registration');
                }}
                className="text-xs font-bold text-[#8C6B28] hover:underline"
              >
                Edit
              </button>
              <span className="material-symbols-outlined text-[#7B8580]">
                {openSection === 'personal' ? 'expand_less' : 'expand_more'}
              </span>
            </div>
          </div>

          {openSection === 'personal' && (
            <div className="px-5 pb-5 pt-1 border-t border-[#E8D8B8]/50 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#FAF7F0]">
                <div className="text-[10px] font-bold text-[#6B7570] uppercase">Full Name</div>
                <div className="font-bold text-[#24302F] mt-0.5">{patient.name}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F0]">
                <div className="text-[10px] font-bold text-[#6B7570] uppercase">Date of Birth &amp; Gender</div>
                <div className="font-bold text-[#24302F] mt-0.5">{patient.dob} ({patient.gender})</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F0]">
                <div className="text-[10px] font-bold text-[#6B7570] uppercase">Mobile Number</div>
                <div className="font-mono font-bold text-[#24302F] mt-0.5">{patient.phone}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F0] sm:col-span-2">
                <div className="text-[10px] font-bold text-[#6B7570] uppercase">Residential Address</div>
                <div className="font-medium text-[#24302F] mt-0.5">{patient.address}</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F0]">
                <div className="text-[10px] font-bold text-[#6B7570] uppercase">ABHA Address</div>
                <div className="font-mono font-bold text-[#8C6B28] mt-0.5">{patient.abhaAddress}</div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Symptoms & AI Interview Transcript */}
        <div className="bg-white rounded-3xl border border-[#E8D8B8]/80 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleSection('symptoms')}
            className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F0]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#24302F]">2. Symptoms Identified via Aura AI</h3>
                <p className="text-xs text-[#6B7570]">
                  Chief Complaint: <strong>{extracted.chiefComplaint || 'Pending'}</strong> • Duration: {extracted.duration || 'Not stated'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('ai-interview');
                }}
                className="text-xs font-bold text-[#8C6B28] hover:underline"
              >
                Edit
              </button>
              <span className="material-symbols-outlined text-[#7B8580]">
                {openSection === 'symptoms' ? 'expand_less' : 'expand_more'}
              </span>
            </div>
          </div>

          {openSection === 'symptoms' && (
            <div className="px-5 pb-5 pt-1 border-t border-[#E8D8B8]/50 space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/60 space-y-1">
                <div className="text-[10px] font-bold uppercase text-[#6B7570]">Voice Transcript Stream</div>
                <p className="text-[#24302F] italic">
                  &ldquo;{transcript || 'No voice statements recorded.'}&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-white border border-[#E8D8B8]">
                  <div className="text-[10px] font-bold text-[#6B7570]">Identified Concern</div>
                  <div className="font-bold text-[#24302F] mt-0.5">{extracted.chiefComplaint}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E8D8B8]">
                  <div className="text-[10px] font-bold text-[#6B7570]">Onset Duration</div>
                  <div className="font-bold text-[#24302F] mt-0.5">{extracted.duration}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-[#E8D8B8]">
                  <div className="text-[10px] font-bold text-[#6B7570]">Associated Symptoms</div>
                  <div className="font-bold text-[#24302F] mt-0.5">{extracted.associatedSymptom}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Healthcare Approach */}
        <div className="bg-white rounded-3xl border border-[#E8D8B8]/80 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleSection('approach')}
            className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F0]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">local_hospital</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#24302F]">3. Healthcare Approach &amp; Language</h3>
                <p className="text-xs text-[#6B7570]">
                  Approach: <strong className="capitalize">{patient.healthcareApproach}</strong> • Language: {patient.preferredLanguage}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('healthcare-system');
                }}
                className="text-xs font-bold text-[#8C6B28] hover:underline"
              >
                Edit
              </button>
              <span className="material-symbols-outlined text-[#7B8580]">
                {openSection === 'approach' ? 'expand_less' : 'expand_more'}
              </span>
            </div>
          </div>

          {openSection === 'approach' && (
            <div className="px-5 pb-5 pt-1 border-t border-[#E8D8B8]/50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#FAF7F0]">
                <div className="text-[10px] font-bold text-[#6B7570]">Selected Pathway</div>
                <div className="font-bold text-[#24302F] mt-0.5 capitalize">{patient.healthcareApproach} Medicine</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF7F0]">
                <div className="text-[10px] font-bold text-[#6B7570]">Language Preference</div>
                <div className="font-bold text-[#24302F] mt-0.5">{patient.preferredLanguage}</div>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Medical Reports & History */}
        <div className="bg-white rounded-3xl border border-[#E8D8B8]/80 shadow-xs overflow-hidden">
          <div
            onClick={() => toggleSection('reports')}
            className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F0]/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">description</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#24302F]">4. Medical Reports &amp; History</h3>
                <p className="text-xs text-[#6B7570]">
                  {uploadedReports.length} Document(s) attached • {patient.allergies.length} Allergies flagged
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('reports');
                }}
                className="text-xs font-bold text-[#8C6B28] hover:underline"
              >
                Edit
              </button>
              <span className="material-symbols-outlined text-[#7B8580]">
                {openSection === 'reports' ? 'expand_less' : 'expand_more'}
              </span>
            </div>
          </div>

          {openSection === 'reports' && (
            <div className="px-5 pb-5 pt-1 border-t border-[#E8D8B8]/50 space-y-3 text-xs">
              <div className="space-y-1.5">
                <div className="font-bold text-[#24302F]">Attached Reports:</div>
                {uploadedReports.map((r) => (
                  <div key={r.id} className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8D8B8] flex items-center justify-between">
                    <span className="font-medium text-[#24302F]">{r.fileName}</span>
                    <span className="text-[10px] text-emerald-800 font-bold">{r.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Consent Status */}
        <div className="bg-white rounded-3xl border border-[#E8D8B8]/80 shadow-xs p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#24302F]">5. Clinical Consent &amp; DPDP 2023</h3>
              <p className="text-xs text-emerald-800 font-semibold">
                ✓ Consent granted for Personal, Medical &amp; AI Processing
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('consent')}
            className="text-xs font-bold text-[#8C6B28] hover:underline"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmedCorrect}
            onChange={(e) => setConfirmedCorrect(e.target.checked)}
            className="mt-0.5 w-5 h-5 text-[#24302F] rounded border-[#E8D8B8] focus:ring-[#B89A5A] cursor-pointer"
          />
          <div>
            <h4 className="text-xs font-bold text-[#24302F]">
              Everything looks correct and accurate
            </h4>
            <p className="text-xs text-[#6B7570] mt-0.5">
              I have reviewed my demographic details, voice symptoms, and attached reports, and confirm they are ready for physician consultation.
            </p>
          </div>
        </label>
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8D8B8]/80 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('reports')}
          className="text-xs font-bold text-[#5D6662] hover:text-[#24302F] px-4 py-2"
        >
          ← Back
        </button>

        <button
          onClick={handleContinue}
          disabled={!confirmedCorrect}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md ${
            confirmedCorrect
              ? 'bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] cursor-pointer hover:-translate-y-0.5'
              : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <span>Continue to Submission</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </motion.div>
  );
};
