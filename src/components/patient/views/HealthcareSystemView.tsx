import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PatientTab } from '../types';

interface HealthcareSystemViewProps {
  selectedApproach: 'allopathy' | 'ayush' | 'integrated';
  onApproachChange: (approach: 'allopathy' | 'ayush' | 'integrated') => void;
  setActiveTab: (tab: PatientTab) => void;
  onMarkStepComplete: (step: PatientTab) => void;
}

export const HealthcareSystemView: React.FC<HealthcareSystemViewProps> = ({
  selectedApproach,
  onApproachChange,
  setActiveTab,
  onMarkStepComplete,
}) => {
  const [approach, setApproach] = useState<'allopathy' | 'ayush' | 'integrated'>(
    selectedApproach || 'allopathy'
  );
  const [selectedDept, setSelectedDept] = useState('General Medicine');

  const handleSelect = (app: 'allopathy' | 'ayush' | 'integrated') => {
    setApproach(app);
    onApproachChange(app);
    if (app === 'allopathy') setSelectedDept('General Medicine');
    if (app === 'ayush') setSelectedDept('Ayurveda (Kayachikitsa)');
    if (app === 'integrated') setSelectedDept('Integrative Clinical OPD');
  };

  const handleContinue = () => {
    onApproachChange(approach);
    onMarkStepComplete('healthcare-system');
    setActiveTab('ai-interview');
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
          <span className="material-symbols-outlined text-[15px]">local_hospital</span>
          <span>Step 4 • Healthcare Approach</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24302F]">
          Choose Your Healthcare Approach
        </h1>
        <p className="text-sm text-[#5D6662] mt-1 max-w-3xl leading-relaxed">
          Select between evidence-based Modern Allopathic Medicine, traditional AYUSH systems, or an Integrated clinical pathway for your consultation today.
        </p>
      </div>

      {/* Two Large Cards + Integrated Option */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modern Medicine Card */}
        <div
          onClick={() => handleSelect('allopathy')}
          className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
            approach === 'allopathy'
              ? 'bg-white border-[#24302F] shadow-lg ring-2 ring-[#B89A5A]'
              : 'bg-white border-[#E8D8B8] hover:border-[#B89A5A]'
          }`}
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">local_hospital</span>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  approach === 'allopathy'
                    ? 'bg-[#24302F] text-[#FAF7F0]'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {approach === 'allopathy' ? 'Selected' : 'Select'}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-[#24302F] mt-5">Modern Medicine (Allopathy)</h3>
            <p className="text-xs text-[#6B7570] mt-1">
              Evidence-based conventional medical diagnosis, pharmacology, and treatment.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-[#4D5652]">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 text-[16px]">check_circle</span>
                <span>MBBS/MD certified clinical doctors &amp; specialists</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 text-[16px]">check_circle</span>
                <span>Advanced diagnostic lab tests, ECG &amp; scans</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 text-[16px]">check_circle</span>
                <span>Standard pharmacological prescriptions &amp; emergency care</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8D8B8]/60 flex items-center justify-between text-xs font-bold text-[#24302F]">
            <span>Departments: Internal Medicine, Cardiology, ENT, Pediatrics</span>
          </div>
        </div>

        {/* AYUSH Card */}
        <div
          onClick={() => handleSelect('ayush')}
          className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
            approach === 'ayush'
              ? 'bg-white border-[#24302F] shadow-lg ring-2 ring-[#B89A5A]'
              : 'bg-white border-[#E8D8B8] hover:border-[#B89A5A]'
          }`}
        >
          <div>
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">spa</span>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  approach === 'ayush'
                    ? 'bg-[#24302F] text-[#FAF7F0]'
                    : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {approach === 'ayush' ? 'Selected' : 'Select'}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-[#24302F] mt-5">AYUSH Healthcare Systems</h3>
            <p className="text-xs text-[#6B7570] mt-1">
              Holistic traditional Indian systems certified under the Ministry of AYUSH.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-[#4D5652]">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">
                  check_circle
                </span>
                <span>Ayurveda (Panchakarma, Dosha balance, Herbal formulation)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">
                  check_circle
                </span>
                <span>Yoga, Naturopathy, Unani, Siddha &amp; Homoeopathy</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">
                  check_circle
                </span>
                <span>Lifestyle management &amp; chronic wellness protocols</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8D8B8]/60 flex items-center justify-between text-xs font-bold text-[#24302F]">
            <span>Departments: Kayachikitsa, Shalya, Swasthavritta, Yoga Therapy</span>
          </div>
        </div>
      </div>

      {/* Integrated Medicine Option Banner */}
      <div
        onClick={() => handleSelect('integrated')}
        className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          approach === 'integrated'
            ? 'bg-[#24302F] text-[#FAF7F0] border-[#24302F] shadow-md'
            : 'bg-white border-[#E8D8B8] hover:border-[#B89A5A]'
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              approach === 'integrated' ? 'bg-[#B89A5A] text-[#1B2423]' : 'bg-[#FAF7F0] text-[#24302F]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">hub</span>
          </div>
          <div>
            <h4 className="text-sm font-bold">Integrated Healthcare Approach (Recommended for Lifestyle)</h4>
            <p className={`text-xs ${approach === 'integrated' ? 'text-zinc-300' : 'text-[#6B7570]'}`}>
              Combines modern clinical diagnostics with tailored AYUSH wellness and diet recommendations.
            </p>
          </div>
        </div>

        <button
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 ${
            approach === 'integrated'
              ? 'bg-[#B89A5A] text-[#1B2423]'
              : 'bg-[#FAF7F0] text-[#24302F] border border-[#E8D8B8]'
          }`}
        >
          {approach === 'integrated' ? 'Selected ✓' : 'Choose Integrated'}
        </button>
      </div>

      {/* Department Selection */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#24302F]">Select Clinical Specialty Department</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            'General Medicine',
            'Cardiology & Vascular',
            'Pulmonology & Chest',
            'Gastroenterology',
            'Ayurveda (Kayachikitsa)',
            'Panchakarma & Detox',
            'Homoeopathy Clinic',
            'Integrative OPD',
          ].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`p-3 rounded-2xl text-xs font-bold text-left transition-all border cursor-pointer ${
                selectedDept === dept
                  ? 'bg-[#24302F] text-[#FAF7F0] border-[#24302F]'
                  : 'bg-[#FAF7F0] text-[#4D5652] border-[#E8D8B8] hover:bg-[#F3EBDD]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5">
        <span className="material-symbols-outlined text-amber-800 text-[20px] shrink-0 mt-0.5">
          info
        </span>
        <p className="text-[11px] text-amber-900 leading-relaxed">
          <strong>Clinical Advisory:</strong> For acute medical emergencies, severe chest pain, sudden breathlessness, or traumatic injury, Allopathic emergency triage is immediately mandated by hospital protocol.
        </p>
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8D8B8]/80 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('language')}
          className="text-xs font-bold text-[#5D6662] hover:text-[#24302F] px-4 py-2"
        >
          ← Back
        </button>

        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md hover:-translate-y-0.5"
        >
          <span>Continue to AI Voice Interview</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </motion.div>
  );
};
