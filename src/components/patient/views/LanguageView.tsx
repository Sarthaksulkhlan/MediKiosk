import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PatientTab } from '../types';

interface LanguageViewProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  setActiveTab: (tab: PatientTab) => void;
  onMarkStepComplete: (step: PatientTab) => void;
}

interface LanguageOption {
  code: string;
  name: string;
  native: string;
  script: string;
  flag: string;
  sampleAudioText: string;
  population: string;
}

const ALL_LANGUAGES: LanguageOption[] = [
  {
    code: 'EN',
    name: 'English',
    native: 'English',
    script: 'Latin',
    flag: '🇬🇧',
    sampleAudioText: 'I have had mild fever for two days and slight headache.',
    population: 'Global & Pan-India',
  },
  {
    code: 'HI',
    name: 'Hindi',
    native: 'हिंदी',
    script: 'Devanagari',
    flag: '🇮🇳',
    sampleAudioText: 'मुझे दो दिनों से हल्का बुखार और सिरदर्द हो रहा है।',
    population: 'North & Central India',
  },
  {
    code: 'BN',
    name: 'Bengali',
    native: 'বাংলা',
    script: 'Bengali',
    flag: '🇮🇳',
    sampleAudioText: 'আমার দুই দিন ধরে হালকা জ্বর এবং মাথাব্যথা আছে।',
    population: 'West Bengal & Tripura',
  },
  {
    code: 'MR',
    name: 'Marathi',
    native: 'मराठी',
    script: 'Devanagari',
    flag: '🇮🇳',
    sampleAudioText: 'मला दोन दिवसांपासून हलका ताप आणि डोकेदुखी आहे.',
    population: 'Maharashtra',
  },
  {
    code: 'TA',
    name: 'Tamil',
    native: 'தமிழ்',
    script: 'Tamil',
    flag: '🇮🇳',
    sampleAudioText: 'எனக்கு இரண்டு நாட்களாக லேசான காய்ச்சல் மற்றும் தலைவலி உள்ளது.',
    population: 'Tamil Nadu & Puducherry',
  },
  {
    code: 'TE',
    name: 'Telugu',
    native: 'తెలుగు',
    script: 'Telugu',
    flag: '🇮🇳',
    sampleAudioText: 'నాకు రెండు రోజులుగా స్వల్ప జ్వరం మరియు తలనొప్పి ఉంది.',
    population: 'Andhra Pradesh & Telangana',
  },
  {
    code: 'KN',
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    script: 'Kannada',
    flag: '🇮🇳',
    sampleAudioText: 'ನನಗೆ ಎರಡು ದಿನಗಳಿಂದ ಸೌಮ್ಯ ಜ್ವರ ಮತ್ತು ತಲೆನೋವು ಇದೆ.',
    population: 'Karnataka',
  },
  {
    code: 'GU',
    name: 'Gujarati',
    native: 'ગુજરાતી',
    script: 'Gujarati',
    flag: '🇮🇳',
    sampleAudioText: 'મને બે દિવસથી સામાન્ય તાવ અને માથાનો દુખાવો છે.',
    population: 'Gujarat',
  },
  {
    code: 'PA',
    name: 'Punjabi',
    native: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    flag: '🇮🇳',
    sampleAudioText: 'ਮੈਨੂੰ ਦੋ ਦਿਨਾਂ ਤੋਂ ਹਲਕਾ ਬੁਖਾਰ ਅਤੇ ਸਿਰਦਰਦ ਹੈ।',
    population: 'Punjab',
  },
];

