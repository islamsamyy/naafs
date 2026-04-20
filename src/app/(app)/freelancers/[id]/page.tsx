"use client";
import React, { useState, useEffect } from "react";
import { Star, Send, Loader2, MapPin, Calendar, Clock, Briefcase, Zap, CheckCircle2 } from "lucide-react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export default function FreelancerProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*, bids(*, project:projects(*))")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) fetchProfile();
  }, [params.id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 rounded-full border-4 border-t-[#1A4FD6] animate-spin border-gray-100 mb-4" />
      <p className="text-lg font-bold text-gray-500">جاري تحميل الملف الشخصي...</p>
    </div>
  );

  if (error || !profile) return (
    <div className="text-center py-20 bg-white rounded-3xl border border-red-100">
      <h2 className="text-2xl font-black text-red-500 mb-2">عذراً، لم يتم العثور على الشخص</h2>
      <p className="text-gray-500">العضو الذي تبحث عنه غير موجود أو تم حذفه</p>
    </div>
  );

  const portfolio = [
    {
      id: "1",
      title: "منصة تجارة إلكترونية متكاملة",
      category: "تطوير ويب",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop",
      description: "بناء نظام دفع إلكتروني متطور يدعم عدة لغات وعملات."
    },
    {
      id: "2",
      title: "تطبيق حجوزات طبية",
      category: "تطوير جوال",
      image: "https://images.unsplash.com/photo-1576091160550-217359f42f8c?w=400&h=300&fit=crop",
      description: "تصميم واجهات سهلة الاستخدام للمرضى والأطباء."
    },
    {
      id: "3",
      title: "هوية بصرية لشركة تقنية",
      category: "تصميم جرافيك",
      image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=400&h=300&fit=crop",
      description: "خلق شعار وهوية تعبر عن الابتكار والسرعة."
    }
  ];

  const reviews = [
    { name: "أحمد العتيبي", title: "مدير مشاريع", text: "عمل احترافي وسرعة في التنفيذ، سأتعامل معه مرة أخرى بالتأكيد.", image: "https://i.pravatar.cc/150?u=a" },
    { name: "سارة محمد", title: "صاحبة متجر", text: "دقة في المواعيد وفهم عميق للمتطلبات التقنية.", image: "https://i.pravatar.cc/150?u=s" }
  ];

  return (
    <div className="space-y-10 animate-fade-in-up pb-20">
      {/* ── Hero Profile ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 rtl" dir="rtl">
        {/* Identity Card */}
        <div
          className="lg:col-span-8 rounded-2xl p-7 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden"
          style={{ background: "#FFFFFF", border: "1px solid #E8ECF4", boxShadow: "0 4px 20px rgba(26,79,214,0.06)" }}
        >
          <div
            className="absolute top-0 left-0 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(26,79,214,0.05), transparent 70%)", transform: "translate(-40%, -40%)" }}
          />
          <div className="relative flex-shrink-0">
            <img
              alt="Freelancer"
              className="w-28 h-28 rounded-2xl object-cover"
              style={{ border: "3px solid #E8ECF4", boxShadow: "0 4px 16px rgba(26,79,214,0.12)" }}
              src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=1A4FD6&color=fff`}
            />
            {profile.is_verified && (
              <span
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white"
                style={{ background: "#00C2A8" }}
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
              </span>
            )}
          </div>

          <div className="flex-1 text-right relative z-10 w-full">
            <div className="flex items-center gap-2 flex-row-reverse mb-2">
              <h1 className="text-3xl font-black" style={{ color: "#0A0E1A", letterSpacing: "-0.03em" }}>{profile.name}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#EEF3FF", color: "#1A4FD6" }}>
                {profile.role === "freelancer" ? "مستقل محترف" : "صاحب أعمال"}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#8892A4" }}>
              {profile.bio || "لا يوجد وصف متوفر حالياً لهذا المستخدم."}
            </p>
            <div className="flex flex-wrap gap-2 flex-row-reverse">
              {(profile.skills || ["React", "UI/UX", "Next.js"]).map((skill: string) => (
                <span key={skill} className="px-3 py-1 rounded-lg text-xs font-bold" style={{ background: "#F0F3FA", color: "#3D4560", border: "1px solid #E8ECF4" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Column */}
        <div className="lg:col-span-4 space-y-4">
          <div
            className="rounded-2xl p-6 text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1A4FD6 0%, #0D3BAA 100%)", boxShadow: "0 8px 24px rgba(26,79,214,0.3)" }}
          >
            <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>التقييم العام</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-4xl font-black">{profile.rating || "5.0"}</span>
              <Star className="w-5 h-5 fill-current" style={{ color: "#00C2A8" }} />
            </div>
            <div className="h-1.5 rounded-full mb-4" style={{ background: "rgba(255,255,255,0.2)" }}>
              <div className="h-full rounded-full" style={{ width: `${(profile.rating || 5) * 20}%`, background: "#00C2A8" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>المشاريع المكتملة</p>
                <p className="text-xl font-black">{profile.completed_projects || 0}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>معدل التوظيف</p>
                <p className="text-xl font-black">100%</p>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-4 flex items-center justify-between"
            style={{ background: "#FFFFFF", border: "1px solid #E8ECF4" }}
          >
            <MapPin className="w-4 h-4 text-[#8892A4]" />
            <div className="text-right">
              <p className="text-xs" style={{ color: "#8892A4" }}>الموقع</p>
              <p className="text-sm font-bold" style={{ color: "#0A0E1A" }}>{profile.location || "المملكة العربية السعودية"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Active Projects/Bids ── */}
      <section className="rtl" dir="rtl">
        <div className="flex items-center justify-between mb-5 flex-row-reverse">
          <h2 className="text-xl font-black flex items-center gap-2" style={{ color: "#0A0E1A" }}>
            العروض والمشاريع
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00C2A8" }} />
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {profile.bids?.length > 0 ? profile.bids.map((bid: any) => (
            <div
              key={bid.id}
              className="rounded-xl p-5 transition-all"
              style={{ background: "#FFFFFF", border: "1px solid #E8ECF4", borderRight: `4px solid #1A4FD6`, boxShadow: "0 2px 12px rgba(26,79,214,0.04)" }}
            >
              <div className="flex justify-between items-start mb-3 flex-row-reverse">
                <span className="text-sm font-black" style={{ color: "#1A4FD6" }}>SAR {bid.amount}</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "#F0F3FA", color: "#3D4560" }}>{bid.project?.category}</span>
              </div>
              <h3 className="font-bold text-sm mb-1.5 text-right" style={{ color: "#0A0E1A" }}>{bid.project?.title}</h3>
              <p className="text-xs line-clamp-2 mb-4 text-right" style={{ color: "#8892A4" }}>{bid.project?.description}</p>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #F0F3FA" }}>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: bid.is_accepted ? "#D1FAE5" : "#F3F4F6", color: bid.is_accepted ? "#059669" : "#6B7280" }}>
                  {bid.is_accepted ? "مقبول" : "قيد المراجعة"}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "#8892A4" }}>
                  <Clock className="w-3 h-3" />
                  {bid.created_at ? formatDistanceToNow(new Date(bid.created_at), { addSuffix: true, locale: ar }) : "قديماً"}
                </span>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
              <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 font-bold">لا توجد عروض نشطة حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Portfolio ── */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div className="text-right">
            <h2 className="text-xl font-black" style={{ color: "#0A0E1A" }}>معرض الأعمال</h2>
            <p className="text-xs" style={{ color: "#8892A4" }}>مجموعة مختارة من أفضل المشاريع التي قمت بتنفيذها مؤخراً</p>
          </div>
          <div className="flex gap-2">
            {["الكل", "تطبيقات ويب", "تصميم UI/UX"].map((f, i) => (
              <button
                key={f}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{ background: i === 0 ? "#1A4FD6" : "#F0F3FA", color: i === 0 ? "#FFFFFF" : "#3D4560" }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl h-56"
              style={{ boxShadow: "0 4px 20px rgba(26,79,214,0.08)" }}
            >
              <img
                alt="Portfolio"
                src={item.image}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(0,10,20,0.65)", color: "#FFFFFF", backdropFilter: "blur(8px)" }}
              >
                {item.category}
              </div>
              <div
                className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "linear-gradient(to top, rgba(10,14,26,0.9) 0%, transparent 60%)" }}
              >
                <h4 className="font-bold text-sm text-white mb-1 text-right">{item.title}</h4>
                <p className="text-xs text-right mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>{item.description}</p>
                <button
                  className="w-full py-2 rounded-lg text-xs font-bold"
                  style={{ background: "#FFFFFF", color: "#1A4FD6" }}
                >
                  مشاهدة التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="rounded-2xl p-7" style={{ background: "#FAFBFF", border: "1px solid #E8ECF4" }}>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/3 text-right space-y-4">
            <h2 className="text-2xl font-black" style={{ color: "#0A0E1A" }}>ماذا يقول العملاء؟</h2>
            <p className="text-sm" style={{ color: "#8892A4" }}>نحن فخورون بتقديم جودة استثنائية وبناء علاقات طويلة الأمد مع شركائنا.</p>
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#EEF3FF" }}>
                <span className="material-symbols-outlined" style={{ color: "#1A4FD6", fontSize: "1.5rem" }}>chat</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black" style={{ color: "#0A0E1A" }}>98%</p>
                <p className="text-xs font-bold" style={{ color: "#8892A4" }}>نسبة رضا العملاء</p>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="rounded-xl p-5 relative"
                style={{ background: "#FFFFFF", border: "1px solid #E8ECF4", boxShadow: "0 2px 12px rgba(26,79,214,0.04)" }}
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: "#F59E0B" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4 text-right italic" style={{ color: "#3D4560" }}>"{r.text}"</p>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <img alt={r.name} src={r.image} className="w-9 h-9 rounded-full object-cover" />
                  <div className="text-right">
                    <p className="text-xs font-bold" style={{ color: "#0A0E1A" }}>{r.name}</p>
                    <p className="text-[10px]" style={{ color: "#8892A4" }}>{r.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAB */}
      <button
        className="fixed bottom-8 left-8 w-14 h-14 rounded-full flex items-center justify-center transition-all z-50 text-white"
        style={{ background: "linear-gradient(135deg, #1A4FD6, #2563EB)", boxShadow: "0 8px 24px rgba(26,79,214,0.4)" }}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
