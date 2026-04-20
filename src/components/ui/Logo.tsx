import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export function Logo({ className = '', showText = false, size = 'md', variant = 'light' }: LogoProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const colorClass = variant === 'dark' ? 'text-cyan-400' : 'text-primary';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* NAFIS Logo - U-shaped arrow pointing up */}
      <svg
        className={`${sizeMap[size]} ${colorClass} transition-colors duration-300`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main U shape - curved arrow body */}
        <path
          d="M 25 75 Q 25 45 50 35 Q 75 45 75 75"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Arrow head - top point */}
        <path
          d="M 50 15 L 40 30 M 50 15 L 60 30"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Gradient shimmer for depth */}
        <defs>
          <linearGradient id="nafisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Text branding */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black font-headline ${textSizeMap[size]} ${colorClass} leading-none`}>
            NAFIS
          </span>
          <span className={`text-[10px] ${variant === 'dark' ? 'text-teal-300' : 'text-tertiary'} font-bold tracking-widest uppercase`}>
            Platform
          </span>
        </div>
      )}
    </div>
  );
}
