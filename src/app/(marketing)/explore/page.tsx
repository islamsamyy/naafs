"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  LayoutGrid,
  List,
  Sparkles,
  Search,
  Zap,
  TrendingUp,
  Users,
  Star,
  Activity,
  Globe,
  ShieldCheck,
  MousePointer2,
  Cpu,
  Layers,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";
import { TalentCard } from "@/components/marketplace/TalentCard";
import { TalentFilters } from "@/components/marketplace/TalentFilters";
import { getTalents } from "@/lib/services/talentService";
import { Talent } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function StatCard({ icon: Icon, value, label, color, delay }: { icon: any; value: string; label: string; color: string; delay: string }) {
  return (
    <div
      className="group relative flex flex-col items-center justify-center p-6 rounded-[2.5rem] border bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up"
      style={{ 
        borderColor: "rgba(232, 236, 244, 1)", 
        animationDelay: delay,
      }}
    >
      <div 
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at center, ${color}08, transparent 70%)` }}
      />
      <div 
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner"
        style={{ background: `${color}12`, border: `1px solid ${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <p className="text-2xl font-black tracking-tight text-[#0A0E1A]">{value}</p>
      <p className="text-xs font-black uppercase tracking-wider mt-1 text-[#3D4560]/80">{label}</p>
    </div>
  );
}

