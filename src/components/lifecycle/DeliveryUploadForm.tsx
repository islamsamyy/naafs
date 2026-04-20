"use client";
// ── T022 — DeliveryUploadForm (US4) ───────────────────────────────────────────
import { useState } from "react";
import { Upload, FileText, Link, CheckCircle } from "lucide-react";

interface DeliveryUploadFormProps {
  projectId: string;
  onSubmit: (deliveryNote: string, fileUrl?: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function DeliveryUploadForm({ projectId: _projectId, onSubmit, isSubmitting }: DeliveryUploadFormProps) {
  const [note, setNote] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (note.trim().length < 20) {
      setError("يجب أن تكون ملاحظات التسليم 20 حرفاً على الأقل");
      return;
    }
    setError("");
    await onSubmit(note, fileUrl || undefined);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: "12px",
    background: "#FAFBFF", border: "1.5px solid #E8ECF4",
    fontSize: "14px", fontFamily: "'Cairo', sans-serif",
    color: "#0A0E1A", outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg,#1A4FD6,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Upload size={18} color="#fff" />
        </div>
        <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#0A0E1A" }}>تسليم العمل</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", color: "#3D4560", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>
            <FileText size={12} style={{ display: "inline", marginLeft: "4px" }} />
            ملاحظات التسليم *
          </label>
          <textarea
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
            placeholder="اشرح ما تم تسليمه وكيف استوفيت متطلبات المشروع..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {error && <p style={{ color: "#EF4444", fontSize: "11px", marginTop: "4px" }}>{error}</p>}
        </div>

        <div>
          <label style={{ display: "block", color: "#3D4560", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>
            <Link size={12} style={{ display: "inline", marginLeft: "4px" }} />
            رابط الملف أو Repository (اختياري)
          </label>
          <input
            type="url"
            style={inputStyle}
            placeholder="https://drive.google.com/..."
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "14px", borderRadius: "12px",
            background: isSubmitting ? "#8892A4" : "linear-gradient(135deg,#00C2A8,#1A4FD6)",
            color: "#fff", border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "14px", fontWeight: "900",
            boxShadow: "0 4px 16px rgba(0,194,168,0.3)",
          }}
        >
          <CheckCircle size={16} />
          {isSubmitting ? "جاري التسليم..." : "تسليم العمل للمراجعة"}
        </button>
      </div>
    </form>
  );
}
