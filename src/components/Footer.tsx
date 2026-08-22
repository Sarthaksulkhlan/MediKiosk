import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-10 px-6 md:px-12 bg-[#FAF7F0] border-t border-[#E8D8B8]/60 mt-auto relative z-20">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[#4D5652]">
        {/* Brand Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Logo size="sm" showText={true} />
          <span className="hidden sm:inline text-xs text-[#E8D8B8]">|</span>
          <p className="text-xs text-[#73787A] text-center sm:text-left">
            AI-powered clinical intake for faster, clearer, patient-centered care.
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-medium">
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="text-[#4D5652] hover:text-[#24302F] transition-colors"
          >
            Privacy Architecture
          </a>
          <a
            href="#consent"
            onClick={(e) => e.preventDefault()}
            className="text-[#4D5652] hover:text-[#24302F] transition-colors"
          >
            Patient Consent
          </a>
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="text-[#4D5652] hover:text-[#24302F] transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="#support"
            onClick={(e) => e.preventDefault()}
            className="text-[#4D5652] hover:text-[#B89A5A] transition-colors"
          >
            Contact Hospital Support
          </a>
        </div>
      </div>
    </footer>
  );
};