export const LanguageView: React.FC<LanguageViewProps> = ({
  selectedLanguage,
  onLanguageChange,
  setActiveTab,
  onMarkStepComplete,
}) => {
  const [currentLang, setCurrentLang] = useState(selectedLanguage);
  const [tone, setTone] = useState<'conversational' | 'clinical'>('conversational');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const handleSelectLanguage = (langName: string) => {
    setCurrentLang(langName);
    onLanguageChange(langName);
  };

  const handlePlaySample = (lang: LanguageOption, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(lang.code);

    // Use browser SpeechSynthesis if supported
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lang.sampleAudioText);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(null), 2000);
    }
  };

  const handleContinue = () => {
    onLanguageChange(currentLang);
    onMarkStepComplete('language');
    setActiveTab('healthcare-system');
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
          <span className="material-symbols-outlined text-[15px]">translate</span>
          <span>Step 3 • Language Selection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#24302F]">
          Choose Your Preferred Language
        </h1>
        <p className="text-sm text-[#5D6662] mt-1 max-w-3xl leading-relaxed">
          Healthcare should be accessible in the language you're comfortable with. Aura AI speaks and understands natural regional dialects across India.
        </p>
      </div>

      {/* Grid of 9 Large Language Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_LANGUAGES.map((lang) => {
          const isSelected =
            currentLang.toLowerCase().includes(lang.name.toLowerCase()) ||
            currentLang.toLowerCase().includes(lang.native.toLowerCase());

          return (
            <div
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.name)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#24302F] text-[#FAF7F0] border-[#24302F] shadow-lg scale-[1.02]'
                  : 'bg-white text-[#24302F] border-[#E8D8B8] hover:border-[#B89A5A] hover:bg-[#FAF7F0]/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <h3 className="text-lg font-bold leading-tight">{lang.native}</h3>
                      <p className={`text-xs ${isSelected ? 'text-[#D8BE88]' : 'text-[#6B7570]'}`}>
                        {lang.name} ({lang.script})
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-[#B89A5A] text-[#1B2423] flex items-center justify-center text-xs font-extrabold">
                      ✓
                    </span>
                  )}
                </div>

                <div
                  className={`mt-4 p-3 rounded-2xl text-xs leading-relaxed ${
                    isSelected ? 'bg-white/10 text-zinc-200' : 'bg-[#FAF7F0] text-[#5D6662]'
                  }`}
                >
                  &ldquo;{lang.sampleAudioText}&rdquo;
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-current/15 flex items-center justify-between">
                <span className="text-[11px] opacity-75">{lang.population}</span>
                <button
                  onClick={(e) => handlePlaySample(lang, e)}
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#B89A5A] text-[#1B2423] hover:bg-[#C8AE78]'
                      : 'bg-white border border-[#E8D8B8] text-[#24302F] hover:bg-[#F3EBDD]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isPlayingAudio === lang.code ? 'volume_up' : 'play_circle'}
                  </span>
                  <span>{isPlayingAudio === lang.code ? 'Playing...' : 'Audio Preview'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tone / Speech Mode Selector */}
      <div className="p-5 rounded-3xl bg-white border border-[#E8D8B8]/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-[#24302F]">Aura Speech Processing Model</h3>
          <p className="text-xs text-[#6B7570]">
            Choose whether Aura interacts using conversational everyday language or clinical terms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTone('conversational')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              tone === 'conversational'
                ? 'bg-[#24302F] text-[#FAF7F0] shadow-sm'
                : 'bg-[#FAF7F0] text-[#4D5652] border border-[#E8D8B8]'
            }`}
          >
            Conversational (Recommended)
          </button>
          <button
            onClick={() => setTone('clinical')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
              tone === 'clinical'
                ? 'bg-[#24302F] text-[#FAF7F0] shadow-sm'
                : 'bg-[#FAF7F0] text-[#4D5652] border border-[#E8D8B8]'
            }`}
          >
            Clinical &amp; Formal
          </button>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8D8B8]/80 shadow-xs flex items-center justify-between">
        <button
          onClick={() => setActiveTab('consent')}
          className="text-xs font-bold text-[#5D6662] hover:text-[#24302F] px-4 py-2"
        >
          ← Back
        </button>

        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-2 bg-[#24302F] hover:bg-[#1B2423] text-[#FAF7F0] px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-md hover:-translate-y-0.5"
        >
          <span>Continue to Healthcare System</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </motion.div>
  );
};
