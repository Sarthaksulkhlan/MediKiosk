import React from 'react';
import { PatientRecord, DoctorSection } from '../../types';

interface PatientHeaderStripProps {
  patient: PatientRecord;
  isSigned: boolean;
  onSign: () => void;
  onNavigateSection: (section: DoctorSection) => void;
}

export const PatientHeaderStrip: React.FC<PatientHeaderStripProps> = ({
  patient,
  isSigned,
  onSign,
  onNavigateSection,
}) => {
  const isUrgent = patient.priorityLevel === 'Urgent' || patient.isVitalsAlert;

  return (
    <div
      id="patient-active-header"
      className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-[#E8D8B8] shadow-sm mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Patient Identity and Badges */}
        <div className="flex items-center gap-4 min-w-0">
          {patient.avatar ? (
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-[#E8D8B8] flex-shrink-0 shadow-xs"
            />
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#24302F] text-[#FAF7F0] flex items-center justify-center font-display font-bold text-xl flex-shrink-0 shadow-xs">
              {patient.name[0]}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#24302F] truncate">
                {patient.name}
              </h2>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isUrgent
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : patient.priorityLevel === 'Elevated'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-[#F3EBDD] text-[#4D5652] border-[#E8D8B8]'
                }`}
              >
                {patient.priorityLevel || (isUrgent ? 'Urgent Priority' : 'Standard')}
              </span>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#24302F] border border-[#E8D8B8] flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-[#B89A5A]">translate</span>
                {patient.language} ({patient.languageCode})
              </span>

              {isSigned && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  EMR Signed
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#4D5652]">
              <span>
                <strong>Age:</strong> {patient.age}y &bull; <strong>Gender:</strong> {patient.gender}
              </span>
              <span className="text-[#73787A]">&bull;</span>
              <span>
                <strong>ID:</strong> <code className="font-mono text-[#B89A5A] font-bold">{patient.patientId}</code>
              </span>
              <span className="text-[#73787A]">&bull;</span>
              <span className="truncate max-w-[280px]">
                <strong>Complaint:</strong> <span className="text-[#24302F] font-semibold">{patient.chiefComplaint}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            id="btn-goto-consult"
            onClick={() => onNavigateSection('consultation')}
            className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-[#24302F] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">medical_services</span>
            <span>Start Consult</span>
          </button>

          <button
            id="btn-goto-edit"
            onClick={() => onNavigateSection('doctor-edit')}
            className="px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-[#24302F] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">edit_note</span>
            <span>Edit Prescription</span>
          </button>

          <button
            id="btn-sign-complete-strip"
            onClick={onSign}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isSigned
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSigned ? 'check_circle' : 'draw'}
            </span>
            <span>{isSigned ? 'Consultation Signed' : 'Sign & Complete'}</span>
          </button>
        </div>
      </div>

      {/* Biometric Vitals Strip */}
      <div className="mt-4 pt-3 border-t border-[#E8D8B8]/70 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-500 text-[18px]">thermostat</span>
            <div>
              <span className="text-[10px] text-[#73787A] block">Temperature</span>
              <span className="font-bold text-[#24302F]">{patient.vitals.temperature}</span>
            </div>
          </div>
          {patient.vitals.temperature.includes('102') && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">High</span>
          )}
        </div>

        <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[18px]">cardiology</span>
            <div>
              <span className="text-[10px] text-[#73787A] block">Blood Pressure</span>
              <span className="font-bold text-[#24302F]">{patient.vitals.bloodPressure}</span>
            </div>
          </div>
          {patient.vitals.bloodPressure.includes('154') && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Alert</span>
          )}
        </div>

        <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">favorite</span>
            <div>
              <span className="text-[10px] text-[#73787A] block">Heart Rate</span>
              <span className="font-bold text-[#24302F]">{patient.vitals.heartRate}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-600 text-[18px]">air</span>
            <div>
              <span className="text-[10px] text-[#73787A] block">SpO₂ Oxygen</span>
              <span className="font-bold text-[#24302F]">{patient.vitals.oxygenSaturation}</span>
            </div>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Optimal</span>
        </div>
      </div>
    </div>
  );
};
