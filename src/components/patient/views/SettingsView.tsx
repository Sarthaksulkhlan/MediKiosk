import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PatientProfileData, ConsentSettings } from '../types';

interface SettingsViewProps {
  patient: PatientProfileData;
  consentSettings: ConsentSettings;
  onUpdateConsent: (updated: ConsentSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  patient,
  consentSettings,
  onUpdateConsent,
}) => {
  const [notifications, setNotifications] = useState({
    sms: true,
    whatsapp: true,
    email: false,
    emergencyAlerts: true,
  });

  const [toast, setToast] = useState(false);

  const handleSave = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24302F]">Portal Settings</h1>
        <p className="text-sm text-[#5D6662] mt-1">
          Manage your account preferences, ABDM digital health lockers, notifications, and security.
        </p>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Preferences saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8D8B8]/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#24302F] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B89A5A]">notifications</span>
            <span>Notifications &amp; Alerts</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/60 cursor-pointer">
              <div>
                <div className="font-bold text-[#24302F]">WhatsApp OPD Updates</div>
                <div className="text-[11px] text-[#6B7570]">Receive token queue status &amp; digital Rx on WhatsApp</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.whatsapp}
                onChange={(e) => setNotifications({ ...notifications, whatsapp: e.target.checked })}
                className="w-4 h-4 text-[#24302F] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/60 cursor-pointer">
              <div>
                <div className="font-bold text-[#24302F]">SMS Reminders</div>
                <div className="text-[11px] text-[#6B7570]">Standard SMS alerts to {patient.phone}</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                className="w-4 h-4 text-[#24302F] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/60 cursor-pointer">
              <div>
                <div className="font-bold text-[#24302F]">Critical Triage Alerts</div>
                <div className="text-[11px] text-[#6B7570]">Immediate push notification for high-risk red flags</div>
              </div>
              <input
                type="checkbox"
                checked={notifications.emergencyAlerts}
                onChange={(e) => setNotifications({ ...notifications, emergencyAlerts: e.target.checked })}
                className="w-4 h-4 text-[#24302F] rounded"
              />
            </label>
          </div>
        </div>

        {/* Data & ABDM Security */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8D8B8]/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[#24302F] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B89A5A]">security</span>
              <span>Data &amp; ABDM Security</span>
            </h3>

            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8D8B8]/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7570]">Linked ABHA:</span>
                <span className="font-mono font-bold text-[#24302F]">{patient.abhaId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7570]">Consent State:</span>
                <span className="font-bold text-emerald-700">DPDP 2023 Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7570]">Data Locker:</span>
                <span className="font-bold text-[#24302F]">256-Bit Encrypted</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-2xl bg-[#24302F] text-[#FAF7F0] text-xs font-bold hover:bg-[#1B2423] cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
