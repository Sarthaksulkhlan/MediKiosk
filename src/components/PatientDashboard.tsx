import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, PatientRecord } from '../types';
import {
  PatientTab,
  PatientProfileData,
  UploadedReport,
  ConsentSettings,
} from './patient/types';
import { PatientSidebar } from './patient/PatientSidebar';
import { PatientHeader } from './patient/PatientHeader';

// Subviews
import { DashboardView } from './patient/views/DashboardView';
import { ProfileView } from './patient/views/ProfileView';
import { RegistrationView } from './patient/views/RegistrationView';
import { ConsentView } from './patient/views/ConsentView';
import { LanguageView } from './patient/views/LanguageView';
import { HealthcareSystemView } from './patient/views/HealthcareSystemView';
import { VoiceInterviewView } from './patient/views/VoiceInterviewView';
import { RedFlagsView } from './patient/views/RedFlagsView';
import { ReportsView } from './patient/views/ReportsView';
import { ReviewView } from './patient/views/ReviewView';
import { SubmitView } from './patient/views/SubmitView';
import { DoctorsAdviceReportView } from './patient/views/DoctorsAdviceReportView';
import { SettingsView } from './patient/views/SettingsView';
import { HelpView } from './patient/views/HelpView';

interface PatientDashboardProps {
  setCurrentView: (view: AppView) => void;
  onNewCaseSubmitted?: (patient: Partial<PatientRecord>) => void;
  activePatientRecord?: PatientRecord;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  setCurrentView,
  onNewCaseSubmitted,
  activePatientRecord,
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<PatientTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Completed Step Tracker
  const [completedSteps, setCompletedSteps] = useState<PatientTab[]>([
    'consent',
  ]);

  // Central Patient Profile State
  const [patientData, setPatientData] = useState<PatientProfileData>({
    name: 'Eleanor Vance',
    age: 34,
    gender: 'Female',
    dob: '14 Jul 1992',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    email: 'eleanor.vance@gmail.com',
    address: 'Flat 402, Green Glen Heights, Bellandur, Bengaluru - 560103',
    emergencyContact: {
      name: 'Arthur Vance',
      relationship: 'Spouse',
      phone: '+91 98765 00112',
    },
    abhaId: '91-4521-8890-1204',
    abhaAddress: 'eleanor.vance@abdm',
    insurancePolicy: 'Star Health Comprehensive Gold (#SH-884920)',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    medicalHistory: [
      { condition: 'Mild Bronchial Asthma', diagnosedYear: '2019', status: 'Managed' },
      { condition: 'Seasonal Allergic Rhinitis', diagnosedYear: '2021', status: 'Active' },
    ],
    assignedDoctor: {
      name: 'Dr. Rajesh Sharma, MD',
      specialty: 'Senior General Physician',
      room: 'Room 402, 2nd Floor, OPD Wing',
      slot: '10:30 AM',
      tokenNumber: 'A-42',
    },
    preferredLanguage: 'English',
    healthcareApproach: 'allopathy',
  });

