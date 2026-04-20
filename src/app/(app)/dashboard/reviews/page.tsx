"use client";
import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageSquare, Calendar, Filter, TrendingUp, Award, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ReviewsPage() {
  const [filter, setFilter] = useState<"all" | "received" | "given">("all");
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch reviews received
        const { data: receivedReviews } = await supabase
          .from('reviews')
          .select('id, rating, comment, created_at, reviewer:profiles(name, avatar_url), project:projects(title)')
          .eq('reviewee_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch reviews given
        const { data: givenReviews } = await supabase
          .from('reviews')
          .select('id, rating, comment, created_at, reviewee:profiles(name, avatar_url), project:projects(title)')
          .eq('reviewer_id', user.id)
          .order('created_at', { ascending: false });

        const formattedReviews = [
          ...(receivedReviews?.map((r: any) => ({
            id: r.id,
            projectTitle: r.project?.title || 'مشروع',
            reviewer: { name: r.reviewer?.name || 'محترف', avatar: r.reviewer?.avatar_url || `https://ui-avatars.com/api/?name=${r.reviewer?.name || 'User'}&background=1A4FD6&color=fff` },
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.created_at).toLocaleDateString('ar-EG'),
            type: 'received' as const,
            helpful: 0,
            reply: null,
            tags: [],
          })) || []),
          ...(givenReviews?.map((r: any) => ({
            id: r.id,
            projectTitle: r.project?.title || 'مشروع',
            reviewer: { name: r.reviewee?.name || 'محترف', avatar: r.reviewee?.avatar_url || `https://ui-avatars.com/api/?name=${r.reviewee?.name || 'User'}&background=00C2A8&color=fff` },
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.created_at).toLocaleDateString('ar-EG'),
            type: 'given' as const,
            helpful: 0,
            reply: null,
            tags: [],
          })) || []),
        ];

        setReviews(formattedReviews);

        // Calculate stats
        if (receivedReviews && receivedReviews.length > 0) {
          const avgRating = receivedReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / receivedReviews.length;
          const starCounts = [0, 0, 0, 0, 0];
          receivedReviews.forEach((r: any) => {
            if (r.rating) starCounts[r.rating - 1]++;
          });

          setStats({
            avgRating: avgRating.toFixed(1),
            totalReviews: receivedReviews.length,
            oneStars: starCounts[0],
            twoStars: starCounts[1],
            threeStars: starCounts[2],
            fourStars: starCounts[3],
            fiveStars: starCounts[4],
          });
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#1A4FD6] mb-4" />
        <h2 className="text-xl font-black text-[#0A0E1A]">جاري تحميل التقييمات...</h2>
      </div>
    );
  }

  const filtered = reviews.filter((r) => filter === "all" || r.type === filter);
  const displayStats = stats || {
    avgRating: "0",
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStars: 0,
  };

  return (
    <div className="max-w-4xl mx-auto pb-20" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Header */}
      <div className="text-right mb-8">
        <h1 className="text-3xl font-black mb-1" style={{ color: "#0A0E1A" }}>التقييمات والمراجعات</h1>
        <p className="text-sm" style={{ color: "#8892A4" }}>سمعتك المهنية وتقييمات العملاء</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Overall Rating */}
        <div className="bg-white rounded-2xl p-6 border text-center md:col-span-1" style={{ borderColor: "#E8ECF4" }}>
          <p className="text-5xl font-black mb-1" style={{ color: "#0A0E1A" }}>{displayStats.avgRating}</p>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5" fill={s <= Math.round(parseFloat(displayStats.avgRating) || 0) ? "#F59E0B" : "#E8ECF4"} style={{ color: s <= Math.round(parseFloat(displayStats.avgRating) || 0) ? "#F59E0B" : "#E8ECF4" }} />
            ))}
          </div>
          <p className="text-sm" style={{ color: "#8892A4" }}>{displayStats.totalReviews} تقييم إجمالي</p>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white rounded-2xl p-6 border md:col-span-2" style={{ borderColor: "#E8ECF4" }}>
          <h3 className="text-sm font-bold text-right mb-4" style={{ color: "#3D4560" }}>توزيع التقييمات</h3>
          <div className="space-y-2.5">
            {[
              { stars: 5, count: displayStats.fiveStars },
              { stars: 4, count: displayStats.fourStars },
              { stars: 3, count: displayStats.threeStars },
              { stars: 2, count: displayStats.twoStars },
              { stars: 1, count: displayStats.oneStars },
            ].map((row) => {
              const pct = displayStats.totalReviews > 0 ? Math.round((row.count / displayStats.totalReviews) * 100) : 0;
              return (
                <div key={row.stars} className="flex items-center gap-3 flex-row-reverse">
                  <span className="text-xs font-bold w-6 text-right" style={{ color: "#3D4560" }}>{row.stars}★</span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "#F0F3FA" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: row.stars >= 4 ? "#F59E0B" : row.stars === 3 ? "#FCD34D" : "#FCA5A5" }} />
                  </div>
                  <span className="text-xs font-bold w-8 text-left" style={{ color: "#8892A4" }}>{row.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 flex-row-reverse">
        {[
          { label: "الأكثر موثوقية", icon: <Award className="w-4 h-4" />, color: "#F59E0B" },
          { label: "معدل رضا 98%", icon: <TrendingUp className="w-4 h-4" />, color: "#10B981" },
          { label: "87 تقييم إيجابي", icon: <ThumbsUp className="w-4 h-4" />, color: "#1A4FD6" },
        ].map((badge) => (
          <div key={badge.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-xs font-bold flex-row-reverse" style={{ background: `${badge.color}15`, color: badge.color }}>
            {badge.icon} {badge.label}
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-row-reverse">
        {[
          { id: "all" as const, label: "الكل" },
          { id: "received" as const, label: "تقييمات مستلمة" },
          { id: "given" as const, label: "تقييمات مُعطاة" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: filter === f.id ? "#1A4FD6" : "#FFFFFF",
              color: filter === f.id ? "#FFFFFF" : "#3D4560",
              border: `1px solid ${filter === f.id ? "#1A4FD6" : "#E8ECF4"}`,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#E8ECF4" }}>
            <div className="flex items-start gap-4 flex-row-reverse">
              <img src={review.reviewer.avatar} alt={review.reviewer.name} className="w-12 h-12 rounded-xl" />
              <div className="flex-1 text-right">
                <div className="flex items-center justify-between flex-row-reverse mb-1">
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#0A0E1A" }}>{review.reviewer.name}</p>
                    <p className="text-xs" style={{ color: "#8892A4" }}>بخصوص: {review.projectTitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{
                      background: review.type === "received" ? "#EEF3FF" : "#E6FAF8",
                      color: review.type === "received" ? "#1A4FD6" : "#00C2A8",
                    }}>
                      {review.type === "received" ? "مستلم" : "مُعطى"}
                    </span>
                    <span className="text-xs" style={{ color: "#8892A4" }}>{review.date}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 justify-end my-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4" fill={s <= review.rating ? "#F59E0B" : "#E8ECF4"} style={{ color: s <= review.rating ? "#F59E0B" : "#E8ECF4" }} />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#3D4560" }}>{review.comment}</p>

                {/* Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3 justify-end">
                    {review.tags.map((tag: string) => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] font-bold" style={{ background: "#F0F3FA", color: "#3D4560" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Reply */}
                {review.reply && (
                  <div className="p-3 rounded-xl mt-2" style={{ background: "#FAFBFF", borderRight: "3px solid #1A4FD6" }}>
                    <p className="text-xs font-bold mb-1" style={{ color: "#1A4FD6" }}>ردك:</p>
                    <p className="text-sm" style={{ color: "#3D4560" }}>{review.reply}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 mt-3 flex-row-reverse">
                  <button className="flex items-center gap-1 text-xs font-bold flex-row-reverse" style={{ color: "#8892A4" }}>
                    <ThumbsUp className="w-3.5 h-3.5" /> مفيد ({review.helpful})
                  </button>
                  {!review.reply && review.type === "received" && (
                    <button className="flex items-center gap-1 text-xs font-bold flex-row-reverse" style={{ color: "#1A4FD6" }}>
                      <MessageSquare className="w-3.5 h-3.5" /> الرد على التقييم
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
