"use client";
// ── T015 — LiveTicker (US2) ───────────────────────────────────────────────────
// Real-time bidding ticker using Supabase Realtime with kinetic animations

import { useEffect, useRef, useState } from "react";
import { subscribeToBids } from "@/lib/supabase/client";
import { TrendingDown, Users, Zap } from "lucide-react";
import type { Bid } from "@/types/marketplace";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface LiveTickerProps {
  projectId: string;
  initialBids?: Bid[];
  budgetMin?: number;
  budgetMax?: number;
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `منذ ${diff} ث`;
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  return `منذ ${Math.floor(diff / 3600)} س`;
}

export default function LiveTicker({ projectId, initialBids = [], budgetMin, budgetMax }: LiveTickerProps) {
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [newBidIds, setNewBidIds] = useState<Set<string>>(new Set());
  const [pulse, setPulse] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    channelRef.current = subscribeToBids(projectId, (newBid) => {
      const bid = newBid as Bid;
      setBids((prev) => [bid, ...prev]);
      setNewBidIds((prev) => new Set([...prev, bid.id]));
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
      setTimeout(() => setNewBidIds((prev) => { const n = new Set(prev); n.delete(bid.id); return n; }), 3000);
      // Scroll to top
      tickerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });

    return () => { channelRef.current?.unsubscribe(); };
  }, [projectId]);

  const lowestBid = bids.length > 0 ? Math.min(...bids.map((b) => b.amount)) : null;

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif" }} dir="rtl">
      {/* Header Stats */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        {/* Bid Count */}
        <div
          style={{
            flex: 1, display: "flex", alignItems: "center", gap: "8px",
            padding: "12px 16px", borderRadius: "12px",
            background: pulse ? "#EEF3FF" : "#FAFBFF",
            border: `1.5px solid ${pulse ? "#1A4FD6" : "#E8ECF4"}`,
            transition: "all 0.4s",
          }}
        >
          <Users size={16} color="#1A4FD6" />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "20px", fontWeight: "900", color: "#0A0E1A" }}>{bids.length}</div>
            <div style={{ fontSize: "11px", color: "#8892A4" }}>إجمالي العروض</div>
          </div>
        </div>
        {/* Lowest Bid */}
        {lowestBid !== null && (
          <div
            style={{
              flex: 1, display: "flex", alignItems: "center", gap: "8px",
              padding: "12px 16px", borderRadius: "12px",
              background: "#E6FAF8", border: "1.5px solid #00C2A8",
            }}
          >
            <TrendingDown size={16} color="#00C2A8" />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "20px", fontWeight: "900", color: "#00C2A8" }}>${lowestBid}</div>
              <div style={{ fontSize: "11px", color: "#8892A4" }}>أدنى عرض</div>
            </div>
          </div>
        )}
        {/* Live indicator */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "12px 16px", borderRadius: "12px",
            background: "#0A0E1A", border: "1.5px solid #1A4FD6",
          }}
        >
          <span
            style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "#00FF88",
              boxShadow: pulse ? "0 0 12px #00FF88" : "0 0 4px #00FF88",
              animation: "livePulse 1.5s infinite",
            }}
          />
          <span style={{ color: "#00FF88", fontSize: "11px", fontWeight: "700" }}>مباشر</span>
          <Zap size={14} color="#00FF88" />
        </div>
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes slideInBid {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Bid List */}
      <div
        ref={tickerRef}
        style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "380px", overflowY: "auto" }}
      >
        {bids.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#8892A4" }}>
            <Zap size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <p style={{ fontSize: "14px" }}>كن أول من يقدم عرضاً!</p>
          </div>
        ) : (
          bids.map((bid) => (
            <div
              key={bid.id}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 16px", borderRadius: "12px",
                background: newBidIds.has(bid.id) ? "#EEF3FF" : "#FFFFFF",
                border: `1.5px solid ${newBidIds.has(bid.id) ? "#1A4FD6" : "#E8ECF4"}`,
                animation: newBidIds.has(bid.id) ? "slideInBid 0.4s ease-out" : "none",
                transition: "background 0.5s, border-color 0.5s",
              }}
            >
              <div
                style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #1A4FD6, #7C3AED)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: "900", fontSize: "14px", flexShrink: 0,
                }}
              >
                {bid.freelancer?.full_name?.[0] ?? "م"}
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#8892A4", fontSize: "11px" }}>{timeAgo(bid.created_at)}</span>
                  <span style={{ fontWeight: "700", fontSize: "13px", color: "#0A0E1A" }}>
                    {bid.freelancer?.full_name ?? "مستقل"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <span style={{ color: "#8892A4", fontSize: "12px" }}>{bid.days_to_complete} يوم</span>
                  <span style={{ fontWeight: "900", fontSize: "18px", color: "#1A4FD6" }}>${bid.amount}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
