"use client";
// ── T014 — PlaceBidForm (US2) ─────────────────────────────────────────────────
// High-fidelity RTL bid submission form with validation

import { useState } from "react";
import { DollarSign, Clock, FileText, Zap } from "lucide-react";
import type { SubmitBidArgs } from "@/types/marketplace";

interface PlaceBidFormProps {
  projectId: string;
  budgetMin?: number;
  budgetMax?: number;
  onSubmit: (args: SubmitBidArgs) => Promise<void>;
  isSubmitting?: boolean;
}

export default function PlaceBidForm({ projectId, budgetMin, budgetMax, onSubmit, isSubmitting }: PlaceBidFormProps) {
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");
  const [proposal, setProposal] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; days?: string; proposal?: string }>({});
  const [focused, setFocused] = useState<string | null>(null);

  function validate() {
    const e: typeof errors = {};
    const amt = Number(amount);
    const d = Number(days);
    if (!amount || isNaN(amt) || amt <= 0) e.amount = "يرجى إدخال قيمة صحيحة للعرض";
    if (budgetMax && amt > budgetMax) e.amount = `الحد الأقصى للميزانية هو $${budgetMax}`;
    if (!days || isNaN(d) || d <= 0) e.days = "يرجى تحديد مدة التنفيذ";
    if (!proposal.trim() || proposal.length < 30) e.proposal = "يجب أن يكون عرضك 30 حرفاً على الأقل";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ p_project_id: projectId, p_amount: Number(amount), p_days: Number(days), p_proposal: proposal });
  }

  const fieldStyle = (name: string, hasError?: boolean) => ({
    background: focused === name ? "#F0F5FF" : "#FAFBFF",
    border: `1.5px solid ${hasError ? "#EF4444" : focused === name ? "#1A4FD6" : "#E8ECF4"}`,
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    fontFamily: "'Cairo', sans-serif",
    color: "#0A0E1A",
    width: "100%",
    outline: "none",
    transition: "all 0.2s",
    boxShadow: focused === name ? "0 0 0 3px rgba(26,79,214,0.1)" : "none",
  } as React.CSSProperties);

  const labelStyle: React.CSSProperties = { display: "block", color: "#3D4560", fontSize: "12px", fontWeight: "700", marginBottom: "6px", textAlign: "right" };
  const errorStyle: React.CSSProperties = { color: "#EF4444", fontSize: "11px", marginTop: "4px", textAlign: "right" };

  return (
    <form onSubmit={handleSubmit} dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#0A0E1A", marginBottom: "20px", textAlign: "right" }}>
        قدّم عرضك الآن
      </h3>

      {budgetMin !== undefined && budgetMax !== undefined && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", borderRadius: "10px", background: "#EEF3FF", marginBottom: "20px" }}>
          <span style={{ color: "#1A4FD6", fontSize: "13px", fontWeight: "700" }}>${budgetMin} - ${budgetMax}</span>
          <span style={{ color: "#8892A4", fontSize: "12px" }}>نطاق الميزانية</span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {/* Amount */}
          <div>
            <label style={labelStyle}>
              <DollarSign size={12} style={{ display: "inline", marginLeft: "4px" }} />
              قيمة العرض ($) *
            </label>
            <input
              type="number"
              min={1}
              style={fieldStyle("amount", !!errors.amount)}
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setFocused("amount")}
              onBlur={() => setFocused(null)}
            />
            {errors.amount && <p style={errorStyle}>{errors.amount}</p>}
          </div>
          {/* Days */}
          <div>
            <label style={labelStyle}>
              <Clock size={12} style={{ display: "inline", marginLeft: "4px" }} />
              مدة التنفيذ (أيام) *
            </label>
            <input
              type="number"
              min={1}
              style={fieldStyle("days", !!errors.days)}
              placeholder="10"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              onFocus={() => setFocused("days")}
              onBlur={() => setFocused(null)}
            />
            {errors.days && <p style={errorStyle}>{errors.days}</p>}
          </div>
        </div>

        {/* Proposal */}
        <div>
          <label style={labelStyle}>
            <FileText size={12} style={{ display: "inline", marginLeft: "4px" }} />
            نص عرضك *
          </label>
          <textarea
            style={{ ...fieldStyle("proposal", !!errors.proposal), minHeight: "100px", resize: "vertical" }}
            placeholder="اشرح سبب اختيارك لهذا المشروع وكيف ستنفذه..."
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            onFocus={() => setFocused("proposal")}
            onBlur={() => setFocused(null)}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            {errors.proposal && <p style={errorStyle}>{errors.proposal}</p>}
            <span style={{ color: "#8892A4", fontSize: "11px", marginRight: "auto" }}>{proposal.length} حرف</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "14px",
            borderRadius: "12px",
            background: isSubmitting ? "#8892A4" : "linear-gradient(135deg, #1A4FD6, #7C3AED)",
            color: "#fff",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "900",
            boxShadow: "0 4px 16px rgba(26,79,214,0.3)",
            transition: "all 0.2s",
          }}
        >
          <Zap size={16} />
          {isSubmitting ? "جاري التقديم..." : "إرسال العرض"}
        </button>
      </div>
    </form>
  );
}
