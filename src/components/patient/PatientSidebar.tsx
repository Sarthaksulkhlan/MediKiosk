import React from 'react';
import { PatientTab, PatientProfileData } from './types';
import { AppView } from '../../types';

interface PatientSidebarProps {
  activeTab: PatientTab;
  setActiveTab: (tab: PatientTab) => void;
  patient?: PatientProfileData;
  progressPercent?: number;
  completedSteps?: PatientTab[];
  completedTabs?: Set<PatientTab>;
  isOpenMobile?: boolean;
  setIsOpenMobile?: (open: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  setCurrentView?: (view: AppView) => void;
}

interface NavItemDef {
  id: PatientTab;
  label: string;
  icon: string;
  badge?: string;
  workflowStep?: number;
}

const MAIN_NAV_ITEMS: NavItemDef[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
  { id: 'profile', label: 'Patient Profile', icon: 'account_circle' },
  { id: 'registration', label: 'ABHA / Registration', icon: 'badge', workflowStep: 1 },
  { id: 'consent', label: 'Consent', icon: 'verified_user', workflowStep: 2 },
  { id: 'language', label: 'Language', icon: 'translate', workflowStep: 3 },
  { id: 'healthcare-system', label: 'Healthcare System', icon: 'local_hospital', workflowStep: 4 },
  { id: 'ai-interview', label: 'AI Voice Interview', icon: 'smart_toy', workflowStep: 5, badge: 'Live AI' },
  { id: 'red-flags', label: 'Red Flag Detection', icon: 'emergency', workflowStep: 6 },
  { id: 'reports', label: 'Scan Reports', icon: 'description', workflowStep: 7 },
  { id: 'review', label: 'Review Information', icon: 'search_check', workflowStep: 8 },
  { id: 'submit', label: 'Submit', icon: 'send', workflowStep: 9, badge: 'Final' },
];

export const PatientSidebar: React.FC<PatientSidebarProps> = ({
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
  progressPercent,
  completedSteps = [],
  completedTabs,
  isOpenMobile,
  setIsOpenMobile,
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed = false,
  setIsCollapsed,
  setCurrentView = (_view: AppView) => {},
}) => {
  const isMobile = isMobileOpen ?? isOpenMobile ?? false;
  const closeMobile = () => {
    if (setIsMobileOpen) setIsMobileOpen(false);
    if (setIsOpenMobile) setIsOpenMobile(false);
  };

  const stepsList = completedSteps || (completedTabs ? Array.from(completedTabs) : []);
  const calculatedProgress =
    progressPercent ?? Math.min(100, Math.round((stepsList.length / 9) * 100));

  const patientName = patient?.name || 'Eleanor Vance';
  const patientInitials = patientName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2) || 'EV';
  const abhaId = patient?.abhaId || '91-4521-8890-1204';
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Main Element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 ${
          isCollapsed ? 'w-[76px]' : 'w-[265px]'
        } bg-[#FAF7F0] border-r border-[#E8D8B8]/80 flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Branding & Profile Header */}
        <div className="p-4 border-b border-[#E8D8B8]/70">
          {/* Logo & Platform Name */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#24302F] text-[#FAF7F0] flex items-center justify-center shadow-sm border border-[#D8BE88]/40 shrink-0">
                <span className="material-symbols-outlined text-[#D8BE88] text-[22px]">
                  health_and_safety
                </span>
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <h1 className="text-base font-extrabold text-[#24302F] tracking-tight flex items-center gap-1">
                    <span>HealthBridge</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  </h1>
                  <p className="text-[11px] font-medium text-[#7B8580] tracking-tight truncate">
                    AI-Powered Healthcare
                  </p>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={closeMobile}
              className="p-1.5 rounded-lg text-[#5D6662] hover:bg-[#E8D8B8]/50 lg:hidden"
              aria-label="Close Sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Patient Profile Card Snippet */}
          {!isCollapsed && (
            <div className="mt-4 p-3 rounded-2xl bg-white/90 border border-[#E8D8B8]/80 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#24302F] to-[#3A4A49] text-[#FAF7F0] flex items-center justify-center font-bold text-sm shadow-inner shrink-0 border border-[#D8BE88]/40">
                  {patientInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-xs font-bold text-[#24302F] truncate">{patientName}</h2>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded shrink-0">
                      Patient
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#6B7570] truncate mt-0.5">
                    ABHA: {abhaId}
                  </p>
                </div>
              </div>

              {/* Dynamic Journey Progress Bar */}
              <div className="mt-3 pt-2.5 border-t border-[#E8D8B8]/50">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#4D5652] mb-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-[#B89A5A]">
                      route
                    </span>
                    <span>Patient Journey</span>
                  </span>
                  <span className="text-[#8C6B28]">{calculatedProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E8D8B8]/50 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#B89A5A] to-emerald-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${calculatedProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Middle Navigation Section (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
          {!isCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8A9590]">
              Main Navigation
            </div>
          )}

          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const isDone = stepsList.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  closeMobile();
                }}
                title={item.label}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                } rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#24302F] text-[#FAF7F0] shadow-sm font-bold'
                    : 'text-[#4D5652] hover:bg-[#F0E6D2]/80 hover:text-[#24302F]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[18px] transition-colors ${
                      isActive
                        ? 'text-[#D8BE88]'
                        : isDone
                        ? 'text-emerald-600'
                        : 'text-[#7B8580] group-hover:text-[#24302F]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-[#B89A5A] text-[#1B2423]'
                            : 'bg-[#E8D8B8] text-[#4D5652]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isDone && !isActive && (
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions & Settings */}
        <div className="p-3 border-t border-[#E8D8B8]/70 space-y-1 bg-[#FAF7F0]">
          <button
            onClick={() => {
              setActiveTab('settings');
              closeMobile();
            }}
            title="Settings"
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
            } rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#24302F] text-[#FAF7F0]'
                : 'text-[#5D6662] hover:bg-[#F0E6D2]/80 hover:text-[#24302F]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            {!isCollapsed && <span>Settings</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab('help');
              closeMobile();
            }}
            title="Help & Support"
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2'
            } rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'help'
                ? 'bg-[#24302F] text-[#FAF7F0]'
                : 'text-[#5D6662] hover:bg-[#F0E6D2]/80 hover:text-[#24302F]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
            {!isCollapsed && <span>Help &amp; Support</span>}
          </button>

          <div className={`pt-2 border-t border-[#E8D8B8]/50 flex items-center gap-2 ${isCollapsed ? 'flex-col' : ''}`}>
            <button
              onClick={() => setCurrentView('doctor-dashboard')}
              title="Doctor Portal"
              className={`flex items-center justify-center gap-1.5 bg-white hover:bg-[#F3EBDD] text-[#24302F] border border-[#E8D8B8] py-2 rounded-xl text-[11px] font-bold transition-all shadow-2xs ${
                isCollapsed ? 'w-full p-2' : 'flex-1'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-[#B89A5A]">
                stethoscope
              </span>
              {!isCollapsed && <span>Doctor Desk</span>}
            </button>

            <button
              onClick={() => setCurrentView('landing')}
              title="Logout / Exit"
              className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
