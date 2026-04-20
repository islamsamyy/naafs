"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp, Check, Clock, Loader2, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LiveAuctionsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          setProfile(p);
        }

        // Fetch Open Projects
        const { data: openProjects } = await supabase
          .from('projects')
          .select('*, client:profiles(name, avatar_url), bids(count)')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(10);
        
        setProjects(openProjects || []);

        // Fetch real activities from bids
        const { data: bids } = await supabase
          .from('bids')
          .select('id, amount, created_at, project:projects(title), freelancer:profiles(name)')
          .order('created_at', { ascending: false })
          .limit(10);

        if (bids) {
          const activitiesData = bids.map((bid: any) => {
            const createdTime = new Date(bid.created_at);
            const now = new Date();
            const diffMinutes = Math.floor((now.getTime() - createdTime.getTime()) / (1000 * 60));
            let timeAgo = 'منذ قليل';
            if (diffMinutes > 60) timeAgo = `منذ ${Math.floor(diffMinutes / 60)} ساعة`;
            else if (diffMinutes > 1) timeAgo = `منذ ${diffMinutes} دقيقة`;

            return {
              id: bid.id,
              title: `تم تقديم عرض جديد على "${bid.project?.title || 'مشروع'}"`,
              timeAgo,
              amount: `${bid.amount} ريال`
            };
          });
          setActivities(activitiesData);
        }
      } catch (err) {
        console.error("Live fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();

    // Subscribe to new projects
    const projectSub = supabase
      .channel('live-auctions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects' }, (payload) => {
        setProjects(prev => [payload.new, ...prev].slice(0, 10));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(projectSub);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#1A4FD6] mb-4" />
        <h2 className="text-xl font-black text-[#0A0E1A]">جاري استكشاف السوق المباشر...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 rtl" style={{ fontFamily: "'Cairo', 'Noto Sans Arabic', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row-reverse items-start md:items-end justify-between gap-4">
        <div className="text-right">
          <h1 className="text-3xl font-black mb-1" style={{ color: '#0A0E1A' }}>
            سوق المزايدات المباشر ⚡
          </h1>
          <p className="text-sm font-bold" style={{ color: '#8892A4' }}>
            مرحباً {profile?.name || 'بك'}، الفرص الذهبية تظهر وتختفي في ثوانٍ.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-[#E6FAF8] text-[#00C2A8] border border-[#00C2A8]">
          <span className="w-2 h-2 rounded-full animate-pulse bg-[#00C2A8]" />
          حالة السوق: نشط جداً
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Feed & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Projects List */}
          <div className="space-y-5">
            <h2 className="text-xl font-black text-[#0A0E1A]">المشاريع المتاحة للمزايدة</h2>
            {projects.length > 0 ? (
              projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="bg-white p-6 rounded-[2rem] border border-[#E8ECF4] hover:border-[#1A4FD6] transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group mb-4">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-[#EEF3FF] flex items-center justify-center text-[#1A4FD6] flex-shrink-0">
                         <Zap size={24} />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1 flex-row-reverse">
                          <span className="text-[10px] font-black px-2 py-0.5 bg-[#E6FAF8] text-[#00C2A8] rounded-full uppercase">جديد</span>
                          <h3 className="text-lg font-black text-[#0A0E1A] group-hover:text-[#1A4FD6] transition-colors">{project.title}</h3>
                        </div>
                        <p className="text-xs text-[#8892A4] font-bold line-clamp-1">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-[#8892A4] mb-1">الميزانية</p>
                        <p className="text-lg font-black text-[#1A4FD6]">${project.budget_min} - ${project.budget_max}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-[#8892A4] mb-1">المزايدين</p>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-sm font-black">{project.bids?.[0]?.count || 0}</span>
                          <TrendingUp className="w-3.5 h-3.5 text-[#00C2A8]" />
                        </div>
                      </div>
                      <button className="hidden md:block px-5 py-2.5 bg-[#1A4FD6] text-white rounded-xl font-black text-xs group-hover:bg-[#0039CC]">مزايدة</button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-20 text-center bg-[#FAFBFF] rounded-[2rem] border-2 border-dashed border-[#E8ECF4]">
                <Clock className="w-12 h-12 text-[#8892A4] mx-auto mb-4 animate-pulse" />
                <p className="text-[#8892A4] font-bold">بانتظار ظهور فرص جديدة...</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Activity Log */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-[#E8ECF4] shadow-sm">
             <h2 className="text-xl font-black text-[#0A0E1A] mb-6 flex items-center gap-2 flex-row-reverse">
               <Clock className="w-5 h-5 text-[#1A4FD6]" />
               آخر النشاطات
             </h2>
             <div className="space-y-6">
                {activities.map(activity => (
                  <div key={activity.id} className="flex gap-4 flex-row-reverse relative">
                    <div className="w-2.5 h-2.5 bg-[#1A4FD6] rounded-full mt-1.5 flex-shrink-0 z-10" />
                    <div className="absolute top-4 right-1 hover:w-0.5 w-[1px] h-12 bg-[#F0F3FA] -z-0" />
                    <div className="text-right">
                       <p className="text-sm font-bold text-[#0A0E1A] leading-tight mb-1">{activity.title}</p>
                       <p className="text-[10px] font-black text-[#8892A4]">{activity.timeAgo} • {activity.amount}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-8 py-3 text-[#1A4FD6] font-bold text-xs bg-[#EEF3FF] rounded-xl">عرض سجل السوق الكامل</button>
          </div>

          {/* Tips Card */}
          <div className="bg-[#0A0E1A] p-8 rounded-[2rem] text-white relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[#00C2A8]">lightbulb</span>
                </div>
                <h3 className="text-lg font-black mb-2">نصيحة نافس</h3>
                <p className="text-xs font-bold leading-relaxed opacity-70">المشاريع التي يتم التقديم عليها في أول 10 دقائق لها معدل قبول أعلى بنسبة 40%.</p>
             </div>
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#1A4FD6] rounded-full blur-[80px] opacity-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
