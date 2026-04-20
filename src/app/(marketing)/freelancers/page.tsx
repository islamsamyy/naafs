"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  MapPin,
  Briefcase,
  ChevronDown,
  Zap,
  TrendingUp,
  Users,
  Award,
  ArrowLeft,
  ArrowRight,
  Verified,
  Globe,
  MessageSquare,
  ShieldCheck,
  Cpu,
  Sparkles,
  LayoutGrid,
  Filter,
  ArrowUpRight,
  Quote,
} from "lucide-react";

const COLORS = ["#1A4FD6", "#00C2A8", "#6366F1", "#F59E0B", "#EC4899", "#8B5CF6"];
const SKILL_GALAXY = [
  "React", "DevOps", "AI Architect", "Motion Design", "Cyber Security",
  "Python", "Figma", "NFT Art", "SEO Expert", "Product Manager"
];

interface FreelancerType {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviews: number;
  projects: number;
  hourlyRate: number;
  location: string;
  skills: string[];
  level: string;
  isOnline: boolean;
  verified: boolean;
  bio: string;
  accentColor: string;
}

const FreelancerCard = React.memo(function FreelancerCard({ f, idx }: { f: FreelancerType; idx: number }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Link
      href={`/freelancers/${f.id}`}
      className="group relative block rounded-[3rem] overflow-hidden border bg-white/60 backdrop-blur-xl transition-all duration-700 animate-fade-in-up"
      style={{
        borderColor: hovered ? f.accentColor + "40" : "rgba(232, 236, 244, 0.6)",
        boxShadow: hovered 
          ? `0 30px 60px ${f.accentColor}15, 0 10px 20px rgba(0,0,0,0.02)`
          : "0 10px 40px -15px rgba(26, 79, 214, 0.05)",
        transform: hovered ? "translateY(-10px) scale(1.01)" : "translateY(0) scale(1)",
        animationDelay: `${idx * 100}ms`
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ─── Card Decoration ─── */}
      <div 
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[60px] opacity-0 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${f.accentColor}15, transparent 70%)`, opacity: hovered ? 1 : 0 }}
      />
      
      <div className="relative p-8">
        {/* Header Row */}
        <div className="flex items-start gap-5 flex-row-reverse mb-6">
          <div className="relative flex-shrink-0">
            <div className={`absolute -inset-1 rounded-[1.8rem] opacity-0 transition-opacity duration-700 ${hovered ? 'opacity-100 animate-pulse' : ''}`} style={{ background: f.accentColor }} />
            <img
              src={f.avatar} alt={f.name}
              className="relative w-24 h-24 rounded-[1.7rem] object-cover border-2 border-white shadow-xl transition-transform duration-700 group-hover:rotate-3"
            />
            <div className="absolute -top-1 -left-1 flex items-center justify-center">
               <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center p-0.5 ${f.isOnline ? 'bg-accent' : 'bg-ink-muted'}`}>
                  {f.isOnline && <div className="w-full h-full rounded-full bg-white opacity-40 animate-ping" />}
               </div>
            </div>
          </div>

          <div className="flex-1 text-right pt-2 min-w-0">
            <div className="flex items-center gap-2 flex-row-reverse mb-1">
              <h3 className="text-xl font-black truncate" style={{ color: "#0A0E1A" }}>{f.name}</h3>
              {f.verified && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
                   <Verified className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
            </div>
            <p className="text-sm font-bold opacity-60 truncate" style={{ color: "#3D4560" }}>{f.title}</p>
            
            <div className="flex items-center gap-2 flex-row-reverse mt-3">
              <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="text-xs font-black mr-1 text-amber-700">{f.rating}</span>
              </div>
              <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">{f.reviews} تقييم</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-right mb-6 line-clamp-2 leading-relaxed opacity-80" style={{ color: "#3D4560" }}>
          {f.bio}
        </p>

        {/* Level & Rate Pills */}
        <div className="flex gap-2 flex-row-reverse mb-8">
           <div className="px-4 py-2 rounded-2xl bg-surface-container-low border border-border flex items-center gap-1.5 transition-colors duration-500 group-hover:border-primary/20">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase text-ink-muted">{f.level}</span>
           </div>
           <div 
             className="px-4 py-2 rounded-2xl flex items-center gap-1.5 transition-all duration-500"
             style={{ background: hovered ? f.accentColor : '#F5F7FC', color: hovered ? '#FFF' : '#0A0E1A' }}
           >
              <Zap className={`w-3.5 h-3.5 ${hovered ? 'fill-white text-white' : 'text-primary'}`} />
              <span className="text-[10px] font-black uppercase">${f.hourlyRate}/ساعة</span>
           </div>
        </div>

        {/* Skills - Mosaic Layout */}
        <div className="flex flex-wrap gap-2 mb-8 justify-end">
          {f.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-500 border bg-white shadow-sm"
              style={{ 
                color: hovered ? f.accentColor : "#3D4560", 
                borderColor: hovered ? f.accentColor + "30" : "rgba(0,0,0,0.05)"
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-dashed border-border group-hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 text-xs font-bold opacity-50" style={{ color: "#3D4560" }}>
            <MapPin className="w-3.5 h-3.5" />
            <span>{f.location}</span>
          </div>
          <button 
             className="px-6 py-2.5 rounded-2xl font-black text-xs transition-all duration-500 border group-hover:shadow-lg"
             style={{ 
               backgroundColor: hovered ? f.accentColor : 'white', 
               color: hovered ? 'white' : f.accentColor,
               borderColor: f.accentColor + "40"
             }}
          >
            مشاهدة الملف
          </button>
        </div>
      </div>
    </Link>
  );
});

export default function FreelancersListPage() {
  const [freelancers, setFreelancers] = useState<FreelancerType[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setScrolled(window.scrollY > 20); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadFreelancers() {
      setLoading(true);
      try {
        const supabase = require('@/lib/supabase').supabase;

        const { data: profiles, count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .eq('role', 'freelancer');

        if (profiles) {
          const accentColors = COLORS;
          const freelancersData = profiles.map((p: any, idx: number) => {
            const reviewCount = p.reviews_count || 0;
            let level = "متوسط";
            if (reviewCount > 100) level = "خبير";
            else if (reviewCount > 30) level = "متقدم";

            return {
              id: p.id,
              name: p.name || "بدون اسم",
              title: p.title || "محترف",
              avatar: p.avatar_url || `https://ui-avatars.com/api/?name=${p.name}&background=random&color=fff`,
              rating: p.rating || 0,
              reviews: p.reviews_count || 0,
              projects: 0,
              hourlyRate: p.hourly_rate || 0,
              location: p.location || "",
              skills: (Array.isArray(p.skills) ? p.skills : []) as string[],
              level,
              isOnline: false,
              verified: false,
              bio: p.bio || "",
              accentColor: accentColors[idx % accentColors.length],
            };
          });
          setFreelancers(freelancersData);

          const defaultCategories = [
            { label: "الكل", count: count || 0, icon: Globe },
            { label: "تطوير برمجيات", count: Math.floor((count || 0) * 0.4), icon: Cpu },
            { label: "تصميم UI/UX", count: Math.floor((count || 0) * 0.25), icon: Sparkles },
            { label: "تسويق رقمي", count: Math.floor((count || 0) * 0.15), icon: TrendingUp },
            { label: "كتابة محتوى", count: Math.floor((count || 0) * 0.11), icon: MessageSquare },
            { label: "تحليل بيانات", count: Math.floor((count || 0) * 0.09), icon: Briefcase },
          ];
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error("Failed to load freelancers:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFreelancers();
  }, []);

  const filtered = freelancers.filter((f) => {
    const isCategoryMatch = activeCategory === "الكل" || f.title.includes(activeCategory) || f.skills.some(s => s.includes(activeCategory));
    const isSearchMatch = !searchQuery || f.name.includes(searchQuery) || f.title.includes(searchQuery) || f.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return isCategoryMatch && isSearchMatch;
  });

  return (
    <div style={{ background: "#FAFBFF", fontFamily: "'Cairo', sans-serif" }} className="min-h-screen relative overflow-hidden">
      
      {/* ─── BACKGROUND DECORATION ─── */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent/5 blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="fixed inset-0 dot-grid pointer-events-none opacity-[0.02]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full blur-xl animate-float-up ${i % 2 === 0 ? 'bg-primary/10' : 'bg-accent/10'}`}
            style={{
              width: `${Math.random() * 120 + 40}px`,
              height: `${Math.random() * 120 + 40}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-20%`,
              animationDuration: `${Math.random() * 15 + 15}s`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* ─── LIVE AVAILABILITY DASHBOARD ─── */}
      <div className="fixed left-8 bottom-32 z-50 hidden xl:block animate-fade-in" style={{ animationDelay: '2000ms' }}>
         <div className="glass-panel-strong border-white/20 p-6 rounded-[2.5rem] shadow-2xl w-64 group hover:-translate-y-2 transition-transform duration-500">
            <div className="flex items-center justify-between mb-4 flex-row-reverse border-b border-white/10 pb-4">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Now</span>
               </div>
               <Users className="w-4 h-4 text-white/40" />
            </div>
            <div className="space-y-4">
               {[
                 { name: "أحمد ح.", status: "متاح", color: "bg-accent" },
                 { name: "سارة م.", status: "في اجتماع", color: "bg-amber-500" },
                 { name: "ياسين ب.", status: "متاح", color: "bg-accent" },
               ].map((user, i) => (
                 <div key={i} className="flex items-center justify-between flex-row-reverse">
                    <div className="flex items-center gap-3 flex-row-reverse">
                       <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-8 h-8 rounded-xl border border-white/10" alt="u" />
                       <span className="text-xs font-bold text-white/80">{user.name}</span>
                    </div>
                    <div className={`${user.color} w-1.5 h-1.5 rounded-full`} />
                 </div>
               ))}
            </div>
            <Link href="/register">
               <button className="w-full mt-6 py-3 rounded-2xl bg-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">View All Online</button>
            </Link>
         </div>
      </div>

      <div className="relative z-10">
        
        {/* News Ticker */}
        <div className="bg-white/50 backdrop-blur-md border-b border-primary/5 py-3 overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee gap-16">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-16 text-[10px] font-black uppercase tracking-widest text-primary/40">
                <span>تم توثيق ١٢٠ مستقلاً هذا الأسبوع</span>
                <span>•</span>
                <span>متوسط سرعة الرد: ٤ ساعات</span>
                <span>•</span>
                <span>أعلى مهارة طلباً: تطوير واجهات Next.js 15</span>
                <span>•</span>
                <span>المشاريع المكتملة الشهر الماضي: ٨٣٤ مشروع</span>
                <span>•</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ ENTERPRISE TRUST MARQUEE ══════════════ */}
        <div className="bg-primary/5 border-b border-white/50 py-6 overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee gap-24 items-center opacity-25 grayscale hover:grayscale-0 transition-all duration-700">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-24 items-center">
                <span className="text-2xl font-black italic">APPLE</span>
                <span className="text-2xl font-black italic">MICROSOFT</span>
                <span className="text-2xl font-black italic">STC</span>
                <span className="text-2xl font-black italic">NEOM</span>
                <span className="text-2xl font-black italic">GOOGLE</span>
                <span className="text-2xl font-black italic">ARAMCO</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ HERO SECTION ══════════════ */}
        <section className="pt-24 pb-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-8 border glass-panel animate-fade-in-up">
              <Verified className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary">تحقق عالي المستوى</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[1.05] tracking-tight mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              نخبة <span className="kinetic-gradient-text">المستقلين</span> <br />
              في العالم العربي
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-14 opacity-70 leading-relaxed animate-fade-in-up" style={{ color: "#3D4560", animationDelay: "200ms" }}>
              مجتمع من المحترفين الذين تم التحقق من هوياتهم وخبراتهم يدوياً. <br />
              ضمان الجودة يبدأ من الاختيار الدقيق.
            </p>

            {/* Futuristic Search & Filter Bar */}
            <div className="max-w-4xl mx-auto glass-panel p-2 rounded-[3.5rem] border border-white shadow-2xl flex flex-col md:flex-row items-stretch gap-2 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم، المهارة، أو التخصص..."
                  className="w-full h-16 rounded-[2.5rem] pr-16 pl-8 bg-surface-container-low/50 border-none focus:ring-2 focus:ring-primary/10 text-right font-black text-sm"
                />
              </div>

              <div className="flex gap-2 p-1">
                 <button 
                   onClick={() => setIsFilterOpen(!isFilterOpen)}
                   className="flex items-center gap-3 px-8 rounded-[2.5rem] bg-white border border-border font-black text-xs hover:bg-surface-container-low transition-all"
                 >
                   <span>تصفية متقدمة</span>
                   <Filter className="w-4 h-4" />
                 </button>
                 <button className="bg-primary hover:bg-primary-hover text-white px-10 rounded-[2.5rem] font-black text-sm transition-all shadow-xl shadow-primary/20 flex items-center gap-3 active:scale-95">
                   <span>تحديث النتائج</span>
                   <TrendingUp className="w-4 h-4" />
                 </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="flex flex-wrap justify-center gap-12 mt-20 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
               {[
                 { label: "مستقل نشط", value: "١,٢٠٠+", icon: Users, color: "#1A4FD6" },
                 { label: "متوسط الخبرة", value: "٦ سنوات", icon: Award, color: "#00C2A8" },
                 { label: "تقييم الرضا", value: "٤.٩/٥", icon: Star, color: "#F59E0B" },
                 { label: "هوية موثقة", value: "١٠٠٪", icon: ShieldCheck, color: "#6366F1" },
               ].map((s, i) => (
                 <div key={i} className="flex flex-col items-center group">
                    <div className="w-14 h-14 rounded-[1.5rem] flex items-center justify-center mb-4 shadow-sm bg-white border border-border group-hover:-translate-y-2 transition-all duration-500">
                       <s.icon className="w-6 h-6" style={{ color: s.color }} />
                    </div>
                    <span className="text-2xl font-black">{s.value}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 mt-1">{s.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* ══════════════ WHY NAFIS SECTION ══════════════ */}
        <section className="py-32 px-4 relative bg-primary/5 border-y border-primary/10">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center gap-20">
              <div className="md:w-1/2 text-right">
                 <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                    لماذا تختار <br /> <span className="text-primary italic">نافــس</span> ؟
                 </h2>
                 <div className="space-y-8">
                    {[
                      { title: "توثيق يدوي صارم", desc: "لا نقبل الجميع. فقط المبدعين الذين يجتازون اختبارات الجودة والهوية.", icon: ShieldCheck },
                      { title: "دقة في المواعيد", desc: "نظام تتبع ذكي يضمن تسليم مشاريعك في وقتها المحدد.", icon: Zap },
                      { title: "دعم محلي بلغتكم", desc: "فريق دعم متاح على مدار الساعة يتحدث العربية ويفهم احتياجاتكم.", icon: MessageSquare },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-6 flex-row-reverse group">
                         <div className="w-14 h-14 rounded-2xl bg-white border shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <item.icon className="w-6 h-6 text-primary" />
                         </div>
                         <div>
                            <h3 className="text-xl font-black mb-2">{item.title}</h3>
                            <p className="text-sm font-bold opacity-60 leading-relaxed text-ink-muted">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="md:w-1/2 relative">
                 <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                 <div className="relative rounded-[4rem] overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-all duration-1000">
                    <img src="https://picsum.photos/800/600?random=11" alt="team" loading="lazy" className="w-full grayscale hover:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                 </div>
              </div>
           </div>
        </section>

        {/* ══════════════ SKILL HEATMAP ══════════════ */}
        <section className="py-32 px-4 relative">
           <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-16">
                 <div className="md:w-1/2 text-right">
                    <h2 className="text-4xl font-black mb-6">خارطة <span className="kinetic-gradient-text">الطلب</span> المعرفي</h2>
                    <p className="text-lg opacity-60 font-bold mb-10 leading-relaxed max-w-lg ml-auto">
                       نحلل آلاف المشاريع يومياً لنقدم لك قائمة بأكثر المهارات طلباً من قبل كبار أصحاب الأعمال في المنطقة.
                    </p>
                    <div className="space-y-4">
                       {[
                         { skill: "Next.js & React", demand: 95, color: "bg-primary" },
                         { skill: "AI Engineering", demand: 88, color: "bg-accent" },
                         { skill: "UI Modernization", demand: 82, color: "bg-indigo-500" },
                         { skill: "Cloud Architecture", demand: 76, color: "bg-pink-500" },
                       ].map((s, i) => (
                         <div key={i} className="p-5 rounded-3xl bg-white border border-border shadow-sm flex items-center justify-between flex-row-reverse hover:shadow-md transition-all">
                            <span className="text-sm font-black">{s.skill}</span>
                            <div className="flex items-center gap-4">
                               <div className="w-32 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.demand}%` }} />
                               </div>
                               <span className="text-xs font-black opacity-40">{s.demand}%</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="md:w-1/2 grid grid-cols-2 gap-6 relative">
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`aspect-[4/5] rounded-[3rem] p-1 border shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:rotate-2 ${i % 2 === 0 ? 'mt-12' : ''}`}>
                         <img
                          loading="lazy"
                          src={`https://picsum.photos/400/500?random=${i + 20}`}
                          className="w-full h-full object-cover rounded-[2.8rem]"
                          alt="skill"
                         />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* ══════════════ FEATURED PROFESSIONAL SPOTLIGHT ══════════════ */}
        <section className="py-40 px-4">
           <div className="max-w-6xl mx-auto glass-panel p-1 border shadow-2xl rounded-[5rem] overflow-hidden group">
              <div className="flex flex-col lg:flex-row-reverse">
                 <div className="lg:w-1/2 relative bg-ink-primary p-12 lg:p-24 flex flex-col justify-center text-white text-right overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                    <Quote className="absolute top-12 left-12 w-20 h-20 text-white opacity-10" />
                    <div className="relative z-10 flex flex-col items-end">
                      <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
                         <Star className="w-4 h-4 fill-accent text-accent" />
                         <span className="text-[10px] font-black uppercase text-accent">عضو النخبة المميز</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black mb-6">سارة الماجد</h2>
                      <p className="text-xl font-bold opacity-80 leading-relaxed mb-10 max-w-lg">
                         "نافـس وفر لي المنصة المثالية للوصول إلى كبار العملاء في الخليج. الجودة هنا هي المعيار الوحيد للنجاح والنمو."
                      </p>
                      <div className="flex gap-10">
                         <div>
                            <p className="text-3xl font-black text-primary">١٥٦</p>
                            <p className="text-[10px] font-black uppercase opacity-40">مشروع ناجح</p>
                         </div>
                         <div className="border-l border-white/10 pl-10">
                            <p className="text-3xl font-black text-accent">٩ سنوات</p>
                            <p className="text-[10px] font-black uppercase opacity-40">خبرة عملية</p>
                         </div>
                      </div>
                      <Link href="/register">
                        <button className="mt-12 flex items-center gap-3 px-10 py-5 rounded-2xl bg-primary text-white font-black hover:scale-105 transition-all">
                           <span>مشاهدة الملف الكامل</span>
                           <ArrowUpRight className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>
                 </div>
                 <div className="lg:w-1/2 overflow-hidden">
                    <img 
                      src="https://picsum.photos/800/600?random=25"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                      alt="featured"
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* ══════════════ LISTING SECTION ══════════════ */}
        <section className="px-4 md:px-8 pb-32">
          <div className="max-w-[1400px] mx-auto">
            
            <div className="mb-16 text-right">
               <h2 className="text-3xl font-black mb-4">استكشف المهارات المتاحة</h2>
               <p className="text-sm font-bold opacity-50">تصفح حسب التصنيف أو ابحث عن تخصص معين</p>
            </div>

            {/* Category Navigation - Horizontal Scroller */}
            <div className="flex items-center gap-3 overflow-x-auto pb-8 mb-12 scrollbar-hide flex-row-reverse">
              {categories.length > 0 ? (
                categories.map((cat: any, i: number) => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    className={`group flex items-center gap-3 px-8 py-4 rounded-[2.2rem] border transition-all duration-500 whitespace-nowrap animate-fade-in-up ${
                      activeCategory === cat.label
                      ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30 scale-105'
                      : 'bg-white text-ink-secondary border-border hover:border-primary/30'
                    }`}
                    style={{ animationDelay: `${500 + i * 50}ms` }}
                  >
                    <cat.icon className={`w-4 h-4 ${activeCategory === cat.label ? 'text-white' : 'text-primary opacity-50 group-hover:scale-110 transition-transform'}`} />
                    <span className="text-sm font-black">{cat.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black ${activeCategory === cat.label ? 'bg-white/20' : 'bg-surface-container-low text-ink-muted'}`}>
                      {cat.count}
                    </span>
                  </button>
                ))
              ) : (
                [...Array(6)].map((_, i: number) => (
                  <div key={i} className="h-12 w-32 rounded-[2.2rem] bg-surface-container-low animate-pulse" />
                ))
              )}
            </div>

            {/* View Switch bar */}
            <div className="flex items-center justify-between mb-10 flex-row-reverse glass-panel p-4 rounded-3xl border border-white">
              <div className="flex items-center gap-3 flex-row-reverse">
                <p className="text-sm font-black" style={{ color: "#0A0E1A" }}>{filtered.length} مستقل مرشح</p>
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              </div>
              
              <div className="flex items-center gap-4">
                 <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-border text-xs font-black hover:border-primary/30 transition-all">
                    <span>فرز حسب: الأوصى بهم</span>
                    <ChevronDown className="w-4 h-4 opacity-40" />
                 </button>
                 <div className="flex p-1 bg-surface-container-low border border-border rounded-xl">
                    <button className="p-2.5 rounded-lg bg-white shadow-sm text-primary"><LayoutGrid className="w-4 h-4" /></button>
                    <button className="p-2.5 rounded-lg text-ink-muted hover:text-primary transition-colors"><MessageSquare className="w-4 h-4" /></button>
                 </div>
              </div>
            </div>

            {/* Professionals Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-panel rounded-[3rem] p-8 animate-pulse">
                    <div className="flex items-start gap-5 flex-row-reverse mb-6">
                      <div className="w-24 h-24 rounded-[1.7rem] bg-surface-container-low" />
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-surface-container-low rounded w-3/4" />
                        <div className="h-4 bg-surface-container-low rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="h-4 bg-surface-container-low rounded" />
                      <div className="h-4 bg-surface-container-low rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                 {filtered.map((f: any, i: number) => <FreelancerCard key={f.id} f={f} idx={i} />)}
               </div>
            ) : (
              <div className="py-40 text-center glass-panel rounded-[4rem] border border-white">
                <div className="w-24 h-24 rounded-[2.5rem] bg-surface-container-low flex items-center justify-center mx-auto mb-8">
                  <Cpu className="w-10 h-10 text-primary opacity-20" />
                </div>
                <h3 className="text-3xl font-black mb-4">للاسف، لا يوجد تطابق</h3>
                <p className="text-sm opacity-50 font-bold">حاول تغيير معايير البحث أو استكشاف تصنيفات أخرى</p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("الكل"); }}
                  className="mt-10 px-10 py-5 rounded-[2rem] bg-primary text-white font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  العودة للكل
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════ SKILL GALAXY ══════════════ */}
        <section className="py-40 px-4">
           <div className="max-w-7xl mx-auto text-center relative">
              <h2 className="text-3xl font-black mb-16">مجرة المهارات التقنية</h2>
              <div className="flex flex-wrap justify-center gap-6 animate-fade-in">
                 {SKILL_GALAXY.map((skill, i) => (
                   <div 
                    key={skill} 
                    className="px-10 py-6 rounded-full bg-white border border-white shadow-xl hover:scale-110 hover:border-primary transition-all duration-500 text-sm font-black cursor-pointer animate-float-up"
                    style={{ animationDelay: `${i * 200}ms`, animationDuration: '6s' }}
                   >
                     {skill}
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* ══════════════ CALL TO ACTION ══════════════ */}
        <section className="px-4 md:px-8 pb-32">
          <div className="max-w-[1200px] mx-auto relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-[4rem] blur-[20px] opacity-50 group-hover:opacity-100 transition duration-1000" />
            <div className="relative glass-panel rounded-[4rem] p-12 md:p-20 border border-white overflow-hidden text-center md:text-right">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(0,194,168,0.05),transparent)]" />
               <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
                  <div className="flex-1">
                     <h2 className="text-4xl md:text-5xl font-black mb-6">هل أنت مستقل محترف؟</h2>
                     <p className="text-lg opacity-60 leading-relaxed font-bold mb-8">
                       انضم إلى كوكبة المبدعين العرب، احصل على مشاريع نوعية وبناء سمعتك الرقمية في سوق النخبة.
                     </p>
                     <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                        <button className="bg-primary hover:bg-primary-hover text-white px-12 py-5 rounded-[2.5rem] font-black shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                           <span>سجل الآن كمستقل</span>
                           <ArrowUpRight className="w-5 h-5 font-bold" />
                        </button>
                        <button className="bg-white hover:bg-surface-container-low text-primary px-12 py-5 rounded-[2.5rem] border-2 border-primary/20 font-black transition-all">
                           <span>تعلم كيف تنضم</span>
                        </button>
                     </div>
                  </div>
                  <div className="hidden lg:block w-72 h-72 relative">
                     <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                     <img 
                       src="https://picsum.photos/400/400?random=26"
                       className="w-full h-full object-cover rounded-[3rem] shadow-2xl transition-transform duration-700 group-hover:rotate-6"
                       alt="cta"
                     />
                  </div>
               </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(33.33%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .dot-grid {
           background-image: radial-gradient(rgba(26, 79, 214, 0.2) 1px, transparent 1px);
           background-size: 30px 30px;
        }
        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up infinite linear;
        }
        .kinetic-gradient-text {
          background: linear-gradient(90deg, #1A4FD6, #00C2A8, #6366F1, #1A4FD6);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 8s linear infinite;
        }
        @keyframes shine {
          to { background-position: 300% center; }
        }
        .glass-panel-strong {
          background: rgba(10, 14, 26, 0.7);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .dot-grid {
           background-image: radial-gradient(rgba(26, 79, 214, 0.3) 1px, transparent 1px);
           background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
