import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PatientProfileData, PatientTab } from '../types';

interface ProfileViewProps {
  patient?: PatientProfileData;
  onUpdatePatient: (updated: Partial<PatientProfileData>) => void;
  setActiveTab: (tab: PatientTab) => void;
}

const DEFAULT_PATIENT: PatientProfileData = {
  name: 'Eleanor Vance',
  age: 34,
  gender: 'Female',
  dob: '14 Jul 1992',
  bloodGroup: 'O+',
  phone: '+91 98765 43210',
  email: 'eleanor.vance@gmail.com',
  address: 'Bellandur, Bengaluru',
  emergencyContact: { name: 'Arthur Vance', relationship: 'Spouse', phone: '+91 98765 00112' },
  abhaId: '91-4521-8890-1204',
  abhaAddress: 'eleanor.vance@abdm',
  medicalHistory: ['Mild Bronchial Asthma (2019)', 'Seasonal Allergic Rhinitis (2021)'],
  allergies: ['Penicillin', 'Sulfa Drugs'],
  currentMedications: [
    { name: 'Tab Paracetamol', dosage: '650mg', frequency: 'PRN for fever' },
    { name: 'Inhaler Budesonide', dosage: '200mcg', frequency: 'Twice daily' },
  ],
  insurance: {
    provider: 'Star Health Comprehensive Gold',
    policyNumber: 'SH-884920',
    validity: 'Dec 2027',
  },
  assignedDoctor: {
    name: 'Dr. Rajesh Sharma, MD',
    specialty: 'Senior General Physician',
    room: 'Room 402, 2nd Floor',
    slot: '10:30 AM',
    tokenNumber: 'A-42',
  },
  preferredLanguage: 'English',
  healthcareApproach: 'allopathy',
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  patient = DEFAULT_PATIENT,
  onUpdatePatient,
  setActiveTab,
}) => {
  const safePatient = { ...DEFAULT_PATIENT, ...patient };
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(safePatient);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    onUpdatePatient(formData);
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const patientName = safePatient.name || 'Eleanor Vance';
  const initials = patientName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2) || 'EV';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Toast */}
      {saveToast && (
        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Top Profile Header Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#E8D8B8]/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#24302F] to-[#3C4E4D] text-[#FAF7F0] flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-md border-2 border-[#D8BE88]/40 shrink-0">
            {initials}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#24302F]">{patientName}</h1>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                ✓ ABDM Verified
              </span>
            </div>
            <p className="text-xs text-[#6B7570] flex items-center gap-2 flex-wrap">
              <span>DOB: <strong>{safePatient.dob}</strong> ({safePatient.age} Yrs)</span>
              <span>•</span>
              <span>Gender: <strong>{safePatient.gender}</strong></span>
              <span>•</span>
              <span>Blood Group: <strong className="text-rose-700">{safePatient.bloodGroup}</strong></span>
            </p>
            <p className="text-xs font-mono text-[#8C6B28] flex items-center gap-1.5 pt-0.5">
              <span className="material-symbols-outlined text-[14px]">badge</span>
              <span>ABHA ID: {safePatient.abhaId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setFormData(safePatient);
                  setIsEditing(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5D6662] bg-[#FAF7F0] hover:bg-[#E8D8B8]/60 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-xs font-bold text-[#FAF7F0] bg-[#24302F] hover:bg-[#1B2423] transition-all cursor-pointer shadow-sm"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 bg-[#FAF7F0] hover:bg-[#F3EBDD] text-[#24302F] border border-[#E8D8B8] px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">edit</span>
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: ABHA Card + Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* National Health Authority ABHA Card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-gradient-to-br from-[#1E2928] to-[#121A19] text-[#FAF7F0] border border-[#E8D8B8]/40 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#B89A5A]/15 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase font-extrabold tracking-widest text-[#D8BE88]">
                  National Health Authority
                </div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  AYUSHMAN BHARAT HEALTH ACCOUNT
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#D8BE88] text-[24px]">qr_code_2</span>
              </div>
            </div>

            <div className="space-y-1.5 my-5">
              <div className="text-base font-bold text-white">{safePatient.name}</div>
              <div className="text-sm font-mono text-[#D8BE88] tracking-wider">{safePatient.abhaId}</div>
              <div className="text-xs text-zinc-400 font-mono">{safePatient.abhaAddress}</div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/15 text-xs text-zinc-300">
            <div className="flex items-center justify-between">
              <span>DOB: {safePatient.dob}</span>
              <span>Gender: {safePatient.gender}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                ABDM Gateway Active
              </span>
              <span>PM-JAY Linked</span>
            </div>
          </div>
        </div>

        {/* Demographics & Contact Form */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
            <h3 className="font-bold text-base text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A]">contact_phone</span>
              <span>Personal &amp; Emergency Contact</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                Phone Number (Aadhaar linked)
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs font-mono text-[#24302F]"
                />
              ) : (
                <div className="text-xs font-semibold text-[#24302F] bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8]/60 font-mono">
                  {safePatient.phone}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F]"
                />
              ) : (
                <div className="text-xs font-semibold text-[#24302F] bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8]/60">
                  {safePatient.email}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                Residential Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F]"
                />
              ) : (
                <div className="text-xs font-semibold text-[#24302F] bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8]/60">
                  {safePatient.address}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                Emergency Contact
              </label>
              <div className="text-xs font-semibold text-[#24302F] bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8D8B8]/60 flex items-center justify-between">
                <span>
                  {safePatient.emergencyContact?.name || 'Arthur Vance'} ({safePatient.emergencyContact?.relationship || 'Spouse'})
                </span>
                <span className="font-mono text-[#8C6B28]">{safePatient.emergencyContact?.phone || '+91 98765 00112'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History, Allergies & Current Medications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chronic Conditions */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#24302F] pb-2 border-b border-[#E8D8B8]/60">
            <span className="material-symbols-outlined text-[#B89A5A]">history_edu</span>
            <h3 className="font-bold text-sm">Medical Conditions</h3>
          </div>
          <div className="space-y-2">
            {(safePatient.medicalHistory || []).map((item, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8D8B8]/60 text-xs font-medium text-[#24302F] flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89A5A]" />
                <span>{typeof item === 'string' ? item : (item as any).condition || 'Condition'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Known Allergies */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#24302F] pb-2 border-b border-[#E8D8B8]/60">
            <span className="material-symbols-outlined text-rose-600">warning</span>
            <h3 className="font-bold text-sm">Known Allergies</h3>
          </div>
          <div className="space-y-2">
            {(safePatient.allergies || []).map((item, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-900 flex items-center justify-between"
              >
                <span>{item}</span>
                <span className="text-[10px] uppercase font-bold text-rose-700 bg-white px-2 py-0.5 rounded-full">
                  Severe
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Medications */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-[#24302F] pb-2 border-b border-[#E8D8B8]/60">
            <span className="material-symbols-outlined text-teal-600">pill</span>
            <h3 className="font-bold text-sm">Current Medications</h3>
          </div>
          <div className="space-y-2">
            {(safePatient.currentMedications || []).map((item, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8D8B8]/60 text-xs text-[#24302F]"
              >
                <div className="font-bold">{item.name}</div>
                <div className="text-[11px] text-[#6B7570]">
                  {item.dosage} • {item.frequency}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
