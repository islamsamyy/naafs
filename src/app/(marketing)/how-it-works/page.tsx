"use client";
import React from "react";
import Link from "next/link";
import { Zap, Users, TrendingDown, Shield, Clock, Star, CheckCircle, ArrowLeft } from "lucide-react";

const STEPS_BUSINESS = [
  { icon: "📋", step: "1", title: "انشر مشروعك", desc: "أدخل تفاصيل مشروعك والميزانية القصوى وحدد مدة المزاد (24-72 ساعة)" },
  { icon: "⚡", step: "2", title: "شاهد المزاد مباشرة", desc: "يتنافس المستقلون على مشروعك في الوقت الحقيقي — الأسعار تنخفض تلقائياً" },
  { icon: "🏆", step: "3", title: "اختر الفائز", desc: "راجع ملفات المستقلين وعروضهم، ثم اختر الأفضل سعراً وجودةً" },
  { icon: "💰", step: "4", title: "ادفع بأمان", desc: "الدفع محفوظ في حساب ضمان حتى تستلم المشروع وتوافق عليه" },
];

const STEPS_FREELANCER = [
  { icon: "👤", step: "1", title: "أنشئ ملفك الشخصي", desc: "أضف مهاراتك وأعمالك السابقة واحصل على توثيق نافس" },
  { icon: "🎯", step: "2", title: "تصفح المزادات", desc: "اكتشف المشاريع المناسبة لمهاراتك وقدّر حجم المنافسة" },
  { icon: "📊", step: "3", title: "قدّم أفضل عرض", desc: "تنافس بسعر منطقي — نظامنا يعرض لك السعر الأعلى حالياً" },
  { icon: "✅", step: "4", title: "استلم مدفوعاتك", desc: "بعد اعتماد العمل تُحوّل الأموال إلى محفظتك فورياً" },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFBFF", fontFamily: "'Cairo', sans-serif" }}>
      {/* Hero */}
      <section className="py-24 px-6 text-center" style={{ background: "linear-gradient(135deg, #EEF3FF, #E6FAF8)" }}>
        <h1 className="text-5xl md:text-7xl font-black mb-4" style={{ color: "#0A0E1A", letterSpacing: "-2px" }}>كيف يعمل نافِس؟</h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "#3D4560" }}>
          نظام مزادات عكسية يضمن أفضل سعر للعميل وأفضل فرصة للمستقل
        </p>
      </section>

      {/* Business Steps */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: "#EEF3FF", color: "#1A4FD6" }}>للشركات والأعمال</span>
            <h2 className="text-4xl font-black mt-4" style={{ color: "#0A0E1A" }}>أنجز مشروعك بأقل تكلفة</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS_BUSINESS.map((s, i) => (
              <div key={i} className="relative text-center p-8 rounded-2xl border bg-white" style={{ borderColor: "#E8ECF4" }}>
                {i < 3 && <div className="hidden md:block absolute top-1/2 -left-3 w-6 h-0.5" style={{ background: "#E8ECF4" }} />}
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white mx-auto mb-4" style={{ background: "#1A4FD6" }}>{s.step}</div>
                <h3 className="font-black text-lg mb-2" style={{ color: "#0A0E1A" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#3D4560" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Freelancer Steps */}
      <section className="py-20 px-6" style={{ background: "#F5F7FC" }}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: "#E6FAF8", color: "#00C2A8" }}>للمستقلين</span>
            <h2 className="text-4xl font-black mt-4" style={{ color: "#0A0E1A" }}>حوّل مهاراتك إلى دخل</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {STEPS_FREELANCER.map((s, i) => (
              <div key={i} className="text-center p-8 rounded-2xl border bg-white" style={{ borderColor: "#E8ECF4" }}>
                <div className="text-4xl mb-4">{s.icon}</div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white mx-auto mb-4" style={{ background: "#00C2A8" }}>{s.step}</div>
                <h3 className="font-black text-lg mb-2" style={{ color: "#0A0E1A" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#3D4560" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Nafis */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-black text-center mb-12" style={{ color: "#0A0E1A" }}>لماذا نافِس؟</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <TrendingDown className="w-7 h-7" />, title: "أسعار أقل دائماً", desc: "المزادات العكسية تضمن أن ينخفض السعر مع كل عرض جديد — توفير يصل إلى 40%" },
              { icon: <Shield className="w-7 h-7" />, title: "حماية كاملة", desc: "نظام ضمان يحفظ أموالك حتى تستلم عملك وتوافق عليه" },
              { icon: <Star className="w-7 h-7" />, title: "مواهب موثّقة", desc: "كل مستقل يمر بعملية توثيق صارمة — مهاراته مؤكدة وتقييماته حقيقية" },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl text-center border" style={{ borderColor: "#E8ECF4" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white" style={{ background: "linear-gradient(135deg, #1A4FD6, #00C2A8)" }}>
                  {item.icon}
                </div>
                <h3 className="font-black text-xl mb-3" style={{ color: "#0A0E1A" }}>{item.title}</h3>
                <p className="leading-relaxed" style={{ color: "#3D4560" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "linear-gradient(135deg, #1A4FD6, #00C2A8)" }}>
        <h2 className="text-4xl font-black text-white mb-4">جاهز للبدء؟</h2>
        <p className="text-white/80 mb-8 text-lg">انضم لآلاف المستخدمين الذين وثقوا بنافِس</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="px-8 py-4 rounded-xl font-black text-lg transition-all hover:scale-105" style={{ background: "white", color: "#1A4FD6" }}>أنشر مشروعك</Link>
          <Link href="/register" className="px-8 py-4 rounded-xl font-black text-lg border-2 border-white text-white transition-all hover:bg-white/10">ابدأ كمستقل</Link>
        </div>
      </section>
    </div>
  );
}
