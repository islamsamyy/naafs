"use client";

import React, { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface FloatingActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  position?: "bottom-right" | "bottom-left";
  visible?: boolean;
  showOnMobileOnly?: boolean;
}

export default function FloatingActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
  position = "bottom-right",
  visible = true,
  showOnMobileOnly = true,
}: FloatingActionButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsVisible(visible && (!showOnMobileOnly || isMobile));
  }, [visible, showOnMobileOnly, isMobile]);

  if (!isVisible) return null;

  const positionClasses = {
    "bottom-right": "bottom-8 right-8",
    "bottom-left": "bottom-8 left-8",
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-[#1A4FD6] to-[#2563EB] text-white shadow-lg shadow-[#1A4FD6]/40 hover:shadow-xl hover:shadow-[#1A4FD6]/60",
    secondary: "bg-white text-[#1A4FD6] border-2 border-[#1A4FD6] shadow-lg hover:shadow-xl hover:bg-[#EEF3FF]",
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed z-50 flex items-center justify-center gap-3
        ${positionClasses[position]}
        px-6 py-4 rounded-full
        ${variantClasses[variant]}
        transition-all duration-300 ease-out
        hover:scale-110 active:scale-95
        animate-pulse-slow
        group
      `}
      title={label}
      dir="rtl"
    >
      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
      <span className="text-sm font-bold hidden sm:inline">{label}</span>
    </button>
  );
}
