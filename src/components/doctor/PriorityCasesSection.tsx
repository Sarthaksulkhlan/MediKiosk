import React from 'react';
import { PatientRecord, DoctorSection } from '../../types';

interface PriorityCasesSectionProps {
  patients: PatientRecord[];
  selectedPatient: PatientRecord;
  onSelectPatient: (patient: PatientRecord) => void;
  onNavigateSection: (section: DoctorSection) => void;
}

export const PriorityCasesSection: React.FC<PriorityCasesSectionProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onNavigateSection,
}) => {
  // Filter for priority / urgent cases
  const priorityPatients = patients.filter(
    (p) => p.priorityLevel === 'Urgent' || p.priorityLevel === 'Elevated' || p.isVitalsAlert
  );

  const standardPatients = patients.filter(
    (p) => p.priorityLevel !== 'Urgent' && p.priorityLevel !== 'Elevated' && !p.isVitalsAlert
  );

  const handleFastTrack = (patient: PatientRecord) => {
    onSelectPatient(patient);
    onNavigateSection('consultation');
  };

  return (
    <div id="priority-cases-section" className="space-y-6">
      {/* 1. Triage Advisory Banner */}
      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-[#FAF7F0] p-5 sm:p-6 rounded-3xl border border-rose-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-2xl">e911_emergency</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg text-rose-950">
                Clinical Priority &amp; Triage Escalations
              </h3>
              <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                {priorityPatients.length} Flags Active
              </span>
            </div>
            <p className="text-xs text-rose-900/80 mt-0.5 leading-relaxed">
              Automated algorithmic flags generated from high fever biometrics, elevated blood pressure thresholds, and Aura AI symptom severity extraction.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-semibold text-[#4D5652]">
            Triage Standard: Emergency Severity Index (ESI)
          </span>
        </div>
      </div>

      {/* 2. Priority List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {priorityPatients.map((patient) => {
          const isSelected = patient.id === selectedPatient.id;
          const isUrgent = patient.priorityLevel === 'Urgent' || patient.isVitalsAlert;

          return (
            <div
              key={patient.id}
              id={`priority-card-${patient.id}`}
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#FAF7F0] border-rose-400 ring-2 ring-rose-400/30 shadow-md'
                  : 'bg-white border-[#E8D8B8] hover:border-rose-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {patient.avatar ? (
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-rose-900 text-white flex items-center justify-center font-display font-bold text-lg flex-shrink-0">
                        {patient.name[0]}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-base text-[#24302F]">
                          {patient.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                          {isUrgent ? 'ESI Level 2 - Urgent' : 'ESI Level 3 - Elevated'}
                        </span>
                      </div>
                      <p className="text-xs text-[#73787A]">
                        {patient.age}y &bull; {patient.gender} &bull; ID: <span className="font-mono text-[#B89A5A]">{patient.patientId}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                    Wait: {patient.waitTime}
                  </span>
                </div>

                {/* Triage Reason Banner */}
                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3.5 mb-3 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-900 font-bold mb-1">
                    <span className="material-symbols-outlined text-[17px] text-rose-600">warning</span>
                    <span>Triage Trigger:</span>
                  </div>
                  <p className="text-rose-950 font-medium leading-relaxed">
                    {patient.triageReason || 'Elevated biometric parameter flagged for rapid clinical assessment.'}
                  </p>
                </div>

                {/* Vitals Highlights */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
                    <span className="text-[10px] text-[#73787A] block">Recorded Temp</span>
                    <strong className={`text-sm ${patient.vitals.temperature.includes('102') ? 'text-rose-700 font-bold' : 'text-[#24302F]'}`}>
                      {patient.vitals.temperature}
                    </strong>
                  </div>

                  <div className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
                    <span className="text-[10px] text-[#73787A] block">Blood Pressure</span>
                    <strong className={`text-sm ${patient.vitals.bloodPressure.includes('154') ? 'text-rose-700 font-bold' : 'text-[#24302F]'}`}>
                      {patient.vitals.bloodPressure}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E8D8B8]/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectPatient(patient)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#24302F] text-[#FAF7F0]'
                      : 'bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-[#24302F]'
                  }`}
                >
                  {isSelected ? 'Active Case Selected' : 'Select Patient'}
                </button>

                <button
                  onClick={() => handleFastTrack(patient)}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>Fast-Track Consult</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Stable Queue overview */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm">
        <h4 className="font-display font-bold text-base text-[#24302F] mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
          Stable Routine Cases ({standardPatients.length})
        </h4>

        <div className="space-y-2.5">
          {standardPatients.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectPatient(p)}
              className="p-3 bg-[#FAF7F0] hover:bg-[#F3EBDD] rounded-2xl border border-[#E8D8B8] flex items-center justify-between transition-colors cursor-pointer text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#24302F] text-white flex items-center justify-center font-bold text-xs">
                  {p.name[0]}
                </div>
                <div>
                  <strong className="text-[#24302F]">{p.name}</strong>
                  <span className="text-[#73787A] ml-2 font-mono">({p.patientId})</span>
                  <span className="text-[#4D5652] block text-[11px]">{p.chiefComplaint}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[#73787A]">Vitals Normal &bull; Temp: {p.vitals.temperature}</span>
                <span className="text-[#B89A5A] font-bold">Select &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
