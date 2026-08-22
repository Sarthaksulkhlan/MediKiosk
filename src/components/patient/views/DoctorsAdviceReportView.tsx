import React, { useState } from 'react';
import { PatientProfileData } from '../types';
import { PatientRecord } from '../../../types';

interface DoctorsAdviceReportViewProps {
  patientProfile: PatientProfileData;
  activePatientRecord?: PatientRecord;
  onNavigateTab: (tab: any) => void;
}

export const DoctorsAdviceReportView: React.FC<DoctorsAdviceReportViewProps> = ({
  patientProfile,
  activePatientRecord,
  onNavigateTab,
}) => {
  const [printSuccess, setPrintSuccess] = useState(false);

  // Determine if doctor has signed or confirmed diagnosis/prescription
  const isConsultationCompleted =
    activePatientRecord?.aiSummary?.status === 'Signed' ||
    (activePatientRecord?.prescriptions && activePatientRecord.prescriptions.length > 0) ||
    Boolean(activePatientRecord?.confirmedDiagnosis);

  const handlePrint = () => {
    setPrintSuccess(true);
    setTimeout(() => {
      window.print();
      setPrintSuccess(false);
    }, 300);
  };

  return (
    <div id="doctors-advice-report-view" className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#24302F] text-[#D8BE88] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D8BE88]/30">
            <span className="material-symbols-outlined text-2xl">stars</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-[#24302F]">
                Doctor's Advice &amp; Official Prescription Report
              </h2>
              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  isConsultationCompleted
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {isConsultationCompleted ? 'Official Clinical Advice' : 'Awaiting Physician'}
              </span>
            </div>
            <p className="text-xs text-[#73787A] mt-0.5">
              Verified clinical findings, prescription orders, and follow-up guidance from your physician.
            </p>
          </div>
        </div>

        {isConsultationCompleted && (
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#D8BE88]">print</span>
            <span>{printSuccess ? 'Printing...' : 'Download / Print PDF'}</span>
          </button>
        )}
      </div>

      {!isConsultationCompleted ? (
        /* State when Doctor has not yet signed/finalized consultation */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8D8B8] text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#FAF7F0] text-[#B89A5A] border border-[#E8D8B8] flex items-center justify-center mx-auto shadow-inner">
            <span className="material-symbols-outlined text-3xl">hourglass_empty</span>
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <h3 className="font-display font-bold text-xl text-[#24302F]">
              No doctor's report available yet
            </h3>
            <p className="text-xs sm:text-sm text-[#5D6662] leading-relaxed">
              Your intake information and triage assessment have been successfully synchronized with the physician's EMR workspace. Once <strong>{patientProfile.assignedDoctor.name}</strong> conducts your clinical consultation and digitally certifies your prescription, your official advice report will appear right here.
            </p>
          </div>

          {/* OPD Token card */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8] text-left text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#24302F] text-[#FAF7F0] flex items-center justify-center font-mono font-bold text-sm">
                {patientProfile.assignedDoctor.tokenNumber}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#73787A] block">Assigned Physician</span>
                <span className="font-bold text-[#24302F]">{patientProfile.assignedDoctor.name}</span>
                <span className="text-[11px] text-[#5D6662] block">{patientProfile.assignedDoctor.room}</span>
              </div>
            </div>
            <div className="sm:border-l sm:border-[#E8D8B8] sm:pl-4">
              <span className="text-[10px] font-bold uppercase text-[#73787A] block">Current Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                In Consultation Queue
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="px-4 py-2 bg-white hover:bg-[#FAF7F0] border border-[#E8D8B8] text-[#24302F] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Back to Patient Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* State when Doctor consultation is signed/completed */
        <div className="space-y-6">
          {/* Official Doctor Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8D8B8]/60 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  <span className="material-symbols-outlined text-2xl">verified</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#24302F]">
                    {patientProfile.assignedDoctor.name || 'Dr. Rajesh Sharma, MD'}
                  </h3>
                  <p className="text-xs text-[#73787A]">
                    {patientProfile.assignedDoctor.specialty || 'Senior Internal Medicine Specialist'} &bull; Reg: MCI-984210
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block">
                  Consultation Completed
                </span>
                <span className="text-xs font-mono font-bold text-[#24302F]">
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} &bull; OPD Desk 3A
                </span>
              </div>
            </div>

            {/* Confirmed Diagnosis */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Official Clinical Diagnosis:
              </span>
              <p className="text-sm font-bold text-emerald-950 font-display">
                {activePatientRecord?.confirmedDiagnosis || 'Acute Upper Respiratory Tract Infection (Provisional) with Mild Reactive Bronchospasm'}
              </p>
            </div>
          </div>

          {/* Prescribed Medications */}
          <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
              <h3 className="font-display font-bold text-sm text-[#24302F] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B89A5A] text-lg">medication</span>
                <span>Doctor Prescribed Medications (Rx)</span>
              </h3>
              <span className="text-xs font-bold text-[#8C6B28]">
                {activePatientRecord?.prescriptions?.length || 0} Item(s) Prescribed
              </span>
            </div>

            {activePatientRecord?.prescriptions && activePatientRecord.prescriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF7F0] text-[10px] font-bold uppercase text-[#73787A] border-b border-[#E8D8B8]">
                      <th className="p-3">Medication Name</th>
                      <th className="p-3">Strength / Dose</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Special Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8D8B8]/60 text-xs">
                    {activePatientRecord.prescriptions.map((rx) => (
                      <tr key={rx.id} className="hover:bg-[#FAF7F0]/60">
                        <td className="p-3 font-bold text-[#24302F]">{rx.name}</td>
                        <td className="p-3 font-mono text-[#5D6662]">{rx.dosage}</td>
                        <td className="p-3 text-[#24302F]">{rx.frequency}</td>
                        <td className="p-3 text-[#5D6662]">{rx.duration}</td>
                        <td className="p-3 text-[#5D6662] italic">{rx.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E8D8B8] text-xs text-[#5D6662]">
                Supportive therapy and oral hydration advised. No antibiotic intervention indicated at present.
              </div>
            )}
          </div>

          {/* Dietary & Lifestyle Care Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm space-y-3 text-xs">
              <h3 className="font-display font-bold text-sm text-[#24302F] flex items-center gap-2 pb-2 border-b border-[#E8D8B8]/60">
                <span className="material-symbols-outlined text-[#B89A5A] text-lg">restaurant</span>
                <span>Dietary &amp; Hydration Guidance</span>
              </h3>
              <ul className="space-y-2 text-[#3A4543] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0">check_circle</span>
                  <span>Maintain high warm fluid intake: warm water, herbal teas, or clear broths.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0">check_circle</span>
                  <span>Avoid refrigerated beverages, excessive oily foods, and dairy triggers during active congestion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0">check_circle</span>
                  <span>Steam inhalation twice daily for 5-7 minutes for symptomatic nasal decongestion.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm space-y-3 text-xs">
              <h3 className="font-display font-bold text-sm text-[#24302F] flex items-center gap-2 pb-2 border-b border-[#E8D8B8]/60">
                <span className="material-symbols-outlined text-rose-600 text-lg">warning</span>
                <span>When to Seek Immediate / SOS Care</span>
              </h3>
              <ul className="space-y-2 text-[#3A4543] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-rose-600 text-[16px] shrink-0">emergency</span>
                  <span>High fever exceeding 102°F that does not respond to paracetamol.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-rose-600 text-[16px] shrink-0">emergency</span>
                  <span>Shortness of breath, chest tightness, or oxygen saturation dropping below 95%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-rose-600 text-[16px] shrink-0">emergency</span>
                  <span>Follow-up review recommended in 5-7 days if symptoms persist.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Digital Signature & ABHA PHR sync */}
          <div className="bg-[#FAF7F0] rounded-3xl p-5 border border-[#E8D8B8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-700 text-2xl">verified_user</span>
              <div>
                <span className="font-bold text-[#24302F] block">Digitally Signed &amp; Synced to ABDM PHR</span>
                <span className="text-[#73787A]">ABHA ID: {patientProfile.abhaId} &bull; E-Sign Ref: ES-2026-9842</span>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white hover:bg-[#FAF7F0] border border-[#E8D8B8] text-[#24302F] font-bold rounded-xl transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
            >
              Print Official Prescription
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