function MarqueeItem({ name, role, avatar, color }: any) {
  return (
    <div className="flex items-center gap-4 px-8 py-4 bg-white rounded-full border border-primary/10 shadow-lg whitespace-nowrap hover:shadow-xl hover:border-primary/30 transition-all duration-300">
      <img src={avatar} alt={name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
      <div>
        <h4 className="text-xs font-black text-[#0A0E1A]">{name}</h4>
        <p className="text-[10px] font-bold" style={{ color }}>{role}</p>
      </div>
      <Star className="w-3 h-3 fill-amber-400 text-amber-400 ml-2" />
    </div>
  );
}

export default function ExplorePage() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridView, setGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [filters, setFilters] = useState({
    category: "الكل",
    experienceLevels: [] as any[],
    priceRange: 500,
  });
  const [stats, setStats] = useState({ freelancers: 0, projects: 0, avgRating: 0 });
  const [projectPulse, setProjectPulse] = useState<any[]>([]);

  const spotlightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        spotlightRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(26, 79, 214, 0.04) 0%, transparent 40%)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const supabase = require('@/lib/supabase').supabase;

        const data = await getTalents();
        setTalents(data);

        const { data: topTalents } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'freelancer')
          .order('rating', { ascending: false })
          .limit(12);

        if (topTalents) {
          const risingData = topTalents.map((p: any) => ({
            id: p.id,
            name: p.name || 'Anonymous',
            role: p.title || 'Talent',
            price: `$${p.hourly_rate || 0}`,
            rating: (p.rating || 0).toString(),
            reviews: (p.reviews_count || 0).toString(),
            projects: '0',
            tags: (Array.isArray(p.skills) ? p.skills : []) as string[],
            avatar: p.avatar_url || '',
            verified: false,
            bio: p.bio || ''
          }));
          setTalents(prev => {
            const existingIds = new Set(prev.map(t => t.id));
            const newOnes = risingData.filter((t: any) => !existingIds.has(t.id));
            return newOnes.length > 0 ? [...prev, ...newOnes] : prev;
          });
        }

        const { data: projects } = await supabase
          .from('projects')
          .select('id, title, budget_min, budget_max, created_at')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(5);

        if (projects) {
          setProjectPulse(projects.map((p: any) => ({
            title: p.title,
            budget: `$${Math.floor((p.budget_min + p.budget_max) / 2)}`,
            time: new Date(p.created_at).toLocaleString('ar-SA')
          })));
        }

        const { data: statsData } = await supabase
          .from('profiles')
          .select('rating')
          .eq('role', 'freelancer');

        const { count: projectCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'open');

        if (statsData && statsData.length > 0) {
          const avgRating = statsData.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) / statsData.length;
          setStats({
            freelancers: statsData.length,
            projects: projectCount || 0,
            avgRating: parseFloat(avgRating.toFixed(1))
          });
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const [sortBy, setSortBy] = useState("recommended");

  const risingTalents = useMemo(() => {
    return talents
      .filter(t => parseFloat(t.rating) >= 4.5)
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 8);
  }, [talents]);

  const filteredTalents = useMemo(() => {
    let result = talents.filter((talent) => {
      // Price filtering
      const priceNumeric = talent.hourly_rate || parseInt(talent.price.replace("$", "")) || 0;
      const isPriceMatch = isNaN(priceNumeric) || priceNumeric <= filters.priceRange;
      
      // Category filtering
      const isCategoryMatch = filters.category === "الكل" || 
        talent.role?.includes(filters.category) || 
        talent.tags?.includes(filters.category);
      
      // Experience level filtering
      const activeExperienceFilters = filters.experienceLevels.filter((l: any) => l.checked).map((l: any) => l.id);
      let isExperienceMatch = true;
      if (activeExperienceFilters.length > 0) {
        isExperienceMatch = false;
        const years = talent.years_experience || 0;
        if (activeExperienceFilters.includes("expert") && years >= 10) isExperienceMatch = true;
        if (activeExperienceFilters.includes("pro") && years >= 5 && years < 10) isExperienceMatch = true;
        if (activeExperienceFilters.includes("mid") && years >= 2 && years < 5) isExperienceMatch = true;
      }

      // Search filtering
      const searchLower = searchQuery.toLowerCase();
      const isSearchMatch =
        !searchQuery ||
        talent.name.toLowerCase().includes(searchLower) ||
        talent.role?.toLowerCase().includes(searchLower) ||
        talent.tags?.some((t) => t.toLowerCase().includes(searchLower));

      return isPriceMatch && isCategoryMatch && isExperienceMatch && isSearchMatch;
    });

    // Sorting logic
    return [...result].sort((a, b) => {
      if (sortBy === "top-rated") {
        return parseFloat(b.rating) - parseFloat(a.rating);
      }
      if (sortBy === "price-low") {
        const prA = a.hourly_rate || parseInt(a.price.replace("$", "")) || 0;
        const prB = b.hourly_rate || parseInt(b.price.replace("$", "")) || 0;
        return prA - prB;
      }
      if (sortBy === "price-high") {
        const prA = a.hourly_rate || parseInt(a.price.replace("$", "")) || 0;
        const prB = b.hourly_rate || parseInt(b.price.replace("$", "")) || 0;
        return prB - prA;
      }
      // default: recommended (can be based on a combination of rating and activity)
      return parseFloat(b.rating) - parseFloat(a.rating);
    });
  }, [talents, filters, searchQuery, sortBy]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#FAFBFF", fontFamily: "'Cairo', sans-serif" }}>
      
      {/* ══════════════ FUTURISTIC BACKGROUND ══════════════ */}
      <div ref={spotlightRef} className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000" />
      
      {/* Dynamic Mesh Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-bounce-slow" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] micro-grid z-0" />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary/10 blur-xl animate-float-up"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        
        {/* News Ticker */}
        <div className="bg-primary/5 border-b border-primary/10 py-2 overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee gap-12 text-primary">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                <span>تحديثات حية: انضم ٤٥ مستقلاً جديداً اليوم</span>
                <span>•</span>
                <span>تريند: الطلب على خبراء الذكاء الاصطناعي يرتفع بنسبة ١٤٠٪</span>
                <span>•</span>
                <span>أمان بنسبة ١٠٠٪ لمدفوعاتك</span>
                <span>•</span>
                <span>العقود النشطة الآن: ١,٢٥٤ عقد</span>
                <span>•</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ TRUSTED BY MARQUEE ══════════════ */}
        <div className="bg-white/40 border-b border-white py-4 overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee gap-20 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-20 items-center">
                <span className="text-xl font-black italic tracking-tighter">APPLE</span>
                <span className="text-xl font-black italic tracking-tighter">META</span>
                <span className="text-xl font-black italic tracking-tighter">GOOGLE</span>
                <span className="text-xl font-black italic tracking-tighter">AMAZON</span>
                <span className="text-xl font-black italic tracking-tighter">MICROSOFT</span>
                <span className="text-xl font-black italic tracking-tighter">STC</span>
                <span className="text-xl font-black italic tracking-tighter">ARAMCO</span>
                <span className="text-xl font-black italic tracking-tighter">NEOM</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ HERO SECTION ══════════════ */}
        <section className="pt-24 pb-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-8 border glass-panel animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-primary">المستقبل يبدأ هنا</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[1.05] tracking-tight mb-8 animate-fade-in-up" style={{ color: "#0A0E1A", animationDelay: "200ms" }}>
              اكتشف ملامح <br />
              <span className="kinetic-gradient-text">الإبداع القادم</span>
            </h1>

            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 text-[#3D4560] leading-relaxed animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              نصلك بأفضل العقول العربية المحترفة في مجالات التقنية الحديثة. <br className="hidden md:block" />
              بيئة عمل ذكية، آمنة، ومحفزة على الابتكار.
            </p>

            {/* Interactive Search Bar */}
            <div className="relative max-w-3xl mx-auto group animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex items-center bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-2 border border-white shadow-2xl">
                <div className="flex-1 flex items-center pr-6">
                  <Search className="w-5 h-5 text-primary opacity-50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن مهارة، خبير، أو تقنية..."
                    className="w-full bg-transparent border-none focus:ring-0 text-right pr-4 text-sm font-bold"
                  />
                </div>
                <button className="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-[2rem] font-black text-sm transition-all duration-300 transform active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2">
                  <span>ابحث الآن</span>
                  <Zap className="w-4 h-4 fill-white" />
                </button>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
              <StatCard icon={Users} value={`${stats.freelancers}+`} label="موهبة متحقق منها" color="#1A4FD6" delay="500ms" />
              <StatCard icon={TrendingUp} value={`${stats.projects}`} label="مشروع نشط" color="#00C2A8" delay="600ms" />
              <StatCard icon={ShieldCheck} value={`${stats.avgRating}/٥`} label="متوسط التقييم" color="#6366F1" delay="700ms" />
              <StatCard icon={Globe} value="١٤" label="دولة عربية" color="#EC4899" delay="800ms" />
            </div>
          </div>
        </section>

        {/* ══════════════ CONTENT SECTION (MARKETPLACE) ══════════════ */}
        <section className="px-4 md:px-8 pt-10 pb-32">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col lg:flex-row-reverse gap-10">
              
              {/* Sidebar Filters - Sticky Glass */}
              <aside className="w-full lg:w-80 h-fit lg:sticky lg:top-24 z-20">
                <div className="glass-panel rounded-[2.5rem] p-6 border shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 blur-3xl pointer-events-none" />
                  <TalentFilters onFilterChange={(f) => setFilters(f as any)} />
                  
                  {/* Premium Promo Card */}
                  <div className="mt-8 relative group rounded-3xl overflow-hidden aspect-square flex flex-col justify-end p-6 cursor-pointer border border-primary/20">
                    <img 
                      src="https://picsum.photos/600/600?random=31"
                      className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
                      alt="promo"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="relative text-right text-white">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#00C2A8] mb-1 flex items-center gap-1 justify-end">
                        <Sparkles className="w-3 h-3" />
                        عضوية PRO
                      </div>
                      <h4 className="text-xl font-black">طور أعمالك اليوم</h4>
                      <p className="text-[11px] text-white/90 mt-1">احصل على وصول حصري لأفضل ٥٪ من الموهبين</p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Feed */}
              <main className="flex-1">
                {/* Control Header */}
                <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-10 gap-6 glass-panel-strong p-4 rounded-[2.5rem] border border-white/50 shadow-sm">
                  <div className="text-right pr-4">
                    <h2 className="text-2xl font-black text-[#0A0E1A]">النتائج الذكية</h2>
                    <p className="text-xs font-bold text-[#3D4560]/70 uppercase tracking-widest mt-0.5">
                      {loading ? "جاري مسح الشبكة..." : `${filteredTalents.length} خبير متاح`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 flex-row-reverse">
                    {/* View Switch */}
                    <div className="flex bg-surface-container-low p-1.5 rounded-2xl border">
                      <button 
                        onClick={() => setGridView(true)}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${gridView ? 'bg-primary shadow-lg shadow-primary/30 text-white' : 'text-ink-muted hover:text-primary'}`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => setGridView(false)}
                         className={`p-2.5 rounded-xl transition-all duration-300 ${!gridView ? 'bg-primary shadow-lg shadow-primary/30 text-white' : 'text-ink-muted hover:text-primary'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>

                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-2xl border border-border px-6 font-bold py-3 text-sm flex items-center gap-2 bg-transparent outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer text-right"
                    >
                      <option value="recommended">الموصى بهم</option>
                      <option value="top-rated">الأعلى تقييماً</option>
                      <option value="price-low">السعر: من الأقل</option>
                      <option value="price-high">السعر: من الأعلى</option>
                    </select>
                  </div>
                </div>

                {/* Category Chips - Animated Stagger */}
                <div className="flex flex-wrap gap-2 justify-end mb-10 overflow-x-auto pb-4 scrollbar-hide">
                  {["الكل", "تصميم UI/UX", "تطوير ويب", "ذكاء اصطناعي", "برمجة تطبيقات", "تسويق رقمي", "كتابة إبداعية"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilters(f => ({ ...f, category: cat }))}
                      className={`px-6 py-3 rounded-full text-xs font-black transition-all duration-500 border whitespace-nowrap ${
                        filters.category === cat 
                        ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105' 
                        : 'bg-white text-ink-secondary border-border hover:border-primary/30 hover:bg-primary/5 shadow-sm'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Listing Grid */}
                {loading ? (
                  <div className={`grid gap-8 ${gridView ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"}`}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="glass-panel h-[320px] rounded-[3rem] p-8 animate-pulse flex flex-col justify-between">
                        <div className="flex flex-row-reverse gap-6">
                           <Skeleton className="w-20 h-20 rounded-3xl" />
                           <div className="flex-1 space-y-4">
                              <Skeleton className="h-6 w-3/4 ml-auto" />
                              <Skeleton className="h-4 w-1/2 ml-auto opacity-50" />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <Skeleton className="h-4 w-full rounded-full" />
                           <Skeleton className="h-4 w-5/6 rounded-full" />
                        </div>
                        <div className="flex gap-2 justify-end">
                           <Skeleton className="h-8 w-16 rounded-xl" />
                           <Skeleton className="h-8 w-16 rounded-xl" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredTalents.length > 0 ? (
                  <div className={`grid gap-8 ${gridView ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"}`}>
                    {filteredTalents.map((talent, idx) => (
                      <div key={talent.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                        <TalentCard talent={talent} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-32 text-center glass-panel rounded-[4rem] border relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10">
                      <div className="w-24 h-24 rounded-[2rem] bg-primary/5 flex items-center justify-center mx-auto mb-8 animate-float-up">
                        <Activity className="w-10 h-10 text-primary opacity-30" />
                      </div>
                      <h3 className="text-3xl font-black mb-4">لا توجد موجات حالياً</h3>
                      <p className="text-sm opacity-60 font-medium max-w-sm mx-auto leading-relaxed">
                        نأسف، لم نتمكن من العثور على أي نتائج تطابق معاييرك الحالية. جرّب توسيع نطاق البحث.
                      </p>
                      <Button 
                        onClick={() => setFilters({ category: "الكل", experienceLevels: [], priceRange: 500 })}
                        className="mt-10 rounded-2xl px-12 py-7 font-black"
                      >
                         تصفير الإعدادات
                      </Button>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </div>
        </section>

        {/* ══════════════ RISING TALENTS MARQUEE ══════════════ */}
        <section className="py-20 bg-primary/5 backdrop-blur-sm border-y border-primary/10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 mb-10 flex items-center justify-between flex-row-reverse">
            <div className="text-right">
              <h2 className="text-2xl font-black mb-2 flex items-center gap-2 justify-end text-ink-primary">
                مواهب صاعدة <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </h2>
              <p className="text-sm font-bold text-ink-primary/60">أكثر المستقلين تميزاً هذا الأسبوع</p>
            </div>
            <div className="hidden md:flex gap-4">
               <div className="px-5 py-2 rounded-full border border-primary/10 bg-white/50 text-[10px] font-black text-primary">LIVE UPDATES</div>
               <div className="px-5 py-2 rounded-full border border-accent/10 bg-white/50 text-[10px] font-black text-accent">TOP RATED</div>
            </div>
          </div>
          <div className="flex animate-marquee-slow gap-8 py-4">
             {risingTalents.length > 0 ? (
               [...risingTalents, ...risingTalents].map((talent, i) => (
                 <MarqueeItem
                  key={`${talent.id}-${i}`}
                  name={talent.name}
                  role={talent.role}
                  avatar={talent.avatar}
                  color={["#1A4FD6", "#00C2A8", "#6366F1", "#F59E0B", "#EC4899", "#10B981"][i % 6]}
                 />
               ))
             ) : (
               [...Array(6)].map((_, i) => (
                 <MarqueeItem
                  key={i}
                  name={`استقلالي ${i + 1}`}
                  role="جاري التحميل..."
                  avatar={`https://ui-avatars.com/api/?name=Loading${i}&background=random`}
                  color={["#1A4FD6", "#00C2A8", "#6366F1", "#F59E0B", "#EC4899", "#10B981"][i % 6]}
                 />
               ))
             )}
          </div>
        </section>

        {/* ══════════════ AI MATCHMAKER SIMULATOR ══════════════ */}
        <section className="py-24 px-4 overflow-hidden relative">
          <div className="max-w-7xl mx-auto rounded-[4rem] bg-[#0A0E1A] p-12 md:p-20 relative overflow-hidden group border border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(26,79,214,0.25),transparent)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none skew-y-12 translate-x-1/2 scale-150 border-t border-primary/50" />
            
            <div className="relative z-10 flex flex-col lg:flex-row-reverse items-center justify-between gap-16">
              <div className="lg:w-1/2 text-right">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary mb-8 animate-pulse">
                  <Cpu className="w-4 h-4" />
                  <span className="text-[10px] font-black tracking-widest uppercase">AI Concierge v2.4</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                  دع الذكاء الاصطناعي <br /> 
                  <span className="text-primary italic">يجد لك المحترف المثالي</span>
                </h2>
                <p className="text-lg text-white/80 font-medium mb-10 leading-relaxed max-w-xl ml-auto">
                  قم بوصف مشروعك ببساطة، وسيقوم محرك البحث الذكي لدينا بتحليل آلاف الملفات الشخصية للعثور على أفضل ٣ مرشحين في ثوانٍ.
                </p>
                
                <div className="flex gap-4 justify-end">
                   <button className="px-10 py-5 rounded-[2rem] bg-primary text-white font-black hover:scale-105 transition-all shadow-xl shadow-primary/40">جرب البحث الذكي</button>
                   <button className="px-10 py-5 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all">شاهد فيديو توضيحي</button>
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="relative glass-panel-strong border-white/10 p-8 rounded-[3rem] shadow-2xl skew-x-1 group-hover:skew-x-0 transition-all duration-1000">
                  <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6 flex-row-reverse">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Matching.engine_analysis</span>
                  </div>
                  
                  <div className="space-y-6">
                    {[
                      { label: "دقة المهارات", value: 98, color: "text-primary" },
                      { label: "سرعة التسليم المتوقعة", value: 94, color: "text-accent" },
                      { label: "الميزانية المقترحة", value: 87, color: "text-indigo-400" },
                    ].map((m, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-black flex-row-reverse">
                          <span className="text-white">{m.label}</span>
                          <span className={m.color}>{m.value}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-current rounded-full animate-progress-grow ${m.color}`} 
                            style={{ width: `${m.value}%`, animationDelay: `${i * 200}ms` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex gap-4 justify-center">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-white/10 overflow-hidden animate-bounce-slow" style={{ animationDelay: `${i * 300}ms` }}>
                        <img src={`https://ui-avatars.com/api/?name=User${i}&background=random`} alt="user" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════ HOW IT WORKS SECTION ══════════════ */}
        <section className="py-40 px-4 relative">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-16" style={{ color: "#0A0E1A" }}>
              رحلة <span className="kinetic-gradient-text">النجاح</span> في نافس
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector Lines (Desktop Only) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 border-t-2 border-dashed border-primary/20 -translate-y-12 z-0" />
              
              {[
                { step: "٠١", title: "تصفح المبدعين", desc: "تصفح سِيَر نخبة المستقلين الموثقين بعناية.", icon: MousePointer2, color: "#1A4FD6" },
                { step: "٠٢", title: "تواصل واتفق", desc: "ناقش مشروعك، حدد الأهداف والجدول الزمني.", icon: MessageSquare, color: "#00C2A8" },
                { step: "٠٣", title: "استلم وأبهر", desc: "استلم عملاً احترافياً بجودة عالمية وضمان مالي.", icon: Layers, color: "#6366F1" },
              ].map((step, i) => (
                <div key={i} className="group relative bg-white/60 backdrop-blur-xl p-10 rounded-[4rem] border border-white shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(26,79,214,0.1)] transition-all duration-700 hover:-translate-y-4">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-[2rem] bg-white border shadow-2xl flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-500">
                    <step.icon className="w-10 h-10" style={{ color: step.color }} />
                  </div>
                  <div className="mt-8">
                    <span className="text-5xl font-black opacity-10 absolute right-10 top-10" style={{ color: step.color }}>{step.step}</span>
                    <h3 className="text-2xl font-black mb-4">{step.title}</h3>
                    <p className="text-sm font-bold opacity-60 leading-relaxed text-ink-muted">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════ PROJECT PULSE SECTION ══════════════ */}
        <section className="py-24 bg-[#0A0E1A] relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
           <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">نبض <span className="kinetic-gradient-text">المشاريع</span> الحية</h2>
              <p className="text-white/60 font-bold uppercase tracking-widest text-xs">مشاريع تم فتحها للتو</p>
           </div>

           <div className="flex animate-marquee-slow gap-6 py-2 flex-row-reverse opacity-80">
              {projectPulse.length > 0 ? (
                [...projectPulse, ...projectPulse].map((p, i) => (
                  <div key={i} className="flex items-center gap-6 px-8 py-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md min-w-[320px]">
                     <div className={`w-2 h-2 rounded-full animate-pulse bg-current text-${["primary", "accent", "indigo-400", "pink-400", "emerald-400"][i % 5]}`} />
                     <div className="flex-1 text-right">
                        <h4 className="text-sm font-black text-white mb-1">{p.title}</h4>
                        <div className="flex justify-between items-center text-[10px] font-bold text-white/40 flex-row-reverse">
                           <span>{p.budget}</span>
                           <span>• {p.time}</span>
                        </div>
                     </div>
                  </div>
                ))
              ) : (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-6 px-8 py-5 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md min-w-[320px] animate-pulse">
                     <div className="w-2 h-2 rounded-full bg-white/20" />
                     <div className="flex-1 text-right">
                        <div className="h-4 bg-white/20 rounded w-3/4 ml-auto mb-1" />
                        <div className="h-3 bg-white/10 rounded w-1/2 ml-auto" />
                     </div>
                  </div>
                ))
              )}
           </div>
        </section>

        {/* ══════════════ GLOBAL TALENT MAP SIMULATION ══════════════ */}
        <section className="py-24 px-4 overflow-hidden">
           <div className="max-w-7xl mx-auto rounded-[4rem] bg-surface-container-low border border-border p-12 md:p-24 relative overflow-hidden text-center">
              <div className="absolute inset-0 dot-grid opacity-[0.05]" />
              <div className="relative z-10">
                 <h2 className="text-3xl md:text-5xl font-black mb-6">شبكة <span className="kinetic-gradient-text">عالمية</span> بروح عربية</h2>
                 <p className="text-lg opacity-60 font-bold mb-16 max-w-2xl mx-auto">
                    نحن نغطي كافة الأقطار العربية، نجمع لك أفضل الخبرات لتصل إليك أينما كنت.
                 </p>
                 
                 <div className="aspect-[21/9] w-full relative">
                    <div className="absolute inset-0 bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/10 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Globe className="w-48 h-48 text-primary opacity-10 animate-spin-slow" />
                    </div>
                    {/* Animated Connection Points */}
                    {[
                      { t: '10%', l: '20%' }, { t: '40%', l: '60%' }, { t: '70%', l: '30%' },
                      { t: '20%', l: '80%' }, { t: '60%', l: '10%' }, { t: '80%', l: '70%' },
                    ].map((p, i) => (
                      <div key={i} className="absolute w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center animate-ping" style={{ top: p.t, left: p.l, animationDelay: `${i * 1000}ms` }}>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#1A4FD6]" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* ══════════════ TECH SPOTLIGHT SECTION ══════════════ */}
        <section className="px-4 md:px-8 py-40">
           <div className="max-w-7xl mx-auto rounded-[5rem] overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-600 to-accent animate-gradient-shift opacity-90" />
              <div className="absolute inset-0 mix-blend-overlay opacity-20 dot-grid" />
              
              <div className="relative z-10 p-12 md:p-24 flex flex-col md:flex-row-reverse items-center justify-between gap-16">
                 <div className="md:w-1/2 text-right text-white">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md mb-8 border border-white/30">
                       <Cpu className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">تخصص الأسبوع</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                       عصر <br /> <span className="text-accent underline decoration-4 underline-offset-8">الذكاء الاصطناعي</span>
                    </h2>
                    <p className="text-xl opacity-80 font-bold mb-10 leading-relaxed">
                       خبراء في تعلم الآلة، هندسة الأوامر، وتطوير نماذج اللغات الكبيرة. جاهزون لنقل مشروعك للمستوى التالي.
                    </p>
                    <button className="bg-white text-primary px-12 py-6 rounded-[2.5rem] font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                       <span>استكشف خبراء الـ AI</span>
                       <ArrowUpRight className="w-5 h-5" />
                    </button>
                 </div>
                 
                 <div className="md:w-1/2 relative">
                    <div className="absolute -inset-10 bg-white/20 rounded-full blur-[100px] animate-pulse" />
                    <div className="relative grid grid-cols-2 gap-4 animate-float-up">
                       {[1, 2, 3, 4].map(i => (
                         <div key={i} className="aspect-square rounded-[3rem] border border-white/30 bg-white/10 backdrop-blur-xl p-1 shadow-2xl relative group-hover:rotate-2 transition-transform duration-1000">
                            <img 
                              src={`https://picsum.photos/200/200?random=${i + 30}`}
                              className="w-full h-full object-cover rounded-[2.8rem]"
                              alt="tech"
                            />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* ══════════════ COMMUNITY HUB ══════════════ */}
        <section className="px-4 md:px-8 pb-40">
           <div className="max-w-4xl mx-auto text-center glass-panel p-16 rounded-[4rem] border relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-y-32 translate-x-32 pointer-events-none" />
              <div className="relative z-10">
                 <div className="w-20 h-20 rounded-[2rem] bg-primary/5 flex items-center justify-center mx-auto mb-8">
                    <Users className="w-10 h-10 text-primary" />
                 </div>
                 <h2 className="text-4xl font-black mb-6">انضم لمجتمع المبدعين</h2>
                 <p className="text-lg opacity-60 font-bold mb-12 max-w-xl mx-auto">
                    كن جزءاً من أكبر تجمع للمصممين والمطورين العرب. تبادل الخبرات، احصل على نصائح، وواكب أحدث التقنيات.
                 </p>
                 <div className="flex flex-wrap justify-center gap-6">
                    <button className="flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-[#5865F2] text-white font-black shadow-xl shadow-[#5865F2]/20 hover:scale-105 transition-all">
                       <MessageSquare className="w-5 h-5 fill-white" />
                       <span>سيرفر ديسكورد</span>
                    </button>
                    <button className="flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-white border border-border font-black shadow-sm hover:bg-surface-container-low transition-all">
                       <Globe className="w-5 h-5 text-primary" />
                       <span>المدونة العربية</span>
                    </button>
                 </div>
              </div>
           </div>
        </section>

      </div>

      {/* Floating Action Button - Glass Morph */}
      <div className="fixed bottom-10 right-10 z-[100] group animate-bounce-in">
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <button
          className="relative flex items-center gap-4 px-8 py-5 bg-primary text-white rounded-[2.5rem] font-black shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 group overflow-hidden"
          style={{ boxShadow: "0 20px 48px -10px rgba(26, 79, 214, 0.4)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-gradient-shift" />
          <PlusCircle className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
          <span className="tracking-tight">ابدأ مشروعك</span>
        </button>
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
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-slow {
          animation: marquee-slow 60s linear infinite;
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
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes progress-grow {
          from { width: 0; }
          to { width: current; }
        }
        .animate-progress-grow {
          animation: progress-grow 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
