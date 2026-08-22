import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { AppView, MedicalDocument, PatientRecord } from '../types';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<string>('ALL');
  const [showDocumentModal, setShowDocumentModal] = useState<MedicalDocument | null>(null);
  const [isEditingAiSummary, setIsEditingAiSummary] = useState(false);
  const [aiSummaryText, setAiSummaryText] = useState(selectedPatient.aiSummary.text);
  const [doctorNotes, setDoctorNotes] = useState(selectedPatient.clinicalNotes || '');
  const [signedState, setSignedState] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    hpi: true,
    pmh: true,
    meds: true,
    allergies: true,
    surgical: false,
    family: false,
    ros: false,
    investigations: false,
  });

  // Sync state on patient select
  const handleSelectPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setAiSummaryText(patient.aiSummary.text);
    setDoctorNotes(patient.clinicalNotes || '');
    setIsEditingAiSummary(false);
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = filterLanguage === 'ALL' || p.languageCode === filterLanguage;
    return matchesSearch && matchesLang;
  });

  const handleSign = () => {
    setSignedState((prev) => ({ ...prev, [selectedPatient.id]: true }));
    onSignNotes(selectedPatient.id);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const isSigned = signedState[selectedPatient.id] || selectedPatient.aiSummary.status === 'Signed';

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-[1520px] mx-auto relative z-10">
      
      {/* 1. CLINICAL WORKSPACE TOP HEADER */}
      <header className="mb-6 pb-5 border-b border-[#E8D8B8]/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#4D5652]">
              Live Sync &bull; EMR Connected
            </span>
            <span className="text-xs text-[#73787A]">&bull; Room 3A</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#24302F]">
            Clinical Workspace &bull; Dr. Sharma, MD
          </h1>
          <p className="text-xs sm:text-sm text-[#4D5652]">
            General Medicine &bull; Pre-Consultation Patient Queue &amp; Verified SOAP EMR
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('patient-dashboard')}
            className="px-4 py-2 bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-[#24302F] text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">person</span>
            <span>View Patient Portal</span>
          </button>

          <button
            onClick={() => setCurrentView('kiosk-mode')}
            className="px-4 py-2 bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-[#24302F] text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">tablet</span>
            <span>Waiting Kiosk</span>
          </button>
        </div>
      </header>

      {/* 2. THREE COLUMN LAYOUT: PATIENT QUEUE (3.5 cols) + CLINICAL WORKSPACE (5.5 cols) + DOCUMENTS & VITALS (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: PATIENT QUEUE (3.5 cols -> 4 cols on 12-grid) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white/90 rounded-3xl p-5 border border-[#E8D8B8] shadow-sm">
            
            {/* Queue Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8D8B8]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B89A5A] text-xl">groups</span>
                <h3 className="font-display font-bold text-base text-[#24302F]">
                  Patient Queue
                </h3>
              </div>
              <span className="text-xs font-bold text-[#24302F] bg-[#F3EBDD] px-2.5 py-1 rounded-full border border-[#E8D8B8]">
                {patients.length} Waiting
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#73787A]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient or symptom..."
                className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl pl-9 pr-3 py-2 text-xs text-[#24302F] outline-none focus:border-[#B89A5A]"
              />
            </div>

            {/* Language Filter */}
            <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1 text-[11px]">
              {['ALL', 'EN', 'HI'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setFilterLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                    filterLanguage === lang
                      ? 'bg-[#24302F] text-[#FAF7F0]'
                      : 'bg-[#FAF7F0] text-[#4D5652] hover:bg-[#F3EBDD]'
                  }`}
                >
                  {lang === 'ALL' ? 'All Languages' : lang === 'EN' ? 'English (EN)' : 'Hindi (HI)'}
                </button>
              ))}
            </div>

            {/* Patients Stream */}
            <div className="space-y-2.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
              {filteredPatients.map((patient) => {
                const isCurrent = patient.id === selectedPatient.id;
                const isPatSigned = signedState[patient.id] || patient.aiSummary.status === 'Signed';

                return (
                  <div
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                      isCurrent
                        ? 'bg-[#FAF7F0] border-[#B89A5A] shadow-md ring-1 ring-[#B89A5A]/30'
                        : 'bg-white border-[#E8D8B8] hover:border-[#B89A5A]/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={patient.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#E8D8B8]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#24302F] text-white flex items-center justify-center font-bold text-sm">
                            {patient.name[0]}
                          </div>
                        )}
                        <div>
                          <h4 className="font-display font-bold text-sm text-[#24302F]">
                            {patient.name}
                          </h4>
                          <span className="text-[10px] text-[#73787A]">
                            {patient.age}y &bull; {patient.gender} &bull; {patient.patientId}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isPatSigned
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-[#F3EBDD] text-[#4D5652] border border-[#E8D8B8]'
                        }`}
                      >
                        {isPatSigned ? 'Consulted' : patient.vitalsStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#4D5652] mt-2 pt-2 border-t border-[#E8D8B8]/60">
                      <span className="font-semibold text-[#24302F] truncate max-w-[180px]">
                        {patient.chiefComplaint}
                      </span>
                      <span className="text-[#73787A] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#B89A5A]">translate</span>
                        {patient.language}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: PATIENT CLINICAL WORKSPACE & AI SUMMARY (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Patient Header Card */}
          <div className="bg-white/90 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {selectedPatient.avatar ? (
                  <img
                    src={selectedPatient.avatar}
                    alt={selectedPatient.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#E8D8B8]"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#24302F] text-white flex items-center justify-center font-bold text-xl">
                    {selectedPatient.name[0]}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-[#24302F]">
                      {selectedPatient.name}
                    </h2>
                    <span className="bg-[#F3EBDD] text-[#4D5652] text-xs font-semibold px-2 py-0.5 rounded-full border border-[#E8D8B8]">
                      {selectedPatient.language}
                    </span>
                  </div>
                  <p className="text-xs text-[#73787A] mt-0.5">
                    {selectedPatient.age} Years &bull; {selectedPatient.gender} &bull; ID: <strong className="font-mono text-[#B89A5A]">{selectedPatient.patientId}</strong>
                  </p>
                </div>
              </div>

              {/* Physician Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSign}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    isSigned
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">
                    {isSigned ? 'done_all' : 'history_edu'}
                  </span>
                  <span>{isSigned ? 'Notes Signed' : 'Sign & Complete'}</span>
                </button>
              </div>
            </div>

            {/* Quick Vitals Strip */}
            <div className="mt-4 pt-3 border-t border-[#E8D8B8] grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
                <span className="text-[10px] text-[#73787A] block font-semibold">Temperature</span>
                <span className="font-bold text-[#24302F]">{selectedPatient.vitals.temperature}</span>
              </div>
              <div className="p-2 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
                <span className="text-[10px] text-[#73787A] block font-semibold">Blood Pressure</span>
                <span className="font-bold text-[#24302F]">{selectedPatient.vitals.bloodPressure}</span>
              </div>
              <div className="p-2 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
                <span className="text-[10px] text-[#73787A] block font-semibold">Heart Rate</span>
                <span className="font-bold text-[#24302F]">{selectedPatient.vitals.heartRate}</span>
              </div>
              <div className="p-2 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
                <span className="text-[10px] text-[#73787A] block font-semibold">Oxygen (SpO₂)</span>
                <span className="font-bold text-[#24302F]">{selectedPatient.vitals.oxygenSaturation}</span>
              </div>
            </div>
          </div>

          {/* AI Clinical Summary Banner (Explicitly marked Draft - Review Required) */}
          <div className="bg-gradient-to-b from-[#FAF7F0] to-[#F3EBDD]/50 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#B89A5A]/20 flex items-center justify-center text-[#B89A5A]">
                  <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
                </div>
                <h3 className="font-display font-bold text-lg text-[#24302F]">
                  AI Clinical Summary
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    isSigned
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {isSigned ? 'VERIFIED & SIGNED' : 'DRAFT &bull; REVIEW REQUIRED'}
                </span>

                <button
                  onClick={() => setIsEditingAiSummary(!isEditingAiSummary)}
                  className="text-xs text-[#B89A5A] hover:underline font-bold cursor-pointer"
                >
                  {isEditingAiSummary ? 'Done' : 'Edit'}
                </button>
              </div>
            </div>

            {isEditingAiSummary ? (
              <textarea
                value={aiSummaryText}
                onChange={(e) => setAiSummaryText(e.target.value)}
                rows={3}
                className="w-full bg-white border border-[#B89A5A] rounded-xl p-3 text-xs sm:text-sm text-[#24302F] outline-none mb-2"
              />
            ) : (
              <p className="text-xs sm:text-sm text-[#4D5652] leading-relaxed mb-3">
                {aiSummaryText}
              </p>
            )}

            <div className="text-[10px] text-[#73787A] flex items-center justify-between border-t border-[#E8D8B8]/80 pt-2.5 font-medium">
              <span>Intake: {selectedPatient.language} &bull; Translation: English</span>
              <span>Updated: {selectedPatient.aiSummary.lastUpdated}</span>
            </div>
          </div>

          {/* Structured Clinical History Sections (Expandable & Editable) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D5652] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#B89A5A]">history_edu</span>
              Structured Clinical History
            </h4>

            {/* 1. History of Present Illness (HPI) */}
            <div className="bg-white rounded-2xl border border-[#E8D8B8] shadow-2xs overflow-hidden">
              <button
                onClick={() => toggleSection('hpi')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F0] transition-colors cursor-pointer"
              >
                <span className="font-display font-bold text-sm text-[#24302F]">
                  1. History of Present Illness (HPI)
                </span>
                <span className="material-symbols-outlined text-lg text-[#73787A]">
                  {expandedSections.hpi ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {expandedSections.hpi && (
                <div className="p-4 pt-0 border-t border-[#E8D8B8]/60 text-xs space-y-2 text-[#4D5652]">
                  <div>
                    <strong className="text-[#24302F]">Onset: </strong>
                    {selectedPatient.hpi.onset}
                  </div>
                  <div>
                    <strong className="text-[#24302F]">Severity: </strong>
                    {selectedPatient.hpi.severity}
                  </div>
                  <div>
                    <strong className="text-[#24302F]">Associated Symptoms: </strong>
                    {selectedPatient.hpi.associated}
                  </div>
                  <div>
                    <strong className="text-[#24302F]">Alleviating Factors: </strong>
                    {selectedPatient.hpi.alleviating}
                  </div>
                  <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8]">
                    <strong className="text-[#24302F] block mb-0.5">Raw Narrative:</strong>
                    <span className="italic text-[#4D5652]">{selectedPatient.hpi.rawNarrative}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Past Medical History (PMH) & Surgical */}
            <div className="bg-white rounded-2xl border border-[#E8D8B8] shadow-2xs overflow-hidden">
              <button
                onClick={() => toggleSection('pmh')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F0] transition-colors cursor-pointer"
              >
                <span className="font-display font-bold text-sm text-[#24302F]">
                  2. Past Medical &amp; Surgical History
                </span>
                <span className="material-symbols-outlined text-lg text-[#73787A]">
                  {expandedSections.pmh ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {expandedSections.pmh && (
                <div className="p-4 pt-0 border-t border-[#E8D8B8]/60 text-xs space-y-1.5 text-[#4D5652]">
                  {selectedPatient.pmh.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B89A5A]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Current Medications & Allergies */}
            <div className="bg-white rounded-2xl border border-[#E8D8B8] shadow-2xs overflow-hidden">
              <button
                onClick={() => toggleSection('meds')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F0] transition-colors cursor-pointer"
              >
                <span className="font-display font-bold text-sm text-[#24302F]">
                  3. Current Medications &amp; Allergies
                </span>
                <span className="material-symbols-outlined text-lg text-[#73787A]">
                  {expandedSections.meds ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {expandedSections.meds && (
                <div className="p-4 pt-0 border-t border-[#E8D8B8]/60 text-xs space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#73787A] block mb-1">Active Prescriptions:</span>
                    <div className="space-y-1">
                      {selectedPatient.currentMedications.map((med, idx) => (
                        <div key={idx} className="bg-[#FAF7F0] p-2 rounded-xl border border-[#E8D8B8] flex justify-between">
                          <strong className="text-[#24302F]">{med.name}</strong>
                          <span className="text-[#4D5652]">{med.dosage} ({med.frequency})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#73787A] block mb-1">Allergies:</span>
                    <div className="space-y-1">
                      {selectedPatient.allergies.map((allg, idx) => (
                        <div key={idx} className="bg-rose-50 text-rose-900 p-2 rounded-xl border border-rose-200 flex justify-between">
                          <strong className="font-semibold">{allg.allergen}</strong>
                          <span>{allg.reaction} ({allg.severity})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Family & Social History */}
            <div className="bg-white rounded-2xl border border-[#E8D8B8] shadow-2xs overflow-hidden">
              <button
                onClick={() => toggleSection('family')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F0] transition-colors cursor-pointer"
              >
                <span className="font-display font-bold text-sm text-[#24302F]">
                  4. Family &amp; Review of Systems (ROS)
                </span>
                <span className="material-symbols-outlined text-lg text-[#73787A]">
                  {expandedSections.family ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {expandedSections.family && (
                <div className="p-4 pt-0 border-t border-[#E8D8B8]/60 text-xs space-y-2 text-[#4D5652]">
                  <div>
                    <strong className="text-[#24302F]">Family History: </strong>
                    Mother: Type 2 Diabetes (controlled). Father: Essential Hypertension.
                  </div>
                  <div>
                    <strong className="text-[#24302F]">Personal Habits: </strong>
                    Non-smoker, occasional caffeine consumption, no alcohol use.
                  </div>
                  <div>
                    <strong className="text-[#24302F]">Review of Systems: </strong>
                    Negative for shortness of breath, chest discomfort, or focal neurologic deficit.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Physician Clinical Notes Box */}
          <div className="bg-white/90 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm">
            <h4 className="font-display font-bold text-base text-[#24302F] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A] text-lg">edit_note</span>
              Physician Consultation Notes &amp; Rx
            </h4>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              rows={3}
              placeholder="Enter clinical examination findings, definitive diagnosis, or prescription modifications..."
              className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-2xl p-3.5 text-xs sm:text-sm text-[#24302F] outline-none focus:border-[#B89A5A] mb-3"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSign}
                className="bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Save &amp; Verify Notes
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DOCUMENTS PANEL & OCR EVIDENCE (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white/90 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm sticky top-28">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8D8B8]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B89A5A] text-xl">folder_shared</span>
                <h3 className="font-display font-bold text-base text-[#24302F]">
                  Documents
                </h3>
              </div>
              <span className="text-xs font-bold text-[#4D5652] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#E8D8B8]">
                {selectedPatient.documents.length} Records
              </span>
            </div>

            <p className="text-xs text-[#4D5652] mb-4">
              Click a document to review extracted OCR information and digital prescriptions.
            </p>

            <div className="space-y-3">
              {selectedPatient.documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setShowDocumentModal(doc)}
                  className="p-3.5 bg-[#FAF7F0] hover:bg-[#F3EBDD] rounded-2xl border border-[#E8D8B8] transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#E8D8B8] text-[#B89A5A]">
                      {doc.type}
                    </span>
                    <span className="text-[10px] text-[#73787A]">{doc.date}</span>
                  </div>

                  <h5 className="font-display font-bold text-xs text-[#24302F] group-hover:text-[#B89A5A] transition-colors mb-1">
                    {doc.title}
                  </h5>

                  <p className="text-[11px] text-[#4D5652] line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>

                  <div className="mt-2 pt-2 border-t border-[#E8D8B8]/60 flex items-center justify-between text-[10px] font-semibold text-[#24302F]">
                    <span>{doc.status}</span>
                    <span className="material-symbols-outlined text-[14px] text-[#B89A5A]">visibility</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      <AnimatePresence>
        {showDocumentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FAF7F0] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E8D8B8] shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8] mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#B89A5A] text-2xl">description</span>
                  <h4 className="font-display font-bold text-lg text-[#24302F]">
                    {showDocumentModal.title}
                  </h4>
                </div>
                <button
                  onClick={() => setShowDocumentModal(null)}
                  className="w-8 h-8 rounded-full bg-[#F3EBDD] hover:bg-[#E8D8B8] flex items-center justify-center text-[#24302F] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E8D8B8] text-xs text-[#24302F] leading-relaxed mb-4 shadow-inner space-y-3">
                <p className="font-semibold text-sm">{showDocumentModal.summary}</p>
                {showDocumentModal.details?.notes && (
                  <div className="bg-[#FAF7F0] p-3 rounded-xl border border-[#E8D8B8] font-mono text-[11px] whitespace-pre-line">
                    {showDocumentModal.details.notes}
                  </div>
                )}
                <div className="text-[10px] text-[#73787A] pt-2 border-t border-[#E8D8B8]">
                  Status: <strong>{showDocumentModal.status}</strong> &bull; Date: {showDocumentModal.date}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowDocumentModal(null)}
                  className="bg-[#24302F] text-[#FAF7F0] px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
