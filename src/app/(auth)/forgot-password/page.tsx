"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Zap, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إرسال رابط إعادة التعيين");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "linear-gradient(135deg, #EEF3FF 0%, #E6FAF8 100%)", fontFamily: "'Cairo', sans-serif" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1A4FD6, #00C2A8)" }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #1A4FD6, #00C2A8)" }}>نافِس</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border" style={{ borderColor: "#E8ECF4" }}>
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "#EEF3FF" }}>
                  <Mail className="w-8 h-8" style={{ color: "#1A4FD6" }} />
                </div>
                <h1 className="text-2xl font-black" style={{ color: "#0A0E1A" }}>نسيت كلمة المرور؟</h1>
                <p className="text-sm mt-2" style={{ color: "#8892A4" }}>
                  أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-semibold text-right border border-red-100">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-right mb-1.5" style={{ color: "#3D4560" }}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full px-4 py-3.5 rounded-xl border text-right outline-none text-sm"
                    style={{ borderColor: "#E8ECF4", fontFamily: "'Cairo'" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#1A4FD6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,79,214,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "#E8ECF4"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                  style={{ background: "linear-gradient(135deg, #1A4FD6, #2563EB)", boxShadow: "0 4px 20px rgba(26,79,214,0.3)" }}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>إرسال رابط إعادة التعيين</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#E6FAF8" }}>
                <CheckCircle className="w-8 h-8" style={{ color: "#00C2A8" }} />
              </div>
              <h2 className="text-xl font-black mb-2" style={{ color: "#0A0E1A" }}>تم الإرسال!</h2>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "#8892A4" }}>
                تم إرسال رابط إعادة تعيين كلمة المرور إلى<br />
                <strong style={{ color: "#1A4FD6" }}>{email}</strong>
              </p>
              <p className="text-xs mb-6" style={{ color: "#8892A4" }}>
                لم تستلم البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها أو{" "}
                <button onClick={() => setSent(false)} className="font-bold" style={{ color: "#1A4FD6" }}>أعد المحاولة</button>
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 text-center" style={{ borderTop: "1px solid #E8ECF4" }}>
            <Link href="/login" className="text-sm font-bold flex items-center justify-center gap-1 flex-row-reverse" style={{ color: "#1A4FD6" }}>
              <ArrowLeft className="w-4 h-4" /> العودة لتسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
