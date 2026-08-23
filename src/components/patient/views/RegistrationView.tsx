import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PatientProfileData, PatientTab } from '../types';

interface RegistrationViewProps {
  patient: PatientProfileData;
  onUpdatePatient: (updated: Partial<PatientProfileData>) => void;
  setActiveTab: (tab: PatientTab) => void;
  onMarkStepComplete: (step: PatientTab) => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  patient,
  onUpdatePatient,
  setActiveTab,
  onMarkStepComplete,
}) => {
  const [formData, setFormData] = useState(patient);
  const [isAbhaVerified, setIsAbhaVerified] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('4829');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setShowOtpModal(false);
      setIsAbhaVerified(true);
    }, 1000);
  };

  const handleContinue = () => {
    onUpdatePatient(formData);
    onMarkStepComplete('registration');
    setActiveTab('consent');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="border-b border-[#E8D8B8]/70 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B89A5A]/15 text-[#8C6B28] text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[15px]">badge</span>
          <span>Step 1 • Healthcare Registration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24302F]">
          Create Your Healthcare Profile
        </h1>
        <p className="text-sm text-[#5D6662] mt-1">
          Register securely to access personalized healthcare services and sync with National Health Authority.
        </p>
      </div>

      {/* Main Grid: Form + ABHA Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Fields */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8D8B8]/80 shadow-xs space-y-5">
          <h3 className="font-bold text-base text-[#24302F] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B89A5A]">person_pin</span>
            <span>Patient Demographic Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#24302F] focus:outline-none focus:border-[#B89A5A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                Date of Birth *
              </label>
              <input
                type="text"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3.5 py-2.5 text-xs text-[#24302F] focus:outline-none focus:border-[#B89A5A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3.5 py-2.5 text-xs text-[#24302F] focus:outline-none focus:border-[#B89A5A]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                Mobile Number (Aadhaar linked) *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#24302F] focus:outline-none focus:border-[#B89A5A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                ABHA ID (Ayushman Bharat) *
              </label>
              <input
                type="text"
                value={formData.abhaId}
                onChange={(e) => setFormData({ ...formData, abhaId: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#8C6B28] focus:outline-none focus:border-[#B89A5A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                ABHA Address
              </label>
              <input
                type="text"
                value={formData.abhaAddress}
                onChange={(e) => setFormData({ ...formData, abhaAddress: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#24302F] focus:outline-none focus:border-[#B89A5A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                Residential Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3.5 py-2.5 text-xs text-[#24302F] focus:outline-none focus:border-[#B89A5A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-[#6B7570] mb-1">
                Emergency Contact (Name, Relation &amp; Phone) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.emergencyContact.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, name: e.target.value },
                    })
                  }
                  className="bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F]"
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, relationship: e.target.value },
                    })
                  }
                  className="bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs text-[#24302F]"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.emergencyContact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, phone: e.target.value },
                    })
                  }
                  className="bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl px-3 py-2 text-xs font-mono text-[#24302F]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: ABHA Card Preview & Verification */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1E2928] to-[#121A19] text-[#FAF7F0] border border-[#E8D8B8]/40 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[290px]">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#D8BE88]">
                    ABDM Government of India
                  </span>
                  <h4 className="text-base font-bold text-white tracking-wide">ABHA CARD</h4>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#D8BE88] text-[20px]">qr_code_2</span>
                </div>
              </div>

              <div className="space-y-1.5 my-4">
                <div className="text-sm font-bold text-white">{formData.name}</div>
                <div className="text-xs font-mono text-[#D8BE88]">{formData.abhaId}</div>
                <div className="text-[11px] text-zinc-400 font-mono">{formData.abhaAddress}</div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-white/15 text-xs text-zinc-300">
              <div className="flex items-center justify-between">
                <span>DOB: {formData.dob}</span>
                <span>Gender: {formData.gender}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Status: {isAbhaVerified ? 'Verified' : 'Pending OTP'}
                </span>
              </div>
            </div>
          </div>

          {/* ABHA Verification Actions */}
          <div className="p-5 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#4D5652]">
              ABHA Integration
            </h4>
            <p className="text-xs text-[#6B7570]">
              Verify your Ayushman Bharat Digital Health ID to automatically sync past electronic records.
            </p>

            <button
              onClick={() => setShowOtpModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FAF7F0] hover:bg-[#F3EBDD] text-[#24302F] border border-[#E8D8B8] py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-[#B89A5A]">
                verified
              </span>
              <span>{isAbhaVerified ? 'Re-Verify via Aadhaar OTP' : 'Verify ABHA ID'}</span>
            </button>
          </div>

          {/* Privacy & Security Note */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-teal-800 text-[20px] shrink-0 mt-0.5">
              lock
            </span>
            <p className="text-[11px] text-teal-900 leading-relaxed font-medium">
              <strong>Your health information is encrypted and securely stored.</strong> Health360 is fully compliant with India's Digital Personal Data Protection (DPDP) Act 2023.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8D8B8]/80 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="text-xs font-bold text-[#5D6662] hover:text-[#24302F] px-4 py-2"
        >
          ← Back to Dashboard
        </button>

        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md hover:-translate-y-0.5"
        >
          <span>Continue to Consent</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E8D8B8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8D8B8]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B89A5A]">lock_clock</span>
                <h3 className="font-bold text-base text-[#24302F]">Aadhaar OTP Verification</h3>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-[#6B7570] hover:text-[#24302F]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#5D6662]">
              A 6-digit authentication code was sent to your Aadhaar-linked mobile ending in <strong>4321</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#4D5652] mb-1">Enter 6-Digit OTP</label>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-mono font-bold bg-[#FAF7F0] border border-[#E8D8B8] rounded-xl py-3 text-[#24302F]"
                maxLength={6}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#5D6662] hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="inline-flex items-center gap-2 bg-[#24302F] text-[#FAF7F0] px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1B2423] cursor-pointer shadow-sm"
              >
                {isVerifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify &amp; Link ABHA</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
