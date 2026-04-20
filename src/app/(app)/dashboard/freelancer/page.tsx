"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Clock, 
  Star, 
  Wallet, 
  Bell, 
  Plus, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Zap, 
  Edit2,
  ChevronLeft,
  Gavel,
  ShieldCheck,
  MessageSquare,
  LayoutGrid,
  Rocket,
  PlusCircle,
  History
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import AnimatedCounter from "@/components/common/AnimatedCounter";
import FloatingNotificationPanel, { Notification } from "@/components/common/FloatingNotificationPanel";
import OptimizedImage from "@/components/common/OptimizedImage";
import ProfileEditModal from "@/components/common/ProfileEditModal";

export default function FreelancerDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [activeBids, setActiveBids] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch freelancer profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);

        // Fetch active bids (pending bids)
        const { data: bidsData } = await supabase
          .from('bids')
          .select('id, amount, created_at, project:projects(id, title, deadline, budget_min, budget_max)')
          .eq('freelancer_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (bidsData) {
          const bidsWithMaxBid = await Promise.all(
            bidsData.map(async (bid: any) => {
              const projectId = bid.project?.id || bid.project_id;
              if (!projectId) return { ...bid, bestBid: bid.amount };

              const { data: allBids } = await supabase
                .from('bids')
                .select('amount')
                .eq('project_id', projectId);
              const maxBid = allBids && allBids.length > 0
                ? Math.max(...allBids.map((b: any) => b.amount || 0))
                : bid.amount;
              return { ...bid, bestBid: maxBid };
            })
          );
          setActiveBids(bidsWithMaxBid.slice(0, 5));
        }

        // Fetch active projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('id, title, deadline, budget_min, client:profiles(name)')
          .eq('awarded_freelancer_id', user.id)
          .eq('status', 'in_progress')
          .order('created_at', { ascending: false });

        if (projectsData) {
          const enrichedProjects = await Promise.all(
            projectsData.map(async (proj: any) => {
              const { data: milestones } = await supabase
                .from('project_milestones')
                .select('status')
                .eq('project_id', proj.id);

              const completed = milestones?.filter((m: any) => m.status === 'completed').length || 0;
              const total = milestones?.length || 0;
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

              return { ...proj, progress, completedMilestones: completed, totalMilestones: total };
            })
          );
          setActiveProjects(enrichedProjects);
        }

        // Calculate stats
        const { data: completedProjects } = await supabase
          .from('projects')
          .select('budget_min')
          .eq('awarded_freelancer_id', user.id)
          .eq('status', 'completed');

        const earnings = completedProjects
          ? completedProjects.reduce((sum: number, p: any) => sum + (p.budget_min || 0), 0)
          : 0;

        setStats({
          earnings,
          activeBids: bidsData?.length || 0,
          rating: profileData?.rating || 0,
          completedProjects: completedProjects?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching freelancer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      {/* ─── Augmented Background Elements ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-float-up" style={{ animationDuration: '25s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] animate-float-up" style={{ animationDuration: '30s', animationDelay: '-10s' }} />
        <div className="absolute inset-0 micro-grid opacity-[0.3]" />
      </div>

      <FloatingNotificationPanel
        notifications={notifications}
        onDismiss={(id) => setNotifications(notifications.filter(n => n.id !== id))}
        position="bottom-right"
      />

      <FloatingActionButton
        icon={Plus}
        label="عرض جديد"
        onClick={() => {
          const newNotif: Notification = {
            id: Date.now().toString(),
            type: "bid",
            title: "جاهز لتقديم عرض",
            message: "استكشف الفرص المتاحة في السوق الآن",
            action: { label: "ابدأ البحث", onClick: () => window.location.href = "/auctions" },
            autoDismissMs: 6000,
          };
          setNotifications([newNotif, ...notifications]);
        }}
        variant="primary"
        showOnMobileOnly={false}
      />

      {/* Dynamic Style Injection */}
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

        .status-pulse {
          position: relative;
        }
        .status-pulse::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          border: 2px solid currentColor;
          opacity: 0;
          animation: badge-pulse 2s infinite;
        }

        @keyframes badge-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
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
            <h2 className="text-2xl font-black tracking-tight text-[#0A0E1A]">أهلاً بك، {profile?.name || 'محترف'}</h2>
            <div className="flex flex-row-reverse items-center gap-2 mt-1 opacity-60">
               <span className="w-2 h-2 rounded-full bg-[#00C2A8] animate-ripple"></span>
               <p className="text-[10px] font-black uppercase tracking-widest">المحفظة جاهزة للعمليات</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/auctions" className="group relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-1000"></div>
             <div className="relative bg-[#0A0E1A] text-white rounded-2xl px-10 py-4 flex items-center gap-3 shadow-xl hover:scale-[1.03] active:scale-95 transition-all">
               <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
               <span className="text-sm font-black">اقتناص فرصة جديدة</span>
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
            { label: "إجمالي الأرباح", value: stats?.earnings, icon: <Wallet />, color: "#1A4FD6", bg: "bg-blue-50" },
            { label: "العروض النشطة", value: stats?.activeBids, icon: <Clock />, color: "#00C2A8", bg: "bg-teal-50" },
            { label: "المشاريع المنجزة", value: stats?.completedProjects, icon: <CheckCircle />, color: "#7C3AED", bg: "bg-purple-50" },
            { label: "التقييم العام", value: stats?.rating, icon: <Star />, color: "#FACC15", bg: "bg-yellow-50", isRating: true },
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
                  <AnimatedCounter from={0} to={stat.value || 0} duration={2000} prefix={!stat.isRating ? "ج" : ""} decimals={stat.isRating ? 1 : 0} />
                  {stat.isRating && " ★"}
                </h3>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Ongoing Projects */}
          <section className="lg:col-span-7 space-y-10">
             <div className="flex flex-row-reverse items-center justify-between px-2">
               <div className="flex flex-row-reverse items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-primary shadow-sm">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0E1A] tracking-tight">المسار التنفيذي</h3>
               </div>
               <Link href="/projects" className="text-xs font-black text-primary hover:gap-3 transition-all flex items-center gap-1 group">
                 <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                 <span>كافة المشاريع</span>
               </Link>
             </div>

             <div className="space-y-6">
               {activeProjects.length > 0 ? activeProjects.map((proj, idx) => (
                 <div key={proj.id} className="premium-card p-8 rounded-[2.5rem] group/item animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                   <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                     <div className="flex-1 text-right space-y-5">
                       <div className="flex flex-row-reverse items-center justify-between">
                         <h4 className="text-xl font-black text-[#0A0E1A] group-hover/item:text-primary transition-colors">{proj.title}</h4>
                         <span className="text-[10px] font-black text-[#8892A4] px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                           {proj.client?.name || 'عميل'}
                         </span>
                       </div>
                       
                       <div className="space-y-3">
                         <div className="flex justify-between items-center flex-row-reverse text-[10px] font-black">
                            <span className="text-[#0A0E1A]">اكتمال الإنجاز</span>
                            <span className="text-primary">{proj.progress}%</span>
                         </div>
                         <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-primary to-accent progress-bar" style={{ '--p-width': `${proj.progress}%` } as any} />
                         </div>
                       </div>

                       <div className="flex flex-row-reverse items-center justify-between pt-2">
                         <div className="flex flex-row-reverse items-center gap-8">
                            <div className="flex flex-row-reverse items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-accent" />
                              <span className="text-[11px] font-bold text-[#64748B] tabular-nums">{proj.budget_min.toLocaleString()} ج</span>
                            </div>
                            <div className="flex flex-row-reverse items-center gap-2">
                              <Clock className="w-4 h-4 text-[#8892A4]" />
                              <span className="text-[11px] font-bold text-[#64748B]">{new Date(proj.deadline).toLocaleDateString('ar-EG')}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-primary px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                              {proj.completedMilestones}/{proj.totalMilestones} مراحل
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
               )) : (
                 <div className="premium-card p-20 text-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/50">
                   <LayoutGrid className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                   <p className="text-sm font-bold text-slate-400">لا يوجد مشاريع تنفيذية نشطة الآن</p>
                 </div>
               )}
             </div>
          </section>

          {/* Active Bids Sidebar */}
          <section className="lg:col-span-5 space-y-10">
             <div className="flex flex-row-reverse items-center justify-between px-2">
               <div className="text-right">
                 <h3 className="text-2xl font-black text-[#0A0E1A] tracking-tight">رصد العطاءات</h3>
                 <p className="text-[10px] font-black text-accent uppercase tracking-widest mt-0.5">Live Auction Tracking</p>
               </div>
               <Link href="/auctions/live" className="text-xs font-black text-[#8892A4] hover:text-primary transition-all">تحديث</Link>
             </div>

             <div className="space-y-6">
                {activeBids.length > 0 ? activeBids.map((bid, idx) => {
                  const isWinning = bid.amount === bid.bestBid;
                  return (
                    <div
                      key={bid.id}
                      className={`premium-card p-6 rounded-[2.5rem] relative overflow-hidden group cursor-pointer animate-fade-in-up ${isWinning ? 'ring-2 ring-accent ring-offset-2' : ''}`}
                      style={{ animationDelay: `${(idx + 2) * 150}ms` }}
                      onMouseEnter={() => setHoveredItem(bid.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {isWinning && <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -z-0" />}
                      
                      <div className="flex flex-row-reverse items-center gap-6 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isWinning ? 'bg-accent text-white shadow-lg shadow-accent/20 rotate-6' : 'bg-slate-50 text-[#8892A4] border-slate-100'}`}>
                          <Gavel className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-right space-y-2">
                          <h4 className="font-black text-lg text-[#0A0E1A] group-hover:text-primary transition-colors line-clamp-1">{bid.project?.title}</h4>
                          <div className="flex flex-row-reverse items-center gap-4">
                             <div className="flex flex-row-reverse items-center gap-2">
                               <span className="text-[10px] font-black text-[#8892A4]">عرضي:</span>
                               <span className="text-sm font-black text-primary tabular-nums">{bid.amount.toLocaleString()} ج</span>
                             </div>
                             <div className="w-1 h-1 rounded-full bg-slate-200" />
                             <div className="flex flex-row-reverse items-center gap-2">
                               <span className="text-[10px] font-black text-[#8892A4]">الأفضل:</span>
                               <span className={`text-sm font-black tabular-nums ${isWinning ? 'text-accent' : 'text-[#0A0E1A]'}`}>{bid.bestBid.toLocaleString()} ج</span>
                             </div>
                          </div>
                        </div>
                        <div className="shrink-0">
                           <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isWinning ? 'bg-accent/10 text-accent status-pulse' : 'bg-slate-100 text-[#8892A4]'}`}>
                             {isWinning ? 'Leading' : 'Outbid'}
                           </div>
                        </div>
                      </div>

                      {/* Expandable Action */}
                      <div className={`mt-6 pt-6 border-t border-slate-50 flex gap-3 transition-all duration-500 ${hoveredItem === bid.id ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                         <button className="flex-1 py-3 bg-[#0A0E1A] text-white text-[10px] font-black rounded-xl hover:bg-primary active:scale-95 transition-all">تحسين العرض</button>
                         <Link href={`/auctions/${bid.project?.id}`} className="w-12 h-12 flex items-center justify-center bg-slate-50 text-[#0A0E1A] rounded-xl hover:bg-slate-100 border border-slate-100 transition-all">
                           <ArrowUpRight className="w-5 h-5" />
                         </Link>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="premium-card p-16 text-center rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/50">
                    <History className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-bold text-slate-400">لا يوجد عطاءات نشطة حالياً</p>
                  </div>
                )}
                
                {/* Promo Card */}
                <div className="premium-card p-10 rounded-[3rem] bg-gradient-to-br from-primary to-[#7C3AED] text-white relative overflow-hidden group border-0 shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  
                  <div className="relative z-10 space-y-8">
                     <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">
                        <TrendingUp className="w-8 h-8" />
                     </div>
                     <div className="text-right">
                       <h5 className="text-2xl font-black mb-2">حلل أداءك</h5>
                       <p className="text-xs font-bold opacity-70 leading-relaxed">اطلع على تقارير تفصيلية لمعدل فوزك بالعطاءات وكيفية تطوير استراتيجيتك السوقية.</p>
                     </div>
                     <button className="w-full py-4 bg-white text-primary rounded-xl font-black text-xs hover:bg-accent hover:text-[#0A0E1A] transition-all active:scale-95">عرض التقارير الذكية</button>
                  </div>
                </div>
             </div>
          </section>
        </div>
      </main>

      <div className="pb-32" />
    </div>
  );
}
