"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Star, Zap, Lock } from "lucide-react";

export default function BidComparisonPage() {
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
          setError("Only project owners can compare bids.");
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
          setError("You can only compare bids on your own projects.");
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
        <p className="text-on-surface-variant">{error || "You don't have permission to compare bids for this project."}</p>
      </div>
    );
  }
  const bids = [
    {
      id: 1,
      name: "TechNova Core",
      verified: true,
      completion: "92% إنجاز",
      price: "$148,000",
      duration: "5 أشهر",
      description:
        "نقدم بنية تحتية سحابية هجينة مع تركيز عالي على الأمان. يتضمن العرض فترة دعم فني لمدة 6 أشهر بعد الإطلاق.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBlbpc0gjLnpSKeS24gBVWbZVA6RLK2cIcNerjCYy7owk1oPnR_nvJRf-FsKMD_MIu_nv0LkmwYqyEW9DGzR1vzZnSmCRKOyoNMZPM1FAkAvgsXkDJ8b6Qk5wW9i1Kwr2YsJ5rNmISF1N5uE8ev-zEm575A5prWDJy1u7u7RewL1VFNjNug82dJxMBf62LfezHB5w9aMmtvOfaKRDHPMhOZfbos8LzdBPDTFXsfwxte0IersuRbYkOBYC1VXwoeS0fOnwmkt0g04Sio",
      featured: false,
    },
    {
      id: 2,
      name: "Nexus Financial AI",
      verified: true,
      completion: "99% إنجاز",
      price: "$142,500",
      duration: "4 أشهر",
      description:
        "حل متقدم يجمع بين الذكاء الاصطناعي والأمان على مستوى المؤسسات. نقدم أيضاً تكاملات مخصصة وأتمتة العمليات.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAKHmEvWz0BFRGyiYnGtPF32OcgC1E2G0dJGO4PaUwLB5LCVrPj4fVPUYd4Twap2yuOGgShLvwXSss4y592Iqn_Em4BQjsGnKEpGOKLrRTHxdcqbjKxfGcjq0Xnl-lAoEmo_BomzS8RC8pv52P6K25czLf2L7XBFGP36kXGDiLDeg0AVSYKNlnuTjG6zaqcr9_-8gUzg5EjZUrig3VJfD8xhKGP-7c9006hkIFj49E6dDDQBk6FKT-Y5PGsSVz791YANbkDYzci0E2x",
      featured: true,
    },
    {
      id: 3,
      name: "CloudWorks Solutions",
      verified: true,
      completion: "88% إنجاز",
      price: "$155,000",
      duration: "6 أشهر",
      description:
        "منصة شاملة مع دعم العملات المشفرة والتحويلات الدولية. تضمن السعر التحديثات المستمرة وفريق دعم مخصص.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB_4w_1K-V2bQU8MpZs0OWwBYq5aWEp0tFd7Aq_zVuGAqZhXw5-XUmIu4HT2h8qLu3qT3ZqPJqKlPsU0Hs6K5gVSDOOV9P1nO7vMxYoLp-Y5VlFrDz_TKf0qkm9fG3Kkc8wlsvh1gLRZ70J1K2YhFVYzWZyPv-P7F1R8XDCbmcZLCTLsJEKDR2Py9F6A3F6HZrHiKHOkW4g6dw",
      featured: false,
    },
  ];

  return (
    <div
      className="space-y-6 rtl"
      style={{ fontFamily: "'Cairo', 'Noto Sans Arabic', sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-row-reverse items-center justify-between">
        <div className="flex items-center gap-3 flex-row-reverse">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: '#FAFBFF', border: '1px solid #E8ECF4', color: '#3D4560' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#EEF3FF'; (e.currentTarget as HTMLElement).style.color = '#1A4FD6'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#FAFBFF'; (e.currentTarget as HTMLElement).style.color = '#3D4560'; }}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="text-right">
            <p className="text-xs font-bold mb-0.5" style={{ color: '#1A4FD6' }}>تحليل البيانات</p>
            <h1 className="text-xl font-black" style={{ color: '#0A0E1A' }}>مقارنة العطاءات</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00C2A8' }} />
          <span className="text-sm font-bold" style={{ color: '#00C2A8' }}>مباشر: جاري استقبال العروض</span>
        </div>
      </div>

      {/* Project Context */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 12px rgba(26,79,214,0.04)' }}
      >
        {/* Accent line */}
        <div
          className="absolute top-0 right-0 w-1 h-full rounded-r-2xl"
          style={{ background: 'linear-gradient(to bottom, #1A4FD6, #00C2A8)' }}
        />
        <div className="flex flex-col md:flex-row-reverse justify-between items-end gap-6">
          <div className="flex-1 text-right">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background: '#FAFBFF', border: '1px solid #E8ECF4', color: '#8892A4', fontFamily: 'monospace' }}
            >
              ID: #TC-2023-894-BETA
            </span>
            <h2 className="text-2xl font-black mb-2" style={{ color: '#0A0E1A', letterSpacing: '-0.02em' }}>
              مشروع تطوير منصة الدفع الذكية
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#3D4560' }}>
              بناء بنية تحتية مالية لامركزية تدعم المعاملات عالية التردد مع تكامل الذكاء الاصطناعي لكشف الاحتيال.
            </p>
          </div>
          <div className="flex gap-6 flex-shrink-0">
            <div className="text-right">
              <span className="text-xs mb-1 block" style={{ color: '#8892A4' }}>الميزانية المرصودة</span>
              <span className="text-2xl font-black" style={{ color: '#1A4FD6', fontVariantNumeric: 'tabular-nums' }}>$150,000</span>
            </div>
            <div className="w-px" style={{ background: '#E8ECF4' }} />
            <div className="text-right">
              <span className="text-xs mb-1 block" style={{ color: '#8892A4' }}>متوسط العروض</span>
              <span className="text-2xl font-black" style={{ color: '#0A0E1A', fontVariantNumeric: 'tabular-nums' }}>$142,500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bids Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className="rounded-2xl p-5 flex flex-col relative transition-all"
            style={{
              background: '#FFFFFF',
              border: bid.featured ? '2px solid #1A4FD6' : '1px solid #E8ECF4',
              boxShadow: bid.featured ? '0 8px 32px rgba(26,79,214,0.14)' : '0 2px 12px rgba(26,79,214,0.04)',
              transform: bid.featured ? 'translateY(-4px)' : undefined,
            }}
          >
            {/* Featured Badge */}
            {bid.featured && (
              <div
                className="absolute -top-3.5 left-5 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: '#EEF3FF', color: '#1A4FD6', border: '1px solid #1A4FD6' }}
              >
                <Zap className="w-3 h-3" />
                الخوارزمية ترشح
              </div>
            )}

            {/* Company Info */}
            <div className={`flex items-start justify-between mb-5 ${bid.featured ? 'mt-3' : ''}`}>
              <div className="flex items-center gap-3">
                <div
                  className="rounded-xl overflow-hidden flex-shrink-0"
                  style={{
                    width: '48px',
                    height: '48px',
                    border: bid.featured ? '2px solid #1A4FD6' : '1px solid #E8ECF4',
                  }}
                >
                  <img alt={bid.name} className="w-full h-full object-cover" src={bid.image} />
                </div>
                <div>
                  <h3 className="font-black text-sm" style={{ color: '#0A0E1A' }}>{bid.name}</h3>
                  <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: bid.featured ? '#00C2A8' : '#8892A4' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                      {bid.featured ? 'speed' : 'verified'}
                    </span>
                    <span>{bid.featured ? 'أعلى سرعة استجابة' : 'موثوق'} • {bid.completion}</span>
                  </div>
                </div>
              </div>
              {bid.verified && (
                <Star className="w-4 h-4 flex-shrink-0" style={{ color: bid.featured ? '#1A4FD6' : '#8892A4' }} />
              )}
            </div>

            {/* Content */}
            <div className="space-y-4 flex-1 text-right">
              <div>
                <span className="text-xs block mb-1" style={{ color: '#8892A4' }}>
                  قيمة العرض{bid.featured && ' (النهائية)'}
                </span>
                <span
                  className="text-3xl font-black"
                  style={{ color: bid.featured ? '#1A4FD6' : '#0A0E1A', fontVariantNumeric: 'tabular-nums' }}
                >
                  {bid.price}
                </span>
              </div>
              <div>
                <span className="text-xs block mb-1" style={{ color: '#8892A4' }}>المدة الزمنية</span>
                <span className="text-lg font-bold" style={{ color: '#0A0E1A' }}>{bid.duration}</span>
              </div>
              <div className="pt-3" style={{ borderTop: '1px solid #E8ECF4' }}>
                <p className="text-xs leading-relaxed line-clamp-3" style={{ color: '#3D4560' }}>
                  {bid.description}
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              className="mt-5 w-full py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: bid.featured ? '#1A4FD6' : 'transparent',
                color: bid.featured ? '#FFFFFF' : '#1A4FD6',
                border: bid.featured ? 'none' : '2px solid #1A4FD6',
              }}
              onMouseEnter={(e) => {
                if (!bid.featured) {
                  (e.currentTarget as HTMLElement).style.background = '#EEF3FF';
                }
              }}
              onMouseLeave={(e) => {
                if (!bid.featured) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }
              }}
            >
              {bid.featured ? 'اختيار هذا العرض' : 'عرض التفاصيل التقنية'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
