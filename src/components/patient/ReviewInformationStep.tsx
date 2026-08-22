import React from 'react';
import { PatientWorkflowStep } from '../../types';

interface ReviewInformationStepProps {
  patientName: string;
  patientId: string;
  abhaNumber: string;
  consentTimestamp?: string;
  selectedLanguage: 'EN' | 'HI';
  carePreference: 'Modern Medicine' | 'AYUSH / Ayurveda';
  transcript: string;
  extractedEntities: {
    chiefComplaint: string;
    duration: string;
    associatedSymptom: string;
  };
  auraRecap?: string;
  redFlags: string[];
  uploadedRecord: {
    fileName: string;
    visitDate: string;
    doctor: string;
    medicines: { name: string; dosage: string; frequency: string }[];
  };
  onJumpToStep: (step: PatientWorkflowStep) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ReviewInformationStep: React.FC<ReviewInformationStepProps> = ({
  patientName,
  patientId,
  abhaNumber,
  consentTimestamp,
  selectedLanguage,
  carePreference,
  transcript,
  extractedEntities,
  auraRecap,
  redFlags,
  uploadedRecord,
  onJumpToStep,
  onNext,
  onPrev,
}) => {
  return (
    <div className="bg-[#FAF7F0] border border-[#E8D8B8] rounded-3xl p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8D8B8]/70">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] bg-white px-2.5 py-1 rounded-full border border-[#E8D8B8] inline-block mb-2">
            STEP 10 OF 11 &bull; PRE-SUBMISSION VERIFICATION
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#24302F]">
            Review Consultation Information
          </h2>
          <p className="text-xs sm:text-sm text-[#4D5652] mt-1">
            Please verify your patient-provided statements and AI-extracted summary before sending to Dr. Sharma.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-[#24302F] text-[#FAF7F0] px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px] text-[#D8BE88]">
              checklist_rtl
            </span>
            <span>Ready for Verification</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-7">
        {/* PANEL 1: PATIENT-PROVIDED INFORMATION */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8D8B8] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/70 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#24302F] text-[#FAF7F0] flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#24302F]">
                    Patient-Provided Information
                  </h3>
                  <p className="text-[11px] text-[#73787A]">Direct inputs by patient</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#FAF7F0] text-[#4D5652] px-2 py-0.5 rounded border border-[#E8D8B8]">
                Primary Source
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Identity & ABHA */}
              <div className="flex items-center justify-between pb-2 border-b border-[#FAF7F0]">
                <div>
                  <span className="text-[10px] font-bold text-[#73787A] block">PATIENT / ABHA</span>
                  <span className="font-semibold text-[#24302F]">{patientName}</span>{' '}
                  <span className="text-[#73787A]">({patientId})</span>
                  <div className="text-[11px] font-mono text-[#B89A5A]">{abhaNumber}</div>
                </div>
                <button
                  onClick={() => onJumpToStep('registration')}
                  className="text-xs text-[#B89A5A] hover:text-[#24302F] font-semibold cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Consent */}
              <div className="flex items-center justify-between pb-2 border-b border-[#FAF7F0]">
                <div>
                  <span className="text-[10px] font-bold text-[#73787A] block">CONSENT STATUS</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Granted &bull; {consentTimestamp || '22 Aug 2026, 09:15 AM'}
                  </span>
                </div>
                <button
                  onClick={() => onJumpToStep('consent')}
                  className="text-xs text-[#B89A5A] hover:text-[#24302F] font-semibold cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Language & Care Preference */}
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#FAF7F0]">
                <div>
                  <span className="text-[10px] font-bold text-[#73787A] block">LANGUAGE</span>
                  <span className="font-bold text-[#24302F]">
                    {selectedLanguage === 'EN' ? 'English (EN)' : 'Hindi (हिन्दी)'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#73787A] block">CARE PREFERENCE</span>
                  <span className="font-bold text-[#B89A5A]">{carePreference}</span>
                </div>
              </div>

              {/* Stated Narrative */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#73787A] block">
                    PATIENT STATED VOICE TRANSCRIPT
                  </span>
                  <button
                    onClick={() => onJumpToStep('voice-interview')}
                    className="text-xs text-[#B89A5A] hover:text-[#24302F] font-semibold cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8D8B8] italic text-xs text-[#24302F] leading-relaxed">
                  &ldquo;
                  {transcript ||
                    'Patient stated symptoms will appear here upon speaking or typing.'}
                  &rdquo;
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#73787A] block">
                    UPLOADED MEDICAL RECORD
                  </span>
                  <button
                    onClick={() => onJumpToStep('scan-reports')}
                    className="text-xs text-[#B89A5A] hover:text-[#24302F] font-semibold cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
                <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#B89A5A]">
                      description
                    </span>
                    <span className="font-medium text-[#24302F]">{uploadedRecord.fileName}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-[#E8D8B8]">
                    OCR Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2: AI-EXTRACTED & STRUCTURED INFORMATION */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8D8B8] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/70 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#B89A5A] text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#24302F]">
                    AI-Extracted Information
                  </h3>
                  <p className="text-[11px] text-[#73787A]">Automated clinical NLP extraction</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                Aura AI Processed
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Dynamic Entities Chips */}
              <div>
                <span className="text-[10px] font-bold text-[#73787A] block mb-1.5">
                  EXTRACTED CLINICAL ENTITIES
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8]">
                    <span className="text-[9px] font-bold text-[#73787A] uppercase block">
                      Chief Complaint
                    </span>
                    <strong className="text-xs text-[#24302F] block truncate">
                      {extractedEntities.chiefComplaint}
                    </strong>
                  </div>
                  <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8]">
                    <span className="text-[9px] font-bold text-[#73787A] uppercase block">
                      Duration
                    </span>
                    <strong className="text-xs text-[#24302F] block truncate">
                      {extractedEntities.duration}
                    </strong>
                  </div>
                  <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8]">
                    <span className="text-[9px] font-bold text-[#73787A] uppercase block">
                      Associated
                    </span>
                    <strong className="text-xs text-[#24302F] block truncate">
                      {extractedEntities.associatedSymptom}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Aura AI Structured Summary */}
              <div>
                <span className="text-[10px] font-bold text-[#73787A] block mb-1">
                  AURA AI STRUCTURED PRE-CONSULTATION RECAP
                </span>
                <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8D8B8] font-mono text-[11px] text-[#24302F] leading-relaxed whitespace-pre-line max-h-[140px] overflow-y-auto">
                  {auraRecap ||
                    `• Chief Concern: ${extractedEntities.chiefComplaint}
• Duration: ${extractedEntities.duration}
• Associated Symptoms: ${extractedEntities.associatedSymptom}
• Intake Status: Structured for Dr. Sharma review`}
                </div>
              </div>

              {/* Safety / Red Flag Status */}
              <div>
                <span className="text-[10px] font-bold text-[#73787A] block mb-1">
                  AI SAFETY SCREENING STATUS
                </span>
                {redFlags.length > 0 ? (
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-300 text-xs text-amber-950 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-amber-700">
                      warning
                    </span>
                    <span>
                      Flagged: <strong>{redFlags.join(', ')}</strong> &bull; Priority OPD Review
                    </span>
                  </div>
                ) : (
                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">
                      check_circle
                    </span>
                    <span>Standard Clinical Triage &bull; No acute emergency flags</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E8D8B8]/70">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF7F0] text-[#4D5652] border border-[#E8D8B8] px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Previous: Scan Reports</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-7 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
        >
          <span>Proceed to Final Submission</span>
          <span className="material-symbols-outlined text-[18px] text-[#D8BE88]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
