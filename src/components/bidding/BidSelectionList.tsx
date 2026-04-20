"use client";
// ── T018 — BidSelectionList (US3) ─────────────────────────────────────────────
// Client-facing list of bids with accept action and escrow trigger

import { useState } from "react";
import { Star, CheckCircle, MessageCircle, Clock, DollarSign } from "lucide-react";
import type { Bid } from "@/types/marketplace";

interface BidSelectionListProps {
  bids: Bid[];
  isClient: boolean;
  allowAccept: boolean; // only true when project is "active"
  onAccept: (bidId: string) => Promise<void>;
}

export default function BidSelectionList({ bids, isClient, allowAccept, onAccept }: BidSelectionListProps) {
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  async function handleAccept(bidId: string) {
    setAcceptingId(bidId);
    try {
      await onAccept(bidId);
      setAcceptedId(bidId);
    } finally {
      setAcceptingId(null);
    }
  }

  if (bids.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0", color: "#8892A4", fontFamily: "'Cairo', sans-serif" }} dir="rtl">
        <DollarSign size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
        <p>لا توجد عروض بعد. شارك مشروعك للحصول على عروض!</p>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", display: "flex", flexDirection: "column", gap: "16px" }}>
      {bids.map((bid, idx) => {
        const isWinner = bid.status === "accepted" || acceptedId === bid.id;
        const isAccepting = acceptingId === bid.id;

        return (
          <div
            key={bid.id}
            style={{
              borderRadius: "16px",
              padding: "20px",
              background: isWinner ? "linear-gradient(135deg, #EEF3FF, #F5F0FF)" : "#FFFFFF",
              border: `2px solid ${isWinner ? "#1A4FD6" : idx === 0 ? "#00C2A8" : "#E8ECF4"}`,
              boxShadow: isWinner ? "0 8px 32px rgba(26,79,214,0.18)" : "0 2px 12px rgba(26,79,214,0.04)",
              position: "relative",
              transition: "all 0.3s",
            }}
          >
            {/* Top Bid Badge */}
            {idx === 0 && !isWinner && (
              <div style={{
                position: "absolute", top: "-12px", right: "20px",
                padding: "4px 14px", borderRadius: "20px",
                background: "#00C2A8", color: "#fff", fontSize: "11px", fontWeight: "900",
              }}>
                ★ أفضل عرض
              </div>
            )}
            {isWinner && (
              <div style={{
                position: "absolute", top: "-12px", right: "20px",
                padding: "4px 14px", borderRadius: "20px",
                background: "#1A4FD6", color: "#fff", fontSize: "11px", fontWeight: "900",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <CheckCircle size={12} /> العرض الفائز
              </div>
            )}

            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              {/* Avatar */}
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #1A4FD6, #7C3AED)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: "900", fontSize: "16px",
                border: `2px solid ${isWinner ? "#1A4FD6" : "#E8ECF4"}`,
              }}>
                {bid.freelancer?.full_name?.[0] ?? "م"}
              </div>

              <div style={{ flex: 1 }}>
                {/* Name + Rating */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {bid.freelancer?.rating !== undefined && (
                      <>
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0A0E1A" }}>{bid.freelancer.rating}</span>
                      </>
                    )}
                  </div>
                  <span style={{ fontWeight: "900", fontSize: "15px", color: "#0A0E1A" }}>
                    {bid.freelancer?.full_name ?? "مستقل"}
                  </span>
                </div>

                {/* Amount + Days */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                  <div style={{ padding: "8px 12px", borderRadius: "10px", background: "#FAFBFF", border: "1px solid #E8ECF4", textAlign: "left" }}>
                    <div style={{ fontSize: "10px", color: "#8892A4" }}>قيمة العرض</div>
                    <div style={{ fontSize: "18px", fontWeight: "900", color: "#1A4FD6" }}>${bid.amount}</div>
                  </div>
                  <div style={{ padding: "8px 12px", borderRadius: "10px", background: "#FAFBFF", border: "1px solid #E8ECF4", textAlign: "right" }}>
                    <div style={{ fontSize: "10px", color: "#8892A4" }}>مدة التنفيذ</div>
                    <div style={{ fontSize: "18px", fontWeight: "900", color: "#0A0E1A", display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                      <Clock size={14} /> {bid.days_to_complete} يوم
                    </div>
                  </div>
                </div>

                {/* Proposal */}
                <p style={{ fontSize: "13px", color: "#3D4560", lineHeight: "1.7", marginBottom: "16px", textAlign: "right" }}>
                  {bid.proposal && bid.proposal.length > 180 ? bid.proposal.slice(0, 180) + "..." : bid.proposal || bid.message || "بدون وصف"}
                </p>

                {/* Actions */}
                {isClient && allowAccept && !isWinner && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleAccept(bid.id)}
                      disabled={!!isAccepting}
                      style={{
                        flex: 1, padding: "10px 16px", borderRadius: "10px",
                        background: isAccepting ? "#8892A4" : "linear-gradient(135deg, #1A4FD6, #7C3AED)",
                        color: "#fff", border: "none", cursor: isAccepting ? "not-allowed" : "pointer",
                        fontSize: "13px", fontWeight: "900",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        boxShadow: "0 4px 16px rgba(26,79,214,0.3)",
                        transition: "all 0.2s",
                      }}
                    >
                      <CheckCircle size={16} />
                      {isAccepting ? "جاري القبول..." : "قبول هذا العرض"}
                    </button>
                    <button style={{
                      padding: "10px 14px", borderRadius: "10px",
                      border: "1.5px solid #E8ECF4", background: "#FAFBFF",
                      cursor: "pointer", color: "#8892A4",
                      transition: "all 0.2s",
                    }}>
                      <MessageCircle size={16} />
                    </button>
                  </div>
                )}

                {isWinner && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "10px", background: "#E6FAF8", border: "1px solid #00C2A8" }}>
                    <CheckCircle size={16} color="#00C2A8" />
                    <span style={{ color: "#00C2A8", fontWeight: "700", fontSize: "13px" }}>تم قبول هذا العرض وتأمين الدفع</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
