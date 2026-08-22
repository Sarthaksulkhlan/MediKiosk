import React from 'react';

interface CarePreferenceStepProps {
  carePreference: 'Modern Medicine' | 'AYUSH / Ayurveda';
  onSelectPreference: (pref: 'Modern Medicine' | 'AYUSH / Ayurveda') => void;
  onNext: () => void;
  onPrev: () => void;
}

export const CarePreferenceStep: React.FC<CarePreferenceStepProps> = ({
  carePreference,
  onSelectPreference,
  onNext,
  onPrev,
}) => {
  return (
    <div className="bg-[#FAF7F0] border border-[#E8D8B8] rounded-3xl p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8D8B8]/70">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] bg-white px-2.5 py-1 rounded-full border border-[#E8D8B8] inline-block mb-2">
            STEP 5 OF 11 &bull; CLINICAL MODALITY PREFERENCE
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#24302F]">
            Care Preference: Modern Medicine / AYUSH
          </h2>
          <p className="text-xs sm:text-sm text-[#4D5652] mt-1">
            Choose your preferred clinical evaluation framework for today&apos;s consultation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-[#FAF7F0] text-[#24302F] border border-[#D8BE88] px-3 py-1 rounded-full text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px] text-[#B89A5A]">
              integration_instructions
            </span>
            <span>Integrative OPD Support</span>
          </span>
        </div>
      </div>

      {/* Two Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
        {/* Option 1: Modern Medicine */}
        <div
          onClick={() => onSelectPreference('Modern Medicine')}
          className={`p-5 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
            carePreference === 'Modern Medicine'
              ? 'bg-white border-[#24302F] shadow-md ring-2 ring-[#24302F]/20'
              : 'bg-white/80 border-[#E8D8B8] hover:border-[#D8BE88] hover:bg-white'
          }`}
        >
          {carePreference === 'Modern Medicine' && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#24302F] text-[#FAF7F0] flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
          )}

          <div className="w-12 h-12 rounded-2xl bg-[#24302F] text-[#FAF7F0] flex items-center justify-center mb-4 shadow-xs">
            <span className="material-symbols-outlined text-2xl">medical_services</span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block mb-1">
            ALLOPATHIC &bull; EVIDENCE-BASED
          </span>
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#24302F] mb-2">
            Modern Medicine
          </h3>

          <p className="text-xs text-[#4D5652] leading-relaxed mb-4">
            Standard clinical assessment focusing on symptom pathology, diagnostic lab correlation, pharmacological treatment, and evidence-based clinical protocols.
          </p>

          <div className="space-y-1.5 pt-3 border-t border-[#E8D8B8]/60 text-[11px] text-[#4D5652]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
              <span>General Medicine &amp; Specialized OPD review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
              <span>Prescription &amp; Diagnostic investigation sync</span>
            </div>
          </div>
        </div>

        {/* Option 2: AYUSH / Ayurveda */}
        <div
          onClick={() => onSelectPreference('AYUSH / Ayurveda')}
          className={`p-5 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
            carePreference === 'AYUSH / Ayurveda'
              ? 'bg-white border-[#B89A5A] shadow-md ring-2 ring-[#B89A5A]/30'
              : 'bg-white/80 border-[#E8D8B8] hover:border-[#D8BE88] hover:bg-white'
          }`}
        >
          {carePreference === 'AYUSH / Ayurveda' && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#B89A5A] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
          )}

          <div className="w-12 h-12 rounded-2xl bg-[#B89A5A] text-white flex items-center justify-center mb-4 shadow-xs">
            <span className="material-symbols-outlined text-2xl">spa</span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] block mb-1">
            TRADITIONAL &bull; AYURVEDIC INTEGRATION
          </span>
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#24302F] mb-2">
            AYUSH / Ayurveda
          </h3>

          <p className="text-xs text-[#4D5652] leading-relaxed mb-4">
            Holistic traditional Indian medicine assessment including Dosha constitution (Vata, Pitta, Kapha), Agni metabolic balance, dietary (Ahara), and lifestyle (Vihara) guidance.
          </p>

          <div className="space-y-1.5 pt-3 border-t border-[#E8D8B8]/60 text-[11px] text-[#4D5652]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-amber-600">check</span>
              <span>Prakriti &amp; Dosha dominance profiling</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-amber-600">check</span>
              <span>Agni (Digestive Fire) &amp; Rasayana herbal recommendations</span>
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
          <span>Previous: Language</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
        >
          <span>Continue to AI Voice Interview</span>
          <span className="material-symbols-outlined text-[16px] text-[#D8BE88]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
