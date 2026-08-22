import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, UserRole } from '../types';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentView: (view: AppView) => void;
  setUserRole: (role: UserRole) => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
  setCurrentView,
  setUserRole,
}) => {
  if (!isOpen) return null;

  const handleSelect = (view: AppView, role: UserRole) => {
    setUserRole(role);
    setCurrentView(view);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1B2423]/40 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg bg-[#FAF7F0] border border-[#E8D8B8] rounded-3xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(36,48,47,0.15)]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[#4D5652] hover:text-[#24302F] p-1.5 rounded-full hover:bg-[#F3EBDD] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B89A5A] block mb-1">
              Select Experience
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#24302F]">
              Experience MediKiosk
            </h2>
            <p className="text-sm text-[#4D5652] mt-1">
              Choose your perspective to explore our clinical intake ecosystem.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {/* Option 1: Patient Experience */}
            <button
              onClick={() => handleSelect('patient-dashboard', 'patient')}
              className="w-full text-left p-4 rounded-2xl bg-white/80 hover:bg-white border border-[#E8D8B8]/70 hover:border-[#B89A5A] transition-all group flex items-start gap-4 cursor-pointer shadow-xs hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F3EBDD] text-[#B89A5A] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">person</span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#24302F] group-hover:text-[#1B2423]">
                    Patient Portal
                  </h3>
                  <span className="material-symbols-outlined text-[#B89A5A] text-[18px] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
                <p className="text-xs text-[#4D5652] mt-0.5 leading-relaxed">
                  Speak symptoms via voice, upload medical records, and preview your pre-consult summary.
                </p>
              </div>
            </button>

            {/* Option 2: Doctor Portal */}
            <button
              onClick={() => handleSelect('doctor-dashboard', 'doctor')}
              className="w-full text-left p-4 rounded-2xl bg-white/80 hover:bg-white border border-[#E8D8B8]/70 hover:border-[#B89A5A] transition-all group flex items-start gap-4 cursor-pointer shadow-xs hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F3EBDD] text-[#24302F] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">stethoscope</span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#24302F] group-hover:text-[#1B2423]">
                    Doctor Portal
                  </h3>
                  <span className="material-symbols-outlined text-[#B89A5A] text-[18px] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
                <p className="text-xs text-[#4D5652] mt-0.5 leading-relaxed">
                  Review the triaged queue, inspect structured SOAP draft notes, and approve clinical addendums.
                </p>
              </div>
            </button>

            {/* Option 3: Waiting Room Kiosk */}
            <button
              onClick={() => handleSelect('kiosk-mode', 'patient')}
              className="w-full text-left p-4 rounded-2xl bg-white/80 hover:bg-white border border-[#E8D8B8]/70 hover:border-[#B89A5A] transition-all group flex items-start gap-4 cursor-pointer shadow-xs hover:shadow-md"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F3EBDD] text-[#4D5652] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">touch_app</span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#24302F] group-hover:text-[#1B2423]">
                    Waiting Room Kiosk Terminal
                  </h3>
                  <span className="material-symbols-outlined text-[#B89A5A] text-[18px] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    arrow_forward
                  </span>
                </div>
                <p className="text-xs text-[#4D5652] mt-0.5 leading-relaxed">
                  Large touch & multilingual voice terminal with simulated biometric vitals reading.
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-[#73787A] border-t border-[#E8D8B8]/50">
            <span>Already have credentials?</span>
            <button
              onClick={() => {
                setCurrentView('auth');
                onClose();
              }}
              className="text-[#24302F] font-semibold hover:text-[#B89A5A] transition-colors cursor-pointer"
            >
              Sign In to account &rarr;
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
