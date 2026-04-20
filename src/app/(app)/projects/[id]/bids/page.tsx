"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  History,
  Search,
  MapPin,
  Clock,
  Star,
  MessageSquare,
  TrendingUp,
  Shield,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Calendar,
  Wallet,
  CheckCircle2,
  Users,
  Lock
} from "lucide-react";

const BIDS = [
  {
    id: 1,
    freelancerName: "أحمد المنصور",
    title: "خبير تطوير نظم البلوكشين",
    rating: 4.9,
    amount: 18500,
    duration: 75,
    successRate: 98,
    projects: 124,
    proposal: "لدي خبرة سابقة في بناء منصات مشابهة لمنصة نافس، وأضمن لكم نظاماً أمنياً بمستوى بنكي. سأستخدم تقنيات الـ WebSocket لضمان سرعة تداول الحقيقية.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQY7xwWre7YoXAA6IG1uzbUFj_Tj1WESTAjdoPclKiccLp6_riP0fFP57PZCAaqFyRI1KCcqpPE1oiXqeFQYchu6FHqRPhc7uk4EqFRKXF0aaPdEPFtjy75SkzFto_-aY6q14L6Kz5anqKZzmQIzw8FAU9HyRkX6koCmJOrfFxj203hzj_Fam-piHPoNA9n_vBAVAeayGDOGFd_twcKG-Zw1xxCSjf5ar2dYcX6C5zax8o9ARQUUep8Z3tfynij9kv-tTIARZWYmrc",
    isBestMatch: true
  },
  {
    id: 2,
    freelancerName: "سارة الخالدي",
    title: "مصممة واجهات UI/UX",
    rating: 4.8,
    amount: 5000,
    duration: 20,
    successRate: 95,
    projects: 42,
    proposal: "سأعمل على تصميم واجهة مستخدم عصرية تركز على سهولة الوصول والتفاعل.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiKK4Mj-smbkAViTnQWu8-xfLFs8HceC2qIStn8CnHuz3UCG6Df2NJV_8C_JM4earCoLb4ahAkie73PCGqOTQp2JwQ-TLeaYXrlWRaga4zNkTXz7sh64e8EeQUH_z9XuNJlW43IikqlUuhLa0OvJzdKHuAsp4ytvFU57L4lHv03bJQuyVBCMAjJhcS8R_Myi3_WN8moRwPxK51T-baFNDr6YFG0ldyl9RaCbM75FJIfS6LQ7MKM_6MM7k4lHQemTpmJpBiC8ouv-jD",
    isBestMatch: false
  },
  {
    id: 3,
    freelancerName: "ياسين المحمد",
    title: "مطور Full-Stack",
    rating: 5.0,
    amount: 22000,
    duration: 80,
    successRate: 100,
    projects: 18,
    proposal: "متخصص في بناء الأنظمة المعقدة باستخدام React و Node.js مع التركيز على الأداء والأمان.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLbHKkhkd92d88A_JHRMvYcPMNmdV9S6hAzv0SRpJAYPvIDmJ2UZjP1mKZrmc95F6z8gRMU7XFhSrakCsAqhuLDkZwo07e01iFPcY1dLiCSR79U_n-q6My-GYSepZfrYFhywQVa1zCUTLBvJV7DKuXConpScdGUf5Gbaz0WEemApLum8rPxvijMWANFe7eETDYHkPePI85MH_ecCq65a8GZZhpGK-c_YXV1n0aG45btJMJHzv1KgLDnEimc8crZAf1aUSVc7hcfilC",
    isBestMatch: false
  },
  {
    id: 4,
    freelancerName: "ليلى حسن",
    title: "خبيرة تحليل بيانات",
    rating: 4.7,
    amount: 12000,
    duration: 45,
    successRate: 92,
    projects: 64,
    proposal: "يمكنني بناء لوحة تحكم تحليلية متقدمة تمنحك رؤى دقيقة عن أداء المنصة.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMcw1ynyesVq7KqtZDx7dkofLU7Pb64tbp6pRygWA6NbnV2rbtKw5UJvLiU9Y-P5QzQM6Xg-zQEpGcfd_geoNF1ehS8otVNLKfnBq9R5Fu1o7y5F6jefMsU9z9ZfzaSxigToueLYwQLc9Rj8kyB-oM30uZlnaS0tnlnaDhR8pHBLZ1ZTgIQkNgD1UQN3bNUVfwdbjwIka23BGHWxLI46pVZCmDIG99tdvV3L_3VGAr__DXT9n4DegL58rMq3NGnhUUNvkQCS1sc3uU",
    isBestMatch: false
  }
];

