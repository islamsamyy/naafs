"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp, Clock, DollarSign, Zap, Edit2,
  ChevronLeft, Briefcase, Plus, PlusCircle,
  Loader2, MessageSquare, LayoutGrid, Inbox
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import OptimizedImage from "@/components/common/OptimizedImage";
import ProfileEditModal from "@/components/common/ProfileEditModal";
import AnimatedCounter from "@/components/common/AnimatedCounter";

export default function BusinessDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [recentBids, setRecentBids] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [hoveredBid, setHoveredBid] = useState<string | null>(null);
  const [acceptingBid, setAcceptingBid] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);

        // Fetch my projects with bid counts
        const { data: projectsData } = await supabase
          .from("projects")
          .select("id, title, deadline, budget_min, budget_max, status, bids(count)")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false });

        if (projectsData) {
          setMyProjects(projectsData.slice(0, 5));

          const activeCount = projectsData.filter((p: any) => p.status === "open").length;
          const completedCount = projectsData.filter((p: any) => p.status === "completed").length;

          // Calculate total spend
          const { data: bidsData } = await supabase
            .from("bids")
            .select("amount")
            .eq("status", "accepted")
            .in("project_id", projectsData.map((p: any) => p.id));

          const totalSpent = bidsData ? bidsData.reduce((sum, b: any) => sum + (b.amount || 0), 0) : 0;

          setStats({
            totalSpent,
            activeProjects: activeCount,
            completedProjects: completedCount,
            topFreelancer: profileData?.name || "Unknown",
          });
        }

        // Fetch recent bids on my projects
        const { data: bidsOnProjects } = await supabase
          .from("bids")
          .select("id, amount, created_at, freelancer:profiles(name, avatar_url), project:projects(title, id)")
          .in("project_id", projectsData?.map((p: any) => p.id) || [])
          .order("created_at", { ascending: false })
          .limit(5);

        if (bidsOnProjects) {
          setRecentBids(bidsOnProjects);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAcceptBid = async (bid: any) => {
    if (!bid?.project?.id) {
      alert("خطأ: لم يتم العثور على المشروع");
      return;
    }

    setAcceptingBid(bid.id);
    try {
      const supabase = createClient();

      // Check if project already has an accepted bid
      const { data: existingBids } = await supabase
        .from("bids")
        .select("id")
        .eq("project_id", bid.project.id)
        .eq("status", "accepted")
        .single();

      if (existingBids) {
        alert("تم بالفعل قبول عرض لهذا المشروع");
        setAcceptingBid(null);
        return;
      }

      // Update bid status to accepted
      const { error: bidError } = await supabase
        .from("bids")
        .update({ status: "accepted" })
        .eq("id", bid.id);

      if (bidError) throw bidError;

      // Update project: mark as in_progress and set freelancer
      const { error: projError } = await supabase
        .from("projects")
        .update({
          status: "in_progress",
          awarded_freelancer_id: bid.freelancer_id
        })
        .eq("id", bid.project.id);

      if (projError) throw projError;

      // Reject all other bids on this project
      await supabase
        .from("bids")
        .update({ status: "rejected" })
        .eq("project_id", bid.project.id)
        .neq("id", bid.id)
        .eq("status", "pending");

      // Remove bid from UI
      setRecentBids(recentBids.filter(b => b.id !== bid.id));

      // Update stats
      setStats((prev: any) => ({
        ...prev,
        activeProjects: (prev?.activeProjects || 0) + 1
      }));

      alert("تم قبول العرض بنجاح!");
    } catch (err) {
      console.error(err);
      alert("فشل قبول العرض: " + (err as Error).message);
    } finally {
      setAcceptingBid(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100vh] bg-[#F8FAFC]">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-primary opacity-20" />
          <Zap className="w-8 h-8 text-accent absolute inset-0 m-auto animate-pulse" />
        </div>
        <h2 className="text-xl font-black text-[#0A0E1A] mt-8 tracking-tight">جاري مزامنة بياناتك...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A0E1A] antialiased overflow-x-hidden relative" dir="rtl">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-float-up" style={{ animationDuration: '25s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] animate-float-up" style={{ animationDuration: '30s', animationDelay: '-10s' }} />
        <div className="absolute inset-0 micro-grid opacity-[0.3]" />
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap');

        body { font-family: 'Cairo', sans-serif; background-color: #F8FAFC; }

        .premium-card {
          background: #FFFFFF;
          border: 1px solid rgba(26, 79, 214, 0.08);
          box-shadow: 0 10px 40px -10px rgba(26, 79, 214, 0.05);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .premium-card:hover {
          transform: translateY(-6px);
          border-color: rgba(26, 79, 214, 0.15);
          box-shadow: 0 25px 50px -12px rgba(26, 79, 214, 0.12);
        }

        .progress-bar {
          width: 0;
          animation: fill-bar 1s ease-out forwards;
        }
        @keyframes fill-bar {
          to { width: var(--p-width); }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-3xl border-b border-[#E2E8F0] px-10 py-5 flex flex-row-reverse justify-between items-center shadow-lg shadow-black/[0.01]">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <button onClick={() => setEditModalOpen(true)} className="relative transition-all active:scale-95">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/10 transition-all group-hover:border-primary group-hover:shadow-2xl group-hover:shadow-primary/30">
                <OptimizedImage
                  src={profile?.avatar_url}
                  alt={profile?.name || "Profile"}
                  width={56}
                  height={56}
                  className="group-hover:scale-125 transition-transform duration-700"
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-accent rounded-lg p-1.5 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Edit2 className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black tracking-tight text-[#0A0E1A]">أهلاً بك، {profile?.name || 'صاحب المشروع'}</h2>
            <div className="flex flex-row-reverse items-center gap-2 mt-1 opacity-60">
               <span className="w-2 h-2 rounded-full bg-[#00C2A8] animate-ripple"></span>
               <p className="text-[10px] font-black uppercase tracking-widest">مستعد لاستقبال المواهب</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/projects/create" className="group relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-1000"></div>
             <div className="relative bg-[#0A0E1A] text-white rounded-2xl px-10 py-4 flex items-center gap-3 shadow-xl hover:scale-[1.03] active:scale-95 transition-all">
               <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
               <span className="text-sm font-black">مشروع جديد</span>
             </div>
          </Link>
        </div>
      </header>

      <ProfileEditModal
        user={profile}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSaveSuccess={(updatedUser) => setProfile(updatedUser)}
      />

      <main className="p-10 max-w-[1700px] mx-auto space-y-16 relative z-10">

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "إجمالي الإنفاق", value: stats?.totalSpent, icon: <DollarSign />, color: "#1A4FD6", bg: "bg-blue-50" },
            { label: "المشاريع النشطة", value: stats?.activeProjects, icon: <Briefcase />, color: "#00C2A8", bg: "bg-teal-50" },
            { label: "المشاريع المكتملة", value: stats?.completedProjects, icon: <TrendingUp />, color: "#7C3AED", bg: "bg-purple-50" },
            { label: "إجمالي المشاريع", value: myProjects.length, icon: <LayoutGrid />, color: "#FACC15", bg: "bg-yellow-50" },
          ].map((stat, i) => (
            <div key={i} className="premium-card p-8 rounded-[2.5rem] relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="absolute -right-6 -top-6 w-32 h-32 opacity-10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150" style={{ backgroundColor: stat.color }} />
              <div className="flex flex-row-reverse items-start justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`} style={{ color: stat.color }}>
                  {React.isValidElement(stat.icon) ? React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, { className: "w-7 h-7" }) : stat.icon}
                </div>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[#8892A4] text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black tracking-tighter text-[#0A0E1A]">
                  <AnimatedCounter from={0} to={stat.value || 0} duration={2000} prefix={stat.label.includes('إنفاق') ? 'ج' : ''} />
                </h3>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* My Projects */}
          <section className="lg:col-span-7 space-y-10">
             <div className="flex flex-row-reverse items-center justify-between px-2">
               <div className="flex flex-row-reverse items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-primary shadow-sm">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0E1A] tracking-tight">مشاريعي</h3>
               </div>
               <Link href="/projects" className="text-xs font-black text-primary hover:gap-3 transition-all flex items-center gap-1 group">
                 <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                 <span>كل المشاريع</span>
               </Link>
             </div>

             <div className="space-y-6">
               {myProjects.length > 0 ? myProjects.map((proj, idx) => {
                 const bidCount = proj.bids?.[0]?.count || 0;
                 const progress = proj.status === 'completed' ? 100 : proj.status === 'in_progress' ? 65 : proj.status === 'open' ? 30 : 0;
                 return (
                   <div key={proj.id} className="premium-card p-8 rounded-[2.5rem] group/item animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                     <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                       <div className="flex-1 text-right space-y-5">
                         <div className="flex flex-row-reverse items-center justify-between">
                           <h4 className="text-xl font-black text-[#0A0E1A] group-hover/item:text-primary transition-colors">{proj.title}</h4>
                           <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border ${
                             proj.status === 'open' ? 'bg-green-50 text-green-600 border-green-100' :
                             proj.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                             'bg-yellow-50 text-yellow-600 border-yellow-100'
                           }`}>
                             {proj.status === 'open' ? 'مفتوح' : proj.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
                           </span>
                         </div>

                         <div className="space-y-3">
                           <div className="flex justify-between items-center flex-row-reverse text-[10px] font-black">
                              <span className="text-[#0A0E1A]">التقدم</span>
                              <span className="text-primary">{progress}%</span>
                           </div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-gradient-to-r from-primary to-accent progress-bar" style={{ '--p-width': `${progress}%` } as any} />
                           </div>
                         </div>

                         <div className="flex flex-row-reverse items-center justify-between pt-2">
                           <div className="flex flex-row-reverse items-center gap-8">
                              <div className="flex flex-row-reverse items-center gap-2">
                                <DollarSign className="w-4 h-4 text-primary" />
                                <span className="text-[11px] font-bold text-[#64748B] tabular-nums">{proj.budget_min.toLocaleString()}-{proj.budget_max.toLocaleString()} ج</span>
                              </div>
                              <div className="flex flex-row-reverse items-center gap-2">
                                <Clock className="w-4 h-4 text-[#8892A4]" />
                                <span className="text-[11px] font-bold text-[#64748B]">{new Date(proj.deadline).toLocaleDateString('ar-EG')}</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-primary px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                                {bidCount} عرض
                              </span>
                           </div>
                         </div>
                       </div>

                       <div className="shrink-0 flex md:flex-col gap-4">
                          <Link href={`/projects/${proj.id}`}>
                             <button className="w-14 h-14 rounded-2xl bg-[#0A0E1A] text-white flex items-center justify-center hover:bg-primary hover:scale-110 active:scale-90 transition-all shadow-xl shadow-black/10 group/btn">
                               <Plus className="w-6 h-6 group-hover/btn:rotate-90 transition-transform" />
                             </button>
                          </Link>
                          <Link href="/messages">
                             <button className="w-14 h-14 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm text-[#0A0E1A] flex items-center justify-center hover:border-primary hover:text-primary transition-all active:scale-95">
                               <MessageSquare className="w-6 h-6" />
                             </button>
                          </Link>
                       </div>
                     </div>
                   </div>
                 );
               }) : (
                 <div className="premium-card p-20 text-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/50">
                   <LayoutGrid className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                   <p className="text-sm font-bold text-slate-400">لا توجد مشاريع حالياً</p>
                   <Link href="/projects/create" className="mt-6 inline-block px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm">
                     إنشاء مشروع
                   </Link>
                 </div>
               )}
             </div>
          </section>

          {/* Recent Bids Sidebar */}
          <section className="lg:col-span-5 space-y-10">
             <div className="flex flex-row-reverse items-center justify-between px-2">
               <div className="text-right">
                 <h3 className="text-2xl font-black text-[#0A0E1A] tracking-tight">العروض الواردة</h3>
                 <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-0.5">Recent Bids</p>
               </div>
               <Link href="/projects" className="text-xs font-black text-[#8892A4] hover:text-primary transition-all">تحديث</Link>
             </div>

             <div className="space-y-6">
                {recentBids.length > 0 ? recentBids.map((bid, idx) => (
                  <div
                    key={bid.id}
                    className="premium-card p-6 rounded-[2.5rem] relative overflow-hidden group cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${(idx + 2) * 150}ms` }}
                    onMouseEnter={() => setHoveredBid(bid.id)}
                    onMouseLeave={() => setHoveredBid(null)}
                  >
                    <div className="flex flex-row-reverse items-center gap-6 relative z-10">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                        <OptimizedImage
                          src={bid.freelancer?.avatar_url}
                          alt={bid.freelancer?.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-right space-y-2">
                        <h4 className="font-black text-sm text-[#0A0E1A] group-hover:text-primary transition-colors">{bid.freelancer?.name}</h4>
                        <p className="text-xs text-[#8892A4] line-clamp-1">{bid.project?.title}</p>
                        <div className="flex flex-row-reverse items-center gap-3 pt-1">
                          <span className="text-xs font-black text-primary tabular-nums">{bid.amount?.toLocaleString()} ج</span>
                          <span className="text-[9px] text-[#8892A4]">{new Date(bid.created_at).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-4 pt-4 border-t border-slate-50 flex gap-3 transition-all duration-500 ${hoveredBid === bid.id ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                       <button onClick={() => handleAcceptBid(bid)} disabled={acceptingBid === bid.id} className="flex-1 py-2 bg-primary text-white text-[10px] font-black rounded-lg hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all text-center">
                         {acceptingBid === bid.id ? "جاري..." : "قبول"}
                       </button>
                       <button className="flex-1 py-2 bg-red-100 text-red-700 text-[10px] font-black rounded-lg hover:bg-red-200 transition-all">رفض</button>
                    </div>
                  </div>
                )) : (
                  <div className="premium-card p-16 text-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/50">
                    <Inbox className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-400">لا يوجد عروض واردة حالياً</p>
                  </div>
                )}

                {/* Promo Card — matching freelancer dashboard style */}
                <div className="premium-card p-10 rounded-[3rem] bg-gradient-to-br from-primary to-[#7C3AED] text-white relative overflow-hidden group border-0 shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  
                  <div className="relative z-10 space-y-8">
                     <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
                        <TrendingUp className="w-8 h-8" />
                     </div>
                     <div className="text-right">
                       <h5 className="text-2xl font-black mb-2">أطلق مشروعك التالي</h5>
                       <p className="text-xs font-bold opacity-70 leading-relaxed">انشر مشروعاً جديداً واحصل على عروض من أفضل المستقلين في مجالك خلال ساعات قليلة.</p>
                     </div>
                     <Link href="/projects/create" className="block w-full py-4 bg-white text-primary rounded-xl font-black text-xs hover:bg-accent hover:text-[#0A0E1A] transition-all active:scale-95 text-center">إنشاء مشروع جديد</Link>
                  </div>
                </div>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
}
