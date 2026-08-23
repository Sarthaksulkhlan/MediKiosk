import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AppView, UserRole } from '../types';
import { Logo } from './Logo';
import { AmbientShader } from './AmbientShader';

interface AuthScreenProps {
  setCurrentView: (view: AppView) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  setCurrentView,
  userRole,
  setUserRole,
}) => {
  const [selectedRole, setSelectedRole] = useState<'patient' | 'doctor' | 'staff'>(
    userRole === 'doctor' ? 'doctor' : 'patient'
  );
  const [email, setEmail] = useState(
    userRole === 'doctor' ? 'dr.sharma@health360.health' : 'patient@example.com'
  );
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (role: 'patient' | 'doctor' | 'staff') => {
    setSelectedRole(role);
    if (role === 'doctor') {
      setEmail('dr.sharma@health360.health');
    } else if (role === 'staff') {
      setEmail('staff.triage@health360.health');
    } else {
      setEmail('patient@example.com');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUserRole(selectedRole);
      if (selectedRole === 'doctor') {
        setCurrentView('doctor-dashboard');
      } else if (selectedRole === 'staff') {
        setCurrentView('kiosk-mode');
      } else {
        setCurrentView('patient-dashboard');
      }
    }, 450);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setUserRole(selectedRole);
      if (selectedRole === 'doctor') {
        setCurrentView('doctor-dashboard');
      } else {
        setCurrentView('patient-dashboard');
      }
    }, 450);
  };

  return (
    <main className="flex-grow flex flex-col md:flex-row min-h-screen pt-20 bg-[#FAF7F0]">
      {/* Left Split: Ambient Healthcare Space & Editorial Statement */}
      <div className="hidden md:flex w-1/2 relative bg-[#F3EBDD] overflow-hidden items-end justify-start p-12 lg:p-16 border-r border-[#E8D8B8]">
        {/* Warm Subtle Ambient Shader */}
        <div className="absolute inset-0 w-full h-full z-10 opacity-70">
          <AmbientShader opacity={0.6} />
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 max-w-lg mb-6">
          <div className="mb-8">
            <Logo size="lg" showText={true} />
          </div>

          <h1 className="font-display text-4xl lg:text-[44px] font-bold text-[#24302F] mb-4 leading-tight">
            Healthcare begins <br />
            with listening.
          </h1>

          <p className="text-base text-[#4D5652] leading-relaxed">
            Access your patient portal, review synthesized clinical drafts, and connect with your care team in
            a calm, secure environment.
          </p>
        </div>

        {/* System Status Pill */}
        <div className="absolute top-10 right-10 z-20 bg-white/80 backdrop-blur-md border border-[#E8D8B8] rounded-2xl p-4 shadow-xs max-w-[240px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#B89A5A] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#73787A]">
              System Status
            </span>
          </div>
          <p className="text-xs text-[#24302F] font-medium leading-tight">
            All clinical intake services operational. End-to-end encrypted.
          </p>
        </div>
      </div>

      {/* Right Split: Glass/Cream Authentication Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 bg-[#FAF7F0] relative z-30">
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[460px]"
        >
          {/* Mobile Logo Header */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-8">
            <Logo size="md" showText={true} />
          </div>

          <div className="mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B89A5A] block mb-1">
              Portal Authentication
            </span>
            <h2 className="font-display text-3xl font-bold text-[#24302F] mb-1">
              Welcome back.
            </h2>
            <p className="text-sm text-[#4D5652]">Sign in to access your clinical workspace.</p>
          </div>

          {/* Role Selection Toggle */}
          <div className="bg-[#F3EBDD] border border-[#E8D8B8] p-1 rounded-2xl flex items-center justify-between mb-6 shadow-xs">
            <button
              type="button"
              onClick={() => handleRoleChange('patient')}
              className={`flex-1 py-2 text-center rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                selectedRole === 'patient'
                  ? 'bg-white text-[#24302F] shadow-xs border border-[#E8D8B8]'
                  : 'text-[#4D5652] hover:text-[#24302F]'
              }`}
            >
              Patient
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('doctor')}
              className={`flex-1 py-2 text-center rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                selectedRole === 'doctor'
                  ? 'bg-white text-[#24302F] shadow-xs border border-[#E8D8B8]'
                  : 'text-[#4D5652] hover:text-[#24302F]'
              }`}
            >
              Doctor
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('staff')}
              className={`flex-1 py-2 text-center rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                selectedRole === 'staff'
                  ? 'bg-white text-[#24302F] shadow-xs border border-[#E8D8B8]'
                  : 'text-[#4D5652] hover:text-[#24302F]'
              }`}
            >
              Kiosk Station
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#24302F]" htmlFor="email">
                Email Address or Medical ID
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#73787A] text-[18px]">
                  person
                </span>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@example.com"
                  className="w-full bg-white border border-[#E8D8B8] focus:border-[#B89A5A] focus:ring-1 focus:ring-[#B89A5A] rounded-xl py-3 pl-11 pr-4 text-sm text-[#24302F] placeholder:text-[#73787A] transition-colors outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#24302F]" htmlFor="password">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs text-[#B89A5A] hover:text-[#24302F] transition-colors font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#73787A] text-[18px]">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#E8D8B8] focus:border-[#B89A5A] focus:ring-1 focus:ring-[#B89A5A] rounded-xl py-3 pl-11 pr-11 text-sm text-[#24302F] placeholder:text-[#73787A] transition-colors outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#73787A] hover:text-[#24302F] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#E8D8B8] text-[#24302F] focus:ring-[#B89A5A] cursor-pointer"
                />
                <span className="text-xs text-[#4D5652]">
                  Remember me for 30 days
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] font-medium text-sm py-3.5 rounded-full transition-all flex justify-center items-center gap-2 shadow-sm hover:shadow cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined text-[16px] text-[#D8BE88]">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[#E8D8B8]"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] font-bold uppercase tracking-widest text-[#73787A]">
                  OR
                </span>
                <div className="flex-grow border-t border-[#E8D8B8]"></div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-white border border-[#E8D8B8] hover:border-[#B89A5A] text-[#24302F] font-medium text-sm py-3 rounded-full transition-colors flex justify-center items-center gap-3 cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google Workspace</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Pre-fill helper */}
          <div className="mt-6 p-3.5 bg-[#F3EBDD] rounded-2xl border border-[#E8D8B8] text-xs flex items-center justify-between">
            <span className="text-[#4D5652]">Demo preset: <strong>{selectedRole}</strong></span>
            <button
              onClick={() => {
                setUserRole(selectedRole);
                if (selectedRole === 'doctor') setCurrentView('doctor-dashboard');
                else if (selectedRole === 'staff') setCurrentView('kiosk-mode');
                else setCurrentView('patient-dashboard');
              }}
              className="text-[#24302F] font-bold hover:text-[#B89A5A] cursor-pointer"
            >
              Direct Entry &rarr;
            </button>
          </div>

          <p className="mt-5 text-center text-xs text-[#4D5652]">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setCurrentView('kiosk-mode')}
              className="text-[#B89A5A] hover:text-[#24302F] font-semibold transition-colors cursor-pointer"
            >
              Use Walk-In Kiosk
            </button>
          </p>
        </motion.div>
      </div>
    </main>
  );
};