  // Consent Settings State
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    voiceAi: true,
    doctorShare: true,
    abdmSync: true,
    emergencyTelemetry: true,
    signedAt: '22 Aug 2026, 10:02 AM',
  });

  // Voice Interview & Clinical State
  const [transcript, setTranscript] = useState('');
  const [riskStatus, setRiskStatus] = useState<'Low Risk' | 'Moderate Risk' | 'High Priority'>(
    'Low Risk'
  );

  // Uploaded Reports State
  const [uploadedReports, setUploadedReports] = useState<UploadedReport[]>([
    {
      id: 'rep-1',
      fileName: 'OPD_Prescription_Sharma_Aug.pdf',
      fileType: 'PDF',
      category: 'Prescription',
      uploadedAt: '14 Aug 2026',
      size: '420 KB',
      status: 'Processed',
      extractedData: {
        testName: 'General OPD Consultation',
        doctor: 'Dr. Rajesh Sharma',
        date: '14 Aug 2026',
        medicines: [
          { name: 'Tab Paracetamol', dosage: '650mg', frequency: 'Three times daily' },
          { name: 'Tab Levocetirizine', dosage: '5mg', frequency: 'Once daily at night' },
        ],
        summary: 'Prior prescription for seasonal febrile illness. Recommended rest & fluids.',
      },
    },
    {
      id: 'rep-2',
      fileName: 'CBC_Lab_Report_18Aug.pdf',
      fileType: 'PDF',
      category: 'Lab Report',
      uploadedAt: '18 Aug 2026',
      size: '1.2 MB',
      status: 'Processed',
      extractedData: {
        testName: 'Complete Blood Count (CBC)',
        doctor: 'City Health Diagnostic Lab',
        date: '18 Aug 2026',
        parameters: [
          { name: 'Hemoglobin', value: '13.4 g/dL', range: '12.0 - 15.5 g/dL', status: 'normal' },
          { name: 'Total Leukocyte Count', value: '7,400 /µL', range: '4,000 - 11,000 /µL', status: 'normal' },
          { name: 'Platelet Count', value: '240,000 /µL', range: '150,000 - 450,000 /µL', status: 'normal' },
        ],
        summary: 'Normal baseline haematology parameters. Platelets and WBC within healthy limits.',
      },
    },
  ]);

  // Step Completion Handler
  const handleMarkStepComplete = (step: PatientTab) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
    }
  };

  const handleUpdatePatientData = (updated: Partial<PatientProfileData>) => {
    setPatientData((prev) => ({ ...prev, ...updated }));
  };

  const handleAddReport = (report: UploadedReport) => {
    setUploadedReports((prev) => [report, ...prev]);
  };

  const handleDeleteReport = (id: string) => {
    setUploadedReports((prev) => prev.filter((r) => r.id !== id));
  };

  // Render Subview
  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            patient={patientData}
            setActiveTab={setActiveTab}
            completedSteps={completedSteps}
            riskStatus={riskStatus}
            uploadedReportsCount={uploadedReports.length}
          />
        );
      case 'profile':
        return (
          <ProfileView
            patient={patientData}
            onUpdatePatient={handleUpdatePatientData}
            setActiveTab={setActiveTab}
          />
        );
      case 'registration':
        return (
          <RegistrationView
            patient={patientData}
            onUpdatePatient={handleUpdatePatientData}
            setActiveTab={setActiveTab}
            onMarkStepComplete={handleMarkStepComplete}
          />
        );
      case 'consent':
        return (
          <ConsentView
            consentSettings={consentSettings}
            onUpdateConsent={(updated) => setConsentSettings(updated)}
            patient={patientData}
            setActiveTab={setActiveTab}
            onMarkStepComplete={handleMarkStepComplete}
          />
        );
      case 'language':
        return (
          <LanguageView
            preferredLanguage={patientData.preferredLanguage}
            onSelectLanguage={(lang) => handleUpdatePatientData({ preferredLanguage: lang })}
            setActiveTab={setActiveTab}
            onMarkStepComplete={handleMarkStepComplete}
          />
        );
      case 'healthcare-system':
        return (
          <HealthcareSystemView
            selectedApproach={patientData.healthcareApproach}
            onSelectApproach={(app) => handleUpdatePatientData({ healthcareApproach: app })}
            setActiveTab={setActiveTab}
            onMarkStepComplete={handleMarkStepComplete}
          />
        );
      case 'ai-interview':
        return (
          <VoiceInterviewView
            patient={patientData}
            transcript={transcript}
            onUpdateTranscript={(txt) => setTranscript(txt)}
            setActiveTab={setActiveTab}
            onMarkStepComplete={handleMarkStepComplete}
            selectedLanguage={patientData.preferredLanguage}
          />
        );
      case 'red-flags':
        return (
          <RedFlagsView
            transcript={transcript}
            riskStatus={riskStatus}
            onUpdateRiskStatus={(status) => setRiskStatus(status)}
            setActiveTab={setActiveTab}
            onMarkStepComplete={handleMarkStepComplete}
          />
        );
      case 'reports':
        return (
          <ReportsView
            uploadedReports={uploadedReports}
            onAddReport={handleAddReport}
            onDeleteReport={handleDeleteReport}
            setActiveTab={setActiveTab}
            onMarkStepComplete={handleMarkStepComplete}
          />
        );
      case 'review':
        return (
          <ReviewView
            patient={patientData}
            transcript={transcript}
            uploadedReports={uploadedReports}
            consentSettings={consentSettings}
            riskStatus={riskStatus}
            setActiveTab={setActiveTab}
            onMarkStepComplete={handleMarkStepComplete}
          />
        );
      case 'submit':
        return (
          <SubmitView
            patient={patientData}
            transcript={transcript}
            uploadedReports={uploadedReports}
            riskStatus={riskStatus}
            setActiveTab={setActiveTab}
            onMarkStepComplete={handleMarkStepComplete}
            onNewCaseSubmitted={onNewCaseSubmitted}
          />
        );
      case 'doctor-advice':
        return (
          <DoctorsAdviceReportView
            patientProfile={patientData}
            activePatientRecord={activePatientRecord}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'settings':
        return (
          <SettingsView
            patient={patientData}
            consentSettings={consentSettings}
            onUpdateConsent={(updated) => setConsentSettings(updated)}
          />
        );
      case 'help':
        return <HelpView />;
      default:
        return (
          <DashboardView
            patient={patientData}
            setActiveTab={setActiveTab}
            completedSteps={completedSteps}
            riskStatus={riskStatus}
            uploadedReportsCount={uploadedReports.length}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#24302F] flex flex-col font-sans">
      <div className="flex flex-1 w-full relative">
        {/* Persistent Left Navigation Sidebar */}
        <PatientSidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          completedSteps={completedSteps}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
          setCurrentView={setCurrentView}
        />

        {/* Main Content Area */}
        <div
          id="patient-main-container"
          className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          }`}
        >
          {/* Header Bar */}
          <PatientHeader
            patient={patientData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            completedStepsCount={completedSteps.length}
            totalSteps={6}
            setCurrentView={setCurrentView}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />

          {/* Dynamic Subview Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <AnimatePresence mode="wait">
              <div key={activeTab}>{renderView()}</div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};
