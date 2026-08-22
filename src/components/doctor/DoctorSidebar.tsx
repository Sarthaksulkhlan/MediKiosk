import React from 'react';
import { DoctorSection } from '../../types';

interface DoctorSidebarProps {
  activeSection: DoctorSection;
  setActiveSection: (section: DoctorSection) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  waitingCount: number;
  priorityCount: number;
  signedCount: number;
  onNavigateHome: () => void;
}

interface NavItem {
  id: DoctorSection;
  number: number;
  label: string;
  shortLabel: string;
  icon: string;
  badge?: number;
  badgeColor?: string;
  description: string;
}

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  activeSection,
  setActiveSection,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  waitingCount,
  priorityCount,
  signedCount,
  onNavigateHome,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'patient-queue',
      number: 1,
      label: 'Patient Queue',
      shortLabel: 'Queue',
      icon: 'groups',
      badge: waitingCount,
      badgeColor: 'bg-[#24302F] text-[#FAF7F0]',
      description: 'Active triage & waiting pool',
    },
    {
      id: 'priority-cases',
      number: 2,
      label: 'Priority Cases',
      shortLabel: 'Priority',
      icon: 'notification_important',
      badge: priorityCount,
      badgeColor: 'bg-rose-600 text-white animate-pulse',
      description: 'High fever, BP & triage flags',
    },
    {
      id: 'reports',
      number: 3,
      label: 'Reports & OCR',
      shortLabel: 'Reports',
      icon: 'folder_shared',
      description: 'Prescriptions, labs & diagnostics',
    },
    {
      id: 'ai-summary',
      number: 4,
      label: 'AI Patient Summary',
      shortLabel: 'AI Summary',
      icon: 'auto_awesome',
      description: 'SOAP & translated clinical draft',
    },
    {
      id: 'ayush-assessment',
      number: 5,
      label: 'AYUSH Assessment',
      shortLabel: 'AYUSH',
      icon: 'spa',
      description: 'Integrative Dosha & lifestyle care',
    },
    {
      id: 'doctor-edit',
      number: 6,
      label: 'Prescription by Doctor',
      shortLabel: 'Prescription',
      icon: 'edit_note',
      description: 'Prescription & clinical orders',
    },
    {
      id: 'patient-report',
      number: 7,
      label: 'Patient Report',
      shortLabel: 'Report',
      icon: 'summarize',
      badge: 1,
      badgeColor: 'bg-[#B89A5A] text-[#1B2423] font-extrabold',
      description: 'Consolidated clinical dossier',
    },
    {
      id: 'consultation',
      number: 8,
      label: 'Consultation Room',
      shortLabel: 'Consult',
      icon: 'medical_services',
      description: 'Live consult & voice dictation',
    },
  ];

  const handleItemClick = (id: DoctorSection) => {
    setActiveSection(id);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-[#24302F]/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Main Full-Height Collapsible Left Sidebar */}
      <aside
        id="doctor-emr-sidebar"
        className={`fixed top-0 left-0 bottom-0 h-screen z-40 bg-white border-r border-[#E8D8B8]/80 shadow-[2px_0_16px_rgba(36,48,47,0.04)] flex flex-col justify-between transition-all duration-300 ease-in-out ${
          /* Mobile Drawer Position */
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${
          /* Desktop Width toggle */
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        }`}
        aria-label="Doctor Navigation Sidebar"
      >
        {/* Top Header / Branding & Toggle Bar */}
        <div className="flex-shrink-0 p-4 border-b border-[#E8D8B8]/70">
          <div className="flex items-center justify-between gap-2">
            {/* Expanded Brand View */}
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  id="btn-sidebar-brand"
                  onClick={onNavigateHome}
                  className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
                  title="Return to MediKiosk Hub"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#24302F] text-[#D8BE88] flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                  </div>
                  <div className="truncate">
                    <span className="font-display font-bold text-base text-[#24302F] tracking-tight block">
                      Medi<span className="text-[#B89A5A]">Kiosk</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#73787A] uppercase tracking-wider block">
                      Physician EMR
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              /* Collapsed Brand Icon */
              <button
                id="btn-sidebar-brand-collapsed"
                onClick={onNavigateHome}
                className="w-10 h-10 mx-auto rounded-xl bg-[#24302F] text-[#D8BE88] flex items-center justify-center flex-shrink-0 shadow-xs hover:scale-105 transition-transform cursor-pointer focus:outline-none"
                title="MediKiosk Physician Hub"
              >
                <span className="material-symbols-outlined text-[20px]">local_hospital</span>
              </button>
            )}

            {/* Hamburger / Collapse Button */}
            <button
              id="btn-toggle-sidebar"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileOpen(false);
                } else {
                  setIsCollapsed((prev) => !prev);
                }
              }}
              className={`p-2 rounded-xl text-[#4D5652] hover:text-[#24302F] hover:bg-[#FAF7F0] border border-transparent hover:border-[#E8D8B8] transition-all cursor-pointer flex-shrink-0 ${
                isCollapsed ? 'hidden' : 'block'
              }`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <span className="material-symbols-outlined text-[20px]">menu_open</span>
            </button>
          </div>

          {/* If Collapsed on Desktop: Separate toggle button under the logo */}
          {isCollapsed && (
            <div className="mt-3 flex justify-center">
              <button
                id="btn-expand-sidebar"
                onClick={() => setIsCollapsed(false)}
                className="w-9 h-9 rounded-xl text-[#4D5652] hover:text-[#24302F] hover:bg-[#FAF7F0] border border-[#E8D8B8]/60 flex items-center justify-center transition-all cursor-pointer"
                title="Expand Navigation (☰)"
                aria-label="Expand Navigation"
              >
                <span className="material-symbols-outlined text-[18px]">menu</span>
              </button>
            </div>
          )}

          {/* Physician Profile Card / Live OPD Status */}
          {!isCollapsed ? (
            <div className="mt-4 pt-3 border-t border-[#E8D8B8]/50 flex items-center gap-3 bg-[#FAF7F0]/70 p-2.5 rounded-2xl border border-[#E8D8B8]/40">
              <div className="w-9 h-9 rounded-xl bg-[#24302F] text-[#D8BE88] flex items-center justify-center font-display font-bold text-xs flex-shrink-0 shadow-xs">
                DS
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs text-[#24302F] truncate">
                    Dr. Sharma, MD
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" title="EMR Live" />
                </div>
                <p className="text-[10px] text-[#73787A] truncate">
                  Internal Medicine &bull; OPD 3A
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-xl bg-[#FAF7F0] text-[#24302F] border border-[#E8D8B8] flex items-center justify-center font-display font-bold text-xs relative cursor-default"
                title="Dr. Sharma, MD • OPD 3A (EMR Connected)"
              >
                DS
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Navigation List: Exactly 8 sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 scrollbar-thin">
          {!isCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#B89A5A]">
              Clinical Navigation
            </div>
          )}

          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const isReport = item.id === 'patient-report';

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                title={`${item.number}. ${item.label} — ${item.description}`}
                className={`w-full text-left rounded-2xl transition-all duration-200 cursor-pointer flex items-center group relative ${
                  isCollapsed ? 'justify-center p-2.5' : 'justify-between p-2.5 sm:p-3'
                } ${
                  isActive
                    ? isReport
                      ? 'bg-[#24302F] text-[#FAF7F0] shadow-md ring-2 ring-[#B89A5A]/50'
                      : 'bg-[#24302F] text-[#FAF7F0] shadow-md shadow-[#24302F]/10'
                    : isReport
                    ? 'bg-amber-50/80 hover:bg-amber-100/80 text-[#24302F] border border-[#D8BE88]/80 shadow-2xs'
                    : 'bg-[#FAF7F0]/60 hover:bg-[#F3EBDD] text-[#24302F] border border-transparent hover:border-[#E8D8B8]'
                }`}
              >
                <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
                  {/* Icon Container */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors relative ${
                      isActive
                        ? 'bg-[#D8BE88]/20 text-[#D8BE88]'
                        : isReport
                        ? 'bg-[#B89A5A] text-[#1B2423] shadow-xs'
                        : 'bg-white text-[#B89A5A] group-hover:bg-[#FAF7F0] border border-[#E8D8B8]/60'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {item.icon}
                    </span>

                    {/* Badge on collapsed icon */}
                    {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center border border-white ${
                          item.badgeColor || 'bg-rose-600 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Expanded Item Text */}
                  {!isCollapsed && (
                    <div className="truncate text-left min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            isActive ? 'text-[#D8BE88]' : isReport ? 'text-[#8C6B28]' : 'text-[#73787A]'
                          }`}
                        >
                          {item.number}.
                        </span>
                        <span className={`text-xs font-bold truncate ${isReport && !isActive ? 'text-[#1B2423]' : ''}`}>
                          {item.label}
                        </span>
                      </div>
                      <p
                        className={`text-[10px] truncate ${
                          isActive ? 'text-[#FAF7F0]/70' : isReport ? 'text-[#8C6B28]' : 'text-[#73787A]'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Expanded Badge */}
                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-1.5 ${
                      isActive ? 'bg-[#D8BE88] text-[#24302F]' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Shift Footer */}
        <div className="flex-shrink-0 p-3 sm:p-4 border-t border-[#E8D8B8]/70 bg-[#FAF7F0]/40">
          {!isCollapsed ? (
            <div>
              <div className="bg-white p-2.5 rounded-xl border border-[#E8D8B8] mb-2.5 text-xs shadow-2xs">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[#73787A]">Signed Today:</span>
                  <span className="font-bold text-[#24302F]">{signedCount} Records</span>
                </div>
                <div className="w-full bg-[#E8D8B8]/50 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(10, (signedCount / (waitingCount + signedCount || 1)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              <button
                id="btn-sidebar-exit-landing"
                onClick={onNavigateHome}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#E8D8B8] text-[#4D5652] hover:text-[#24302F] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px] text-[#B89A5A]">arrow_back</span>
                <span>Exit EMR Hub</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                id="btn-sidebar-exit-collapsed"
                onClick={onNavigateHome}
                className="w-9 h-9 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#E8D8B8] text-[#4D5652] flex items-center justify-center transition-colors cursor-pointer"
                title="Exit EMR Hub"
                aria-label="Exit EMR Hub"
              >
                <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">arrow_back</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
