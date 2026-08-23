import React, { useState } from 'react';

interface PatientConsentStepProps {
  consentGiven: boolean;
  consentTimestamp?: string;
  onUpdateConsent: (given: boolean, timestamp: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PatientConsentStep: React.FC<PatientConsentStepProps> = ({
  consentGiven,
  consentTimestamp,
  onUpdateConsent,
  onNext,
  onPrev,
}) => {
  const [agreed, setAgreed] = useState(consentGiven !== false);

  const handleToggle = () => {
    const nextState = !agreed;
    setAgreed(nextState);
    if (nextState) {
      const now = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      onUpdateConsent(true, now);
    } else {
      onUpdateConsent(false, '');
    }
  };

  return (
    <div className="bg-[#FAF7F0] border border-[#E8D8B8] rounded-3xl p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8D8B8]/70">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] bg-white px-2.5 py-1 rounded-full border border-[#E8D8B8] inline-block mb-2">
            STEP 3 OF 11 &bull; INFORMED CLINICAL CONSENT
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#24302F]">
            Patient Intake Consent &amp; Data Privacy
          </h2>
          <p className="text-xs sm:text-sm text-[#4D5652] mt-1">
            Understanding how your spoken and typed information assists Dr. Sharma during consultation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px] text-blue-600">
              privacy_tip
            </span>
            <span>ABDM Privacy Compliant</span>
          </span>
        </div>
      </div>

      {/* Consent Details Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#E8D8B8] shadow-2xs mb-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF7F0] text-[#B89A5A] border border-[#E8D8B8] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#24302F]">
              Purpose of Pre-Consultation Intake
            </h4>
            <p className="text-xs text-[#4D5652] leading-relaxed mt-1">
              Health360 assists you in articulating your symptoms, organizing prior medical records, and drafting a preliminary structured timeline for your attending physician.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-[#FAF7F0] p-3.5 rounded-xl border border-[#E8D8B8]/80 text-xs">
            <div className="flex items-center gap-1.5 text-[#24302F] font-bold mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">record_voice_over</span>
              <span>Voice &amp; Text Intake</span>
            </div>
            <p className="text-[11px] text-[#73787A] leading-snug">
              Speech transcripts are processed strictly in memory to extract clinical entities without autonomous diagnosis.
            </p>
          </div>

          <div className="bg-[#FAF7F0] p-3.5 rounded-xl border border-[#E8D8B8]/80 text-xs">
            <div className="flex items-center gap-1.5 text-[#24302F] font-bold mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">medical_services</span>
              <span>Physician Review</span>
            </div>
            <p className="text-[11px] text-[#73787A] leading-snug">
              All generated notes remain as draft records and are only finalized upon physician review and signature.
            </p>
          </div>

          <div className="bg-[#FAF7F0] p-3.5 rounded-xl border border-[#E8D8B8]/80 text-xs">
            <div className="flex items-center gap-1.5 text-[#24302F] font-bold mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">shield</span>
              <span>Confidentiality</span>
            </div>
            <p className="text-[11px] text-[#73787A] leading-snug">
              Protected health information (PHI) is protected under clinical confidentiality standards.
            </p>
          </div>
        </div>

        {/* Checkbox Consent Agreement */}
        <div className="pt-4 border-t border-[#FAF7F0]">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={handleToggle}
              className="mt-1 w-4 h-4 rounded text-[#24302F] focus:ring-[#B89A5A] border-[#D8BE88] cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-bold text-[#24302F] block">
                I give consent for pre-consultation intake processing and clinical summarization for Dr. Sharma.
              </span>
              <span className="text-[#73787A] text-[11px]">
                I understand that Aura AI is an intake assistant and does not provide an autonomous medical diagnosis or prescription.
              </span>
            </div>
          </label>
          {agreed && (
            <div className="mt-3 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              <span>
                Consent recorded: <strong>{consentTimestamp || '22 Aug 2026, 09:15 AM'}</strong> &bull; IP/Station MK-Station-04
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E8D8B8]/70">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF7F0] text-[#4D5652] border border-[#E8D8B8] px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Previous: ABHA Registration</span>
        </button>

        <button
          onClick={onNext}
          disabled={!agreed}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm ${
            agreed
              ? 'bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] cursor-pointer'
              : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
          }`}
        >
          <span>Continue to Language Selection</span>
          <span className="material-symbols-outlined text-[16px] text-[#D8BE88]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
