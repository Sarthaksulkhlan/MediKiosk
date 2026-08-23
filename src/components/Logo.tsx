import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  textColor = 'text-[#24302F]',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg font-bold tracking-tight',
    md: 'text-xl font-bold tracking-tight',
    lg: 'text-2xl font-bold tracking-tight',
    xl: 'text-3xl font-extrabold tracking-tight',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* SVG Icon: Clinical Screen + ECG Pulse + Listening Ear in Warm Champagne & Sage */}
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="health360-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B89A5A" />
            <stop offset="50%" stopColor="#D8BE88" />
            <stop offset="100%" stopColor="#4D5652" />
          </linearGradient>
          <linearGradient id="health360-sage-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#24302F" />
            <stop offset="100%" stopColor="#4D5652" />
          </linearGradient>
        </defs>

        {/* Monitor Screen Frame */}
        <rect
          x="15"
          y="18"
          width="70"
          height="52"
          rx="10"
          stroke="url(#health360-gold-grad)"
          strokeWidth="5.5"
          fill="none"
        />

        {/* Monitor Stand */}
        <path
          d="M40 70 L35 84 H65 L60 70"
          fill="url(#health360-sage-grad)"
        />
        {/* Monitor Base Bar */}
        <line
          x1="28"
          y1="84"
          x2="72"
          y2="84"
          stroke="url(#health360-gold-grad)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Stand Center Dot */}
        <circle cx="50" cy="74" r="2" fill="#D8BE88" />

        {/* ECG Waveform passing through */}
        <path
          d="M8 44 H34 L40 34 L47 54 L54 39 L60 44 H64"
          stroke="url(#health360-gold-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Integrated Listening Ear Motif */}
        <path
          d="M65 32 C74 32, 80 38, 80 46 C80 54, 75 58, 70 60 C66 61.5, 63 65, 63 68 C63 70, 65 72, 68 72"
          stroke="url(#health360-gold-grad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {showText && (
        <span className={`font-display ${textSizes[size]} ${textColor} tracking-tight select-none`}>
          Health360
        </span>
      )}
    </div>
  );
};
