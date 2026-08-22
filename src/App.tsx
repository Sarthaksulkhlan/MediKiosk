import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, UserRole, PatientRecord } from './types';
import { INITIAL_PATIENTS } from './data/patients';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { KioskIntakeMode } from './components/KioskIntakeMode';
import { AmbientShader } from './components/AmbientShader';
import { GetStartedModal } from './components/GetStartedModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(INITIAL_PATIENTS[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleNewCaseSubmitted = (newPat: Partial<PatientRecord>) => {
    const fullPat: PatientRecord = {
      ...INITIAL_PATIENTS[0], // Eleanor base
      ...newPat,
      id: `pat-eleanor`,
    } as PatientRecord;

    setPatients((prev) => [fullPat, ...prev.filter((p) => p.id !== 'pat-eleanor')]);
    setSelectedPatient(fullPat);
    showToast(`Consultation case for ${fullPat.name} synchronized to Doctor EMR!`);
  };

  const handleKioskIntake = (newPat: PatientRecord) => {
    setPatients((prev) => [newPat, ...prev]);
    setSelectedPatient(newPat);
    showToast(`Walk-in Patient ${newPat.name} (${newPat.patientId}) added to Doctor's Queue!`);
  };

  const handleSignNotes = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              aiSummary: { ...p.aiSummary, status: 'Signed' },
              vitalsStatus: 'Consult Completed',
            }
          : p
      )
    );
    showToast(`Clinical notes and prescription signed for ${selectedPatient.name}. EMR updated.`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#24302F] flex flex-col relative selection:bg-[#B89A5A]/20 selection:text-[#24302F]">
      {/* Organic Soft Light Ambient Shader in background */}
      <AmbientShader opacity={0.45} />

      {/* Top Minimal Navbar */}
      {currentView !== 'kiosk-mode' &&
        currentView !== 'patient-dashboard' &&
        currentView !== 'doctor-dashboard' && (
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            onOpenGetStartedModal={() => setIsGetStartedOpen(true)}
          />
        )}

      {/* Main View Transition Container */}
      <div className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex-grow flex flex-col"
            >
              <LandingPage
                setCurrentView={setCurrentView}
                setUserRole={setUserRole}
                onOpenGetStartedModal={() => setIsGetStartedOpen(true)}
              />
            </motion.div>
          )}

          {currentView === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex-grow flex flex-col"
            >
              <AuthScreen
                setCurrentView={setCurrentView}
                userRole={userRole}
                setUserRole={setUserRole}
              />
            </motion.div>
          )}

          {currentView === 'patient-dashboard' && (
            <motion.div
              key="patient-dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex-grow flex flex-col"
            >
              <PatientDashboard
                setCurrentView={setCurrentView}
                onNewCaseSubmitted={handleNewCaseSubmitted}
              />
            </motion.div>
          )}

          {currentView === 'doctor-dashboard' && (
            <motion.div
              key="doctor-dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex-grow flex flex-col"
            >
              <DoctorDashboard
                patients={patients}
                selectedPatient={selectedPatient}
                setSelectedPatient={setSelectedPatient}
                onSignNotes={handleSignNotes}
                setCurrentView={setCurrentView}
              />
            </motion.div>
          )}

          {currentView === 'kiosk-mode' && (
            <motion.div
              key="kiosk-mode"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex-grow flex flex-col"
            >
              <KioskIntakeMode
                onIntakeCompleted={handleKioskIntake}
                setCurrentView={setCurrentView}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Get Started Modal */}
      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
        setCurrentView={setCurrentView}
        setUserRole={setUserRole}
      />

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-[#24302F] text-[#FAF7F0] px-5 py-3.5 rounded-2xl shadow-xl border border-[#E8D8B8]/40 flex items-center gap-3 text-xs sm:text-sm font-medium"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#B89A5A] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {currentView !== 'kiosk-mode' &&
        currentView !== 'patient-dashboard' &&
        currentView !== 'doctor-dashboard' && <Footer />}
    </div>
  );
}
