import React, { useState } from 'react';
import { PatientRecord, PrescriptionItem } from '../../types';

interface DoctorEditSectionProps {
  patient: PatientRecord;
  onUpdatePatient: (updated: PatientRecord) => void;
  isSigned: boolean;
  onSign: () => void;
}

export const DoctorEditSection: React.FC<DoctorEditSectionProps> = ({
  patient,
  onUpdatePatient,
  isSigned,
  onSign,
}) => {
  const [diagnosis, setDiagnosis] = useState<string>(
    patient.confirmedDiagnosis || patient.chiefComplaint
  );
  const [examFindings, setExamFindings] = useState<string>(
    patient.examinationFindings ||
      'General: Alert, well oriented. Vitals stable. Systemic examination within normal limits.'
  );
  const [clinicalNotes, setClinicalNotes] = useState<string>(
    patient.clinicalNotes || 'Patient evaluated during outpatient clinic hours.'
  );
  const [followUp, setFollowUp] = useState<string>(
    patient.followUpDate || 'In 3 to 5 days SOS'
  );

  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(
    patient.prescriptions && patient.prescriptions.length > 0
      ? patient.prescriptions
      : [
          {
            id: 'rx-1',
            name: 'Paracetamol',
            dosage: '650 mg',
            frequency: 'TDS (Three times daily)',
            duration: '3 days',
            instructions: 'Take after meals for fever/pain.',
          },
        ]
  );

  // New Rx row state
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('500 mg');
  const [newMedFreq, setNewMedFreq] = useState('Twice daily after meals');
  const [newMedDuration, setNewMedDuration] = useState('5 days');
  const [newMedInstructions, setNewMedInstructions] = useState('');
  const [showAddMed, setShowAddMed] = useState(false);

  // Lab orders
  const [labOrders, setLabOrders] = useState<string[]>(
    patient.labOrders || ['Complete Blood Count (CBC)']
  );
  const [newLabInput, setNewLabInput] = useState('');

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    const newMed: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      name: newMedName,
      dosage: newMedDose,
      frequency: newMedFreq,
      duration: newMedDuration,
      instructions: newMedInstructions || 'Take as directed.',
    };

    const updatedMeds = [...prescriptions, newMed];
    setPrescriptions(updatedMeds);
    setNewMedName('');
    setNewMedInstructions('');
    setShowAddMed(false);

    onUpdatePatient({
      ...patient,
      prescriptions: updatedMeds,
      confirmedDiagnosis: diagnosis,
      examinationFindings: examFindings,
      clinicalNotes,
      followUpDate: followUp,
      labOrders,
    });
  };

  const handleDeleteMedication = (id: string) => {
    const updated = prescriptions.filter((p) => p.id !== id);
    setPrescriptions(updated);
    onUpdatePatient({
      ...patient,
      prescriptions: updated,
    });
  };

  const handleAddLab = () => {
    if (!newLabInput.trim()) return;
    const updated = [...labOrders, newLabInput.trim()];
    setLabOrders(updated);
    setNewLabInput('');
    onUpdatePatient({
      ...patient,
      labOrders: updated,
    });
  };

  const handleDeleteLab = (index: number) => {
    const updated = labOrders.filter((_, i) => i !== index);
    setLabOrders(updated);
    onUpdatePatient({
      ...patient,
      labOrders: updated,
    });
  };

  const handleSaveAll = () => {
    onUpdatePatient({
      ...patient,
      confirmedDiagnosis: diagnosis,
      examinationFindings: examFindings,
      clinicalNotes,
      followUpDate: followUp,
      prescriptions,
      labOrders,
    });
    onSign();
  };

  return (
    <div id="doctor-edit-section" className="space-y-6">
      {/* 1. Header with Signing Status */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg text-[#24302F] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B89A5A] text-xl">edit_note</span>
            Physician Prescription &amp; Clinical Orders Editor
          </h3>
          <p className="text-xs text-[#73787A]">
            Review, modify and electronically certify the diagnosis, medications, and care plan for {patient.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-save-draft"
            onClick={() => {
              onUpdatePatient({
                ...patient,
                confirmedDiagnosis: diagnosis,
                examinationFindings: examFindings,
                clinicalNotes,
                followUpDate: followUp,
                prescriptions,
                labOrders,
              });
            }}
            className="px-3.5 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-xs font-semibold text-[#24302F] cursor-pointer"
          >
            Save Draft
          </button>

          <button
            id="btn-sign-prescription"
            onClick={handleSaveAll}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isSigned
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSigned ? 'verified' : 'draw'}
            </span>
            <span>{isSigned ? 'Prescription Signed' : 'Sign & Complete EMR'}</span>
          </button>
        </div>
      </div>

      {/* 2. Diagnosis & Physical Examination Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Diagnosis Editor */}
        <div className="bg-white/95 rounded-3xl p-5 border border-[#E8D8B8] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#24302F] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-teal-700 text-[18px]">verified</span>
              Confirmed Diagnosis (ICD-11 / Clinical)
            </label>
            <span className="text-[10px] text-[#73787A]">Physician Confirmed</span>
          </div>

          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Acute Viral Pyrexia, Tension Cephalea..."
            className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3.5 py-2.5 text-xs text-[#24302F] font-bold outline-none focus:border-[#B89A5A]"
          />

          <div className="text-[11px] text-[#73787A] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#B89A5A]">info</span>
            <span>Initial AI impression: {patient.chiefComplaint}</span>
          </div>
        </div>

        {/* Physical Findings */}
        <div className="bg-white/95 rounded-3xl p-5 border border-[#E8D8B8] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#24302F] uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-blue-700 text-[18px]">stethoscope</span>
              Physical Examination Findings
            </label>
            <span className="text-[10px] text-[#73787A]">Clinical Notes</span>
          </div>

          <textarea
            rows={2}
            value={examFindings}
            onChange={(e) => setExamFindings(e.target.value)}
            placeholder="Document chest, abdomen, throat, neurological observations..."
            className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl p-3 text-xs text-[#24302F] outline-none focus:border-[#B89A5A] resize-none"
          />
        </div>
      </div>

      {/* 3. Prescription Medications Table */}
      <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#E8D8B8] shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8D8B8]/70">
          <div>
            <h4 className="font-display font-bold text-base text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg">medication</span>
              Prescribed Medications ({prescriptions.length})
            </h4>
            <p className="text-xs text-[#73787A]">
              Standardized pharmacological orders with precise dosing instructions.
            </p>
          </div>

          <button
            onClick={() => setShowAddMed(!showAddMed)}
            className="px-3 py-2 rounded-xl bg-[#FAF7F0] hover:bg-[#F3EBDD] border border-[#E8D8B8] text-xs font-bold text-[#24302F] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">add</span>
            <span>Add Medication</span>
          </button>
        </div>

        {/* Add Med Form */}
        {showAddMed && (
          <form onSubmit={handleAddMedication} className="mb-4 p-4 bg-[#FAF7F0] rounded-2xl border border-[#E8D8B8] space-y-3">
            <span className="text-xs font-bold text-[#24302F] block">Add New Medicine</span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
                placeholder="Medicine Name (e.g. Paracetamol)"
                required
                className="bg-white border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F] outline-none"
              />
              <input
                type="text"
                value={newMedDose}
                onChange={(e) => setNewMedDose(e.target.value)}
                placeholder="Dosage (e.g. 650 mg)"
                required
                className="bg-white border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F] outline-none"
              />
              <input
                type="text"
                value={newMedFreq}
                onChange={(e) => setNewMedFreq(e.target.value)}
                placeholder="Frequency (e.g. Twice daily)"
                required
                className="bg-white border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F] outline-none"
              />
              <input
                type="text"
                value={newMedDuration}
                onChange={(e) => setNewMedDuration(e.target.value)}
                placeholder="Duration (e.g. 5 days)"
                required
                className="bg-white border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F] outline-none"
              />
            </div>
            <input
              type="text"
              value={newMedInstructions}
              onChange={(e) => setNewMedInstructions(e.target.value)}
              placeholder="Instructions (e.g. Take after food with warm water, avoid alcohol)"
              className="w-full bg-white border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F] outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddMed(false)}
                className="px-3 py-1.5 text-xs text-[#73787A]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#24302F] text-white text-xs font-bold rounded-xl"
              >
                Add to Prescription
              </button>
            </div>
          </form>
        )}

        {/* Prescription items list */}
        <div className="space-y-3">
          {prescriptions.map((rx, idx) => (
            <div
              key={rx.id || idx}
              className="p-3.5 bg-[#FAF7F0] rounded-2xl border border-[#E8D8B8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-white border border-[#E8D8B8] font-bold text-[#B89A5A] flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-[#24302F]">{rx.name}</strong>
                    <span className="bg-white px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#B89A5A] border border-[#E8D8B8]">
                      {rx.dosage}
                    </span>
                    <span className="text-[#73787A]">&bull; {rx.frequency}</span>
                    <span className="text-[#73787A]">&bull; {rx.duration}</span>
                  </div>
                  <p className="text-[11px] text-[#4D5652] mt-0.5">
                    {rx.instructions}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteMedication(rx.id)}
                className="self-end sm:self-center p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                title="Remove medication"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Diagnostic Lab Orders & Follow-Up */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Lab Orders */}
        <div className="bg-white/95 rounded-3xl p-5 border border-[#E8D8B8] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-[#24302F] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">biotech</span>
              Diagnostic Lab Orders &amp; Panels
            </h4>
            <span className="text-[10px] text-[#73787A]">{labOrders.length} Ordered</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newLabInput}
              onChange={(e) => setNewLabInput(e.target.value)}
              placeholder="e.g. Serum Electrolytes, Dengue NS1 Ag..."
              className="flex-1 bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F] outline-none"
            />
            <button
              onClick={handleAddLab}
              className="px-3 py-2 bg-[#24302F] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Add
            </button>
          </div>

          <div className="space-y-1.5">
            {labOrders.map((lab, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-[#FAF7F0] p-2 rounded-xl border border-[#E8D8B8] text-xs"
              >
                <span className="text-[#24302F] font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-600 text-[15px]">science</span>
                  {lab}
                </span>
                <button
                  onClick={() => handleDeleteLab(i)}
                  className="text-rose-500 hover:text-rose-700 text-xs"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Follow up & Advice */}
        <div className="bg-white/95 rounded-3xl p-5 border border-[#E8D8B8] shadow-sm space-y-3">
          <h4 className="font-display font-bold text-sm text-[#24302F] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-purple-600 text-[18px]">event</span>
            Follow-Up &amp; General Advice
          </h4>

          <div>
            <label className="text-[10px] font-bold text-[#73787A] block mb-1">Follow-Up Schedule:</label>
            <input
              type="text"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F] outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#73787A] block mb-1">Clinical Remarks:</label>
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl p-2.5 text-xs text-[#24302F] outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
