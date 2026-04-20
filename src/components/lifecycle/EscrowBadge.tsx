"use client";
// ── T020 — EscrowBadge (US3) ──────────────────────────────────────────────────
// Visual indicator for escrow / financial security status

import { ShieldCheck, Lock, CheckCircle, RefreshCw } from "lucide-react";
import type { EscrowStatus } from "@/types/marketplace";

interface EscrowBadgeProps {
  status: EscrowStatus;
  amount?: number;
  compact?: boolean;
}

const CONFIG: Record<EscrowStatus, { icon: React.ReactNode; label: string; arabicLabel: string; color: string; bg: string; border: string }> = {
  pending: {
    icon: <RefreshCw size={14} />,
    label: "Pending",
    arabicLabel: "في انتظار التأمين",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#F59E0B",
  },
  held: {
    icon: <Lock size={14} />,
    label: "Held",
    arabicLabel: "الدفع محجوز بأمان",
    color: "#1A4FD6",
    bg: "#EEF3FF",
    border: "#1A4FD6",
  },
  released: {
    icon: <CheckCircle size={14} />,
    label: "Released",
    arabicLabel: "تم صرف الدفع",
    color: "#00C2A8",
    bg: "#E6FAF8",
    border: "#00C2A8",
  },
  refunded: {
    icon: <RefreshCw size={14} />,
    label: "Refunded",
    arabicLabel: "تم الاسترداد",
    color: "#8892A4",
    bg: "#F0F3FA",
    border: "#8892A4",
  },
};

export default function EscrowBadge({ status, amount, compact = false }: EscrowBadgeProps) {
  const cfg = CONFIG[status];

  if (compact) {
    return (
      <span
        dir="rtl"
        style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "4px 12px", borderRadius: "20px",
          background: cfg.bg, border: `1px solid ${cfg.border}`,
          color: cfg.color, fontSize: "12px", fontWeight: "700",
          fontFamily: "'Cairo', sans-serif",
        }}
      >
        {cfg.icon}
        {cfg.arabicLabel}
        {amount !== undefined && <span style={{ opacity: 0.8 }}>(${amount})</span>}
      </span>
    );
  }

  return (
    <div
      dir="rtl"
      style={{
        display: "flex", alignItems: "center", gap: "14px",
        padding: "16px 20px", borderRadius: "14px",
        background: cfg.bg, border: `1.5px solid ${cfg.border}`,
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      <div style={{
        width: "44px", height: "44px", borderRadius: "50%",
        background: cfg.border, display: "flex", alignItems: "center",
        justifyContent: "center", flexShrink: 0,
      }}>
        <ShieldCheck size={22} color="#fff" />
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        <div style={{ fontWeight: "900", fontSize: "14px", color: "#0A0E1A", marginBottom: "2px" }}>
          {cfg.arabicLabel}
        </div>
        {amount !== undefined && (
          <div style={{ fontSize: "20px", fontWeight: "900", color: cfg.color }}>
            ${amount.toLocaleString()}
          </div>
        )}
      </div>
      <div style={{ color: cfg.color }}>{cfg.icon}</div>
    </div>
  );
}