export default function ProjectBidsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Verify user is business_owner (project owner can view bids)
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role !== "business_owner") {
          setError("Only project owners can view bids. Contact the project creator.");
          router.push(`/projects/${projectId}`);
          return;
        }

        // Verify user owns this project
        const { data: project } = await supabase
          .from("projects")
          .select("client_id")
          .eq("id", projectId)
          .single();

        if (!project) {
          setError("Project not found.");
          router.push("/projects");
          return;
        }

        if (project.client_id !== user.id) {
          setError("You can only view bids on your own projects.");
          router.push(`/projects/${projectId}`);
          return;
        }

        // User is authorized
        setIsAuthorized(true);
      } catch (err) {
        console.error("Authorization check failed:", err);
        setError("Authorization check failed. Redirecting...");
        router.push("/projects");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [projectId, router, supabase]);

  // Show loading state during authorization check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error if not authorized
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Lock className="w-12 h-12 text-error" />
        <h1 className="text-2xl font-bold text-on-surface">Access Denied</h1>
        <p className="text-on-surface-variant">{error || "You don't have permission to view bids for this project."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Project Header Card */}
      <section className="glass-panel rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-tertiary-fixed/10 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-12 text-right">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4 justify-end">
              <span className="text-on-surface-variant text-sm flex items-center gap-2">
                نشر منذ ٢ ساعة
                <Clock className="w-4 h-4" />
              </span>
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold ring-1 ring-primary/20">
                نشط الآن
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface leading-tight">
              تطوير منصة تداول الأصول الرقمية المتقدمة
            </h1>
            
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-3xl ml-auto opacity-80">
              نحن نبحث عن فريق تطوير متمكن لبناء منصة تداول تعتمد على تقنيات البلوكشين مع واجهة مستخدم فائقة التطور. المشروع يتطلب خبرة في الأمان السيبراني ومعالجة البيانات في الوقت الحقيقي.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-end">
              <div className="flex items-center gap-3 bg-surface-container-low/50 px-5 py-3 rounded-2xl border border-white/40 shadow-sm">
                <span className="font-bold text-on-surface">$١٥,٠٠٠ - $٢٥,٠٠٠</span>
                <span className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Wallet className="w-5 h-5" />
                </span>
                <span className="text-sm text-on-surface-variant mr-1">:الميزانية</span>
              </div>
              <div className="flex items-center gap-3 bg-surface-container-low/50 px-5 py-3 rounded-2xl border border-white/40 shadow-sm">
                <span className="font-bold text-on-surface">٩٠ يوم</span>
                <span className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Calendar className="w-5 h-5" />
                </span>
                <span className="text-sm text-on-surface-variant mr-1">:المدة</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 glass-panel-strong rounded-[2rem] p-8 text-center space-y-6 shadow-2xl shadow-primary/10 border-white/60">
            <p className="text-on-surface-variant text-sm">ينتهي قبول العروض خلال</p>
            
            <div className="flex justify-center items-center gap-5">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black font-headline text-primary">٠٢</span>
                <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-widest mt-1">أيام</span>
              </div>
              <span className="text-2xl font-light text-outline-variant">:</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black font-headline text-primary">١٤</span>
                <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-widest mt-1">ساعة</span>
              </div>
              <span className="text-2xl font-light text-outline-variant">:</span>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-black font-headline text-primary">٤٥</span>
                <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-widest mt-1">دقيقة</span>
              </div>
            </div>

            <button className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
              تقديم عرض الآن
            </button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant font-medium">
              <span>١٢ مستقل قدموا عروضهم</span>
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 text-right">
          <div className="flex gap-3">
            <button className="p-3 glass-panel rounded-2xl hover:bg-white hover:shadow-md transition-all text-on-surface-variant">
              <ArrowUpDown className="w-5 h-5" />
            </button>
            <button className="p-3 glass-panel rounded-2xl hover:bg-white hover:shadow-md transition-all text-on-surface-variant">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-black font-headline text-on-surface mb-2">تحليل العروض المقدمة</h2>
            <p className="text-on-surface-variant text-lg">استعراض ذكي لأفضل المهارات المتاحة لهذا المشروع</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Best Match Card */}
          {BIDS.filter(b => b.isBestMatch).map(bid => (
            <div key={bid.id} className="lg:col-span-2 glass-panel rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all border-white/50">
              <div className="absolute top-0 left-0 w-32 h-32 bg-tertiary-fixed/20 blur-[80px] rounded-full" />
              
              <div className="absolute top-8 left-8">
                <span className="bg-tertiary-fixed/40 backdrop-blur-md text-on-tertiary-fixed font-black text-xs px-5 py-2.5 rounded-full flex items-center gap-2 ring-1 ring-tertiary-fixed/50">
                  <Star className="w-4 h-4 fill-current" />
                  العرض الأفضل
                </span>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row-reverse gap-10 items-start text-right">
                <div className="relative">
                  <img 
                    src={bid.image} 
                    alt={bid.freelancerName}
                    className="w-40 h-40 rounded-3xl object-cover shadow-2xl ring-4 ring-white/50 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-lg" />
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-3xl font-black font-headline text-on-surface mb-1">{bid.freelancerName}</h3>
                    <p className="text-primary font-bold">{bid.title} • تقييم {bid.rating}/٥</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "قيمة العرض", value: `$${bid.amount.toLocaleString()}`, highlight: true },
                      { label: "مدة التنفيذ", value: `${bid.duration} يوم` },
                      { label: "نسبة النجاح", value: `${bid.successRate}٪` },
                      { label: "المشاريع", value: bid.projects },
                    ].map((stat, i) => (
                      <div key={i} className="bg-surface-container/50 backdrop-blur-sm p-4 rounded-[1.5rem] border border-white/40">
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                        <p className={`text-lg font-black ${stat.highlight ? 'text-primary' : 'text-on-surface'}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-on-surface-variant text-base leading-relaxed italic pr-4 border-r-2 border-primary/20">
                    "{bid.proposal}"
                  </p>

                  <div className="flex gap-4 justify-end pt-2">
                    <button className="px-8 py-3.5 glass-panel rounded-2xl font-bold text-sm hover:bg-white hover:shadow-lg transition-all text-on-surface border-white/60">الملف الشخصي</button>
                    <button className="px-8 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-primary/20 transition-all">مراسلة المستقل</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Regular Bid Cards */}
          {BIDS.filter(b => !b.isBestMatch).map(bid => (
            <div key={bid.id} className="glass-panel rounded-[2.5rem] p-8 flex flex-col group hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-transparent hover:shadow-primary/5 hover:bg-white/80 border-white/40">
              <div className="flex items-center gap-5 mb-8 flex-row-reverse text-right">
                <img src={bid.image} alt={bid.freelancerName} className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-500" />
                <div>
                  <h4 className="font-black text-xl text-on-surface">{bid.freelancerName}</h4>
                  <p className="text-xs text-on-surface-variant font-bold">{bid.title}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center flex-row-reverse text-right">
                  <span className="text-sm text-on-surface-variant font-medium">العرض:</span>
                  <span className="text-xl font-black text-primary font-headline">$ {bid.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center flex-row-reverse text-right">
                  <span className="text-sm text-on-surface-variant font-medium">المدة:</span>
                  <span className="text-lg font-bold text-on-surface">{bid.duration} يوم</span>
                </div>
              </div>

              <button className="w-full py-4 rounded-2xl text-sm font-bold text-on-surface-variant border border-surface-container-highest hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                عرض التفاصيل
              </button>
            </div>
          ))}

          {/* Quick Stats Bento */}
          <div className="lg:col-span-2 glass-panel rounded-[2.5rem] p-10 flex flex-col md:flex-row-reverse justify-around items-center gap-8 bg-gradient-to-l from-primary/5 to-transparent relative overflow-hidden border-white/50">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
            
            <div className="text-center relative z-10">
              <p className="text-4xl font-black text-primary font-headline mb-2">$١٧,٢٠٠</p>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">متوسط قيمة العروض</p>
            </div>
            
            <div className="h-16 w-px bg-outline-variant hidden md:block opacity-20" />
            
            <div className="text-center relative z-10">
              <p className="text-4xl font-black text-on-surface font-headline mb-2">٦٠ يوم</p>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">متوسط مدة التنفيذ</p>
            </div>
            
            <div className="h-16 w-px bg-outline-variant hidden md:block opacity-20" />
            
            <div className="text-center relative z-10">
              <div className="flex -space-x-3 rtl:space-x-reverse justify-center mb-3">
                {[
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuA30EV_JrcLPLtzZEknB-BtDLVPVfDH-hT4aE20xtxGWLhLcT69is5-loCp3u9BwZ9lEEgyP3qEsF2CzK58c5xn4r6cJGMHqm0lX47khdppUWZgqbRBJyfENq6QWc-JdxHYsbbcycParMjVnJpIVVrmkDkzcSTXGUerlPqLWWci1Tj8m_kryl_WiwPwzIRaj7P9u4mZxiUZMdDiMlJ7qKXM53T-7bvsgqj8JrfuEufSHiLoskzJ4Kv7he2vMwih4qD_ESQ7lJTzMjek",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBIae2zNAOcjkOVdsdqbyhss0yhTiiUOl8CSOvNgaU6c9PFFigOvQ3VaD77J9j5cGRKtuXPjNOee0JG4hEmeoUIdkCjRIWMEGUIB_8bvquXHotFI8rFCykPb9ZTpRh9r9X03ZRw5kevmJIuLJGPgX_UKGl_JVR1EgjW8a8dgzyixOEBEIzAv6GjFAZDDma4mhxKkF_L_WTMOxOyMkgJZz6GPTMOOoGVPbcZtmbi5u8h1fNALUt5KuqOxVAfyW4OAbsO3Rdqns7_7F2_",
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAN_Wa3NSFQTnBVoN6Pgolptd1Qa7KhowuFnnz4VW87kpYAuYQpPsnNl15hkeby46vZ0oaAtWAsFbd4mQI2NRBMUV6D9eoCXujKkqZ4DdKh5JbCbJcIxbIugjTh7SavxGcMuhcL_WHMM488UIbeBiRjEVEY3QD0JAt7bkN4RDgZJfKB62_VfI9VgIdyg3KdbFsd9PeCEXDpjW27Oa5-JgSAFKkVNueeP0qCTbd1aXv9pxRouoSVm5FX1Vs7eh1M8ma-hG-XykIjpTek"
                ].map((src, i) => (
                  <img 
                    key={i} 
                    src={src} 
                    alt="avatar" 
                    className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary text-xs flex items-center justify-center font-bold border-2 border-white">+٩</div>
              </div>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">مستقل متاح حالياً</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
