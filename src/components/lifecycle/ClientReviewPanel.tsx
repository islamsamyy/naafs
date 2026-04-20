"use client";
// ── T023 — ClientReviewPanel (US4) ────────────────────────────────────────────
import { useState } from "react";
import { CheckCircle, RefreshCw, Star, ExternalLink } from "lucide-react";

interface ClientReviewPanelProps {
  deliveryNote: string;
  fileUrl?: string;
  onApprove: () => Promise<void>;
  onRequestRevision: (reason: string) => Promise<void>;
}

export default function ClientReviewPanel({ deliveryNote, fileUrl, onApprove, onRequestRevision }: ClientReviewPanelProps) {
  const [view, setView] = useState<"idle" | "revision">("idle");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState<"approve" | "revision" | null>(null);

  async function handleApprove() {
    setLoading("approve");
    await onApprove();
    setLoading(null);
  }

  async function handleRevision() {
    if (reason.trim().length < 10) return;
    setLoading("revision");
    await onRequestRevision(reason);
    setLoading(null);
    setView("idle");
  }

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Star size={20} color="#F59E0B" fill="#F59E0B" />
        <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#0A0E1A" }}>مراجعة التسليم</h3>
      </div>

      {/* Delivery Note */}
      <div style={{ padding: "16px", borderRadius: "12px", background: "#FAFBFF", border: "1px solid #E8ECF4" }}>
        <p style={{ fontSize: "13px", color: "#3D4560", lineHeight: "1.8" }}>{deliveryNote}</p>
        {fileUrl && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "12px", color: "#1A4FD6", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}
          >
            <ExternalLink size={14} /> فتح الملف المُسلَّم
          </a>
        )}
      </div>

      {view === "idle" ? (
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleApprove}
            disabled={loading !== null}
            style={{
              flex: 1, padding: "14px", borderRadius: "12px",
              background: loading === "approve" ? "#8892A4" : "linear-gradient(135deg,#00C2A8,#1A4FD6)",
              color: "#fff", border: "none",
              cursor: loading !== null ? "not-allowed" : "pointer",
              fontSize: "14px", fontWeight: "900",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: "0 4px 16px rgba(0,194,168,0.3)",
            }}
          >
            <CheckCircle size={16} />
            {loading === "approve" ? "جاري الموافقة..." : "الموافقة وإصدار الدفع"}
          </button>
          <button
            onClick={() => setView("revision")}
            disabled={loading !== null}
            style={{
              flex: 1, padding: "14px", borderRadius: "12px",
              background: "#FAFBFF", border: "1.5px solid #E8ECF4",
              color: "#3D4560", cursor: "pointer",
              fontSize: "14px", fontWeight: "700",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            <RefreshCw size={16} /> طلب تعديل
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <textarea
            placeholder="اشرح ما يحتاج إلى تعديل..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              padding: "12px", borderRadius: "12px", background: "#FAFBFF",
              border: "1.5px solid #E8ECF4", fontSize: "13px",
              fontFamily: "'Cairo', sans-serif", minHeight: "80px", resize: "vertical",
              outline: "none", color: "#0A0E1A",
            }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleRevision} disabled={loading !== null} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "#1A4FD6", color: "#fff", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
              {loading === "revision" ? "جاري الإرسال..." : "إرسال ملاحظات التعديل"}
            </button>
            <button onClick={() => setView("idle")} style={{ padding: "12px 16px", borderRadius: "10px", background: "#F0F3FA", color: "#8892A4", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
