"use client";

import React from "react";
import { Briefcase, Rocket } from "lucide-react";
import Link from "next/link";
import { NafisLogo } from "@/components/ui/NafisLogo";

export default function RoleSelectionPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 rtl"
      style={{ background: "#FFFFFF", fontFamily: "'Cairo', 'Noto Sans Arabic', sans-serif" }}
    >
      {/* Logo */}
      <NafisLogo height={44} variant="light" className="mb-10" />

      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black mb-3" style={{ color: "#0A0E1A", letterSpacing: "-0.03em" }}>
          اختر هويتك
        </h1>
        <p className="text-base" style={{ color: "#8892A4" }}>
          اختر الدور الذي يناسبك لبدء رحلتك مع نافِس. يمكنك التبديل بين الأدوار لاحقاً.
        </p>
      </div>

      {/* Role Cards */}
      <div className="w-full max-w-2xl space-y-4">
        {/* Freelancer Card */}
        <Link href="/onboarding/freelancer-setup/step-1">
          <div
            className="rounded-2xl p-7 cursor-pointer transition-all"
            style={{ background: "#FFFFFF", border: "1px solid #E8ECF4", boxShadow: "0 2px 12px rgba(26,79,214,0.04)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#1A4FD6";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(26,79,214,0.12)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#E8ECF4";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(26,79,214,0.04)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <div className="flex flex-row-reverse items-start gap-5">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #1A4FD6, #2563EB)", boxShadow: "0 4px 16px rgba(26,79,214,0.3)" }}
              >
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-right">
                <h2 className="text-xl font-black mb-1.5" style={{ color: "#0A0E1A" }}>مستقل</h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#8892A4" }}>
                  عرض مهاراتك وابدأ بجني الأرباح. احصل على فرص من عملاء يبحثون عن أفضل الكفاءات.
                </p>
                <div className="flex items-center gap-2 font-bold text-sm" style={{ color: "#1A4FD6" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_forward</span>
                  <span>ابدأ رحلتك كخبير</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5 pt-5" style={{ borderTop: "1px solid #F0F3FA" }}>
              <div className="flex -space-x-2 -space-x-reverse">
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuD186Yeo7aLoFEP-eS4Ynj3xk_1DhPb2iJpjF-QLYa8VZwrbVL2Gr4cEGwv3cf5QwJNvKoxB4Hx6jlIWWbJ0bhIxpe7m1JUzCmga5tYNi8QjPUJwF_TFy563_fjvchL7lKmuVY-EecgE9bcifi_tv3Ks4zrC0GmX1U_DQFFYuGQSnr-JR7HibRNMBZJcuGIWp3iVlP3tMjTFJXommNbGUb6Ww-cvcp-k6EfpMZitdGBydUgz1Xo3njoiVWzzAu4ulESf_cLMZboivbb",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwLE_yOD-GoRXZ1YrPLM82Ka3sZBl5548QIt0Uh3MPLSxZ2ouqIyAaeP1Rv2qoOlUYoCarRvSdhG9VUACJtusyVcd940rOVFZfDB6qFzQeNd2VIjJ0d1l7sR2EwGKuEXGCZ5QBKsdj_NAmJ-WDINml20MWRUJ6E97The1oeQRVpVAyFaAewzC3f3ukkjykBokTeMzQTgGdpKrh0Ar-y2y_90zMHEgZmkPor7yjhfZT5YNPdvmzT9QdvF-jeU8TqMScdkk7p18KkPqx",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuA7O86YuAwbkrNfwdBABMShlAoDGYTJPJwf1LwQNFv6vSATzGUg-KxcgRoX-jvZuiev0SRGG1k0o8G29AEweE3zH4ilo7Slec-h3GD98c_AZkdptkplaFxCxOfbCstpl_X5r6uxkSAzFIbQCO4xyYiuQr9K1ULCNwUukxs1FHj6MlLJTfiguwyTzAzfi1HJHHyLUlnoCYGR2Ay_pMeQWT7qZskBT43db75OG97gfjVUcUxGHXM3UltZj2ovTg5xLjFEvUcbY2Yia7SB",
                ].map((src, i) => (
                  <img key={i} alt="user" src={src} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <p className="text-sm font-bold" style={{ color: "#3D4560" }}>+500 مستقل نشط</p>
            </div>
          </div>
        </Link>

        {/* Client Card */}
        <Link href="/onboarding/client-setup/step-1">
          <div
            className="rounded-2xl p-7 cursor-pointer transition-all relative"
            style={{ background: "#FFFFFF", border: "1px solid #E8ECF4", boxShadow: "0 2px 12px rgba(26,79,214,0.04)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#00C2A8";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,194,168,0.12)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#E8ECF4";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(26,79,214,0.04)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            {/* Badge */}
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: "#E6FAF8", color: "#00C2A8" }}
            >
              متاح حالياً
            </div>

            <div className="flex flex-row-reverse items-start gap-5">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #00C2A8, #00A896)", boxShadow: "0 4px 16px rgba(0,194,168,0.3)" }}
              >
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-right">
                <h2 className="text-xl font-black mb-1.5" style={{ color: "#0A0E1A" }}>صاحب مشروع</h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#8892A4" }}>
                  جد أفضل المستقلين لتحقيق مشاريعك. ضمان الجودة والسرعة مع حماية كاملة للعقد.
                </p>
                <div className="flex items-center gap-2 font-bold text-sm" style={{ color: "#00C2A8" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_forward</span>
                  <span>ابدأ بتوظيف المواهب</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 mt-5 pt-5" style={{ borderTop: "1px solid #F0F3FA" }}>
              <div className="text-right">
                <p className="text-sm font-black" style={{ color: "#0A0E1A" }}>1000+</p>
                <p className="text-xs" style={{ color: "#8892A4" }}>مشروع مكتمل</p>
              </div>
              <div className="w-px h-8" style={{ background: "#E8ECF4" }} />
              <div className="text-right">
                <p className="text-sm font-black" style={{ color: "#0A0E1A" }}>4.8★</p>
                <p className="text-xs" style={{ color: "#8892A4" }}>متوسط التقييم</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom link */}
      <div className="mt-8 text-center">
        <p className="text-sm" style={{ color: "#8892A4" }}>
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-bold" style={{ color: "#1A4FD6" }}>
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
