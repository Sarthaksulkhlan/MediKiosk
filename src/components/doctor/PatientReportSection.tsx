import React, { useState } from 'react';
import { PatientRecord, DoctorSection } from '../../types';

interface PatientReportSectionProps {
  patient: PatientRecord;
  onNavigateSection: (section: DoctorSection) => void;
  isSigned: boolean;
}

export const PatientReportSection: React.FC<PatientReportSectionProps> = ({
  patient,
  onNavigateSection,
  isSigned,
}) => {
  const [printSuccess, setPrintSuccess] = useState(false);

  const handlePrint = () => {
    setPrintSuccess(true);
    setTimeout(() => {
      window.print();
      setPrintSuccess(false);
    }, 300);
  };

  return (
    <div id="patient-report-section" className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#24302F] text-[#D8BE88] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D8BE88]/30">
            <span className="material-symbols-outlined text-2xl">summarize</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-[#24302F]">
                Consolidated Patient Clinical Report
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Official Physician Dossier
              </span>
            </div>
            <p className="text-xs text-[#73787A] mt-0.5">
              Comprehensive synchronized summary of intake narrative, clinical NLP, OCR documents, and doctor orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF7F0] border border-[#E8D8B8] text-xs font-bold text-[#24302F] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Print or Export Clinical Dossier"
          >
            <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">print</span>
            <span>{printSuccess ? 'Preparing Print...' : 'Print / Export Dossier'}</span>
          </button>

          <button
            onClick={() => onNavigateSection('doctor-edit')}
            className="px-3.5 py-2 rounded-xl bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#D8BE88]">edit_note</span>
            <span>Prescription by Doctor</span>
          </button>
        </div>
      </div>

      {/* 2. Patient Identity & Vitals Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A]">
            Patient Demographics &amp; Identifier
          </span>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#24302F] to-[#3A4A49] text-[#FAF7F0] flex items-center justify-center font-bold text-base shadow-inner shrink-0 border border-[#D8BE88]/40">
              {patient.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#24302F] flex items-center gap-2">
                <span>{patient.name}</span>
                <span className="text-xs font-normal text-[#73787A]">
                  ({patient.age}y &bull; {patient.gender})
                </span>
              </h3>
              <p className="text-xs font-mono text-[#5D6662] mt-0.5">
                MRN / ID: <strong>{patient.patientId}</strong> &bull; ABHA: {patient.abhaNumber || 'Not provided'}
              </p>
              <p className="text-xs text-[#73787A] mt-0.5">
                Preferred Language: <strong>{patient.language}</strong> ({patient.languageCode}) &bull; Care: {patient.carePreference || 'Modern Medicine'}
              </p>
            </div>
          </div>
        </div>

        {/* Triage & Priority */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] block">
            Triage &amp; Priority Level
          </span>
          <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#E8D8B8] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#24302F]">Priority Status:</span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  patient.priorityLevel === 'Urgent'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : patient.priorityLevel === 'Elevated'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {patient.priorityLevel || 'Standard'}
              </span>
            </div>
            <p className="text-[11px] text-[#5D6662] leading-tight">
              {patient.triageReason || 'Standard outpatient triage; stable baseline.'}
            </p>
          </div>
        </div>

        {/* Live Vitals Summary */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] block">
            Recorded Vitals
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] text-[#73787A] block">Blood Pressure</span>
              <span className="font-bold font-mono text-[#24302F]">
                {patient.vitals?.bloodPressure || 'Not provided'}
              </span>
            </div>
            <div className="p-2 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] text-[#73787A] block">Temperature</span>
              <span className="font-bold font-mono text-[#24302F]">
                {patient.vitals?.temperature || 'Not provided'}
              </span>
            </div>
            <div className="p-2 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] text-[#73787A] block">Heart Rate</span>
              <span className="font-bold font-mono text-[#24302F]">
                {patient.vitals?.heartRate || 'Not provided'}
              </span>
            </div>
            <div className="p-2 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] text-[#73787A] block">SpO₂</span>
              <span className="font-bold font-mono text-[#24302F]">
                {patient.vitals?.oxygenSaturation || 'Not provided'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Narrative Intake & Extracted Clinical NLP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient's Original Narrative & Chief Complaint */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
            <h3 className="font-display font-bold text-sm text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A] text-lg">record_voice_over</span>
              <span>Intake Narrative &amp; Chief Complaint</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#73787A] border border-[#E8D8B8]">
              Patient Stated
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block mb-1">
                Primary Complaint:
              </span>
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs font-bold text-[#24302F]">
                {patient.chiefComplaint || 'Not provided'}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block mb-1">
                Patient's Spoken / Typed Narrative:
              </span>
              <div className="p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8] text-xs text-[#3A4543] leading-relaxed font-sans italic">
                {patient.hpi?.rawNarrative || patient.clinicalNotes || 'No extended spoken intake narrative recorded.'}
              </div>
            </div>

            {/* Red Flag Screen */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A] block mb-1">
                Aura AI Red Flag Screening:
              </span>
              {patient.redFlagsDetected && patient.redFlagsDetected.length > 0 ? (
                <div className="space-y-1">
                  {patient.redFlagsDetected.map((rf, i) => (
                    <div key={i} className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-rose-600 text-[16px]">warning</span>
                      <span>{rf}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                  <span>No critical red flags triggered during automated triage.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Structured Clinical NLP Entities */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
            <h3 className="font-display font-bold text-sm text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A] text-lg">schema</span>
              <span>Extracted Clinical Parameters</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200">
              NLP Parsed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold text-[#73787A] uppercase block">Onset / Duration</span>
              <span className="font-bold text-[#24302F] mt-0.5 block">
                {patient.hpi?.onset || 'Not provided'}
              </span>
            </div>

            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold text-[#73787A] uppercase block">Severity Scale</span>
              <span className="font-bold text-[#24302F] mt-0.5 block">
                {patient.hpi?.severity || 'Not provided'}
              </span>
            </div>

            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8] col-span-2">
              <span className="text-[10px] font-bold text-[#73787A] uppercase block">Associated Symptoms</span>
              <span className="text-[#24302F] mt-0.5 block">
                {patient.hpi?.associated || 'None reported'}
              </span>
            </div>

            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8] col-span-2">
              <span className="text-[10px] font-bold text-[#73787A] uppercase block">Alleviating / Aggravating Factors</span>
              <span className="text-[#24302F] mt-0.5 block">
                {patient.hpi?.alleviating || 'None reported'}
              </span>
            </div>

            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8] col-span-2">
              <span className="text-[10px] font-bold text-[#73787A] uppercase block">Known Allergies</span>
              <span className="text-[#24302F] mt-0.5 block">
                {patient.allergies && patient.allergies.length > 0
                  ? patient.allergies.map((a) => `${a.allergen} (${a.severity})`).join(', ')
                  : 'No known drug allergies recorded'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Uploaded Medical Records & OCR Findings */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
          <h3 className="font-display font-bold text-sm text-[#24302F] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B89A5A] text-lg">folder_shared</span>
            <span>Uploaded Medical Records &amp; OCR Extractions</span>
          </h3>
          <span className="text-xs font-bold text-[#8C6B28]">
            {patient.documents?.length || 0} Document(s) on File
          </span>
        </div>

        {patient.documents && patient.documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.documents.map((doc) => (
              <div key={doc.id} className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E8D8B8] space-y-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#B89A5A] text-lg">description</span>
                    <span className="font-bold text-[#24302F]">{doc.title}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#E8D8B8] text-[#5D6662]">
                    {doc.date}
                  </span>
                </div>
                <p className="text-[#5D6662] leading-relaxed">{doc.summary}</p>
                {doc.details && (
                  <div className="p-2.5 bg-white rounded-xl border border-[#E8D8B8]/70 text-[11px] font-mono text-[#3A4543]">
                    {doc.details.testName && <div>Test: {doc.details.testName}</div>}
                    {doc.details.resultValue && <div>Value: {doc.details.resultValue}</div>}
                    {doc.details.doctor && <div>Ordering MD: {doc.details.doctor}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-dashed border-[#E8D8B8] text-center text-xs text-[#73787A]">
            No previous medical documents or scans attached to this case.
          </div>
        )}
      </div>

      {/* 5. AI Clinical Summary (SOAP) */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
          <h3 className="font-display font-bold text-sm text-[#24302F] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B89A5A] text-lg">auto_awesome</span>
            <span>AI Clinical Summary &amp; SOAP Overview</span>
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
            {patient.aiSummary?.status || 'Draft'}
          </span>
        </div>

        {patient.aiSummary?.soap ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold uppercase text-[#73787A] block mb-1">Subjective (S)</span>
              <p className="text-[#24302F] leading-relaxed">{patient.aiSummary.soap.subjective || 'Not provided'}</p>
            </div>
            <div className="p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold uppercase text-[#73787A] block mb-1">Objective (O)</span>
              <p className="text-[#24302F] leading-relaxed">{patient.aiSummary.soap.objective || 'Not provided'}</p>
            </div>
            <div className="p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold uppercase text-[#73787A] block mb-1">Assessment (A)</span>
              <p className="text-[#24302F] leading-relaxed">{patient.aiSummary.soap.assessment || 'Not provided'}</p>
            </div>
            <div className="p-3.5 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold uppercase text-[#73787A] block mb-1">Plan (P)</span>
              <p className="text-[#24302F] leading-relaxed">{patient.aiSummary.soap.plan || 'Not provided'}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8] text-xs text-[#24302F] leading-relaxed">
            {patient.aiSummary?.text || 'No AI SOAP summary generated for this case.'}
          </div>
        )}
      </div>

      {/* 6. AYUSH Integrative Profile (if applicable) */}
      {patient.ayushProfile && (
        <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
            <h3 className="font-display font-bold text-sm text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A] text-lg">spa</span>
              <span>Integrative AYUSH &amp; Prakriti Assessment</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {patient.ayushProfile.doshaDominance} Dosha
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold uppercase text-[#73787A] block">Prakriti Analysis</span>
              <p className="text-[#24302F] mt-1">{patient.ayushProfile.prakritiDetails}</p>
            </div>
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold uppercase text-[#73787A] block">Dietary Guidance (Ahara)</span>
              <ul className="list-disc list-inside text-[#24302F] mt-1 space-y-0.5">
                {patient.ayushProfile.dietaryAdvice?.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8]">
              <span className="text-[10px] font-bold uppercase text-[#73787A] block">Herbal / Vihara Support</span>
              <ul className="list-disc list-inside text-[#24302F] mt-1 space-y-0.5">
                {patient.ayushProfile.herbalSupport?.map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 7. Doctor-Confirmed Prescription & Orders */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8D8B8] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
          <h3 className="font-display font-bold text-sm text-[#24302F] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B89A5A] text-lg">medical_information</span>
            <span>Doctor Confirmed Orders &amp; Prescription</span>
          </h3>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              isSigned || patient.aiSummary?.status === 'Signed'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            {isSigned || patient.aiSummary?.status === 'Signed' ? '✓ Digitally Signed by Doctor' : 'Pending Doctor Signature'}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#73787A] block mb-1">
              Confirmed Clinical Diagnosis:
            </span>
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8] font-bold text-[#24302F]">
              {patient.confirmedDiagnosis || 'Pending physician review & diagnosis entry.'}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase text-[#73787A] block mb-1">
              Prescribed Medications:
            </span>
            {patient.prescriptions && patient.prescriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF7F0] text-[10px] font-bold uppercase text-[#73787A] border-b border-[#E8D8B8]">
                      <th className="p-2">Medication</th>
                      <th className="p-2">Dosage</th>
                      <th className="p-2">Frequency</th>
                      <th className="p-2">Duration</th>
                      <th className="p-2">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8D8B8]/60 text-xs">
                    {patient.prescriptions.map((rx) => (
                      <tr key={rx.id} className="hover:bg-[#FAF7F0]/60">
                        <td className="p-2 font-bold text-[#24302F]">{rx.name}</td>
                        <td className="p-2 font-mono text-[#5D6662]">{rx.dosage}</td>
                        <td className="p-2 text-[#5D6662]">{rx.frequency}</td>
                        <td className="p-2 text-[#5D6662]">{rx.duration}</td>
                        <td className="p-2 text-[#5D6662]">{rx.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8D8B8] text-[#73787A]">
                No medications prescribed yet. Doctor can write prescriptions under "Prescription by Doctor".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
