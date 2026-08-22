import React, { useState } from 'react';
import { PatientTab, PatientProfileData } from './types';
import { AppView } from '../../types';

interface PatientHeaderProps {
  activeTab: PatientTab;
  setActiveTab: (tab: PatientTab) => void;
  patient?: PatientProfileData;
  selectedLanguage?: string;
  onLanguageChange?: (lang: string) => void;
  onOpenMobileSidebar?: () => void;
  onToggleMobileSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
  completedStepsCount?: number;
  totalSteps?: number;
  setCurrentView?: (view: AppView) => void;
}

const TAB_TITLES: Record<PatientTab, { title: string; breadcrumb: string }> = {
  dashboard: { title: 'Patient Overview', breadcrumb: 'Dashboard' },
  profile: { title: 'Patient Profile & Medical History', breadcrumb: 'Patient Profile' },
  registration: { title: 'ABHA & Demographic Registration', breadcrumb: 'Registration' },
  consent: { title: 'Data Privacy & Clinical Consent', breadcrumb: 'Consent' },
  language: { title: 'Language & Dialect Selection', breadcrumb: 'Language' },
  'healthcare-system': { title: 'Healthcare Approach (Allopathy / AYUSH)', breadcrumb: 'Healthcare System' },
  'ai-interview': { title: 'Aura AI Voice Health Interview', breadcrumb: 'AI Voice Interview' },
  'red-flags': { title: 'AI Risk Stratification & Red Flags', breadcrumb: 'Red Flag Detection' },
  reports: { title: 'Upload & Scan Medical Documents', breadcrumb: 'Scan Reports' },
  review: { title: 'Clinical Information Review', breadcrumb: 'Review Information' },
  submit: { title: 'Final Submission & Token Generation', breadcrumb: 'Submit' },
  settings: { title: 'Account & Security Preferences', breadcrumb: 'Settings' },
  help: { title: 'Help, FAQ & Emergency Contacts', breadcrumb: 'Help & Support' },
};

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  activeTab,
  setActiveTab,
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
  selectedLanguage = 'English',
  onLanguageChange = (_lang: string) => {},
  onOpenMobileSidebar,
  onToggleMobileSidebar,
  isSidebarCollapsed = false,
  onToggleCollapse,
  completedStepsCount = 0,
  totalSteps = 9,
  setCurrentView = (_view: AppView) => {},
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      if (onToggleMobileSidebar) onToggleMobileSidebar();
      else if (onOpenMobileSidebar) onOpenMobileSidebar();
    } else {
      if (onToggleCollapse) onToggleCollapse();
    }
  };

  const docName = patient?.assignedDoctor?.name || 'Dr. Rajesh Sharma, MD';
  const docRoom = patient?.assignedDoctor?.room || 'Room 402, 2nd Floor';
  const abhaId = patient?.abhaId || '91-4521-8890-1204';
  const patientName = patient?.name || 'Eleanor Vance';
  const patientFirstName = patientName.split(' ')[0] || 'Patient';
  const patientInitials = patientName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2) || 'EV';

  const notifications = [
    {
      id: 1,
      title: 'Appointment Confirmed',
      text: `${docName} • ${docRoom}`,
      time: '10 min ago',
      unread: true,
      icon: 'event_available',
    },
    {
      id: 2,
      title: 'ABHA Card Linked',
      text: `ABHA ID ${abhaId} verified with ABDM`,
      time: '25 min ago',
      unread: false,
      icon: 'verified',
    },
    {
      id: 3,
      title: 'Aura AI Assistant Ready',
      text: 'Voice intake module initialized in 8+ dialects',
      time: '1 hr ago',
      unread: false,
      icon: 'smart_toy',
    },
  ];

  const currentInfo = TAB_TITLES[activeTab] || { title: 'Patient Portal', breadcrumb: 'Portal' };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#E8D8B8]/80 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-[#24302F] bg-[#FAF7F0] hover:bg-[#E8D8B8]/60 border border-[#E8D8B8] cursor-pointer shadow-2xs transition-colors"
          aria-label="Toggle Navigation Sidebar"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse / Menu'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isSidebarCollapsed ? 'menu_open' : 'menu'}
          </span>
        </button>

        <div>
          {/* Breadcrumb path */}
          <div className="flex items-center gap-1.5 text-xs text-[#7B8580] font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-[#24302F] transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            {activeTab !== 'dashboard' && (
              <>
                <span>/</span>
                <span className="text-[#24302F] font-semibold">{currentInfo.breadcrumb}</span>
              </>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#24302F] tracking-tight leading-tight">
            {currentInfo.title}
          </h2>
        </div>
      </div>

      {/* Right: Controls (Language, Notifications, Profile) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language selector toggle */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="inline-flex items-center gap-1.5 bg-[#FAF7F0] hover:bg-[#F3EBDD] text-[#24302F] border border-[#E8D8B8] px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">
              translate
            </span>
            <span className="hidden sm:inline">{selectedLanguage}</span>
            <span className="sm:hidden">{selectedLanguage.slice(0, 2)}</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-[#E8D8B8] py-1.5 z-50 animate-in fade-in zoom-in-95">
              {['English', 'हिंदी (Hindi)', 'বাংলা (Bengali)', 'मराठी (Marathi)', 'தமிழ் (Tamil)', 'తెలుగు (Telugu)'].map(
                (lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onLanguageChange(lang.split(' ')[0]);
                      setIsLangOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-[#24302F] hover:bg-[#FAF7F0] font-medium flex items-center justify-between"
                  >
                    <span>{lang}</span>
                    {selectedLanguage === lang.split(' ')[0] && (
                      <span className="text-[#B89A5A] font-bold">✓</span>
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F3EBDD] text-[#24302F] border border-[#E8D8B8] transition-all cursor-pointer relative shadow-2xs"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-[#E8D8B8] p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8D8B8]/60">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#24302F]">Notifications</span>
                  <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full">
                    1 new
                  </span>
                </div>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs text-[#8C6B28] hover:underline font-semibold"
                >
                  Close
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      n.unread
                        ? 'bg-[#FAF7F0] border-[#E8D8B8]'
                        : 'bg-white border-transparent hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-[#B89A5A] mt-0.5">
                        {n.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-bold text-[#24302F] flex items-center justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-[#8A9590] font-normal">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#5D6662] mt-0.5">{n.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Portal Quick Switch */}
        <button
          onClick={() => setCurrentView('doctor-dashboard')}
          className="hidden sm:inline-flex items-center gap-1.5 bg-[#FAF7F0] hover:bg-[#F3EBDD] text-[#24302F] border border-[#E8D8B8] px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
        >
          <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">
            stethoscope
          </span>
          <span>Doctor Desk</span>
        </button>

        {/* Profile Pill Trigger */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl bg-[#24302F] text-[#FAF7F0] hover:bg-[#1B2423] transition-all cursor-pointer shadow-xs"
        >
          <div className="w-6 h-6 rounded-lg bg-[#B89A5A] text-[#1B2423] flex items-center justify-center text-[10px] font-bold">
            {patientInitials}
          </div>
          <span className="text-xs font-bold hidden md:inline truncate max-w-[100px]">
            {patientFirstName}
          </span>
        </button>
      </div>
    </header>
  );
};
