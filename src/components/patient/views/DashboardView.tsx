import React from 'react';
import { motion } from 'motion/react';
import { PatientTab, PatientProfileData, UploadedReport } from '../types';

interface DashboardViewProps {
  patient?: PatientProfileData;
  setActiveTab: (tab: PatientTab) => void;
  completedTabs?: Set<PatientTab>;
  completedSteps?: PatientTab[];
  uploadedReports?: UploadedReport[];
  uploadedReportsCount?: number;
  riskStatus?: 'Low Risk' | 'Moderate Risk' | 'High Priority';
  isAiInterviewDone?: boolean;
  transcript?: string;
}

const WORKFLOW_STEPS: { id: PatientTab; label: string; icon: string }[] = [
  { id: 'consent', label: 'Consent', icon: 'verified_user' },
  { id: 'ai-interview', label: 'AI Voice Interview', icon: 'smart_toy' },
  { id: 'red-flags', label: 'Red Flags', icon: 'emergency' },
  { id: 'reports', label: 'Scan Reports', icon: 'description' },
  { id: 'review', label: 'Review', icon: 'search_check' },
  { id: 'submit', label: 'Submit', icon: 'send' },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  patient = {
    name: 'Eleanor Vance',
    age: 34,
    gender: 'Female',
    dob: '14 Jul 1992',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    email: 'eleanor.vance@gmail.com',
    address: 'Bellandur, Bengaluru',
    emergencyContact: { name: 'Arthur Vance', relationship: 'Spouse', phone: '+91 98765 00112' },
    abhaId: '91-4521-8890-1204',
    abhaAddress: 'eleanor.vance@abdm',
    insurancePolicy: 'Star Health Comprehensive Gold',
    allergies: ['Penicillin'],
    medicalHistory: [],
    assignedDoctor: {
      name: 'Dr. Rajesh Sharma, MD',
      specialty: 'Senior General Physician',
      room: 'Room 402, 2nd Floor',
      slot: '10:30 AM',
      tokenNumber: 'A-42',
    },
    preferredLanguage: 'English',
    healthcareApproach: 'allopathy',
  },
  setActiveTab,
  completedTabs,
  completedSteps,
  uploadedReports = [],
  uploadedReportsCount,
  riskStatus = 'Low Risk',
  isAiInterviewDone = false,
}) => {
  const stepsList: PatientTab[] =
    completedSteps || (completedTabs ? Array.from(completedTabs) : []);
  const isStepDone = (tab: PatientTab) => stepsList.includes(tab);

  const reportsCount = uploadedReportsCount ?? (uploadedReports?.length || 0);

  // Determine next actionable step
  const nextStep =
    WORKFLOW_STEPS.find((step) => !isStepDone(step.id)) || WORKFLOW_STEPS[WORKFLOW_STEPS.length - 1];

  const getRiskBadge = () => {
    switch (riskStatus) {
      case 'High Priority':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          dot: 'bg-rose-500',
          label: '🔴 High Priority Alert',
        };
      case 'Moderate Risk':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          dot: 'bg-amber-500',
          label: '🟡 Moderate Risk',
        };
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          dot: 'bg-emerald-500',
          label: '🟢 Low Risk',
        };
    }
  };

  const riskBadge = getRiskBadge();
  const patientName = patient?.name || 'Eleanor Vance';
  const doctorName = patient?.assignedDoctor?.name || 'Dr. Rajesh Sharma, MD';
  const doctorSpecialty = patient?.assignedDoctor?.specialty || 'Senior General Physician';
  const doctorRoom = patient?.assignedDoctor?.room || 'Room 402, 2nd Floor';
  const doctorSlot = patient?.assignedDoctor?.slot || '10:30 AM';
  const tokenNumber = patient?.assignedDoctor?.tokenNumber || 'A-42';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* 1. Top Greeting Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#24302F] to-[#172221] text-[#FAF7F0] p-6 sm:p-8 border border-[#E8D8B8]/30 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B89A5A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D8BE88] text-xs font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ayushman Bharat Digital Health Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Good Morning, {patientName} 👋
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
            Let's complete your pre-consultation healthcare assessment before your appointment with{' '}
            <strong className="text-white">{doctorName}</strong> ({doctorSpecialty}).
          </p>
        </div>

        {/* Big CTA button */}
        <div className="shrink-0 relative z-10">
          <button
            onClick={() => setActiveTab(nextStep.id)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#B89A5A] to-[#D8BE88] hover:from-[#A88A4A] hover:to-[#C8AE78] text-[#1B2423] px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl cursor-pointer hover:-translate-y-0.5"
          >
            <span>Continue Assessment</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 2. Four Main Important Status Cards (Fintech + Healthcare Dashboard Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Health Assessment */}
        <div
          onClick={() => setActiveTab(nextStep.id)}
          className="p-5 rounded-2xl bg-white border border-[#E8D8B8]/80 hover:border-[#B89A5A] transition-all cursor-pointer shadow-xs hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {isStepDone('submit') ? 'Completed' : 'In Progress'}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7570]">
              Health Assessment
            </h3>
            <p className="text-lg font-extrabold text-[#24302F] mt-0.5">
              {isStepDone('submit') ? 'Verified' : 'Active Intake'}
            </p>
            <p className="text-xs text-[#7B8580] mt-1">
              Token <strong className="text-[#24302F] font-mono">#{tokenNumber}</strong> for Today
            </p>
          </div>
        </div>

        {/* Card 2: AI Voice Interview */}
        <div
          onClick={() => setActiveTab('ai-interview')}
          className="p-5 rounded-2xl bg-white border border-[#E8D8B8]/80 hover:border-[#B89A5A] transition-all cursor-pointer shadow-xs hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isAiInterviewDone
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isAiInterviewDone ? 'Completed' : 'Pending'}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7570]">
              AI Voice Interview
            </h3>
            <p className="text-lg font-extrabold text-[#24302F] mt-0.5">
              {isAiInterviewDone ? 'Transcribed' : 'Ready to Start'}
            </p>
            <p className="text-xs text-[#7B8580] mt-1">Aura Clinical Assistant (8+ Dialects)</p>
          </div>
        </div>

        {/* Card 3: Uploaded Reports */}
        <div
          onClick={() => setActiveTab('reports')}
          className="p-5 rounded-2xl bg-white border border-[#E8D8B8]/80 hover:border-[#B89A5A] transition-all cursor-pointer shadow-xs hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {reportsCount} Files
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7570]">
              Medical Reports
            </h3>
            <p className="text-lg font-extrabold text-[#24302F] mt-0.5">
              {reportsCount} Processed
            </p>
            <p className="text-xs text-[#7B8580] mt-1">Prescriptions, CBC &amp; Lab scans</p>
          </div>
        </div>

        {/* Card 4: Risk Status */}
        <div
          onClick={() => setActiveTab('red-flags')}
          className="p-5 rounded-2xl bg-white border border-[#E8D8B8]/80 hover:border-[#B89A5A] transition-all cursor-pointer shadow-xs hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${riskBadge.bg}`}>
              {riskStatus}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7570]">
              Clinical Risk Status
            </h3>
            <p className="text-lg font-extrabold text-[#24302F] mt-0.5 flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${riskBadge.dot}`} />
              <span>{riskStatus}</span>
            </p>
            <p className="text-xs text-[#7B8580] mt-1">Triage Protocol Verified</p>
          </div>
        </div>
      </div>

      {/* 3. Your Healthcare Journey Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8]/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8D8B8]/60">
          <div>
            <h2 className="text-lg font-extrabold text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A]">route</span>
              <span>Your Healthcare Journey</span>
            </h2>
            <p className="text-xs text-[#6B7570]">
              Click any milestone to jump directly into that step of your intake.
            </p>
          </div>
          <span className="text-xs font-bold text-[#8C6B28] bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#E8D8B8]">
            {WORKFLOW_STEPS.filter((s) => isStepDone(s.id)).length} of {WORKFLOW_STEPS.length} Milestones Done
          </span>
        </div>

        {/* Horizontal Timeline Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isCompleted = isStepDone(step.id);
            const isNext = step.id === nextStep.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveTab(step.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                      : isNext
                      ? 'bg-[#24302F] text-[#FAF7F0] border-[#24302F] shadow-sm scale-105'
                      : 'bg-[#FAF7F0] text-[#5D6662] border-[#E8D8B8] hover:bg-[#F3EBDD]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isNext
                        ? 'bg-[#B89A5A] text-[#1B2423]'
                        : 'bg-[#E8D8B8] text-[#24302F]'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </span>
                  <span className="material-symbols-outlined text-[16px]">{step.icon}</span>
                  <span>{step.label}</span>
                </button>

                {idx < WORKFLOW_STEPS.length - 1 && (
                  <span className="text-[#C4B698] font-bold text-xs shrink-0 select-none">
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Grid: Today's OPD Appointment & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's OPD Appointment Card */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
            <div className="flex items-center gap-2 text-[#24302F]">
              <span className="material-symbols-outlined text-[#B89A5A]">calendar_clock</span>
              <h3 className="font-bold text-base">Today's Appointment Desk</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Confirmed Slot: {doctorSlot}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/70">
              <span className="text-[11px] font-bold uppercase text-[#6B7570]">Attending Physician</span>
              <h4 className="font-bold text-sm text-[#24302F] mt-1">{doctorName}</h4>
              <p className="text-xs text-[#7B8580] mt-0.5">{doctorSpecialty}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/70">
              <span className="text-[11px] font-bold uppercase text-[#6B7570]">Location &amp; Room</span>
              <h4 className="font-bold text-sm text-[#24302F] mt-1">{doctorRoom}</h4>
              <p className="text-xs text-[#7B8580] mt-0.5">Main OPD Block, 2nd Floor</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/70">
              <span className="text-[11px] font-bold uppercase text-[#6B7570]">Queue Token Pass</span>
              <h4 className="font-mono font-extrabold text-base text-[#8C6B28] mt-1">
                Token #{tokenNumber}
              </h4>
              <p className="text-xs text-[#7B8580] mt-0.5">Estimated wait: ~10 mins</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-700 text-[18px]">verified</span>
              <span>Your pre-consultation answers are automatically shared with Dr. Sharma.</span>
            </div>
            <button
              onClick={() => setActiveTab('review')}
              className="text-teal-900 font-bold hover:underline"
            >
              View Draft →
            </button>
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[#24302F] mb-1">Quick Launchpad</h3>
            <p className="text-xs text-[#6B7570]">Direct actions for your clinical session</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('ai-interview')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#B89A5A] text-[20px]">mic</span>
                <div>
                  <div className="text-xs font-bold text-[#24302F]">Start AI Voice Interview</div>
                  <div className="text-[10px] text-[#6B7570]">Narrate symptoms in your dialect</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#7B8580] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#B89A5A] text-[20px]">document_scanner</span>
                <div>
                  <div className="text-xs font-bold text-[#24302F]">Scan Medical Report</div>
                  <div className="text-[10px] text-[#6B7570]">Upload lab tests or previous Rx</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#7B8580] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#B89A5A] text-[20px]">qr_code_2</span>
                <div>
                  <div className="text-xs font-bold text-[#24302F]">View Digital ABHA Card</div>
                  <div className="text-[10px] text-[#6B7570]">Government health ID credentials</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#7B8580] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
