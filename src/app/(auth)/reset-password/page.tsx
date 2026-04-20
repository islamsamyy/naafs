"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, Zap, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    // Check if we have a session (Supabase sets it automatically from the recovery link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("انتهت صلاحية الجلسة أو الرابط غير صالح. يرجى طلب رابط جديد.");
      }
    };
    checkSession();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحديث كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #EEF3FF 0%, #E6FAF8 100%)", fontFamily: "'Cairo', sans-serif" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #1A4FD6, #00C2A8)" }}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tight" style={{ color: "#1A4FD6" }}>نافِس</span>
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ color: "#0A0E1A" }}>تعيين كلمة مرور جديدة</h1>
          <p style={{ color: "#8892A4" }}>أدخل كلمة المرور الجديدة لحسابك</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl border transition-all" style={{ borderColor: "#E8ECF4" }}>
          {success ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-black mb-3" style={{ color: "#0A0E1A" }}>تم التغيير بنجاح!</h2>
              <p className="mb-8" style={{ color: "#8892A4" }}>تم تحديث كلمة المرور الخاصة بك بنجاح. سيتم تحويلك لصفحة تسجيل الدخول...</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 font-bold transition-all hover:gap-3"
                style={{ color: "#1A4FD6" }}
              >
                <span>العودة لتسجيل الدخول</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold text-right border border-red-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-right mb-2" style={{ color: "#3D4560" }}>كلمة المرور الجديدة</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="8 أحرف على الأقل"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border text-right outline-none transition-all focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                      style={{ borderColor: "#E8ECF4", fontFamily: "'Cairo', sans-serif" }}
                    />
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#8892A4" }} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-right mb-2" style={{ color: "#3D4560" }}>تأكيد كلمة المرور</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="أعد كتابة كلمة المرور"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border text-right outline-none transition-all focus:ring-4 focus:ring-blue-50 focus:border-blue-500"
                      style={{ borderColor: "#E8ECF4", fontFamily: "'Cairo', sans-serif" }}
                    />
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#8892A4" }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ 
                    background: "linear-gradient(135deg, #1A4FD6, #2563EB)", 
                    boxShadow: "0 10px 30px -10px rgba(26,79,214,0.4)" 
                  }}
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span>تحديث كلمة المرور</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <Link href="/login" className="text-sm font-semibold transition-colors hover:text-blue-600" style={{ color: "#8892A4" }}>
                  تذكرت كلمة المرور؟ <span style={{ color: "#1A4FD6" }}>تسجيل الدخول</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
