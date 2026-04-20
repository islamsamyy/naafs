"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
import { Bell, Zap, TrendingUp, Clock, Users, ArrowUpRight, Search, Filter, ShieldCheck, Target, Sparkles, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [topBid, setTopBid] = useState("$0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuctions() {
      setLoading(true);
      try {
        // Single query with embedded bids — eliminates N+1
        const { data: projects } = await supabase
          .from('projects')
          .select('id, title, description, budget_min, budget_max, deadline, category, created_at, bids(id, amount)')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(6);

        if (projects) {
          const now = new Date();
          const auctionsData = projects.map((p: any) => {
            const bids: any[] = p.bids || [];
            const maxBid = bids.length > 0
              ? Math.max(...bids.map((b: any) => b.amount || 0))
              : p.budget_min;

            const diffHours = Math.floor((now.getTime() - new Date(p.created_at).getTime()) / 3600000);
            const status = diffHours < 24 ? "NEW" : diffHours < 72 ? "HOT" : "TRENDING";

            const timeLeft = new Date(p.deadline).getTime() - now.getTime();
            const hours = Math.max(0, Math.floor(timeLeft / 3600000));
            const mins = Math.max(0, Math.floor((timeLeft % 3600000) / 60000));
            const secs = Math.max(0, Math.floor((timeLeft % 60000) / 1000));

            return {
              id: p.id,
              title: p.title,
              description: p.description,
              currentBid: `$${Math.floor(maxBid || 0)}`,
              timeLeft: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
              bidCount: bids.length,
              bidders: bids.slice(0, 3).map((b: any) => ({
                name: `عارض ${b.id.slice(0, 4)}`,
                avatar: `https://ui-avatars.com/api/?name=${b.id}&background=random`,
              })),
              category: p.category || "غير محدد",
              status,
              image: ["https://picsum.photos/800/600?random=51", "https://picsum.photos/800/600?random=52", "https://picsum.photos/800/600?random=53"][p.id.charCodeAt(0) % 3],
            };
          });

          setAuctions(auctionsData);
          const topAmount = auctionsData.reduce((max: number, a: any) => {
            const val = parseInt(a.currentBid.replace('$', '')) || 0;
            return val > max ? val : max;
          }, 0);
          setTopBid(`$${topAmount}`);
        }
      } catch (error) {
        console.error("Failed to load auctions:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAuctions();
  }, []);

  return (
    <div className="bg-[#FAFBFF] min-h-screen">
      {/* ══════════════ AUCTION HERO ══════════════ */}
      <section className="relative pt-32 pb-24 px-8 overflow-hidden bg-[#0A0E1A]">
        {/* Cyber Background */}
        <div className="absolute inset-0 bg-cyber-scanline opacity-[0.1]" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(26,79,214,0.5)]" />
        
        <div className="container mx-auto relative z-10 flex flex-col md:flex-row-reverse items-center justify-between gap-16">
           <div className="text-right space-y-8 md:w-1/2">
              <div className="inline-flex items-center gap-3 bg-primary/20 text-primary px-4 py-2 rounded-xl border border-primary/30">
                 <Zap className="w-4 h-4 fill-primary" />
                 <span className="text-xs font-black uppercase tracking-widest">ساحة المنافسة المباشرة</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                 زايد بذكاء <br />
                 <span className="text-accent underline decoration-accent/20 italic">اربح بتميز</span>
              </h1>
              <p className="text-xl text-white/60 font-medium">
                 أقوى المشاريع التقنية والبرمجية تُطرح هنا. شارك في المزادات اللحظية واظفر بعقود أحلامك.
              </p>
              <div className="flex gap-4 justify-end">
                 <Link 
                   href="/explore"
                   className="h-16 px-12 rounded-2xl bg-white text-[#0A0E1A] font-black text-lg hover:bg-white/90 flex items-center justify-center transition-all"
                 >
                    استكشف الفرص
                 </Link>
                 <Link 
                   href="/how-it-works"
                   className="h-16 px-12 rounded-2xl border-2 border-white/20 text-white font-black text-lg hover:bg-white/5 flex items-center justify-center transition-all"
                 >
                    كيف أزايد؟
                 </Link>
              </div>
           </div>

           {/* Live Pulse Card */}
           <div className="w-full md:w-80 group">
              <div className="relative rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 p-8 shadow-2xl hover:shadow-primary/20 transition-all duration-700">
                 <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black animate-bounce shadow-xl">
                    LIVE NOW
                 </div>
                 <div className="text-right space-y-6">
                    <div>
                       <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">أعلى عرض مسجل اليوم</p>
                       <p className="text-4xl font-black text-white">{topBid}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
                       <div className="flex justify-between items-center text-xs font-bold text-white/50 flex-row-reverse">
                          <span>الوقت المتبقي</span>
                          <Clock className="w-4 h-4" />
                       </div>
                       <div className="flex justify-center gap-3">
                          {['04', '22', '15'].map((v, i) => (
                             <div key={i} className="flex flex-col items-center">
                                <span className="text-2xl font-black text-accent">{v}</span>
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{i === 0 ? 'HR' : i === 1 ? 'MIN' : 'SEC'}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                    <Link 
                      href="/explore"
                      className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 flex items-center justify-center transition-all"
                    >
                       رفع المزايدة
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ══════════════ SEARCH & FILTERS ══════════════ */}
      <section className="sticky top-20 z-30 py-6 px-8 border-b border-white/50 bg-white/70 backdrop-blur-2xl">
         <div className="container mx-auto flex flex-col md:flex-row-reverse gap-6 items-center justify-between">
            <div className="relative w-full md:w-96 group">
               <input 
                  type="text" 
                  placeholder="ابحث عن مشاريع المزايدة..." 
                  className="w-full h-14 pr-14 pl-6 rounded-2xl bg-white border border-outline-variant/50 focus:border-primary outline-none text-right font-bold transition-all shadow-sm group-hover:shadow-md"
               />
               <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            </div>

            <div className="flex gap-3 flex-row-reverse overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
               {['الكل', 'تطوير ويب', 'ذكاء اصطناعي', 'تصميم', 'بلوكتشين'].map((cat, i) => (
                  <button 
                     key={i} 
                     className={`whitespace-nowrap px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-primary text-white shadow-lg' : 'bg-white border text-[#3D4560] hover:border-primary/30'}`}
                  >
                     {cat}
                  </button>
               ))}
               <div className="w-[1px] h-10 bg-outline-variant mx-2" />
               <button className="p-3 rounded-xl bg-white border text-[#3D4560] hover:text-primary transition-colors">
                  <Filter className="w-5 h-5" />
               </button>
            </div>
         </div>
      </section>

      {/* ══════════════ AUCTION GRID ══════════════ */}
      <section className="py-20 px-8">
         <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {loading ? (
                 [...Array(6)].map((_, i) => (
                   <div key={i} className="rounded-[3rem] bg-white border border-white shadow-sm overflow-hidden animate-pulse">
                     <div className="h-64 bg-surface-container-low" />
                     <div className="p-8 space-y-6">
                       <div className="space-y-2">
                         <div className="h-4 bg-surface-container-low rounded w-1/3" />
                         <div className="h-6 bg-surface-container-low rounded w-3/4" />
                       </div>
                       <div className="space-y-2">
                         <div className="h-4 bg-surface-container-low rounded" />
                         <div className="h-4 bg-surface-container-low rounded w-5/6" />
                       </div>
                     </div>
                   </div>
                 ))
               ) : auctions.length > 0 ? (
                 auctions.map((auction: any) => (
                  <div 
                     key={auction.id} 
                     className="group relative flex flex-col rounded-[3rem] bg-white border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(26,79,214,0.15)]"
                  >
                     {/* Media Area */}
                     <div className="relative h-64 overflow-hidden">
                        <img 
                           src={auction.image} 
                           alt={auction.title} 
                           className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        
                        <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
                           <Activity className={`w-3 h-3 ${auction.status === 'HOT' ? 'text-orange-500' : 'text-accent'}`} />
                           <span className="text-[9px] font-black text-white uppercase tracking-widest">{auction.status}</span>
                        </div>

                        <div className="absolute bottom-6 right-6 left-6 flex justify-between items-end flex-row-reverse">
                           <div className="text-right">
                              <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">المزاد الحالي</p>
                              <p className="text-2xl font-black text-white tracking-tighter">{auction.currentBid}</p>
                           </div>
                           <div className="px-4 py-2 rounded-xl bg-accent text-white font-black text-xs shadow-xl">
                              {auction.timeLeft}
                           </div>
                        </div>
                     </div>

                     {/* Content Area */}
                     <div className="p-8 space-y-6 text-right flex-1 flex flex-col">
                        <div>
                           <div className="flex justify-between items-center mb-2 flex-row-reverse">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest group-hover:translate-x-[-5px] transition-transform">{auction.category}</span>
                              <div className="flex -space-x-1 -space-x-reverse">
                                 {auction.bidders.map((b: any, i: number) => (
                                    <img key={i} src={b.avatar} className="w-6 h-6 rounded-full border border-white shadow-sm" alt={b.name} />
                                 ))}
                                 <div className="w-6 h-6 rounded-full bg-primary/10 border border-white flex items-center justify-center text-[8px] font-black text-primary">
                                    +{auction.bidCount}
                                 </div>
                              </div>
                           </div>
                           <h3 className="text-xl font-black text-[#0A0E1A] line-clamp-1 group-hover:text-primary transition-colors">{auction.title}</h3>
                        </div>

                        <p className="text-sm font-medium text-[#3D4560]/60 leading-relaxed line-clamp-2">
                           {auction.description}
                        </p>

                        <div className="pt-6 border-t border-outline-variant/30 flex justify-between items-center flex-row-reverse mt-auto">
                           <Link href={`/projects/${auction.id}`} className="flex items-center gap-2 group/btn cursor-pointer">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">التفاصيل</span>
                              <ArrowUpRight className="w-4 h-4 text-primary group-hover/btn:rotate-45 transition-transform" />
                           </Link>
                           <Link 
                             href={`/projects/${auction.id}`}
                             className="h-12 px-8 rounded-xl bg-[#0A0E1A] hover:bg-black text-white font-black text-xs group flex items-center justify-center transition-all gap-2"
                           >
                              <span>المزايدة</span>
                              <Zap className="w-3 h-3 group-hover:scale-125 transition-transform" />
                           </Link>
                        </div>
                     </div>
                  </div>
                ))
               ) : (
                 <div className="col-span-full text-center py-20">
                   <p className="text-lg font-bold text-[#3D4560]">لا توجد مزادات متاحة حالياً</p>
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* ══════════════ UPCOMING CALENDAR ══════════════ */}
      <section className="py-24 px-8 bg-white overflow-hidden relative">
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
         <div className="container mx-auto">
            <div className="flex justify-between items-end mb-16 flex-row-reverse">
               <div className="text-right space-y-2">
                  <h2 className="text-4xl font-black text-[#0A0E1A]">جدول المزادات الكبرى</h2>
                  <p className="font-medium text-[#3D4560]/60">خطط لاستراتيجيتك وجدول مهامك للقادم.</p>
               </div>
                <Link href="/pricing">
                   <Button variant="outline" className="border-primary/20 text-primary font-black rounded-xl h-12">
                      تحميل الجدول كامل
                   </Button>
                </Link>
            </div>

            <div className="space-y-4">
               {[
                 { title: 'يوم المطورين (Developers Marathon)', items: '٢٤٠ مشروع', date: 'الاثنين القادم', color: 'primary' },
                 { title: 'ساعة التصميم (Design Hour)', items: '٨٥ مشروع', date: 'الأربعاء، ٢٠ مايو', color: 'accent' },
                 { title: 'قمة الذكاء الاصطناعي (AI Summit)', items: '١٥ مشروع VIP', date: 'قريباً', color: 'indigo-500' }
               ].map((event, i) => (
                 <div key={i} className="group relative flex flex-col md:flex-row-reverse items-center justify-between p-8 rounded-[2.5rem] bg-[#FAFBFF] border border-transparent hover:border-primary/20 hover:bg-white transition-all duration-500 hover:shadow-xl hover:shadow-primary/5">
                    <div className="flex flex-row-reverse items-center gap-8 w-full md:w-auto">
                       <div className={`w-16 h-16 rounded-2xl bg-${event.color}/10 flex items-center justify-center text-${event.color}`}>
                          <Target className="w-8 h-8" />
                       </div>
                       <div className="text-right">
                          <h4 className="text-xl font-black text-[#0A0E1A]">{event.title}</h4>
                          <p className="text-xs font-black text-[#3D4560]/40 uppercase tracking-widest">{event.items}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-8 mt-6 md:mt-0">
                       <div className="text-right px-6 border-r border-outline-variant">
                          <p className="text-lg font-black text-primary">{event.date}</p>
                          <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">الموعد المتوقع</p>
                       </div>
                       <Button className="h-12 w-12 rounded-xl bg-white border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all group/btn">
                          <Bell className="w-5 h-5 group-hover/btn:scale-110" />
                       </Button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* ══════════════ REAL-TIME TICKER ══════════════ */}
      <div className="bg-[#0A0E1A] py-6 border-t border-white/5 overflow-hidden">
         <div className="flex animate-marquee gap-20 whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
               <div key={i} className="flex gap-20 items-center">
                  <div className="flex items-center gap-3 text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                     <span>تم بيع عقد "تطوير لوحة تحكم" بقيمة $٤,٥٠٠</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">
                     <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                     <span>مزايدة جديدة على "تصميم هوية" +$٢٠٠</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">
                     <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                     <span>تبقي ٥ دقائق على مشروع "تحليل بيانات"</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
