import React, { useState } from 'react';
import { PatientRecord } from '../../types';

interface PatientQueueSectionProps {
  patients: PatientRecord[];
  selectedPatient: PatientRecord;
  onSelectPatient: (patient: PatientRecord) => void;
  signedMap: Record<string, boolean>;
}

export const PatientQueueSection: React.FC<PatientQueueSectionProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  signedMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [langFilter, setLangFilter] = useState<'ALL' | 'EN' | 'HI'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'SIGNED'>('ALL');

  const filteredPatients = patients.filter((patient) => {
    const isSigned = signedMap[patient.id] || patient.aiSummary.status === 'Signed';
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = langFilter === 'ALL' || patient.languageCode === langFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && !isSigned) ||
      (statusFilter === 'SIGNED' && isSigned);

    return matchesSearch && matchesLang && matchesStatus;
  });

  const pendingCount = patients.filter(
    (p) => !signedMap[p.id] && p.aiSummary.status !== 'Signed'
  ).length;
  const signedCount = patients.filter(
    (p) => signedMap[p.id] || p.aiSummary.status === 'Signed'
  ).length;
  const hiCount = patients.filter((p) => p.languageCode === 'HI').length;

  return (
    <div id="patient-queue-section" className="space-y-6">
      {/* 1. Top Queue Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="bg-white/90 p-4 rounded-2xl border border-[#E8D8B8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#73787A] mb-1">
            <span>Total Checked-in</span>
            <span className="material-symbols-outlined text-[#B89A5A] text-[18px]">groups</span>
          </div>
          <div className="text-2xl font-bold text-[#24302F] font-display">{patients.length}</div>
          <span className="text-[10px] text-[#4D5652]">Real-time EMR synced</span>
        </div>

        <div className="bg-white/90 p-4 rounded-2xl border border-[#E8D8B8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-amber-700 mb-1">
            <span>Awaiting Consult</span>
            <span className="material-symbols-outlined text-amber-600 text-[18px]">hourglass_top</span>
          </div>
          <div className="text-2xl font-bold text-amber-900 font-display">{pendingCount}</div>
          <span className="text-[10px] text-[#73787A]">Ready for physician review</span>
        </div>

        <div className="bg-white/90 p-4 rounded-2xl border border-[#E8D8B8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-emerald-700 mb-1">
            <span>Consult Completed</span>
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900 font-display">{signedCount}</div>
          <span className="text-[10px] text-[#73787A]">Prescriptions signed today</span>
        </div>

        <div className="bg-white/90 p-4 rounded-2xl border border-[#E8D8B8] shadow-xs">
          <div className="flex items-center justify-between text-xs text-blue-700 mb-1">
            <span>Multilingual Intakes</span>
            <span className="material-symbols-outlined text-blue-600 text-[18px]">translate</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 font-display">{hiCount} Hindi</div>
          <span className="text-[10px] text-[#73787A]">Auto-translated into English SOAP</span>
        </div>
      </div>

      {/* 2. Main Patient Table & Filters */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#E8D8B8]/70">
          <div>
            <h3 className="font-display font-bold text-lg text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A] text-xl">view_list</span>
              Patient Triage Queue
            </h3>
            <p className="text-xs text-[#73787A]">
              Live synchronized intake stream from Patient Portal check-ins &amp; Waiting Room Kiosk pods.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[240px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#73787A]">
                search
              </span>
              <input
                id="search-patient-queue"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, ID, or symptom..."
                className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl pl-9 pr-3 py-2 text-xs text-[#24302F] outline-none focus:border-[#B89A5A]"
              />
            </div>

            {/* Language filter */}
            <div className="flex items-center bg-[#FAF7F0] p-1 rounded-xl border border-[#E8D8B8] text-xs">
              {(['ALL', 'EN', 'HI'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLangFilter(l)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    langFilter === l
                      ? 'bg-[#24302F] text-[#FAF7F0]'
                      : 'text-[#4D5652] hover:bg-[#F3EBDD]'
                  }`}
                >
                  {l === 'ALL' ? 'All Lang' : l}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex items-center bg-[#FAF7F0] p-1 rounded-xl border border-[#E8D8B8] text-xs">
              {(['ALL', 'PENDING', 'SIGNED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    statusFilter === s
                      ? 'bg-[#24302F] text-[#FAF7F0]'
                      : 'text-[#4D5652] hover:bg-[#F3EBDD]'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s === 'PENDING' ? 'Waiting' : 'Signed'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Patients Grid / List */}
        {filteredPatients.length === 0 ? (
          <div className="py-12 text-center text-[#73787A]">
            <span className="material-symbols-outlined text-4xl text-[#B89A5A] mb-2 block">
              person_search
            </span>
            <p className="font-semibold text-sm text-[#24302F]">No patients found</p>
            <p className="text-xs">No active cases match the current filter or search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredPatients.map((patient) => {
              const isSelected = patient.id === selectedPatient.id;
              const isSigned = signedMap[patient.id] || patient.aiSummary.status === 'Signed';
              const isUrgent = patient.priorityLevel === 'Urgent' || patient.isVitalsAlert;

              return (
                <div
                  key={patient.id}
                  id={`queue-card-${patient.id}`}
                  onClick={() => onSelectPatient(patient)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FAF7F0] border-[#B89A5A] ring-2 ring-[#B89A5A]/30 shadow-md'
                      : 'bg-white border-[#E8D8B8] hover:border-[#B89A5A]/70 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={patient.name}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#E8D8B8] flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#24302F] text-white flex items-center justify-center font-display font-bold text-base flex-shrink-0">
                            {patient.name[0]}
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-bold text-sm text-[#24302F]">
                              {patient.name}
                            </h4>
                            {isSelected && (
                              <span className="bg-[#B89A5A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#73787A]">
                            {patient.age}y &bull; {patient.gender} &bull; <span className="font-mono text-[#B89A5A]">{patient.patientId}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSigned
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : isUrgent
                              ? 'bg-rose-100 text-rose-900 border border-rose-300 font-bold animate-pulse'
                              : 'bg-[#F3EBDD] text-[#4D5652] border border-[#E8D8B8]'
                          }`}
                        >
                          {isSigned ? 'Signed' : isUrgent ? 'Urgent Triage' : patient.vitalsStatus}
                        </span>
                        <span className="text-[10px] text-[#73787A]">Wait: {patient.waitTime}</span>
                      </div>
                    </div>

                    <div className="bg-[#FAF7F0]/80 p-2.5 rounded-xl border border-[#E8D8B8]/60 mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#24302F] truncate max-w-[220px]">
                          {patient.chiefComplaint}
                        </span>
                        <span className="text-[11px] text-[#73787A] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-[#B89A5A]">translate</span>
                          {patient.language}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4D5652] line-clamp-2 leading-relaxed italic">
                        &ldquo;{patient.hpi.rawNarrative}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8D8B8]/50 flex items-center justify-between text-[11px]">
                    <span className="text-[#73787A]">
                      Temp: <strong>{patient.vitals.temperature}</strong> &bull; BP: <strong>{patient.vitals.bloodPressure}</strong>
                    </span>
                    <span className="text-[#B89A5A] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      {isSelected ? 'Reviewing' : 'Select Case'} &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
