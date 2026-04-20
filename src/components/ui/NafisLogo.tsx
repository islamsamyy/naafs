'use client';

import React from 'react';
import Image from 'next/image';

interface NafisLogoProps {
  /** Visual height in pixels */
  height?: number;
  /** 'light' (default) = original colors; 'white' = forced white via filter */
  variant?: 'light' | 'dark' | 'white';
  /** Show only the icon mark, no text */
  iconOnly?: boolean;
  className?: string;
}

/**
 * NAFIS brand logo — uses official assets from /public.
 */
export function NafisLogo({
  height = 36,
  variant = 'light',
  iconOnly = false,
  className = '',
}: NafisLogoProps) {
  // logo.svg is 1080x1080 (square but contains text at bottom), logo-icon is icon only.
  // Actually logo.svg contains text.
  const src = iconOnly ? '/logo-icon.svg' : '/logo.svg';
  
  return (
    <div 
      className={`inline-flex items-center select-none ${className}`}
      style={{ height: height, width: height }}
    >
      <Image
        src={src}
        alt="NAFIS Logo"
        width={height}
        height={height}
        priority
        className={`transition-all duration-300 ${variant === 'white' || variant === 'dark' ? 'brightness-100 invert' : ''}`}
        style={{ height: height, width: height, objectFit: 'contain' }}
      />
    </div>
  );
}
