import React, { useState } from 'react';

interface AbhaRegistrationStepProps {
  patientName: string;
  patientId: string;
  abhaNumber: string;
  onUpdateAbha: (abha: string) => void;
  onNext: () => void;
}

export const AbhaRegistrationStep: React.FC<AbhaRegistrationStepProps> = ({
  patientName,
  patientId,
  abhaNumber,
  onUpdateAbha,
  onNext,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempAbha, setTempAbha] = useState(abhaNumber || '91-4521-8890-3412');
  const [isVerified, setIsVerified] = useState(true);

  const handleSave = () => {
    onUpdateAbha(tempAbha);
    setIsEditing(false);
    setIsVerified(true);
  };

  return (
    <div className="bg-[#FAF7F0] border border-[#E8D8B8] rounded-3xl p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8D8B8]/70">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B89A5A] bg-white px-2.5 py-1 rounded-full border border-[#E8D8B8] inline-block mb-2">
            STEP 2 OF 11 &bull; IDENTITY &amp; REGISTRATION
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#24302F]">
            ABHA / Patient Registration
          </h2>
          <p className="text-xs sm:text-sm text-[#4D5652] mt-1">
            Ayushman Bharat Digital Mission (ABDM) verification and hospital record identity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px] text-emerald-600">
              verified
            </span>
            <span>ABHA Linked</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
        {/* Card 1: ABHA Health ID Details */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8D8B8] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#24302F] text-[#D8BE88] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#24302F]">
                  ABHA Health Address
                </h4>
                <p className="text-[11px] text-[#73787A]">Digital Health Authority</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-semibold text-[#B89A5A] hover:text-[#24302F] transition-colors cursor-pointer"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-[#4D5652] block mb-1">
                  ABHA Number (14 Digits)
                </label>
                <input
                  type="text"
                  value={tempAbha}
                  onChange={(e) => setTempAbha(e.target.value)}
                  placeholder="e.g. 91-4521-8890-3412"
                  className="w-full bg-[#FAF7F0] border border-[#D8BE88] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#24302F] outline-none"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full bg-[#24302F] text-[#FAF7F0] py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Verify &amp; Update ABHA
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#FAF7F0]">
                <span className="text-[#73787A]">ABHA Number:</span>
                <strong className="font-mono text-[#24302F]">{tempAbha}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#FAF7F0]">
                <span className="text-[#73787A]">ABHA Address:</span>
                <span className="font-mono text-[#24302F]">eleanor.vance@abdm</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#73787A]">Auth Status:</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Biometric / OTP Authenticated
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Hospital Demographic Record */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8D8B8] shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F0] text-[#24302F] border border-[#E8D8B8] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#24302F]">
                Hospital Demographics
              </h4>
              <p className="text-[11px] text-[#73787A]">MediKiosk OPD Registration</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#FAF7F0]">
              <span className="text-[#73787A]">Patient Name:</span>
              <strong className="text-[#24302F]">{patientName}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#FAF7F0]">
              <span className="text-[#73787A]">Patient ID (MRN):</span>
              <strong className="font-mono text-[#B89A5A]">{patientId}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-[#FAF7F0]">
              <span className="text-[#73787A]">Age &amp; Gender:</span>
              <span className="text-[#24302F]">29 Years &bull; Female</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#73787A]">Attending Department:</span>
              <span className="text-[#24302F] font-medium">General OPD &bull; Dr. Sharma</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation & Next Action */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E8D8B8]/70">
        <div className="flex items-center gap-2 text-xs text-[#73787A]">
          <span className="material-symbols-outlined text-[16px] text-emerald-600">lock</span>
          <span>Patient identity validated against MediKiosk database.</span>
        </div>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
        >
          <span>Save &amp; Continue to Consent</span>
          <span className="material-symbols-outlined text-[16px] text-[#D8BE88]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
