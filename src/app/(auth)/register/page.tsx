"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Briefcase, User, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { NafisLogo } from "@/components/ui/NafisLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"freelancer" | "business_owner" | null>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            role: role,
          },
        },
      });

      if (authError) throw authError;

      // Upon successful registration, redirect to onboarding or dashboard
      if (role === "freelancer") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard/client");
      }
      
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "linear-gradient(135deg, #EEF3FF 0%, #E6FAF8 100%)", fontFamily: "'Cairo', sans-serif" }}>
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <NafisLogo height={64} />
          </Link>
          <h1 className="text-3xl font-black" style={{ color: "#0A0E1A" }}>إنشاء حساب جديد</h1>
          <p className="mt-1" style={{ color: "#8892A4" }}>انضم لآلاف المستخدمين</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border" style={{ borderColor: "#E8ECF4" }}>
          {step === 1 && (
            <div>
              <h2 className="text-xl font-black text-center mb-6" style={{ color: "#0A0E1A" }}>أنت...؟</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { value: "freelancer" as const, label: "مستقل", desc: "أقدم خدماتي وأتنافس على المشاريع", icon: <User className="w-8 h-8" /> },
                  { value: "business_owner" as const, label: "صاحب عمل", desc: "أنشر مشاريع وأوظف أفضل المواهب", icon: <Briefcase className="w-8 h-8" /> },
                ].map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className="p-6 rounded-xl border-2 text-center transition-all hover:scale-105"
                    style={{
                      borderColor: role === r.value ? "#1A4FD6" : "#E8ECF4",
                      background: role === r.value ? "#EEF3FF" : "white",
                    }}
                  >
                    <div className="flex justify-center mb-3" style={{ color: role === r.value ? "#1A4FD6" : "#8892A4" }}>{r.icon}</div>
                    <h3 className="font-black text-lg mb-1" style={{ color: "#0A0E1A" }}>{r.label}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "#8892A4" }}>{r.desc}</p>
                    {role === r.value && (
                      <div className="mt-3 w-6 h-6 rounded-full flex items-center justify-center mx-auto" style={{ background: "#1A4FD6" }}>
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => role && setStep(2)}
                disabled={!role}
                className="w-full py-4 rounded-xl font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: role ? "linear-gradient(135deg, #1A4FD6, #2563EB)" : "#E8ECF4",
                  color: role ? "white" : "#8892A4",
                  cursor: role ? "pointer" : "not-allowed",
                  boxShadow: role ? "0 4px 20px rgba(26,79,214,0.3)" : "none"
                }}
              >
                التالي
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleRegister}>
              <h2 className="text-xl font-black text-right mb-6" style={{ color: "#0A0E1A" }}>بياناتك الشخصية</h2>
              
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-semibold text-right border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {[
                  { label: "الاسم الكامل", key: "name", type: "text", placeholder: "أحمد محمد" },
                  { label: "البريد الإلكتروني", key: "email", type: "email", placeholder: "ahmed@example.com" },
                  { label: "كلمة المرور", key: "password", type: "password", placeholder: "8 أحرف على الأقل" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-bold text-right mb-1.5" style={{ color: "#3D4560" }}>{f.label}</label>
                    <input
                      type={f.type}
                      required
                      placeholder={f.placeholder}
                      value={form[f.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-right outline-none transition-all"
                      style={{ borderColor: "#E8ECF4", fontFamily: "'Cairo', sans-serif" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "#1A4FD6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,79,214,0.1)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "#E8ECF4"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 flex justify-center items-center py-4 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                style={{ background: "linear-gradient(135deg, #1A4FD6, #2563EB)", boxShadow: "0 4px 20px rgba(26,79,214,0.3)" }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "إنشاء الحساب"}
              </button>
              <button type="button" disabled={loading} onClick={() => setStep(1)} className="w-full mt-3 py-2 text-sm transition-opacity hover:opacity-70 disabled:opacity-50" style={{ color: "#8892A4" }}>رجوع</button>
            </form>
          )}

          <p className="text-center text-sm mt-6" style={{ color: "#8892A4" }}>
            لديك حساب؟{" "}
            <Link href="/login" className="font-bold" style={{ color: "#1A4FD6" }}>تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
