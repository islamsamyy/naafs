"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Check, Zap, Shield, Star } from "lucide-react";

const PLANS = [
  {
    name: "مجاني", price: 0, period: "للأبد", color: "#3D4560", badge: null,
    features: ["حتى 5 عروض شهرياً", "ملف شخصي أساسي", "دعم المجتمع", "مزادات عامة فقط"],
    cta: "ابدأ مجاناً", href: "/register",
  },
  {
    name: "نافِس برو", price: 149, period: "شهرياً", color: "#1A4FD6", badge: "الأكثر شعبية",
    features: ["عروض غير محدودة", "ملف شخصي محسّن", "أولوية في المزادات", "دعم على مدار الساعة", "شارة موثّق", "تحليلات أداء متقدمة"],
    cta: "ابدأ 14 يوم مجاناً", href: "/register",
  },
  {
    name: "بلاتيني", price: 349, period: "شهرياً", color: "#00C2A8", badge: "نخبة المستقلين",
    features: ["كل مميزات برو", "ظهور مميز في نتائج البحث", "مدير حساب شخصي", "تدريب ومحتوى حصري", "عمولة 5% فقط", "مزادات VIP حصرية"],
    cta: "انضم للنخبة", href: "/register",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#FAFBFF", fontFamily: "'Cairo', sans-serif" }}>
      <section className="py-24 px-6 text-center" style={{ background: "linear-gradient(135deg, #EEF3FF, #E6FAF8)" }}>
        <h1 className="text-5xl md:text-7xl font-black mb-4" style={{ color: "#0A0E1A", letterSpacing: "-2px" }}>خطط الأسعار</h1>
        <p className="text-xl mb-8 max-w-xl mx-auto" style={{ color: "#3D4560" }}>ابدأ مجاناً، وارتقِ بمهاراتك مع نافِس</p>
        <div className="inline-flex items-center gap-3 p-1 rounded-xl" style={{ background: "white", border: "1px solid #E8ECF4" }}>
          <button onClick={() => setAnnual(false)} className="px-5 py-2 rounded-lg text-sm font-bold transition-all" style={{ background: !annual ? "#1A4FD6" : "transparent", color: !annual ? "white" : "#3D4560" }}>شهري</button>
          <button onClick={() => setAnnual(true)} className="px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2" style={{ background: annual ? "#1A4FD6" : "transparent", color: annual ? "white" : "#3D4560" }}>
            سنوي
            <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: "#E6FAF8", color: "#00C2A8" }}>وفر 20%</span>
          </button>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container mx-auto grid md:grid-cols-3 gap-8 max-w-5xl">
          {PLANS.map((plan, i) => {
            const price = annual && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price;
            const popular = i === 1;
            return (
              <div
                key={i}
                className="rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative"
                style={{
                  border: popular ? `2px solid ${plan.color}` : "1px solid #E8ECF4",
                  background: popular ? "#EEF3FF" : "white",
                  boxShadow: popular ? "0 8px 40px rgba(26,79,214,0.12)" : "none",
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black text-white" style={{ background: plan.color }}>
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-xl font-black text-right mb-2" style={{ color: "#0A0E1A" }}>{plan.name}</h3>
                <div className="text-right mb-6">
                  <span className="text-5xl font-black" style={{ color: plan.color }}>{price === 0 ? "مجاني" : price}</span>
                  {price > 0 && <span className="text-lg" style={{ color: "#8892A4" }}> ج/{annual ? "سنة" : "شهر"}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 justify-end text-sm" style={{ color: "#3D4560" }}>
                      <span>{f}</span>
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="block w-full py-3.5 rounded-xl font-bold text-center transition-all duration-200 hover:scale-105"
                  style={{
                    background: popular ? plan.color : "transparent",
                    color: popular ? "white" : plan.color,
                    border: `2px solid ${plan.color}`,
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6" style={{ background: "#F5F7FC" }}>
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-black text-center mb-10" style={{ color: "#0A0E1A" }}>أسئلة شائعة</h2>
          {[
            { q: "هل يوجد عمولة؟", a: "نعم، تأخذ نافِس 10% كعمولة من قيمة المشروع. خطة بلاتيني تقلل العمولة إلى 5%." },
            { q: "كيف يعمل نظام الضمان؟", a: "يودع العميل المبلغ عند بدء المشروع، ويُحرر للمستقل بعد اعتماد التسليم النهائي." },
            { q: "هل يمكنني الإلغاء في أي وقت؟", a: "نعم، يمكنك إلغاء اشتراكك في أي وقت دون رسوم إضافية." },
          ].map((item, i) => (
            <div key={i} className="mb-4 p-6 bg-white rounded-xl border text-right" style={{ borderColor: "#E8ECF4" }}>
              <h4 className="font-bold mb-2" style={{ color: "#0A0E1A" }}>{item.q}</h4>
              <p className="text-sm leading-relaxed" style={{ color: "#3D4560" }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
