"use client";
import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Compass, Gavel, Briefcase, Settings, BarChart3,
  Loader2, Zap, Edit2, PlusCircle, Clock, DollarSign, Star, TrendingUp,
  CheckCircle, MessageSquare, ArrowUpRight, ChevronLeft, Plus, LayoutGrid, History,
  Search, AlertCircle, Users, Inbox
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import OptimizedImage from "@/components/common/OptimizedImage";
import ProfileEditModal from "@/components/common/ProfileEditModal";
import AnimatedCounter from "@/components/common/AnimatedCounter";
import EmptyState from "@/components/common/EmptyState";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { ToastProvider, useToast } from "@/components/common/Toast";
import { CardSkeleton, FreelancerCardSkeleton, StatSkeleton, ModalSkeleton } from "@/components/common/SkeletonLoader";
import FreelancerModal from "@/components/dashboard/FreelancerModal";
import BidRejectionDialog from "@/components/dashboard/BidRejectionDialog";
import BidAcceptanceDialog from "@/components/dashboard/BidAcceptanceDialog";
import Pagination from "@/components/common/Pagination";

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "explore", label: "استكشف", icon: <Compass className="w-4 h-4" /> },
  { id: "auctions", label: "المزادات", icon: <Gavel className="w-4 h-4" /> },
  { id: "live-auctions", label: "مزادات مباشرة", icon: <Gavel className="w-4 h-4" /> },
  { id: "projects", label: "المشاريع", icon: <Briefcase className="w-4 h-4" /> },
  { id: "available-projects", label: "مشاريع متاحة", icon: <Briefcase className="w-4 h-4" /> },
];

