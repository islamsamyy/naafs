"use client";

import React, { useEffect, useState } from "react";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  ShieldCheck,
  Lock,
  History,
  Search,
  Filter,
  Download,
  Eye,
  RotateCcw,
  Receipt,
  Landmark,
  AlertCircle,
  MoreVertical,
  TrendingUp,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function WalletPage() {
  const [profile, setProfile] = useState<any>(null);
  const [walletStats, setWalletStats] = useState({
    available: 0,
    pending: 0,
    monthlyEarnings: 0,
    totalWithdrawn: 0,
    activeProjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Get user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(profileData);

        // Calculate pending earnings from accepted bids
        const { data: bidsData } = await supabase
          .from('bids')
          .select('amount, created_at, projects!inner(status)')
          .eq('status', 'accepted')
          .eq('freelancer_id', user.id);

        const pending = bidsData?.reduce((sum, bid) => sum + (bid.amount || 0), 0) || 0;

        // Calculate active projects
        const { data: activeProjects } = await supabase
          .from('projects')
          .select('id')
          .eq('awarded_freelancer_id', user.id)
          .eq('status', 'in_progress');

        // For now, available balance is 0 (would need a transactions table)
        // Monthly earnings could be calculated from this month's completed projects
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const { data: monthlyBids } = await supabase
          .from('bids')
          .select('amount, projects!inner(status, created_at)')
          .eq('freelancer_id', user.id)
          .gte('created_at', monthStart.toISOString());

        const monthlyEarnings = monthlyBids
          ?.filter((b: any) => new Date(b.projects?.created_at || 0) >= monthStart)
          .reduce((sum, bid) => sum + (bid.amount || 0), 0) || 0;

        setWalletStats({
          available: 0, // Would need actual transaction history
          pending,
          monthlyEarnings,
          totalWithdrawn: 0, // Would need withdrawal history
          activeProjects: activeProjects?.length || 0
        });
      } catch (err) {
        console.error('Error fetching wallet data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#1A4FD6] mb-4" />
        <h2 className="text-xl font-black text-[#0A0E1A]">جاري تحميل المحفظة...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <header className="mb-12 text-right">
        <h1 className="text-4xl font-black text-on-surface mb-2 font-headline tracking-tight">إدارة الشؤون المالية</h1>
        <p className="text-on-surface-variant max-w-2xl ml-auto">تتبع أرباحك، معاملاتك، والمبالغ المعلقة بكل شفافية وأمان فائق.</p>
      </header>

      {/* Kinetic Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Iridescent Wallet Card */}
        <div className="lg:col-span-2 rounded-[2.5rem] p-10 text-white flex flex-col justify-between min-h-[360px] shadow-2xl shadow-primary/30 group relative overflow-hidden bg-gradient-to-br from-primary via-primary-container to-[#006859] animate-gradient-shift">
          {/* Animated Glow Background */}
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(101,250,222,0.15)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col h-full justify-between rtl">
            <div className="flex justify-between items-start">
              <div className="text-right">
                <p className="text-white/70 text-sm mb-1 font-bold">الرصيد المتاح</p>
                <h3 className="text-6xl font-black font-headline tracking-tighter flex items-baseline gap-3 justify-end">
                  {walletStats.available.toLocaleString()}
                  <span className="text-2xl font-medium opacity-80">ج.م</span>
                </h3>
              </div>
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { label: "تحت المراجعة", value: `${walletStats.pending.toLocaleString()} ج.م` },
                { label: "أرباح الشهر", value: `${walletStats.monthlyEarnings.toLocaleString()} ج.م` },
                { label: "إجمالي السحب", value: `${walletStats.totalWithdrawn.toLocaleString()} ج.م` },
                { label: "المشاريع النشطة", value: `${walletStats.activeProjects} مشروع` }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 text-right">
                  <p className="text-white/60 text-xs mb-1 font-bold">{stat.label}</p>
                  <p className="font-bold text-lg">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-row-reverse gap-4 mt-10">
              <button className="bg-[#65fade] text-[#00201b] px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-[#65fade]/40 transition-all active:scale-95">
                <ArrowDownLeft className="w-5 h-5" />
                سحب الرصيد
              </button>
              <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 border border-white/20 hover:bg-white/30 transition-all active:scale-95">
                <Plus className="w-5 h-5" />
                شحن المحفظة
              </button>
            </div>
          </div>
        </div>

        {/* Escrow Status Card */}
        <div className="bg-surface-container-low rounded-[2.5rem] p-10 flex flex-col justify-between shadow-sm group border border-outline-variant/10 text-right">
          <div>
            <div className="flex items-center gap-2 text-tertiary mb-6 justify-end">
              <span className="font-bold text-sm tracking-wide">الضمان المالي (Escrow)</span>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-2xl font-black text-on-surface mb-8 leading-tight">المبالغ المؤمنة في المشاريع الحالية</h4>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center flex-row-reverse mb-1">
                  <span className="text-sm font-bold">تطوير تطبيق العقارات</span>
                  <span className="text-sm text-tertiary font-bold tracking-tight">٤,٥٠٠ ر.س</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary-container h-full w-3/4 animate-pulse-slow"></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center flex-row-reverse mb-1">
                  <span className="text-sm font-bold">تصميم الهوية البصرية</span>
                  <span className="text-sm text-secondary font-bold tracking-tight">١,٢٠٠ ر.س</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          
          <button className="mt-10 text-primary font-bold flex items-center gap-2 group-hover:gap-4 transition-all justify-end">
            عرض تفاصيل الضمان
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-10 shadow-sm border border-outline-variant/15 text-right mt-4">
          <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h4 className="text-3xl font-black text-on-surface mb-1">سجل المعاملات</h4>
              <p className="text-on-surface-variant text-sm font-medium">مراجعة تاريخية لكافة الحركات المالية</p>
            </div>
            <div className="flex gap-2 flex-row-reverse w-full md:w-auto">
              <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">الكل</button>
              <button className="px-6 py-2.5 bg-surface-container rounded-xl text-sm font-bold text-on-surface-variant hover:bg-primary-fixed transition-all">الفواتير</button>
              <button className="px-6 py-2.5 bg-surface-container rounded-xl text-sm font-bold text-on-surface-variant hover:bg-primary-fixed transition-all">عمليات السحب</button>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right border-separate border-spacing-y-4 font-body">
              <thead>
                <tr className="text-on-surface-variant/70 text-sm font-bold border-b border-outline-variant/10">
                  <th className="pb-4 pr-6">المعاملة</th>
                  <th className="pb-4">الحالة</th>
                  <th className="pb-4">التاريخ</th>
                  <th className="pb-4">القيمة</th>
                  <th className="pb-4 pl-6 text-left">الإجراء</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {[
                  {
                    title: "دفعة مشروع: نظام إدارة المستودعات",
                    id: "#TXN-98234",
                    status: "مكتملة",
                    statusType: "success",
                    date: "١٢ أكتوبر ٢٠٢٣",
                    amount: "٣,٥٠٠.٠٠ ر.س",
                    icon: <Receipt className="w-6 h-6" />,
                    iconBg: "bg-tertiary-container/10 text-tertiary"
                  },
                  {
                    title: "سحب رصيد إلى الحساب البنكي",
                    id: "بنك الراجحي - **** ١٢٣٤",
                    status: "قيد المعالجة",
                    statusType: "warning",
                    date: "١٠ أكتوبر ٢٠٢٣",
                    amount: "٥,٠٠٠.٠٠ ر.س",
                    icon: <Landmark className="w-6 h-6" />,
                    iconBg: "bg-primary-container/10 text-primary"
                  },
                  {
                    title: "رسوم اشتراك الباقة المميزة",
                    id: "محاولة دفع فاشلة",
                    status: "فاشلة",
                    statusType: "error",
                    date: "٠٨ أكتوبر ٢٠٢٣",
                    amount: "١٩٩.٠٠ ر.س",
                    isNegative: true,
                    icon: <AlertCircle className="w-6 h-6" />,
                    iconBg: "bg-error-container/20 text-error"
                  }
                ].map((row, idx) => (
                  <tr key={idx} className="bg-surface-container-lowest/50 hover:bg-white hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 group rounded-2xl group border border-outline-variant/5">
                    <td className="py-6 pr-6 rounded-r-2xl">
                      <div className="flex items-center gap-4 justify-end flex-row-reverse">
                        <div className={`w-12 h-12 rounded-2xl ${row.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                          {row.icon}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-on-surface text-base">{row.title}</p>
                          <p className="text-xs text-on-surface-variant font-medium mt-1">{row.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black ring-1 ring-inset ${
                        row.statusType === 'success' ? 'bg-tertiary-container/10 text-tertiary ring-tertiary-container/20' :
                        row.statusType === 'warning' ? 'bg-secondary-fixed/50 text-on-secondary-fixed-variant ring-secondary-fixed/20' :
                        'bg-error-container/40 text-on-error-container ring-error-container/30'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-6 text-on-surface-variant font-bold text-sm">{row.date}</td>
                    <td className="py-6">
                      <p className={`font-black text-xl tracking-tight ${row.isNegative ? 'text-error' : 'text-on-surface'}`}>
                        {row.isNegative ? '-' : ''}{row.amount}
                      </p>
                    </td>
                    <td className="py-6 pl-6 rounded-l-2xl text-left">
                      <button className="p-2.5 text-outline hover:bg-primary/5 hover:text-primary rounded-xl transition-all">
                        {row.statusType === 'error' ? <RotateCcw className="w-5 h-5" /> : (row.statusType === 'warning' ? <Eye className="w-5 h-5" /> : <Download className="w-5 h-5" />)}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
