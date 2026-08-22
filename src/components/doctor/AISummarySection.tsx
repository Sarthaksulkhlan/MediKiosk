import React, { useState } from 'react';
import { PatientRecord, DoctorSection } from '../../types';

interface AISummarySectionProps {
  patient: PatientRecord;
  onNavigateSection: (section: DoctorSection) => void;
}

export const AISummarySection: React.FC<AISummarySectionProps> = ({
  patient,
  onNavigateSection,
}) => {
  const [activeSoapTab, setActiveSoapTab] = useState<'subjective' | 'objective' | 'assessment' | 'plan'>('subjective');
  const [copied, setCopied] = useState(false);

  const soap = patient.aiSummary.soap || {
    subjective: `${patient.name}, ${patient.age}y ${patient.gender}. Reports ${patient.chiefComplaint}. Onset: ${patient.hpi.onset}. Severity: ${patient.hpi.severity}. Associated factors: ${patient.hpi.associated}.`,
    objective: `Vitals: Temp ${patient.vitals.temperature}, BP ${patient.vitals.bloodPressure}, Pulse ${patient.vitals.heartRate}, SpO2 ${patient.vitals.oxygenSaturation}.`,
    assessment: patient.confirmedDiagnosis || `Clinical impression: ${patient.chiefComplaint} under symptomatic evaluation.`,
    plan: `Follow-up evaluation, appropriate symptomatic medication, and routine hydration support.`,
  };

  const handleCopySOAP = () => {
    const fullText = `SOAP NOTE - ${patient.name} (${patient.patientId})\n\n[SUBJECTIVE]\n${soap.subjective}\n\n[OBJECTIVE]\n${soap.objective}\n\n[ASSESSMENT]\n${soap.assessment}\n\n[PLAN]\n${soap.plan}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="ai-summary-section" className="space-y-6">
      {/* 1. Clinical AI Banner with Physician Oversight Disclaimer */}
      <div className="bg-[#FAF7F0] p-4 sm:p-5 rounded-3xl border border-[#E8D8B8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#24302F] text-[#D8BE88] flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          </div>
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-[#24302F] flex items-center gap-2">
              Aura AI Clinical SOAP Synthesis
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                {patient.aiSummary.status}
              </span>
            </h3>
            <p className="text-[11px] text-[#73787A]">
              Synthesized from multilingual voice intake, biometric sensors &amp; uploaded documents &bull; Last updated {patient.aiSummary.lastUpdated}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-copy-soap"
            onClick={handleCopySOAP}
            className="px-3 py-2 rounded-xl bg-white hover:bg-[#F3EBDD] border border-[#E8D8B8] text-xs font-semibold text-[#24302F] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#B89A5A]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'SOAP Copied!' : 'Copy SOAP'}</span>
          </button>

          <button
            id="btn-edit-from-summary"
            onClick={() => onNavigateSection('doctor-edit')}
            className="px-3.5 py-2 rounded-xl bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            <span>Edit in EMR</span>
          </button>
        </div>
      </div>

      {/* 2. Structured SOAP Card */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm">
        {/* SOAP Tabs */}
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#E8D8B8]/70 overflow-x-auto">
          {[
            { id: 'subjective', label: 'S - Subjective', icon: 'chat' },
            { id: 'objective', label: 'O - Objective', icon: 'monitoring' },
            { id: 'assessment', label: 'A - Assessment', icon: 'assignment' },
            { id: 'plan', label: 'P - Plan', icon: 'medication' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSoapTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeSoapTab === tab.id
                  ? 'bg-[#24302F] text-[#FAF7F0] shadow-xs'
                  : 'bg-[#FAF7F0] text-[#4D5652] hover:bg-[#F3EBDD] border border-[#E8D8B8]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Active SOAP Tab Content */}
        <div className="bg-[#FAF7F0]/60 p-5 rounded-2xl border border-[#E8D8B8]/70 leading-relaxed text-sm text-[#24302F]">
          {activeSoapTab === 'subjective' && (
            <div className="space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-[#B89A5A]">
                Subjective History &amp; Multilingual Intake
              </div>
              <p className="text-sm leading-relaxed">{soap.subjective}</p>
              <div className="mt-3 pt-3 border-t border-[#E8D8B8]/60 bg-white p-3 rounded-xl">
                <span className="text-[11px] font-bold text-[#73787A] block mb-1">
                  Original Intake Narrative ({patient.language}):
                </span>
                <p className="text-xs text-[#4D5652] italic font-serif leading-relaxed">
                  &ldquo;{patient.hpi.rawNarrative}&rdquo;
                </p>
              </div>
            </div>
          )}

          {activeSoapTab === 'objective' && (
            <div className="space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-[#B89A5A]">
                Objective Biometrics &amp; Clinical Signs
              </div>
              <p className="text-sm leading-relaxed">{soap.objective}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-[#E8D8B8]/60">
                <div className="bg-white p-3 rounded-xl border border-[#E8D8B8]">
                  <span className="text-[10px] text-[#73787A] block">Temp</span>
                  <span className="font-bold text-sm text-[#24302F]">{patient.vitals.temperature}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8D8B8]">
                  <span className="text-[10px] text-[#73787A] block">BP</span>
                  <span className="font-bold text-sm text-[#24302F]">{patient.vitals.bloodPressure}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8D8B8]">
                  <span className="text-[10px] text-[#73787A] block">Pulse</span>
                  <span className="font-bold text-sm text-[#24302F]">{patient.vitals.heartRate}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E8D8B8]">
                  <span className="text-[10px] text-[#73787A] block">SpO2</span>
                  <span className="font-bold text-sm text-[#24302F]">{patient.vitals.oxygenSaturation}</span>
                </div>
              </div>
            </div>
          )}

          {activeSoapTab === 'assessment' && (
            <div className="space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-[#B89A5A]">
                Differential Considerations &amp; Clinical Impression
              </div>
              <p className="text-sm leading-relaxed font-semibold">{soap.assessment}</p>
              {patient.aiSummary.differentialConsiderations && (
                <div className="mt-3 pt-3 border-t border-[#E8D8B8]/60 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#73787A] block">
                    AI Differential Considerations (Physician Verification Mandated):
                  </span>
                  {patient.aiSummary.differentialConsiderations.map((diff, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-[#E8D8B8]">
                      <span className="w-5 h-5 rounded-full bg-[#FAF7F0] text-[#B89A5A] font-bold flex items-center justify-center text-[10px] border border-[#E8D8B8]">
                        {i + 1}
                      </span>
                      <span>{diff}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSoapTab === 'plan' && (
            <div className="space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-[#B89A5A]">
                Proposed Care Protocol &amp; Diagnostic Next Steps
              </div>
              <p className="text-sm leading-relaxed">{soap.plan}</p>
              <div className="mt-3 pt-3 border-t border-[#E8D8B8]/60 flex items-center justify-between text-xs bg-white p-3 rounded-xl">
                <span className="text-[#73787A]">Ready to approve or modify in prescription editor?</span>
                <button
                  onClick={() => onNavigateSection('doctor-edit')}
                  className="text-[#B89A5A] hover:underline font-bold"
                >
                  Open Prescription Editor &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Red Flag Safety Screen */}
      <div className="bg-white/95 rounded-3xl p-5 border border-[#E8D8B8] shadow-sm">
        <h4 className="font-display font-bold text-sm text-[#24302F] mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-rose-600 text-lg">shield</span>
          Safety &amp; Red Flag Algorithmic Screening
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {patient.aiSummary.redFlags ? (
            patient.aiSummary.redFlags.map((flag, idx) => (
              <div key={idx} className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#E8D8B8] flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                <span className="text-[#24302F] font-medium">{flag}</span>
              </div>
            ))
          ) : (
            <>
              <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#E8D8B8] flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                <span className="text-[#24302F]">SpO2 Normal (&gt;98%)</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#E8D8B8] flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                <span className="text-[#24302F]">No Respiratory Distress</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#E8D8B8] flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                <span className="text-[#24302F]">Alert &amp; Oriented x3</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
