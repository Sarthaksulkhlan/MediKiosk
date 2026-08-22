import React from 'react';
import { PatientWorkflowStep } from '../../types';

interface PatientWorkflowNavProps {
  currentStep: PatientWorkflowStep;
  onStepChange: (step: PatientWorkflowStep) => void;
  completedSteps: PatientWorkflowStep[];
}

export const WORKFLOW_STEPS: {
  id: PatientWorkflowStep;
  number: number;
  label: string;
  shortLabel: string;
  icon: string;
}[] = [
  { id: 'welcome', number: 1, label: 'Welcome', shortLabel: 'Welcome', icon: 'waving_hand' },
  { id: 'registration', number: 2, label: 'ABHA / Registration', shortLabel: 'ABHA', icon: 'badge' },
  { id: 'consent', number: 3, label: 'Consent', shortLabel: 'Consent', icon: 'verified_user' },
  { id: 'language', number: 4, label: 'Language', shortLabel: 'Language', icon: 'translate' },
  { id: 'care-preference', number: 5, label: 'Modern / AYUSH', shortLabel: 'Care Pref', icon: 'medication_liquid' },
  { id: 'voice-interview', number: 6, label: 'AI Voice Interview', shortLabel: 'Voice', icon: 'mic' },
  { id: 'aura-ai', number: 7, label: 'Aura AI Assistant', shortLabel: 'Aura AI', icon: 'auto_awesome' },
  { id: 'red-flags', number: 8, label: 'Red Flag Detection', shortLabel: 'Safety Check', icon: 'security' },
  { id: 'scan-reports', number: 9, label: 'Scan Reports & OCR', shortLabel: 'Reports', icon: 'document_scanner' },
  { id: 'review-info', number: 10, label: 'Review Information', shortLabel: 'Review', icon: 'fact_check' },
  { id: 'submit', number: 11, label: 'Submit to Doctor', shortLabel: 'Submit', icon: 'send' },
];

export const PatientWorkflowNav: React.FC<PatientWorkflowNavProps> = ({
  currentStep,
  onStepChange,
  completedSteps,
}) => {
  const currentIndex = WORKFLOW_STEPS.findIndex((s) => s.id === currentStep);
  const progressPercent = Math.round(((currentIndex + 1) / WORKFLOW_STEPS.length) * 100);

  return (
    <div className="bg-[#FAF7F0] border border-[#E8D8B8] rounded-2xl p-3 sm:p-4 mb-6 shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#E8D8B8]/60">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-[#24302F] text-[#FAF7F0] flex items-center justify-center text-xs font-bold font-mono">
            {currentIndex + 1}
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#24302F] tracking-tight">
            Step {currentIndex + 1} of {WORKFLOW_STEPS.length}:{' '}
            <span className="text-[#B89A5A]">
              {WORKFLOW_STEPS[currentIndex]?.label}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-[#73787A]">
            {progressPercent}% Completed
          </span>
          <div className="w-20 sm:w-28 h-2 bg-[#E8D8B8]/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#24302F] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Stepper */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-[#D8BE88] scrollbar-track-transparent">
        {WORKFLOW_STEPS.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id) && !isActive;

          return (
            <button
              key={step.id}
              onClick={() => onStepChange(step.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                isActive
                  ? 'bg-[#24302F] text-[#FAF7F0] shadow-xs ring-1 ring-[#24302F]'
                  : isCompleted
                  ? 'bg-white text-[#24302F] border border-emerald-300 hover:bg-emerald-50/50'
                  : 'bg-white/70 text-[#73787A] border border-[#E8D8B8] hover:bg-white hover:text-[#24302F]'
              }`}
              title={step.label}
            >
              {isCompleted ? (
                <span className="material-symbols-outlined text-[14px] text-emerald-600">
                  check_circle
                </span>
              ) : (
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    isActive ? 'bg-[#FAF7F0] text-[#24302F]' : 'bg-[#E8D8B8] text-[#4D5652]'
                  }`}
                >
                  {step.number}
                </span>
              )}
              <span className="hidden md:inline">{step.label}</span>
              <span className="inline md:hidden">{step.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
