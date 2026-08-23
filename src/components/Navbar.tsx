import React from 'react';
import { Logo } from './Logo';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onOpenGetStartedModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenGetStartedModal,
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#FAF7F0]/90 backdrop-blur-md border-b border-[#E8D8B8]/60 transition-all duration-300 shadow-[0_2px_16px_rgba(36,48,47,0.03)]">
      <div className="max-w-[1280px] mx-auto h-20 px-6 md:px-10 flex items-center justify-between">
        {/* Left: Brand Logo + Wordmark */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center text-left focus:outline-none group cursor-pointer"
          aria-label="Health360 Home"
        >
          <Logo size="md" textColor="text-[#24302F]" />
        </button>

        {/* Right: Sign In & Get Started CTA */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={() => setCurrentView('auth')}
            className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
              currentView === 'auth'
                ? 'text-[#B89A5A] font-semibold'
                : 'text-[#4D5652] hover:text-[#24302F]'
            }`}
          >
            Sign In
          </button>

          <button
            onClick={onOpenGetStartedModal}
            className="group relative inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-[0_4px_16px_rgba(36,48,47,0.15)] hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
          >
            <span>Get Started</span>
            <span className="material-symbols-outlined text-[16px] text-[#D8BE88] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};