function DashboardPageContent() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [activeBids, setActiveBids] = useState<any[]>([]);
  const [recentBids, setRecentBids] = useState<any[]>([]);
  const [allFreelancers, setAllFreelancers] = useState<any[]>([]);
  const [allAuctions, setAllAuctions] = useState<any[]>([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [acceptingBid, setAcceptingBid] = useState<string | null>(null);
  const [rejectingBid, setRejectingBid] = useState<any>(null);
  const [acceptingBidDialog, setAcceptingBidDialog] = useState<any>(null);
  const [freelancerModalOpen, setFreelancerModalOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [acceptanceDialogOpen, setAcceptanceDialogOpen] = useState(false);
  const [searchFreelancer, setSearchFreelancer] = useState("");
  const [searchProject, setSearchProject] = useState("");
  const [freelancerPage, setFreelancerPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const loadTabData = async () => {
      setTabLoading(true);
      try {
        const supabase = createClient();

        if (activeTab === "explore") {
          const { data: freelancers } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "freelancer")
            .limit(20);
          setAllFreelancers(freelancers || []);
        } else if (activeTab === "auctions" || activeTab === "available-projects") {
          const { data: auctions } = await supabase
            .from("projects")
            .select("*, bids(count)")
            .eq("status", "open")
            .limit(16);
          setAllAuctions(auctions || []);
        }
      } catch (err) {
        console.error("Error loading tab data:", err);
        toast.show('error', 'فشل تحميل البيانات', 3000);
      } finally {
        setTabLoading(false);
      }
    };

    if (activeTab !== "overview" && activeTab !== "projects") {
      loadTabData();
    }
  }, [activeTab, toast]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Get profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);

        // Get all freelancers
        const { data: freelancers } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "freelancer")
          .limit(20);
        setAllFreelancers(freelancers || []);

        // Get all open projects (auctions)
        const { data: auctions } = await supabase
          .from("projects")
          .select("*, bids(count)")
          .eq("status", "open")
          .limit(16);
        setAllAuctions(auctions || []);

        if (profileData?.role === "freelancer") {
          // Freelancer: active bids
          const { data: bidsData } = await supabase
            .from("bids")
            .select("*, project:projects(id, title, deadline, budget_min, budget_max)")
            .eq("freelancer_id", user.id)
            .eq("status", "pending")
            .order("created_at", { ascending: false });
          setActiveBids(bidsData?.slice(0, 5) || []);

          // Freelancer: projects in progress
          const { data: projectsData } = await supabase
            .from("projects")
            .select("id, title, deadline, budget_min, client:profiles(name)")
            .eq("awarded_freelancer_id", user.id)
            .eq("status", "in_progress");
          setMyProjects(projectsData || []);

          const { data: completedProjects } = await supabase
            .from("projects")
            .select("budget_min")
            .eq("awarded_freelancer_id", user.id)
            .eq("status", "completed");

          setStats({
            earnings: completedProjects?.reduce((s: number, p: any) => s + (p.budget_min || 0), 0) || 0,
            activeBids: bidsData?.length || 0,
            completedProjects: completedProjects?.length || 0,
            rating: profileData?.rating || 0,
          });
        } else {
          // Business owner: my projects
          const { data: myProjectsData } = await supabase
            .from("projects")
            .select("*, bids(count)")
            .eq("client_id", user.id)
            .order("created_at", { ascending: false });
          setMyProjects(myProjectsData || []);

          // Business owner: recent bids
          const { data: bidsOnProjects } = await supabase
            .from("bids")
            .select("id, amount, created_at, freelancer:profiles(name, avatar_url), project:projects(title, id)")
            .in("project_id", myProjectsData?.map((p: any) => p.id) || [])
            .order("created_at", { ascending: false })
            .limit(5);
          setRecentBids(bidsOnProjects || []);

          const activeCount = myProjectsData?.filter((p: any) => p.status === "open").length || 0;
          const completedCount = myProjectsData?.filter((p: any) => p.status === "completed").length || 0;

          const { data: bidsData } = await supabase
            .from("bids")
            .select("amount")
            .eq("status", "accepted")
            .in("project_id", myProjectsData?.map((p: any) => p.id) || []);

          setStats({
            totalSpent: bidsData?.reduce((s: number, b: any) => s + (b.amount || 0), 0) || 0,
            activeProjects: activeCount,
            completedProjects: completedCount,
            totalProjects: myProjectsData?.length || 0,
          });
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAcceptBidSuccess = () => {
    setRecentBids(recentBids.filter(b => b.id !== acceptingBidDialog?.id));
  };

  const handleRejectBidSuccess = () => {
    setRecentBids(recentBids.filter(b => b.id !== rejectingBid?.id));
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

  const isBusiness = profile?.role === "business_owner";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A0E1A] antialiased overflow-x-hidden relative" dir="rtl">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-float-up" style={{ animationDuration: '25s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px] animate-float-up" style={{ animationDuration: '30s', animationDelay: '-10s' }} />
      </div>

      <style jsx global>{`
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
      `}</style>

      {/* Header with Quick Links */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-3xl border-b border-[#E2E8F0] px-10 py-5 shadow-lg shadow-black/[0.01]">
        {/* Top section with profile and quick links */}
        <div className="flex flex-row-reverse justify-between items-center mb-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button onClick={() => setEditModalOpen(true)} className="relative transition-all active:scale-95">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/10 transition-all group-hover:border-primary group-hover:shadow-2xl group-hover:shadow-primary/30">
                  <OptimizedImage src={profile?.avatar_url} alt={profile?.name} width={56} height={56} className="group-hover:scale-125 transition-transform duration-700" loading="eager" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-accent rounded-lg p-1.5 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Edit2 className="w-4 h-4 text-white" />
                </div>
              </button>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black tracking-tight text-[#0A0E1A]">أهلاً بك، {profile?.name || 'مستخدم'}</h2>
              <div className="flex flex-row-reverse items-center gap-2 mt-1 opacity-60">
                 <span className="w-2 h-2 rounded-full bg-[#00C2A8] animate-ripple"></span>
                 <p className="text-[10px] font-black uppercase tracking-widest">متصل الآن</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => {
              if (isBusiness) {
                alert("سيتم إضافة نموذج إنشاء المشروع قريباً");
              } else {
                setActiveTab("auctions");
              }
            }} className="group relative">
               <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-1000"></div>
               <div className="relative bg-[#0A0E1A] text-white rounded-2xl px-10 py-4 flex items-center gap-3 shadow-xl hover:scale-[1.03] active:scale-95 transition-all">
                 <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                 <span className="text-sm font-black">{isBusiness ? "مشروع جديد" : "عرض جديد"}</span>
               </div>
            </button>
          </div>
        </div>

        {/* Quick navigation links */}
        <div className="flex gap-4 flex-row-reverse text-sm font-black">
          <button onClick={() => setActiveTab("live-auctions")} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-primary/10 text-[#0A0E1A]">
            <Gavel className="w-4 h-4" />
            المزادات المباشرة
          </button>
          <button onClick={() => setActiveTab("explore")} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-primary/10 text-[#0A0E1A]">
            <Compass className="w-4 h-4" />
            استكشف المبدعين
          </button>
          <button onClick={() => setActiveTab("available-projects")} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-primary/10 text-[#0A0E1A]">
            <Briefcase className="w-4 h-4" />
            المشاريع المتاحة
          </button>
        </div>
      </header>

      <ProfileEditModal user={profile} isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} onSaveSuccess={(u) => setProfile(u)} />

      {/* Tabs */}
      <div className="sticky top-[73px] z-30 bg-white/70 backdrop-blur-2xl border-b border-[#E2E8F0] px-10">
        <div className="flex gap-2 overflow-x-auto pb-0 flex-row-reverse">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-4 text-sm font-black whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-[#8892A4] hover:text-[#0A0E1A]'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="p-10 max-w-[1700px] mx-auto space-y-16 relative z-10">

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(isBusiness ? [
                  { label: "إجمالي الإنفاق", value: stats?.totalSpent, icon: <DollarSign />, color: "#1A4FD6", bg: "bg-blue-50", isRating: false },
                  { label: "المشاريع النشطة", value: stats?.activeProjects, icon: <Briefcase />, color: "#00C2A8", bg: "bg-teal-50", isRating: false },
                  { label: "المشاريع المكتملة", value: stats?.completedProjects, icon: <TrendingUp />, color: "#7C3AED", bg: "bg-purple-50", isRating: false },
                  { label: "إجمالي المشاريع", value: stats?.totalProjects, icon: <LayoutGrid />, color: "#FACC15", bg: "bg-yellow-50", isRating: false },
                ] : [
                  { label: "إجمالي الأرباح", value: stats?.earnings, icon: <DollarSign />, color: "#1A4FD6", bg: "bg-blue-50", isRating: false },
                  { label: "العروض النشطة", value: stats?.activeBids, icon: <Clock />, color: "#00C2A8", bg: "bg-teal-50", isRating: false },
                  { label: "المشاريع المنجزة", value: stats?.completedProjects, icon: <CheckCircle />, color: "#7C3AED", bg: "bg-purple-50", isRating: false },
                  { label: "التقييم العام", value: stats?.rating, icon: <Star />, color: "#FACC15", bg: "bg-yellow-50", isRating: true },
                ]).map((stat, i) => (
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

            {isBusiness ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <section className="lg:col-span-7 space-y-6">
                  <h3 className="text-2xl font-black">مشاريعي</h3>
                  {myProjects.slice(0, 3).map((p) => (
                    <div key={p.id} className="premium-card p-6 rounded-2xl">
                      <div className="flex justify-between items-start flex-row-reverse">
                        <div>
                          <h4 className="font-black text-lg">{p.title}</h4>
                          <p className="text-sm text-[#8892A4]">{p.bids?.[0]?.count || 0} عرض</p>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${p.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{p.status === 'open' ? 'مفتوح' : 'قيد التنفيذ'}</span>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setActiveTab("projects")} className="text-primary font-black text-sm flex items-center gap-1 group"><ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> كل المشاريع</button>
                </section>

                <section className="lg:col-span-5 space-y-6">
                  <h3 className="text-2xl font-black">العروض الواردة</h3>
                  {recentBids.slice(0, 4).map((b) => (
                    <div key={b.id} className="premium-card p-4 rounded-2xl group">
                      <div className="flex gap-4 flex-row-reverse mb-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                          <OptimizedImage src={b.freelancer?.avatar_url} alt={b.freelancer?.name} width={48} height={48} />
                        </div>
                        <div className="flex-1 text-right text-sm">
                          <p className="font-black">{b.freelancer?.name}</p>
                          <p className="text-[#8892A4] text-xs line-clamp-1">{b.project?.title}</p>
                          <p className="text-primary font-black text-xs mt-1">{b.amount.toLocaleString()} ج</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-row-reverse opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                        <button
                          onClick={() => {
                            setAcceptingBidDialog(b);
                            setAcceptanceDialogOpen(true);
                          }}
                          className="flex-1 py-2 bg-primary text-white text-[10px] font-black rounded-lg hover:opacity-90 transition-all active:scale-95"
                        >
                          قبول
                        </button>
                        <button
                          onClick={() => {
                            setRejectingBid(b);
                            setRejectionDialogOpen(true);
                          }}
                          className="flex-1 py-2 bg-red-100 text-red-700 text-[10px] font-black rounded-lg hover:bg-red-200 transition-all active:scale-95"
                          aria-label="رفض العرض"
                        >
                          رفض
                        </button>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <section className="lg:col-span-7 space-y-6">
                  <h3 className="text-2xl font-black">المشاريع الحالية</h3>
                  {myProjects.slice(0, 3).map((p) => (
                    <div key={p.id} className="premium-card p-6 rounded-2xl">
                      <h4 className="font-black text-lg">{p.title}</h4>
                      <p className="text-sm text-[#8892A4]">من {p.client?.name}</p>
                      <p className="text-xs text-[#64748B] mt-2">{new Date(p.deadline).toLocaleDateString('ar-EG')}</p>
                    </div>
                  ))}
                  <button onClick={() => setActiveTab("projects")} className="text-primary font-black text-sm flex items-center gap-1 group"><ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> كل المشاريع</button>
                </section>

                <section className="lg:col-span-5 space-y-6">
                  <h3 className="text-2xl font-black">العروض النشطة</h3>
                  {activeBids.slice(0, 4).map((b) => (
                    <div key={b.id} className="premium-card p-4 rounded-2xl">
                      <p className="font-black text-sm line-clamp-1">{b.project?.title}</p>
                      <p className="text-primary font-black">{b.amount.toLocaleString()} ج</p>
                      <p className="text-[10px] text-[#8892A4]">{new Date(b.project?.deadline).toLocaleDateString('ar-EG')}</p>
                    </div>
                  ))}
                </section>
              </div>
            )}
          </>
        )}

        {/* EXPLORE TAB */}
        {activeTab === "explore" && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-black flex-1">استكشف المحترفين</h2>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8892A4]" />
                <input
                  type="text"
                  placeholder="ابحث عن محترف..."
                  value={searchFreelancer}
                  onChange={(e) => {
                    setSearchFreelancer(e.target.value);
                    setFreelancerPage(1);
                  }}
                  className="w-full pr-10 pl-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-primary transition-colors"
                  aria-label="ابحث عن محترف"
                />
              </div>
            </div>
            {tabLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <FreelancerCardSkeleton key={i} />)}
              </div>
            ) : (
              <>
                {(() => {
                  const filtered = allFreelancers.filter(f =>
                    f.name.toLowerCase().includes(searchFreelancer.toLowerCase()) ||
                    f.title?.toLowerCase().includes(searchFreelancer.toLowerCase())
                  );
                  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                  const start = (freelancerPage - 1) * ITEMS_PER_PAGE;
                  const paginatedData = filtered.slice(start, start + ITEMS_PER_PAGE);

                  return filtered.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title={searchFreelancer ? "لا توجد نتائج" : "لا توجد محترفين"}
                      description={searchFreelancer ? "لم نجد محترفين مطابقين لبحثك" : "لا توجد محترفين متاحين حالياً. تحقق لاحقاً!"}
                    />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {paginatedData.map((f) => (
                          <div
                            key={f.id}
                            className="premium-card p-6 rounded-2xl text-center group cursor-pointer hover:shadow-lg transition-all"
                            onClick={() => {
                              setSelectedFreelancer(f);
                              setFreelancerModalOpen(true);
                            }}
                          >
                            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 border-2 border-primary/10 group-hover:border-primary transition-colors">
                              <OptimizedImage src={f.avatar_url} alt={f.name} width={64} height={64} />
                            </div>
                            <h4 className="font-black text-lg">{f.name}</h4>
                            <p className="text-sm text-[#8892A4]">{f.title || 'محترف'}</p>
                            <div className="flex items-center justify-center gap-1 mt-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-black">{f.rating || 0}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFreelancer(f);
                                setFreelancerModalOpen(true);
                              }}
                              className="mt-4 block w-full py-2 bg-primary text-white rounded-lg font-black text-sm hover:opacity-90 transition-opacity active:scale-95"
                            >
                              عرض الملف
                            </button>
                          </div>
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={freelancerPage}
                          totalPages={totalPages}
                          onPageChange={setFreelancerPage}
                        />
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </section>
        )}

        {/* AUCTIONS TAB */}
        {activeTab === "auctions" && (
          <section>
            <h2 className="text-3xl font-black mb-8">المزادات المتاحة</h2>
            {tabLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
              </div>
            ) : (
              <>
                {(() => {
                  const totalPages = Math.ceil(allAuctions.length / ITEMS_PER_PAGE);
                  const start = (projectPage - 1) * ITEMS_PER_PAGE;
                  const paginatedData = allAuctions.slice(start, start + ITEMS_PER_PAGE);

                  return allAuctions.length === 0 ? (
                    <EmptyState
                      icon={Gavel}
                      title="لا توجد مزادات"
                      description="لا توجد مزادات مفتوحة حالياً. تحقق لاحقاً!"
                    />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {paginatedData.map((a) => (
                          <div
                            key={a.id}
                            className="premium-card p-8 rounded-2xl group cursor-pointer hover:shadow-lg transition-all"
                            onClick={() => setSelectedProject(a)}
                          >
                            <div className="flex justify-between items-start flex-row-reverse mb-4">
                              <div className="flex-1">
                                <h4 className="font-black text-xl group-hover:text-primary transition-colors">{a.title}</h4>
                                <p className="text-sm text-[#8892A4] mt-1 line-clamp-2">{a.description}</p>
                              </div>
                              <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full ml-2 flex-shrink-0">مفتوح</span>
                            </div>
                            <div className="flex gap-4 flex-row-reverse">
                              <div className="text-right">
                                <p className="text-[10px] text-[#8892A4]">الميزانية</p>
                                <p className="font-black">{a.budget_min?.toLocaleString()}-{a.budget_max?.toLocaleString()} ج</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-[#8892A4]">العروض</p>
                                <p className="font-black">{a.bids?.[0]?.count || 0}</p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(a);
                              }}
                              className="mt-4 block w-full py-2 bg-primary text-white rounded-lg font-black text-sm text-center hover:opacity-90 transition-opacity active:scale-95"
                            >
                              عرض التفاصيل
                            </button>
                          </div>
                        ))}
                      </div>
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={projectPage}
                          totalPages={totalPages}
                          onPageChange={setProjectPage}
                        />
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </section>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <section>
            <h2 className="text-3xl font-black mb-8">{isBusiness ? "مشاريعي" : "المشاريع النشطة"}</h2>
            {tabLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
              </div>
            ) : myProjects.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title={isBusiness ? "لا توجد مشاريع" : "لا توجد مشاريع نشطة"}
                description={isBusiness ? "لم تقم بنشر أي مشروع حتى الآن" : "لا توجد مشاريع نشطة حالياً"}
                action={isBusiness ? {
                  label: "إنشاء مشروع جديد",
                  onClick: () => toast.show('info', 'سيتم إضافة نموذج إنشاء المشروع قريباً', 3000)
                } : undefined}
              />
            ) : (
              <div className="space-y-6">
                {myProjects.map((p) => (
                  <div
                    key={p.id}
                    className="premium-card p-8 rounded-2xl group cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => setSelectedProject(p)}
                  >
                    <div className="flex justify-between items-start flex-row-reverse">
                      <div className="flex-1">
                        <h4 className="font-black text-xl group-hover:text-primary transition-colors">{p.title}</h4>
                        <p className="text-sm text-[#8892A4] mt-1">{isBusiness ? `${p.bids?.[0]?.count || 0} عرض` : `من ${p.client?.name}`}</p>
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${p.status === 'open' ? 'bg-green-100 text-green-700' : p.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.status === 'open' ? 'مفتوح' : p.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-4 flex-row-reverse text-sm">
                      <div><span className="text-[#8892A4]">الميزانية:</span> <span className="font-black">{p.budget_min?.toLocaleString()}-{p.budget_max?.toLocaleString()} ج</span></div>
                      <div><span className="text-[#8892A4]">الموعد:</span> <span className="font-black">{new Date(p.deadline).toLocaleDateString('ar-EG')}</span></div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(p);
                      }}
                      className="mt-4 inline-block py-2 px-4 bg-primary text-white rounded-lg font-black text-sm hover:opacity-90 transition-opacity active:scale-95"
                    >
                      التفاصيل
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* LIVE AUCTIONS TAB */}
        {activeTab === "live-auctions" && (
          <section>
            <h2 className="text-3xl font-black mb-8">المزادات المباشرة - أحدث النشاط</h2>
            <div className="space-y-4">
              {allAuctions.slice(0, 10).map((auction, idx) => (
                <div key={`${auction.id}-${idx}`} className="premium-card p-6 rounded-2xl group cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedProject(auction)}>
                  <div className="flex items-center justify-between flex-row-reverse">
                    <div className="flex-1">
                      <h4 className="font-black text-lg group-hover:text-primary transition-colors">{auction.title}</h4>
                      <p className="text-sm text-[#8892A4] mt-1 line-clamp-2">{auction.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full">مفتوح</span>
                      <span className="text-primary font-black text-sm">{auction.bids?.[0]?.count || 0} عرض</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-6 flex-row-reverse text-sm">
                    <div><span className="text-[#8892A4]">الميزانية:</span> <span className="font-black text-primary">{auction.budget_min?.toLocaleString()}-{auction.budget_max?.toLocaleString()} ج</span></div>
                    <div><span className="text-[#8892A4]">الموعد:</span> <span className="font-black">{new Date(auction.deadline).toLocaleDateString('ar-EG')}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AVAILABLE PROJECTS TAB */}
        {activeTab === "available-projects" && (
          <section>
            <h2 className="text-3xl font-black mb-8">المشاريع المتاحة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allAuctions.map((proj) => (
                <div key={proj.id} className="premium-card p-8 rounded-2xl group cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedProject(proj)}>
                  <div className="flex justify-between items-start flex-row-reverse mb-4">
                    <div className="flex-1">
                      <h4 className="font-black text-xl group-hover:text-primary transition-colors">{proj.title}</h4>
                      <p className="text-sm text-[#8892A4] mt-1 line-clamp-2">{proj.description}</p>
                    </div>
                    <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full ml-2 flex-shrink-0">متاح</span>
                  </div>
                  <div className="flex gap-6 flex-row-reverse mb-4">
                    <div className="text-right">
                      <p className="text-[10px] text-[#8892A4]">الميزانية</p>
                      <p className="font-black text-primary">{proj.budget_min?.toLocaleString()}-{proj.budget_max?.toLocaleString()} ج</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#8892A4]">الموعد النهائي</p>
                      <p className="font-black">{new Date(proj.deadline).toLocaleDateString('ar-EG')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#8892A4]">العروض</p>
                      <p className="font-black text-accent">{proj.bids?.[0]?.count || 0}</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedProject(proj); }} className="w-full py-2 bg-primary text-white rounded-lg font-black text-sm hover:opacity-90 transition-opacity">
                    عرض التفاصيل
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <section className="text-center py-20">
            <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-[#8892A4]">سيتم إضافة الإحصائيات قريباً</p>
          </section>
        )}
      </main>

      {/* Freelancer Modal */}
      <FreelancerModal
        freelancer={selectedFreelancer}
        isOpen={freelancerModalOpen}
        onClose={() => setFreelancerModalOpen(false)}
      />

      {/* Bid Acceptance Dialog */}
      <BidAcceptanceDialog
        bid={acceptingBidDialog}
        isOpen={acceptanceDialogOpen}
        onClose={() => setAcceptanceDialogOpen(false)}
        onSuccess={handleAcceptBidSuccess}
      />

      {/* Bid Rejection Dialog */}
      <BidRejectionDialog
        bid={rejectingBid}
        isOpen={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        onSuccess={handleRejectBidSuccess}
      />

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-right">
              <div className="flex justify-between items-start mb-6 flex-row-reverse">
                <div className="flex-1">
                  <h2 className="text-3xl font-black mb-2">{selectedProject.title}</h2>
                  <p className="text-[#8892A4]">{selectedProject.description}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-2xl text-[#8892A4] hover:text-[#0A0E1A] flex-shrink-0 transition-colors"
                  aria-label="إغلاق"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="premium-card p-4 rounded-2xl text-center">
                  <p className="text-[10px] text-[#8892A4] font-black mb-1">الميزانية</p>
                  <p className="font-black text-lg text-primary">{selectedProject.budget_min?.toLocaleString()}-{selectedProject.budget_max?.toLocaleString()} ج</p>
                </div>
                <div className="premium-card p-4 rounded-2xl text-center">
                  <p className="text-[10px] text-[#8892A4] font-black mb-1">العروض</p>
                  <p className="font-black text-lg text-accent">{selectedProject.bids?.[0]?.count || 0}</p>
                </div>
                <div className="premium-card p-4 rounded-2xl text-center">
                  <p className="text-[10px] text-[#8892A4] font-black mb-1">الموعد</p>
                  <p className="font-black text-lg">{new Date(selectedProject.deadline).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-full py-3 bg-primary text-white rounded-xl font-black hover:opacity-90 transition-opacity active:scale-95"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <ErrorBoundary>
        <DashboardPageContent />
      </ErrorBoundary>
    </ToastProvider>
  );
}
