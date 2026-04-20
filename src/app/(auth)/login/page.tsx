"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NafisLogo } from "@/components/ui/NafisLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      if (data?.user) {
        // Fetch role from profiles table
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        const role = profileData?.role || data.user.user_metadata?.role;

        if (role === "freelancer") {
          router.push("/dashboard");
        } else if (role === "business_owner") {
          router.push("/dashboard/client");
        } else {
          router.push("/dashboard"); // Fallback
        }
      }
    } catch (err: any) {
      setError(err.message || "بيانات الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Brand Side (Visual) - Hidden on mobile */}
      <div className="hidden lg:flex flex-col space-y-8 text-right">
        <div className="space-y-4">
          <span className="text-primary font-headline font-bold tracking-widest uppercase text-sm block">
            Nafis Ecosystem
          </span>
          <h1 className="text-6xl font-headline font-black tracking-tighter text-on-surface leading-tight">
            مستقبل <br />
            <span className="text-primary-container">العمل الحر</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
            انضم إلى أكبر منصة للمواهب في المنطقة. ابدأ رحلتك اليوم نحو
            مشاريع استثنائية وبناء ملف شخصي عالمي.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl w-fit">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-primary to-tertiary-container flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white">
              verified_user
            </span>
          </div>
          <div>
            <p className="text-on-surface font-bold">بوابة آمنة</p>
            <p className="text-on-surface-variant text-xs">
              تشفير بيانات عالي المستوى
            </p>
          </div>
        </div>
      </div>

      {/* Auth Form Side */}
      <div className="flex justify-center lg:justify-end">
        <div className="w-full max-w-[480px] glass-panel p-8 md:p-12 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,56,172,0.12)] border border-white/40">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-10">
            <NafisLogo height={60} className="mb-6" />
            <h2 className="text-2xl font-headline font-extrabold text-on-surface">
              تسجيل الدخول
            </h2>
            <p className="text-on-surface-variant text-sm mt-2">
              أدخل بياناتك للوصول إلى حسابك
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-semibold text-right border border-red-100">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-headline font-bold text-on-surface-variant">
                البريد الإلكتروني
              </label>
              <div className="relative group">
                <input
                  required
                  className="w-full px-5 py-4 bg-surface-container-highest/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-outline-variant text-right"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors w-5 h-5" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-headline font-bold text-on-surface-variant">
                  كلمة المرور
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary-container transition-colors"
                >
                  نسيت كلمة المرور؟
                </a>
              </div>
              <div className="relative group">
                <input
                  required
                  className="w-full px-5 py-4 bg-surface-container-highest/50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 placeholder:text-outline-variant text-right"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors cursor-pointer"
                >
                  <Lock className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-tr from-primary to-tertiary-container text-white py-4 rounded-xl font-headline font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>دخول</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-outline-variant/30"></div>
              <span className="text-xs text-on-surface-variant">
                أو المتابعة عبر
              </span>
              <div className="flex-1 h-px bg-outline-variant/30"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl hover:bg-surface-container-low transition-all"
              >
                <img
                  src="https://www.gstatic.com/firebaseapp/v8.2.1/images/firebase-logo.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="text-sm font-bold text-on-surface">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-xl hover:bg-surface-container-low transition-all"
              >
                <span className="text-sm font-bold text-on-surface">Apple</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-on-surface-variant">
              ليس لديك حساب؟{" "}
              <a
                href="/register"
                className="text-primary font-bold hover:text-primary-container transition-colors"
              >
                سجل الآن مجاناً
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
