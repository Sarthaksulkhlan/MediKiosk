import React from 'react';

interface RedFlagDetectionStepProps {
  transcript: string;
  chiefComplaint: string;
  redFlags: string[];
  onNext: () => void;
  onPrev: () => void;
}

export const RedFlagDetectionStep: React.FC<RedFlagDetectionStepProps> = ({
  transcript,
  chiefComplaint,
  redFlags,
  onNext,
  onPrev,
}) => {
  const hasFlags = redFlags.length > 0;

  return (
    <div className="bg-[#FAF7F0] border border-[#E8D8B8] rounded-3xl p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8D8B8]/70">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] bg-white px-2.5 py-1 rounded-full border border-[#E8D8B8] inline-block mb-2">
            STEP 8 OF 11 &bull; SAFETY PROTOCOL &amp; RED FLAG SCREENING
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#24302F]">
            AI-Assisted Red Flag Detection
          </h2>
          <p className="text-xs sm:text-sm text-[#4D5652] mt-1">
            Automated screening of stated symptoms for clinical urgency and emergency triage alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasFlags ? (
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              <span className="material-symbols-outlined text-[16px] text-amber-700">warning</span>
              <span>Potential Flag Detected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                check_circle
              </span>
              <span>Standard Triage</span>
            </span>
          )}
        </div>
      </div>

      {/* Safety Outcome Card */}
      {hasFlags ? (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-300 shadow-xs mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-2xl">priority_high</span>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-amber-950">
                Potential Clinical Concern Flagged for Physician Review
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed mt-1">
                MediKiosk detected potential indicators in your narrative that require elevated attention. Dr. Sharma has been notified to prioritize this during your examination.
              </p>

              <div className="mt-4 space-y-2">
                {redFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="bg-white/90 p-3 rounded-xl border border-amber-200 flex items-center gap-2.5 text-xs text-amber-950 font-semibold"
                  >
                    <span className="material-symbols-outlined text-amber-700 text-[18px]">
                      report_problem
                    </span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-2xs mb-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#24302F]">
                No Immediate Emergency Red Flags Identified
              </h3>
              <p className="text-xs text-[#4D5652] leading-relaxed mt-1">
                Based on your stated narrative (&ldquo;
                <span className="italic font-medium text-[#24302F]">
                  {transcript || chiefComplaint || 'Standard outpatient concern'}
                </span>
                &rdquo;), no acute life-threatening emergency signs were detected. Your case is queued for regular OPD review.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#FAF7F0] text-xs">
            <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block mb-1">
                CARDIOVASCULAR
              </span>
              <span className="text-[#24302F] font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                No chest pain / radiation
              </span>
            </div>
            <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block mb-1">
                RESPIRATORY
              </span>
              <span className="text-[#24302F] font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                No acute respiratory distress
              </span>
            </div>
            <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block mb-1">
                NEUROLOGICAL
              </span>
              <span className="text-[#24302F] font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                No sudden altered sensorium
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Safety Notice Disclaimer */}
      <div className="p-3.5 bg-white/70 rounded-2xl border border-[#E8D8B8] flex items-start gap-2.5 mb-7 text-xs text-[#73787A]">
        <span className="material-symbols-outlined text-[18px] text-[#B89A5A] flex-shrink-0 mt-0.5">
          info
        </span>
        <p className="leading-relaxed">
          <strong className="text-[#24302F]">Clinical Disclaimer:</strong> This automated screening assists clinical queue triage and does not constitute a final diagnosis or medical clearance. If you experience severe chest pain, extreme breathlessness, or collapse, alert the hospital nursing desk immediately.
        </p>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E8D8B8]/70">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF7F0] text-[#4D5652] border border-[#E8D8B8] px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Previous: Aura AI Assistant</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
        >
          <span>Continue to Scan Reports &amp; OCR</span>
          <span className="material-symbols-outlined text-[16px] text-[#D8BE88]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
