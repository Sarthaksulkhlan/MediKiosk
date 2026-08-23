import React, { useState } from 'react';
import { motion } from 'motion/react';

export const HelpView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the Aura AI Voice Intake help my consultation?',
      a: 'Aura AI listens to your symptoms in your preferred language and formats them into a structured medical draft for your attending doctor. This saves consultation time and ensures all symptoms are clearly communicated.',
    },
    {
      q: 'What is an ABHA ID and why is it linked?',
      a: 'ABHA (Ayushman Bharat Health Account) is a 14-digit national health ID provided by the Government of India that allows seamless digital access to your medical records across hospitals.',
    },
    {
      q: 'Is my voice data and medical history kept private?',
      a: 'Yes, your data is strictly encrypted and protected under India’s Digital Personal Data Protection (DPDP) Act 2023. It is only shared with authorized medical staff assigned to your care.',
    },
    {
      q: 'What if I have an urgent emergency while filling the intake?',
      a: 'You can immediately click the "Emergency Help" button or dial 108 for ambulance services. Health360 will instantly flag your chart for urgent nursing intervention.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="border-b border-[#E8D8B8]/70 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24302F]">Help &amp; Support</h1>
        <p className="text-sm text-[#5D6662] mt-1">
          Emergency helplines, hospital assistance desks, and frequently asked questions.
        </p>
      </div>

      {/* Emergency Helpline Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="material-symbols-outlined text-rose-700">emergency</span>
            <span>Ambulance Service</span>
          </div>
          <div className="font-mono text-2xl font-extrabold text-rose-700">108</div>
          <p className="text-[11px] text-rose-800">24/7 National Free Ambulance</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#FAF7F0] border border-[#E8D8B8] text-[#24302F] space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="material-symbols-outlined text-[#8C6B28]">local_police</span>
            <span>National Emergency</span>
          </div>
          <div className="font-mono text-2xl font-extrabold text-[#24302F]">112</div>
          <p className="text-[11px] text-[#6B7570]">Pan-India Unified Emergency Helpline</p>
        </div>

        <div className="p-5 rounded-3xl bg-teal-50 border border-teal-200 text-teal-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="material-symbols-outlined text-teal-700">support_agent</span>
            <span>Tele-MANAS Support</span>
          </div>
          <div className="font-mono text-2xl font-extrabold text-teal-800">14416</div>
          <p className="text-[11px] text-teal-900">National Mental Health Counseling</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white p-6 rounded-3xl border border-[#E8D8B8]/80 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#24302F] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#B89A5A]">help_outline</span>
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#E8D8B8]/70 overflow-hidden bg-[#FAF7F0]"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[#24302F] flex items-center justify-between cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="material-symbols-outlined text-[#7B8580]">
                  {openFaq === idx ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-[#5D6662] leading-relaxed border-t border-[#E8D8B8]/50 pt-2 bg-white">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
