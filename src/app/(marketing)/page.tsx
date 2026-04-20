"use client";

import React, { useState, useEffect } from "react";
import { Zap, Lock, CheckCircle, Headphones, TrendingUp, ArrowLeft, Globe, Target, Cpu, ShieldCheck, ArrowRight, ZapOff, Sparkles, Activity } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NafisLogo } from "@/components/ui/NafisLogo";

export default function HomePage() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="overflow-x-hidden bg-white selection:bg-primary selection:text-white">
      {/* ══════════════ HERO SECTION ══════════════ */}
      <section className="relative pt-40 pb-32 px-8 min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Futuristic Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full bg-[#FAFBFF]" />
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.4] bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 dot-grid opacity-[0.05]" />
        </div>

        <div className="container mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          {/* Left Side: Text & CTAs */}
          <div className="text-right space-y-12 order-1 lg:order-2">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-primary/10 shadow-sm animate-fade-in-up">
              <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">الجيل القادم من العمل الحر</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-[#0A0E1A] leading-[1.05] tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              نـافـس <br />
              <span className="italic font-light text-primary">المستقبل</span> <br />
              <span className="relative">
                بمهاراتـك
                <div className="absolute -bottom-4 right-0 w-full h-2 bg-accent opacity-20 blur-sm rounded-full" />
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-[#3D4560] max-w-xl leading-relaxed font-bold opacity-80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              أول منصة مزادات لحظية في الشرق الأوسط. اطرح مشروعك الآن وشاهد الخبراء يتنافسون لتقديم أفضل قيمة في دقائق معدودة.
            </p>

            <div className="flex gap-6 flex-wrap justify-end animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/projects/create">
                <button className="group relative bg-[#0A0E1A] text-white px-12 py-6 rounded-[2rem] text-xl font-black transition-all hover:scale-105 active:scale-95 overflow-hidden shadow-2xl shadow-black/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative flex items-center gap-3">
                    ابدأ مشروعك الآن
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform rotate-180" />
                  </span>
                </button>
              </Link>
              <Link href="/explore">
                <button className="px-12 py-6 rounded-[2rem] text-xl font-black border-2 border-primary/10 text-primary hover:bg-primary/5 transition-all">
                  اكتشف المنصة
                </button>
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-8 justify-end opacity-40 grayscale animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <span className="text-sm font-black tracking-widest uppercase">Trusted By</span>
              <div className="w-[1px] h-8 bg-[#3D4560]/20" />
              <div className="flex gap-8">
                <span className="font-black italic">APPLE</span>
                <span className="font-black italic">STC</span>
                <span className="font-black italic">NEOM</span>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Widget */}
          <div className="relative order-2 lg:order-1 perspective-1000">
             <div className="relative w-full max-w-[580px] mx-auto group animate-float-up">
                {/* Main Card */}
                <div className="relative z-20 rounded-[3.5rem] bg-white/70 backdrop-blur-3xl border border-white/50 p-10 shadow-[0_50px_100px_-20px_rgba(26,79,214,0.15)] overflow-hidden">
                   {/* Cyber Scanline */}
                   <div className="absolute inset-0 bg-cyber-scanline opacity-[0.03] pointer-events-none" />
                   
                   <div className="flex justify-between items-start mb-10 flex-row-reverse relative z-10">
                      <div className="text-right">
                         <p className="text-[10px] font-black text-[#3D4560]/50 uppercase tracking-[0.2em] mb-2">المزاد الجاري الآن</p>
                         <div className="flex items-center gap-3 justify-end">
                            <h3 className="text-5xl font-black text-[#0A0E1A] tracking-tighter">$2,450</h3>
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                               <TrendingUp className="w-6 h-6" />
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#E6FAF8] border border-[#00C2A8]/20">
                         <span className="w-2 h-2 rounded-full bg-[#00C2A8] animate-ping" />
                         <span className="text-xs font-black text-[#00C2A8] tracking-widest">LIVE BID</span>
                      </div>
                   </div>

                   <div className="space-y-6 relative z-10">
                      {[
                        { name: 'عمر خالد', role: 'خبير AI', amount: '$2,400', color: 'primary', avatar: 'https://i.pravatar.cc/150?u=omar' },
                        { name: 'نورا السعد', role: 'مصممة واجهات', amount: '$2,350', color: 'accent', avatar: 'https://i.pravatar.cc/150?u=nora' },
                        { name: 'ليان م.', role: 'مطور Next.js', amount: '$2,450', status: 'Leading', avatar: 'https://i.pravatar.cc/150?u=layan' }
                      ].map((bidder, i) => (
                        <div key={i} className={`flex flex-row-reverse items-center justify-between p-5 rounded-3xl transition-all duration-500 hover:bg-white/50 border ${bidder.status ? 'border-primary/20 bg-white shadow-xl' : 'border-transparent'}`}>
                          <div className="flex flex-row-reverse items-center gap-4">
                            <div className="relative w-14 h-14">
                               <div className={`absolute -inset-1 rounded-2xl bg-${bidder.color || 'primary'} opacity-0 group-hover:opacity-20 blur-sm`} />
                               <img src={bidder.avatar} alt={bidder.name} loading="lazy" className="relative w-full h-full rounded-2xl object-cover border-2 border-white shadow-sm" />
                            </div>
                            <div className="text-right">
                               <div className="flex items-center gap-2 justify-end">
                                  {bidder.status && <span className="text-[8px] font-black bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-widest">{bidder.status}</span>}
                                  <h4 className="text-base font-black text-[#0A0E1A]">{bidder.name}</h4>
                               </div>
                               <p className="text-[10px] text-[#3D4560]/60 font-black uppercase tracking-widest">{bidder.role}</p>
                            </div>
                          </div>
                          <div className="text-left font-black text-lg text-primary">{bidder.amount}</div>
                        </div>
                      ))}
                   </div>

                   <div className="mt-10 flex justify-center pt-8 border-t border-white/50 relative z-10">
                      <Link href="/auctions" className="w-full">
                        <Button className="h-16 w-full rounded-2xl bg-[#0A0E1A] hover:bg-black text-white font-black group">
                           <span>دخول المزاد الآن</span>
                           <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-5px] transition-transform" />
                        </Button>
                      </Link>
                   </div>
                </div>

                {/* Decorative floating bits */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
             </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TOP CATEGORIES GRID ══════════════ */}
      <section className="py-32 px-8 bg-white relative">
         <div className="container mx-auto">
            <div className="flex flex-col md:flex-row-reverse items-end justify-between mb-20 gap-8">
               <div className="text-right space-y-4">
                  <div className="inline-flex gap-2 items-center text-primary font-black text-xs uppercase tracking-widest">
                     <span>مجالات الإبداع</span>
                     <Target className="w-4 h-4" />
                  </div>
                  <h2 className="text-5xl font-black text-[#0A0E1A]">تصفح حسب <br /> التخصص التقني</h2>
               </div>
               <Link href="/explore">
                  <Button variant="outline" className="rounded-2xl border-primary/20 hover:bg-primary/5 px-8 py-7 font-black flex items-center gap-3">
                     <span>كل الفئات</span>
                     <ArrowLeft className="w-4 h-4" />
                  </Button>
               </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                  { title: "تطوير تطبيقات AI", count: "٢٤٠ خبير", icon: Cpu, color: "bg-primary" },
                  { title: "تصميم واجهات UX/UI", count: "٤٥٠ خبير", icon: Target, color: "bg-accent" },
                  { title: "برمجة الويب المتكاملة", count: "٨٩٠ خبير", icon: Globe, color: "bg-indigo-600" },
                  { title: "كتابة المحتوى الإبداعي", count: "١٢٠ خبير", icon: Headphones, color: "bg-emerald-600" },
                  { title: "تحليل البيانات الضخمة", count: "١٨٠ خبير", icon: TrendingUp, color: "bg-amber-600" },
                  { title: "أمن المعلومات والسحابة", count: "٩٥ خبير", icon: ShieldCheck, color: "bg-red-600" },
                  { title: "تسويق رقمي متقدم", count: "٣٢٠ خبير", icon: Zap, color: "bg-purple-600" },
                  { title: "تصميم الهويات البصرية", count: "٢١٠ خبير", icon: Sparkles, color: "bg-pink-600" },
               ].map((cat, i) => (
                  <div key={i} className="group relative glass-panel p-8 rounded-[2.5rem] border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer">
                     <div className={`w-14 h-14 rounded-2xl ${cat.color} text-white flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
                        <cat.icon className="w-7 h-7" />
                     </div>
                     <h3 className="text-xl font-black text-[#0A0E1A] mb-2">{cat.title}</h3>
                     <p className="text-sm font-bold text-[#3D4560]/50 tracking-widest">{cat.count}</p>
                     
                     <div className="absolute bottom-6 left-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-500">
                        <ArrowLeft className="w-5 h-5 text-primary" />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════ STATS PULSE ══════════════ */}
      <section className="py-24 bg-[#0A0E1A] relative overflow-hidden">
         <div className="absolute inset-0 bg-cyber-scanline opacity-[0.05]" />
         <div className="container mx-auto px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               {[
                 { label: 'مستقل موثوق', value: '١٢,٥٠٠', icon: ShieldCheck, color: 'primary' },
                 { label: 'مشروع منجز', value: '٤,٨٠٠', icon: CheckCircle, color: 'accent' },
                 { label: 'متوسط الأداء', value: '٪٩٨', icon: Activity, color: 'primary' },
                 { label: 'دعم تقني', value: '٢٤/٧', icon: Headphones, color: 'accent' }
               ].map((stat, i) => (
                 <div key={i} className="text-right space-y-4 group">
                    <div className="flex flex-row-reverse items-center gap-4">
                       <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:border-white/30 transition-all duration-500 group-hover:bg-primary/20">
                          <stat.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">{stat.value}</p>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{stat.label}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════ BENTO GRID EXPERIENCE ══════════════ */}
      <section className="py-32 px-8 relative">
         <div className="container mx-auto">
            <div className="text-right mb-20 space-y-4">
               <div className="inline-flex gap-2 items-center text-primary font-black text-xs uppercase tracking-widest">
                  <span>لماذا نافس؟</span>
                  <Sparkles className="w-4 h-4" />
               </div>
               <h2 className="text-5xl font-black text-[#0A0E1A]">منظومة متكاملة <br /> للنجاح الرقمي</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[300px]">
               {/* Large Feature */}
               <div className="md:col-span-8 group relative overflow-hidden rounded-[3rem] bg-[#FAFBFF] border border-primary/5 p-12 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-32 translate-x-32 group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 h-full flex flex-col justify-between items-end text-right">
                     <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-xl flex items-center justify-center text-primary">
                        <Lock className="w-8 h-8" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-3xl font-black text-[#0A0E1A]">أمان مالي فائق</h3>
                        <p className="text-lg text-[#3D4560]/80 max-w-md font-bold">
                           نظام حماية المستحقات يضمن لك حقك كاملاً. لا يتم تحويل المبالغ إلا بعد استلامك للعمل بجودة ١٠٠٪.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Small Feature 1 */}
               <div className="md:col-span-4 group relative overflow-hidden rounded-[3rem] bg-accent text-white p-12 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/30">
                  <div className="relative z-10 h-full flex flex-col justify-between items-end text-right">
                     <Zap className="w-12 h-12" />
                     <div className="space-y-4">
                        <h3 className="text-2xl font-black">سرعة خارقة</h3>
                        <p className="text-sm font-bold opacity-90">
                           نظام توظيف ذكي يربطك بالمرشح المثالي في أقل من ٢٤ ساعة عبر المزايدة المعلنة.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Small Feature 2 */}
               <div className="md:col-span-4 group relative overflow-hidden rounded-[3rem] bg-primary text-white p-12 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/30">
                  <div className="relative z-10 h-full flex flex-col justify-between items-end text-right">
                     <Cpu className="w-12 h-12" />
                     <div className="space-y-4">
                        <h3 className="text-2xl font-black">خوارزميات ذكية</h3>
                        <p className="text-sm font-bold opacity-90">
                           نحلل المهارات لنقدم لك أفضل المتنافسين بناءً على داتا الأداء الحقيقية.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Medium Feature */}
               <div className="md:col-span-8 group relative overflow-hidden rounded-[3rem] bg-white border border-outline-variant p-12 transition-all duration-700 hover:border-primary/30">
                  <div className="absolute inset-0 bg-dot-grid opacity-[0.03]" />
                  <div className="relative z-10 h-full flex items-center justify-between flex-row-reverse text-right">
                     <div className="space-y-6 flex-1">
                        <h3 className="text-3xl font-black text-[#0A0E1A]">دعم فني استباقي</h3>
                        <p className="text-lg text-[#3D4560]/80 font-bold">
                           فريقنا المهني متاح بمستويات دعم VIP لضمان سير مشاريعك البرمجية والتقنية بسلاسة مطلقة.
                        </p>
                        <Link href="/how-it-works">
                           <button className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                              <span>تعرف على الفريق</span>
                              <ArrowLeft className="w-4 h-4" />
                           </button>
                        </Link>
                     </div>
                     <div className="hidden lg:block w-48 h-48 rounded-[2rem] bg-primary/5 border border-primary/10 flex items-center justify-center animate-float-up">
                        <Headphones className="w-20 h-20 text-primary opacity-20" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ══════════════ LIVE AUCTIONS SNAPSHOT ══════════════ */}
      <section className="py-32 px-8 bg-[#FAFBFF] relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
         <div className="container mx-auto">
            <div className="text-center mb-20 space-y-6">
               <h2 className="text-5xl font-black text-[#0A0E1A]">المزادات <span className="kinetic-gradient-text">النشطة</span> الآن</h2>
               <p className="text-lg text-[#3D4560]/60 font-bold max-w-2xl mx-auto">شاهد المنافسة في الميدان. نصوص ذكية، عروض قوية، وفرص حقيقية.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                  { id: "e25ce536-e457-454b-8976-6bc2bed6ad63", title: "تطوير تطبيق توصيل طلبات", bids: 8, current: "$١,٢٠٠", timeLeft: "١٤ دقيقة", category: "موبايل" },
                  { id: "2", title: "تصميم متجر إلكتروني احترافي", bids: 12, current: "$٨٥٠", timeLeft: "٤٥ دقيقة", category: "تصميم" },
                  { id: "3", title: "نظام أتمتة باستخدام GPT-4", bids: 5, current: "$٢,٤٠٠", timeLeft: "٣ ساعات", category: "ذكاء اصطناعي" },
               ].map((auction, i) => (
                  <div key={i} className="glass-panel p-8 rounded-[3rem] border border-white hover:border-primary/20 transition-all duration-500 shadow-xl group">
                     <div className="flex justify-between items-center mb-6 flex-row-reverse">
                        <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-black text-[10px] tracking-widest uppercase">{auction.category}</span>
                        <div className="flex items-center gap-2 text-[#00C2A8] font-black text-xs">
                           <Activity className="w-4 h-4 animate-pulse" />
                           <span>مباشر</span>
                        </div>
                     </div>
                     <h3 className="text-xl font-black text-[#0A0E1A] mb-8 leading-relaxed text-right">{auction.title}</h3>
                     <div className="flex justify-between items-end border-t border-primary/5 pt-6 flex-row-reverse">
                        <div className="text-right">
                           <p className="text-[10px] text-[#3D4560]/40 font-black uppercase mb-1">أعلى عرض</p>
                           <p className="text-2xl font-black text-primary tracking-tighter">{auction.current}</p>
                        </div>
                        <div className="text-left">
                           <div className="flex items-center gap-2 text-[#3D4560]/60 font-bold text-xs mb-1">
                              <Zap className="w-3.5 h-3.5" />
                              <span>{auction.bids} عروض</span>
                           </div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{auction.timeLeft} متبقي</p>
                        </div>
                     </div>
                     <Link href={`/projects/${auction.id}`} className="block mt-8">
                        <button className="w-full py-4 rounded-2xl bg-white border border-primary/10 text-primary font-black hover:bg-primary hover:text-white transition-all duration-500">
                           شاهد المزاد
                        </button>
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════ AI MATCHMAKING CONSOLE ══════════════ */}
      <section className="py-24 px-8 relative bg-[#0A0E1A] overflow-hidden">
         <div className="absolute inset-0 bg-cyber-scanline opacity-[0.05]" />
         <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
               {/* Left: Interactive Terminal */}
               <div className="w-full lg:w-1/2 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent opacity-20 blur-2xl group-hover:opacity-40 transition-opacity" />
                  <div className="relative rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 p-8 shadow-2xl overflow-hidden min-h-[450px]">
                     <div className="flex items-center gap-2 mb-8 justify-end">
                        <span className="text-[10px] font-black text-primary/60 tracking-[0.3em]">AI-ENGINE v4.0</span>
                        <div className="flex gap-1.5 ml-auto">
                           <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                           <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                           <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                        </div>
                     </div>
                     
                     <div className="space-y-6 font-mono text-sm leading-relaxed text-right">
                        <div className="flex flex-row-reverse gap-4 animate-pulse">
                           <span className="text-primary font-bold">[SYSTEM]</span>
                           <span className="text-white/60">Initializing matching sequence...</span>
                        </div>
                        <div className="flex flex-row-reverse gap-4">
                           <span className="text-accent font-bold">[ENGINE]</span>
                           <span className="text-white/80">Analyzing 1,240 project parameters...</span>
                        </div>
                        
                        <div className="pt-4 grid grid-cols-2 gap-4">
                           {[
                              { label: 'Match Rate', val: '98%', color: 'primary' },
                              { label: 'Efficiency', val: '100%', color: 'accent' },
                              { label: 'Speed', val: 'Low-Latency', color: 'primary' },
                              { label: 'Trust Score', val: 'AAA+', color: 'accent' }
                           ].map((m, i) => (
                              <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center">
                                 <span className="text-[10px] text-white/40 uppercase mb-1">{m.label}</span>
                                 <span className={`text-xl font-black ${m.color === 'primary' ? 'text-primary' : 'text-accent'}`}>{m.val}</span>
                              </div>
                           ))}
                        </div>

                        <div className="relative mt-8 h-40 flex items-center justify-center">
                           <div className="absolute inset-0 flex items-center justify-between opacity-20 px-10">
                              <div className="w-px h-full bg-primary/50" />
                              <div className="w-px h-full bg-accent/50" />
                           </div>
                           <div className="relative w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full border-4 border-accent border-b-transparent animate-spin-slow" />
                           </div>
                           <div className="absolute flex flex-col items-center animate-bounce">
                              <Cpu className="w-10 h-10 text-white" />
                              <span className="text-[8px] font-bold mt-2 text-white/40 uppercase">Matching...</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right: Text Content */}
               <div className="w-full lg:w-1/2 text-right space-y-8">
                  <div className="inline-flex gap-2 items-center bg-accent/10 text-accent px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                     <span>ذكاء اصطناعي متطور</span>
                     <Target className="w-4 h-4" />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-white">تطابق ذكي <br /> في ثوانٍ معدودة</h2>
                  <p className="text-xl text-white/60 font-medium leading-relaxed max-w-xl lg:ml-auto">
                     خوارزمياتنا السحابية لا تختار المستقل الأرخص، بل تختار الأنسب لمواصفات مشروعك التقنية، مما يرفع نسبة نجاح المشاريع إلى ٩٩٪.
                  </p>
                  <Link href="/how-it-works">
                    <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 text-white hover:bg-white/5 font-black flex items-center gap-3 lg:ml-auto">
                       <span>تعرف على التقنية</span>
                       <Sparkles className="w-4 h-4 text-accent" />
                    </Button>
                  </Link>
               </div>
            </div>
         </div>
      </section>


      {/* ══════════════ GLOBAL TALENT MAP ══════════════ */}
      <section className="py-32 px-8 bg-[#FAFBFF] overflow-hidden">
         <div className="container mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-right space-y-8">
               <div className="inline-flex gap-2 items-center bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                  <span>تغطية إقليمية</span>
                  <Globe className="w-4 h-4" />
               </div>
               <h2 className="text-5xl font-black text-[#0A0E1A]">أكبر شبكة خبراء <br /> في الخليج العربي</h2>
               <p className="text-xl text-[#3D4560]/70 font-bold leading-relaxed">
                  من الرياض إلى دبي، ومن الكويت إلى القاهرة. نافس تجمع لك صفوة المطورين والمصممين والمحللين تحت سقف واحد.
               </p>
               <div className="flex gap-12 justify-end">
                  <div className="text-right">
                     <p className="text-4xl font-black text-primary">٢٨+</p>
                     <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">مدينة متصلة</p>
                  </div>
                  <div className="text-right">
                     <p className="text-4xl font-black text-accent">١٠٠٪</p>
                     <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">تغطية تقنية</p>
                  </div>
               </div>
            </div>

            <div className="relative h-[500px] group">
               <div className="absolute inset-0 bg-primary/5 rounded-[4rem] group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 flex items-center justify-center">
                  {/* Simulated Map / Node Network */}
                  <div className="relative w-full h-[80%] max-w-sm mx-auto">
                     {[...Array(6)].map((_, i) => (
                        <div 
                           key={i} 
                           className="absolute w-4 h-4 bg-primary rounded-full animate-ping opacity-20"
                           style={{
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              animationDelay: `${i * 0.5}s`
                           }}
                        />
                     ))}
                     <div className="absolute inset-0 border-[2px] border-primary/10 rounded-full border-dashed animate-spin-slow opacity-20" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 bg-white shadow-2xl rounded-full flex items-center justify-center border border-primary/20">
                           <Globe className="w-20 h-20 text-primary animate-pulse" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ══════════════ ELITE MEMBERSHIP HIGHLIGHT ══════════════ */}
      <section className="py-40 px-8 relative overflow-hidden">
         <div className="absolute inset-0 bg-[#0A0E1A]" />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(245,158,11,0.1),transparent)]" />
         
         <div className="container mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
               <div className="relative order-2 lg:order-1">
                  <div className="aspect-square rounded-[4rem] border-2 border-white/5 bg-white/5 backdrop-blur-3xl p-12 flex flex-col justify-center gap-8 relative overflow-hidden">
                     <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[80px]" />
                     <div className="flex flex-col gap-6 relative z-10">
                        {[
                           "أولوية الوصول للمشاريع الكبرى",
                           "شعار التوثيق الذهبي المعتمد",
                           "عمولة مخفضة بنسبة ٥٠٪",
                           "مدير حسابات مخصص ٢٤/٧"
                        ].map((txt, i) => (
                           <div key={i} className="flex items-center gap-4 flex-row-reverse text-right">
                              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                 <CheckCircle className="w-5 h-5" />
                              </div>
                              <span className="text-xl text-white font-bold opacity-80">{txt}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="text-right space-y-8 order-1 lg:order-2">
                  <div className="inline-flex gap-2 items-center bg-accent/10 border border-accent/20 text-accent px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[0.3em]">
                     <Sparkles className="w-4 h-4" />
                     <span>عضوية NAVIS ELITE</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">تميز عن <br /> <span className="text-accent underline decoration-accent/20">الآخرين</span></h2>
                  <p className="text-xl text-white/50 font-medium leading-relaxed max-w-xl lg:ml-auto">
                     انتقل بتجربتك في العمل الحر إلى أبعاد جديدة. باقات مخصصة للشركات الكبرى والمستقلين المحترفين الباحثين عن التفرد.
                  </p>
                  <button className="px-14 py-6 rounded-[2rem] bg-accent text-[#0A0E1A] font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-accent/20">
                     استكشف مزايا النخبة
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* ══════════════ LATEST INSIGHTS (BLOG) ══════════════ */}
      <section className="py-32 px-8 bg-white">
         <div className="container mx-auto">
            <div className="text-center mb-20 space-y-4">
               <h2 className="text-5xl font-black text-[#0A0E1A]">رؤى <span className="kinetic-gradient-text">مستقبلية</span></h2>
               <p className="text-lg text-[#3D4560]/60 font-bold max-w-xl mx-auto uppercase tracking-widest">The Nafis Academy</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
               {[
                  { title: "كيف ترفع فرص فوزك بالمزادات بذكاء؟", date: "١٥ أبريل ٢٠٢٤", author: "خالد الساير", tag: "دليل المستقل" },
                  { title: "مستقبل الذكاء الاصطناعي في السوق العربي", date: "١٠ أبريل ٢٠٢٤", author: "سارة محمد", tag: "تقنية" },
                  { title: "٥ نصائح لضمان جودة المشاريع البرمجية", date: "٠٥ أبريل ٢٠٢٤", author: "فهد العتيبي", tag: "إدارة مشاريع" },
               ].map((post, i) => (
                  <div key={i} className="group cursor-pointer">
                     <div className="aspect-[16/10] rounded-[3rem] bg-[#FAFBFF] border border-primary/5 mb-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                        <div className="absolute top-8 right-8 px-4 py-1.5 rounded-full bg-white shadow-sm text-[10px] font-black text-primary border border-primary/5">{post.tag}</div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100">
                           <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-xl">
                              <ArrowLeft className="w-8 h-8" />
                           </div>
                        </div>
                     </div>
                     <div className="text-right space-y-3 pr-4 border-r-2 border-transparent group-hover:border-primary transition-all duration-500">
                        <p className="text-[10px] text-[#3D4560]/40 font-black uppercase tracking-widest">{post.date} • بواسطة {post.author}</p>
                        <h3 className="text-2xl font-black text-[#0A0E1A] group-hover:text-primary transition-colors">{post.title}</h3>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════ ABOUT NAFIS (BRAND IDENTITY) ══════════════ */}
      <section className="py-40 px-8 relative overflow-hidden bg-[#FAFBFF]">
         <div className="absolute inset-0 bg-dot-grid opacity-[0.02]" />
         <div className="container mx-auto">
            <div className="flex flex-col items-center text-center space-y-12">
               <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <NafisLogo height={180} className="relative z-10 transition-transform duration-700 group-hover:scale-105" />
               </div>
               
               <div className="max-w-3xl space-y-8">
                  <h2 className="text-4xl md:text-6xl font-black text-[#0A0E1A] leading-tight flex flex-col items-center">
                     <span>المنافسة تصنع</span>
                     <span className="kinetic-gradient-text italic">القيمة الحقيقية</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-[#3D4560]/70 font-bold leading-relaxed">
                     نافس ليست مجرد منصة توظيف، بل هي بيئة متكاملة تهدف لإحداث ثورة في السوق الرقمي العربي. نحن نؤمن أن الشفافية في المزادات والروح التنافسية هي المحرك الأساسي لرفع جودة التنفيذ وعدالة الأسعار.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-12 pt-8">
                     {[
                        { label: "رؤية طموحة", value: "٢٠٣٠" },
                        { label: "قوة تقنية", value: "AI" },
                        { label: "مجتمع متفاعل", value: "+١٠k" }
                     ].map((stat, i) => (
                        <div key={i} className="text-center group">
                           <p className="text-3xl font-black text-primary mb-1 group-hover:scale-110 transition-transform">{stat.value}</p>
                           <p className="text-[10px] font-black text-[#3D4560]/40 uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ══════════════ PROJECT LIFECYCLE TIMELINE ══════════════ */}
      <section className="py-32 px-8 relative overflow-hidden bg-white">
         <div className="container mx-auto">
            <div className="text-center mb-24 space-y-4">
               <h2 className="text-5xl font-black text-[#0A0E1A]">رحلة مشروعك في نافس</h2>
               <p className="text-lg text-[#3D4560]/60 font-bold tracking-widest uppercase">From Vision to Reality</p>
            </div>

            <div className="relative max-w-5xl mx-auto">
               <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary/5 via-primary to-primary/5 hidden md:block" />
               
               <div className="space-y-24">
                  {[
                     { title: 'اطرح فكرتك', desc: 'حدد متطلباتك بوضوح في أقل من دقيقة عبر واجهة ذكية.', side: 'right', icon: Zap },
                     { title: 'تنافس لحظي', desc: 'شاهد الخبراء وهم يقدمون عروضهم أمامك مباشرة في مزاد حي.', side: 'left', icon: TrendingUp },
                     { title: 'اختيار الأفضل', desc: 'بناءً على تقييمات AI وسابقة الأعمال الموثقة.', side: 'right', icon: CheckCircle },
                     { title: 'تسليم وحماية', desc: 'استلم مشروعك ووثق نجاحك بأمان مالي تام ونظام ضمان متطور.', side: 'left', icon: ShieldCheck }
                  ].map((step, i) => (
                     <div key={i} className={`relative flex items-center flex-col md:flex-row ${step.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 group`}>
                        <div className="flex-1 text-center md:text-right">
                           <div className={`p-8 md:p-10 rounded-[2.5rem] bg-[#FAFBFF] border border-transparent transition-all duration-700 hover:border-primary/20 hover:bg-white hover:shadow-[0_40px_80px_-15px_rgba(26,79,214,0.1)]`}>
                              <h4 className="text-2xl font-black text-[#0A0E1A] mb-4">{step.title}</h4>
                              <p className="text-lg text-[#3D4560]/70 font-bold">{step.desc}</p>
                           </div>
                        </div>
                        <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#0A0E1A] text-white flex items-center justify-center shadow-xl group-hover:scale-125 transition-transform duration-500 shrink-0">
                           <step.icon className="w-7 h-7" />
                           <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-lg scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                        <div className="flex-1 hidden md:block" />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ══════════════ SUCCESS PULSE ══════════════ */}
      <section className="py-24 px-8 bg-primary/5 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
         <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="text-right flex-1">
                  <h3 className="text-4xl font-black text-[#0A0E1A] mb-4">مجتمع ينبض بالحياة</h3>
                  <p className="text-lg text-[#3D4560]/70 font-bold max-w-md ml-auto">بينما تشاهد هذه الصفحة، هناك مشاريع تقنية يتم تسليمها الآن لمؤسسات وشركات ناشئة في الخليج.</p>
               </div>
               
               <div className="flex-1 w-full overflow-hidden relative">
                  <div className="flex gap-6 animate-marquee">
                     {[1,2,3,4,5,6].map((u) => (
                        <div key={u} className="flex-shrink-0 bg-white p-6 rounded-3xl border border-primary/10 shadow-sm flex items-center gap-4 flex-row-reverse">
                           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10 shrink-0">
                              <img src={`https://i.pravatar.cc/100?u=user${u}`} alt="user" loading="lazy" className="w-full h-full object-cover" />
                           </div>
                           <div className="text-right whitespace-nowrap">
                              <p className="text-sm font-black text-[#0A0E1A]">تم إنهاء مشروع تطبيق توصيل</p>
                              <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">قبل {u * 3} دقائق</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ══════════════ FAQ ACCORDION ══════════════ */}
      <section className="py-32 px-8 relative bg-white">
         <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16 space-y-4">
               <div className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                  <Headphones className="w-4 h-4" />
                  <span>مركز المساعدة</span>
               </div>
               <h2 className="text-5xl font-black text-[#0A0E1A]">لديك استفسار؟</h2>
            </div>
            
            <div className="space-y-4">
               {[
                  { q: 'كيف يعمل نظام المزايدة اللحظي؟', a: 'بمجرد طرح مشروعك، يتلقى المستقلون تنفيهاً فورياً للبدء في طرح عروضهم السعرية والزمنية في ساحة عامة تضمن لك الشفافية التامة والوصول لأفضل سعر متاح في السوق.' },
                  { q: 'ما هي ضمانات حماية مستحقاتي؟', a: 'نحن نستخدم نظام الضمان (Escrow) المتطور. يبقى مبلغ المشروع في عهدة منصة نافس ولا يتم تحريره للمستقل إلا بعد موافقتك النهائية على جودة العمل المسلم.' },
                  { q: 'هل يمكنني التواصل المباشر مع المستقل؟', a: 'نعم، توفر المنصة نظام مراسلة داخلي متطور يدعم مشاركة الملفات، المكالمات الصوتية، ومتابعة سير العمل لحظة بلحظة لضمان التوافق التام.' }
               ].map((item, i) => (
                  <details key={i} className="group overflow-hidden rounded-[2rem] border border-primary/5 bg-[#FAFBFF] transition-all duration-300 open:bg-white open:shadow-xl open:border-primary/20">
                     <summary className="flex items-center justify-between p-8 cursor-pointer list-none flex-row-reverse">
                        <span className="text-xl font-black text-[#0A0E1A]">{item.q}</span>
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform group-open:rotate-45 group-open:bg-primary group-open:text-white">
                           <Zap className="w-5 h-5" />
                        </div>
                     </summary>
                     <div className="px-8 pb-8 text-right text-lg text-[#3D4560]/70 font-medium leading-relaxed">
                        {item.a}
                     </div>
                  </details>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="py-40 px-8 relative overflow-hidden">

         <div className="absolute inset-0 bg-[#0A0E1A]" />
         <div className="absolute inset-0 bg-cyber-scanline opacity-[0.1]" />
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
         
         <div className="container mx-auto text-center relative z-10 space-y-12">
            <h2 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tighter">
               هل أنت مستعد <br /> لرحلة <span className="text-accent underline decoration-accent/20">النمو؟</span>
            </h2>
            <p className="text-2xl text-white/60 max-w-2xl mx-auto font-bold">
               انضم للآلاف من رواد الأعمال والمستقلين الذين اختاروا "نافس" كواجهتهم للابتكار.
            </p>
            <div className="flex gap-6 justify-center flex-wrap pt-8">
               <Link href="/register">
                 <button className="bg-white text-[#0A0E1A] px-14 py-6 rounded-[2rem] text-xl font-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                    ابدأ الآن مجاناً
                 </button>
               </Link>
               <Link href="/how-it-works">
                 <button className="bg-transparent border-2 border-white/20 text-white px-14 py-6 rounded-[2rem] text-xl font-black hover:bg-white/10 transition-all">
                    تحدث مع خبير
                 </button>
               </Link>
            </div>
         </div>
      </section>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
