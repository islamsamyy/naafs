"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Rocket,
  Settings,
  Users,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  MoreHorizontal,
  Plus,
  MessageSquare,
  FileText,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Lock
} from "lucide-react";

export default function ProjectManagementPage() {
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

        // Verify user is business_owner
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role !== "business_owner") {
          setError("You don't have permission to manage projects. Only business owners can access this page.");
          router.push("/dashboard");
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
          setError("You don't have permission to manage this project.");
          router.push("/projects");
          return;
        }

        // User is authorized
        setIsAuthorized(true);
      } catch (err) {
        console.error("Authorization check failed:", err);
        setError("Authorization check failed. Redirecting...");
        router.push("/dashboard");
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
        <p className="text-on-surface-variant">{error || "You don't have permission to access this page."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Project Header / Control Bar */}
      <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-end gap-6 border-b border-outline-variant/10 pb-10">
        <div className="text-right">
          <div className="flex items-center gap-3 justify-end mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black">نشط الآن</span>
            <div className="flex -space-x-2 flex-row-reverse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[10px] font-bold overflow-hidden ring-1 ring-outline-variant/10">
                  <span className="text-on-surface-variant">U{i}</span>
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold text-white z-10">+٥</div>
            </div>
          </div>
          <h1 className="text-5xl font-black text-on-surface mb-3 font-headline tracking-tight leading-tight">تطوير منصة التجارة الإلكترونية الرقمية</h1>
          <p className="text-on-surface-variant max-w-2xl ml-auto text-lg font-medium leading-relaxed">
            البوابة المتكاملة لإدارة دورة حياة المشروع بكفاءة، تعامل مع الفريق، راقب التقدم، وأصدر الدفعات بأمان.
          </p>
        </div>
        <div className="flex gap-4 flex-row-reverse w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-primary text-white px-8 py-4 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
            <Settings className="w-5 h-5" />
            إعدادات المشروع
          </button>
          <button className="flex-1 md:flex-none bg-surface-container text-on-surface px-8 py-4 rounded-[2rem] font-black border border-outline-variant/10 hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
            <MessageSquare className="w-5 h-5" />
            فريق العمل
          </button>
        </div>
      </div>

      {/* Main Grid: Health & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "التقدم العام", value: "٧٤٪", icon: <Rocket className="w-6 h-6" />, color: "bg-primary-fixed text-primary", trend: "+١٢٪ الأسبوع الحالي" },
          { label: "الميزانية المصروفة", value: "١٢,٤٠٠ ر.س", icon: <CreditCard className="w-6 h-6" />, color: "bg-tertiary-container/30 text-tertiary", trend: "ضمن الميزانية المحددة" },
          { label: "الوقت المتبقي", value: "١٤ يوم", icon: <Clock className="w-6 h-6" />, color: "bg-warning/10 text-orange-600", trend: "الموعد النهائي: ٣٠ أكتوبر" },
          { label: "المخاطر المكتشفة", value: "٢", icon: <AlertCircle className="w-6 h-6" />, color: "bg-error/10 text-error", trend: "تحتاج إلى مراجعة فورية" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-8 border border-outline-variant/15 shadow-sm group hover:shadow-xl transition-all duration-500 text-right">
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-sm font-bold text-on-surface-variant mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black text-on-surface mb-2">{stat.value}</h4>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-[10px] font-black opacity-60">{stat.trend}</span>
              <div className="w-2 h-2 rounded-full bg-primary/20" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Milestone Timeline */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-outline-variant/15 shadow-sm text-right">
          <div className="flex justify-between items-center mb-10 flex-row-reverse">
            <h3 className="text-2xl font-black text-on-surface">خارطة الطريق والإنجازات</h3>
            <button className="p-3 bg-surface-container-low hover:bg-primary/10 hover:text-primary rounded-2xl transition-all">
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-12 pr-4 relative">
            <div className="absolute top-0 right-4 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/30 to-surface-container rounded-full" />
            
            {[
              { title: "تصميم واجهة المستخدم والنماذج الأولية", status: "مكتمل", date: "١٥ أغسطس", id: "١", isDone: true },
              { title: "تطوير البنية التحتية وقواعد البيانات", status: "مكتمل", date: "٠١ سبتمبر", id: "٢", isDone: true },
              { title: "ربط بوابات الدفع المحلية (مدى، تابي)", status: "قيد التنفيذ", date: "٢٠ سبتمبر", id: "٣", isActive: true },
              { title: "الاختبار النهائي وضمان الجودة", status: "مجدول", date: "١٠ أكتوبر", id: "٤" },
            ].map((milestone, idx) => (
              <div key={idx} className={`relative pr-12 group transition-all duration-300 ${milestone.isActive ? 'scale-[1.02]' : 'opacity-80'}`}>
                <div className={`absolute top-0 right-[-6px] w-6 h-6 rounded-full border-4 border-white shadow-lg z-10 transition-colors ${
                  milestone.isDone ? 'bg-primary' : (milestone.isActive ? 'bg-primary animate-pulse' : 'bg-surface-container-high')
                }`} />
                
                <div className={`p-6 rounded-[2rem] border transition-all ${
                  milestone.isActive 
                  ? 'bg-primary/5 border-primary/20 shadow-xl shadow-primary/5' 
                  : 'bg-surface-container-lowest border-outline-variant/5'
                }`}>
                  <div className="flex justify-between items-start flex-row-reverse mb-4">
                    <div className="text-right">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 block">المرحلة {milestone.id}</span>
                      <h4 className="text-lg font-black text-on-surface leading-tight">{milestone.title}</h4>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm px-4 py-1 rounded-xl border border-outline-variant/10">
                      <span className="text-xs font-bold text-on-surface-variant">{milestone.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between flex-row-reverse">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ring-1 ring-inset ${
                        milestone.isDone ? 'bg-tertiary-container/10 text-tertiary ring-tertiary-container/30' :
                        (milestone.isActive ? 'bg-primary/10 text-primary ring-primary/30' : 'bg-surface-container-high text-on-surface-variant ring-outline-variant/20')
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                    {milestone.isActive && (
                      <button className="bg-primary text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        تأكيد الإنجاز
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center & Health */}
        <div className="space-y-8">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/15 shadow-sm text-right">
            <h4 className="text-xl font-black text-on-surface mb-6">إجراءات سريعة</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "إصدار فاتورة", icon: <FileText className="w-5 h-5" /> },
                { label: "دعوة عضو", icon: <Users className="w-5 h-5" /> },
                { label: "تقرير التقدم", icon: <BarChart3 className="w-5 h-5" /> },
                { label: "الأمان", icon: <ShieldCheck className="w-5 h-5" /> }
              ].map((act, i) => (
                <button key={i} className="flex flex-col items-center justify-center p-6 bg-surface-container-low hover:bg-primary-fixed rounded-3xl transition-all gap-3 border border-outline-variant/5">
                  <div className="text-primary">{act.icon}</div>
                  <span className="text-xs font-black">{act.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Project Safety / Escrow */}
          <div className="bg-gradient-to-br from-tertiary to-tertiary-container rounded-[2.5rem] p-8 text-white text-right shadow-2xl shadow-tertiary/20">
            <div className="flex items-center gap-2 justify-end mb-6">
              <span className="text-xs font-bold opacity-80 underline underline-offset-4">النظام المالي المؤمن</span>
              <Lock className="w-4 h-4 opacity-80" />
            </div>
            <h4 className="text-2xl font-black mb-4">المبالغ تحت الضمان</h4>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 relative overflow-hidden group">
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30" />
              <p className="text-white/70 text-sm font-medium mb-1">المبلغ المحتجز حالياً</p>
              <h5 className="text-4xl font-black tracking-tighter mb-4">٤٥,٠٠٠ <span className="text-lg font-medium opacity-80">ر.س</span></h5>
              <div className="flex items-center gap-2 justify-end mb-6">
                <span className="text-[10px] font-bold">بواسطة: مؤسسة نافس للوساطة</span>
                <ShieldCheck className="w-3 h-3" />
              </div>
              <button className="w-full bg-white text-tertiary py-3 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all">إدارة الدفعات</button>
            </div>
          </div>

          {/* Upcoming Meeting */}
          <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 border border-outline-variant/15 text-right relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-x-12 -translate-y-12" />
            <h4 className="text-xl font-black text-on-surface mb-4">الاجتماع القادم</h4>
            <div className="flex items-start gap-4 flex-row-reverse mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center shadow-sm border border-outline-variant/10">
                <span className="text-[10px] font-black text-primary">أكتوبر</span>
                <span className="text-xl font-black text-on-surface">١٨</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-on-surface text-base">مراجعة التحديث التجريبي</p>
                <p className="text-xs text-on-surface-variant font-medium mt-1">٠٩:٣٠ ص - زووم ميتينج</p>
              </div>
            </div>
            <button className="w-full py-3 bg-surface-container text-on-surface font-black rounded-2xl border border-outline-variant/10 hover:bg-surface-container-high transition-all text-sm">انضمام الآن</button>
          </div>
        </div>
      </div>
    </div>
  );
}
