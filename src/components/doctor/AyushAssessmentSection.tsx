import React, { useState } from 'react';
import { PatientRecord, AyushProfile } from '../../types';

interface AyushAssessmentSectionProps {
  patient: PatientRecord;
  onUpdateAyushProfile?: (profile: AyushProfile) => void;
}

export const AyushAssessmentSection: React.FC<AyushAssessmentSectionProps> = ({
  patient,
  onUpdateAyushProfile,
}) => {
  const defaultProfile: AyushProfile = patient.ayushProfile || {
    doshaDominance: 'Vata-Pitta',
    prakritiDetails: 'Vata-Pitta dual constitution with acute Pitta elevation (Jvara/Ushna aggravation).',
    agniAssessment: 'Visham (Irregular)',
    dietaryAdvice: [
      'Warm, freshly cooked light moong dal khichdi with cow ghee',
      'Boiled warm water infused with dry ginger (Shunthi) and Tulsi',
      'Avoid spicy, sour, fermented, and refrigerated deep-fried items',
    ],
    lifestyleRecommendations: [
      'Adequate rest (Vishrama) avoiding late night screen exposure',
      'Gentle cooling sandalwood paste forehead application',
      'Nadi Shodhana Pranayama for 10 minutes daily',
    ],
    herbalSupport: [
      'Sudarshan Ghanvati — 1 tab twice daily with lukewarm water',
      'Amritarishta (Guduchi) — 15ml with equal water after meals',
    ],
    physicianIncluded: true,
    notes: 'Holistic complementary care approved alongside standard clinical protocol.',
  };

  const [profile, setProfile] = useState<AyushProfile>(defaultProfile);
  const [includeInRx, setIncludeInRx] = useState<boolean>(profile.physicianIncluded);

  const toggleInclude = () => {
    const updated = !includeInRx;
    setIncludeInRx(updated);
    const newProf = { ...profile, physicianIncluded: updated };
    setProfile(newProf);
    if (onUpdateAyushProfile) {
      onUpdateAyushProfile(newProf);
    }
  };

  return (
    <div id="ayush-assessment-section" className="space-y-6">
      {/* 1. Header with Integrative Care Badge */}
      <div className="bg-gradient-to-r from-[#FAF7F0] via-[#F3EBDD] to-[#FAF7F0] p-5 sm:p-6 rounded-3xl border border-[#E8D8B8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#735A22] text-[#FAF7F0] flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-2xl">spa</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-[#24302F]">
                AYUSH &amp; Integrative Holistic Assessment
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8D8B8] text-[#735A22] border border-[#B89A5A]/50">
                NABH Holistic Standard
              </span>
            </div>
            <p className="text-xs text-[#4D5652] mt-0.5">
              Evidence-informed Ayurvedic Prakriti, Dosha balance, dietary pathya, and lifestyle recommendations for {patient.name}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E8D8B8] text-xs font-bold text-[#24302F] cursor-pointer shadow-xs">
            <input
              type="checkbox"
              checked={includeInRx}
              onChange={toggleInclude}
              className="accent-[#735A22] w-4 h-4 rounded cursor-pointer"
            />
            <span>Include in Final Prescription</span>
          </label>
        </div>
      </div>

      {/* 2. Dosha & Agni Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dosha Dominance */}
        <div className="bg-white/95 p-5 rounded-3xl border border-[#E8D8B8] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B89A5A]">
                Dosha Dominance
              </span>
              <span className="material-symbols-outlined text-[#735A22] text-[18px]">balance</span>
            </div>
            <div className="text-xl font-bold font-display text-[#24302F] mb-1">
              {profile.doshaDominance}
            </div>
            <p className="text-xs text-[#4D5652] leading-relaxed">
              {profile.prakritiDetails}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8D8B8]/60 flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">Vata: High</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">Pitta: Elevated</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">Kapha: Stable</span>
          </div>
        </div>

        {/* Agni Assessment */}
        <div className="bg-white/95 p-5 rounded-3xl border border-[#E8D8B8] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B89A5A]">
                Agni (Digestive Fire)
              </span>
              <span className="material-symbols-outlined text-amber-600 text-[18px]">local_fire_department</span>
            </div>
            <div className="text-xl font-bold font-display text-[#24302F] mb-1">
              {profile.agniAssessment}
            </div>
            <p className="text-xs text-[#4D5652] leading-relaxed">
              Metabolic status evaluated from digestive symptoms, tongue coating, and appetite rhythm during intake.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8D8B8]/60 text-xs text-[#73787A]">
            Treatment aim: <strong>Deepana &amp; Pachana (Ama elimination)</strong>
          </div>
        </div>

        {/* Holistic Inclusion Status */}
        <div className="bg-white/95 p-5 rounded-3xl border border-[#E8D8B8] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B89A5A]">
                Physician Endorsement
              </span>
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
            </div>
            <div className="text-xl font-bold font-display text-[#24302F] mb-1">
              {includeInRx ? 'Active & Approved' : 'Doctor Omitted'}
            </div>
            <p className="text-xs text-[#4D5652] leading-relaxed">
              {includeInRx
                ? 'These AYUSH lifestyle and nutritional guidelines will automatically append to the patient discharge sheet.'
                : 'Excluded from prescription export per physician discretion.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8D8B8]/60 text-xs">
            <span className="text-[11px] text-[#73787A]">Safety: No documented botanical-drug interactions.</span>
          </div>
        </div>
      </div>

      {/* 3. Guidelines Breakdown: Diet, Lifestyle, Herbs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Dietary Advice (Pathya) */}
        <div className="bg-white/95 rounded-3xl p-5 border border-[#E8D8B8] shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8D8B8]/60">
            <span className="material-symbols-outlined text-emerald-700 text-[20px]">restaurant</span>
            <h4 className="font-bold text-sm text-[#24302F]">Pathya Ahara (Diet)</h4>
          </div>
          <ul className="space-y-2 text-xs text-[#4D5652]">
            {profile.dietaryAdvice.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8]">
                <span className="material-symbols-outlined text-emerald-600 text-[15px] flex-shrink-0 mt-0.5">check</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lifestyle & Dinacharya */}
        <div className="bg-white/95 rounded-3xl p-5 border border-[#E8D8B8] shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8D8B8]/60">
            <span className="material-symbols-outlined text-teal-700 text-[20px]">self_improvement</span>
            <h4 className="font-bold text-sm text-[#24302F]">Vihara (Lifestyle &amp; Yoga)</h4>
          </div>
          <ul className="space-y-2 text-xs text-[#4D5652]">
            {profile.lifestyleRecommendations.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8]">
                <span className="material-symbols-outlined text-teal-600 text-[15px] flex-shrink-0 mt-0.5">spa</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Herbal Support (Aushadha) */}
        <div className="bg-white/95 rounded-3xl p-5 border border-[#E8D8B8] shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8D8B8]/60">
            <span className="material-symbols-outlined text-[#735A22] text-[20px]">local_florist</span>
            <h4 className="font-bold text-sm text-[#24302F]">Classical Formulations</h4>
          </div>
          <ul className="space-y-2 text-xs text-[#4D5652]">
            {profile.herbalSupport.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8]">
                <span className="material-symbols-outlined text-[#735A22] text-[15px] flex-shrink-0 mt-0.5">medication</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
