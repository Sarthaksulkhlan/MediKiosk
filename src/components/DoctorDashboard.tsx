import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { AppView, DoctorSection, PatientRecord, AyushProfile } from '../types';
import { DoctorSidebar } from './doctor/DoctorSidebar';
import { PatientHeaderStrip } from './doctor/PatientHeaderStrip';
import { PatientQueueSection } from './doctor/PatientQueueSection';
import { PriorityCasesSection } from './doctor/PriorityCasesSection';
import { AISummarySection } from './doctor/AISummarySection';
import { ReportsSection } from './doctor/ReportsSection';
import { AyushAssessmentSection } from './doctor/AyushAssessmentSection';
import { DoctorEditSection } from './doctor/DoctorEditSection';
import { PatientReportSection } from './doctor/PatientReportSection';
import { ConsultationSection } from './doctor/ConsultationSection';

interface DoctorDashboardProps {
  patients: PatientRecord[];
  selectedPatient: PatientRecord;
  setSelectedPatient: (patient: PatientRecord) => void;
  onSignNotes: (patientId: string) => void;
  setCurrentView: (view: AppView) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  patients,
  selectedPatient,
  setSelectedPatient,
  onSignNotes,
  setCurrentView,
}) => {
  const [activeSection, setActiveSection] = useState<DoctorSection>('patient-queue');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [signedState, setSignedState] = useState<Record<string, boolean>>({});
  const [patientStore, setPatientStore] = useState<Record<string, PatientRecord>>(() => {
    const map: Record<string, PatientRecord> = {};
    patients.forEach((p) => {
      map[p.id] = p;
    });
    return map;
  });

  const currentPatient = patientStore[selectedPatient.id] || selectedPatient;

  const handleUpdatePatient = (updated: PatientRecord) => {
    setPatientStore((prev) => ({
      ...prev,
      [updated.id]: updated,
    }));
    setSelectedPatient(updated);
  };

  const handleUpdateAyush = (profile: AyushProfile) => {
    const updated = {
      ...currentPatient,
      ayushProfile: profile,
    };
    handleUpdatePatient(updated);
  };

  const handleSign = () => {
    setSignedState((prev) => ({ ...prev, [currentPatient.id]: true }));
    onSignNotes(currentPatient.id);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const isCurrentSigned =
    signedState[currentPatient.id] || currentPatient.aiSummary.status === 'Signed';

  // Counts
  const waitingCount = patients.filter(
    (p) => !signedState[p.id] && p.aiSummary.status !== 'Signed'
  ).length;

  const priorityCount = patients.filter(
    (p) => p.priorityLevel === 'Urgent' || p.priorityLevel === 'Elevated' || p.isVitalsAlert
  ).length;

  const signedCount = Object.keys(signedState).filter((k) => signedState[k]).length;

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-row relative text-[#24302F]">
      {/* 1. TRUE FULL-HEIGHT COLLAPSIBLE LEFT SIDEBAR */}
      <DoctorSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        waitingCount={waitingCount}
        priorityCount={priorityCount}
        signedCount={signedCount}
        onNavigateHome={() => setCurrentView('landing')}
      />

      {/* 2. MAIN PHYSICIAN WORKSPACE CONTAINER */}
      <div
        id="physician-main-container"
        className={`flex-1 min-w-0 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* TOP EMR HEADER (Sticky at top of Main Content) */}
        <header
          id="physician-top-header"
          className="sticky top-0 z-30 bg-[#FAF7F0]/90 backdrop-blur-md border-b border-[#E8D8B8]/80 px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-4 shadow-[0_2px_12px_rgba(36,48,47,0.03)]"
        >
          {/* Left: Hamburger Toggle + Physician Identity */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Mobile / Collapsed Hamburger Button */}
            <button
              id="header-hamburger-toggle"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileSidebarOpen(true);
                } else {
                  setIsSidebarCollapsed((prev) => !prev);
                }
              }}
              className="p-2 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#E8D8B8] text-[#24302F] shadow-2xs transition-all cursor-pointer flex items-center justify-center"
              title={isSidebarCollapsed ? 'Expand Sidebar (☰)' : 'Toggle Sidebar (☰)'}
              aria-label="Toggle Sidebar Navigation"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse flex-shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4D5652] truncate">
                  Dr. Sharma, MD &bull; OPD 3A
                </span>
                <span className="hidden sm:inline-block text-[11px] text-[#73787A] font-mono">
                  &bull; MediKiosk EMR Hub
                </span>
              </div>
              <h1 className="font-display text-lg sm:text-2xl font-bold text-[#24302F] tracking-tight truncate">
                Physician Workspace
              </h1>
            </div>
          </div>

          {/* Right: Quick External Views & Exit */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              id="btn-goto-patient-portal"
              onClick={() => setCurrentView('patient-dashboard')}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white hover:bg-[#FAF7F0] border border-[#E8D8B8] text-[#24302F] text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">person</span>
              <span className="hidden sm:inline">Patient Portal</span>
            </button>

            <button
              id="btn-goto-kiosk"
              onClick={() => setCurrentView('kiosk-mode')}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white hover:bg-[#FAF7F0] border border-[#E8D8B8] text-[#24302F] text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">tablet</span>
              <span className="hidden sm:inline">Waiting Room Kiosk</span>
            </button>

            <button
              id="btn-exit-to-hub"
              onClick={() => setCurrentView('landing')}
              className="p-1.5 sm:px-3 sm:py-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] text-xs font-medium rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Exit to Main Hub"
            >
              <span className="material-symbols-outlined text-[16px] text-[#D8BE88]">home</span>
              <span className="hidden md:inline">Exit Hub</span>
            </button>
          </div>
        </header>

        {/* MAIN WORKSPACE CONTENT SCROLL AREA */}
        <main className="flex-1 w-full max-w-[1580px] mx-auto px-3 sm:px-6 md:px-8 py-6">
          {/* Active Patient Top Context Bar */}
          <PatientHeaderStrip
            patient={currentPatient}
            isSigned={isCurrentSigned}
            onSign={handleSign}
            onNavigateSection={(section) => setActiveSection(section)}
          />

          {/* Dynamic Section View */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* 1. Patient Queue */}
              {activeSection === 'patient-queue' && (
                <PatientQueueSection
                  patients={patients.map((p) => patientStore[p.id] || p)}
                  selectedPatient={currentPatient}
                  onSelectPatient={(p) => {
                    setSelectedPatient(p);
                  }}
                  signedMap={signedState}
                />
              )}

              {/* 2. Priority Cases */}
              {activeSection === 'priority-cases' && (
                <PriorityCasesSection
                  patients={patients.map((p) => patientStore[p.id] || p)}
                  selectedPatient={currentPatient}
                  onSelectPatient={(p) => {
                    setSelectedPatient(p);
                  }}
                  onNavigateSection={(sec) => setActiveSection(sec)}
                />
              )}

              {/* 3. Reports & OCR */}
              {activeSection === 'reports' && (
                <ReportsSection patient={currentPatient} />
              )}

              {/* 4. AI Patient Summary */}
              {activeSection === 'ai-summary' && (
                <AISummarySection
                  patient={currentPatient}
                  onNavigateSection={(sec) => setActiveSection(sec)}
                />
              )}

              {/* 5. AYUSH Assessment */}
              {activeSection === 'ayush-assessment' && (
                <AyushAssessmentSection
                  patient={currentPatient}
                  onUpdateAyushProfile={handleUpdateAyush}
                />
              )}

              {/* 6. Prescription by Doctor */}
              {activeSection === 'doctor-edit' && (
                <DoctorEditSection
                  patient={currentPatient}
                  onUpdatePatient={handleUpdatePatient}
                  isSigned={isCurrentSigned}
                  onSign={handleSign}
                />
              )}

              {/* 7. Patient Report */}
              {activeSection === 'patient-report' && (
                <PatientReportSection
                  patient={currentPatient}
                  onNavigateSection={(sec) => setActiveSection(sec)}
                  isSigned={isCurrentSigned}
                />
              )}

              {/* 8. Consultation Room */}
              {activeSection === 'consultation' && (
                <ConsultationSection
                  patient={currentPatient}
                  onNavigateSection={(sec) => setActiveSection(sec)}
                  isSigned={isCurrentSigned}
                  onSign={handleSign}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
