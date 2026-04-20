'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Clock, Tag, TrendingUp, Sparkles } from 'lucide-react';
import { Project, Bid } from '@/types/marketplace';
import { supabase } from '@/lib/supabase/client';

interface ProjectCardProps {
  project: Project;
  animationDelay?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, animationDelay }) => {
  const [bidCount, setBidCount] = useState((project.bids as any[])?.length || 0);
  const [latestBid, setLatestBid] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Subscribe to bids for this project to update count and highlight activity
    const channel = supabase
      .channel(`project-activity-${project.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `project_id=eq.${project.id}`,
        },
        (payload) => {
          const newBid = payload.new as Bid;
          setBidCount((prev) => prev + 1);
          setLatestBid(newBid.amount);
          
          // Trigger "Live" pulse effect
          setIsLive(true);
          setTimeout(() => setIsLive(false), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [project.id]);

  const calculateTimeLeft = (deadline: string | undefined) => {
    if (!deadline) return '--:--';
    const diff = new Date(deadline).getTime() - new Date().getTime();
    if (diff <= 0) return 'منتهي';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const skillsArray = Array.isArray(project.skills) ? project.skills : [];

  return (
    <Link
      href={`/projects/${project.id}`}
      className="block bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 group relative overflow-hidden"
      style={{ borderColor: '#E8ECF4', animationDelay }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1A4FD6]/5 to-transparent rounded-bl-[100px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row-reverse gap-6 relative">
        {/* Right: Project Info */}
        <div className="flex-1 text-right">
          <div className="flex items-start justify-between flex-row-reverse mb-3">
            <div>
              <div className="flex items-center gap-3 flex-row-reverse mb-2">
                <span 
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-500 ${
                    isLive 
                      ? 'bg-red-100 text-red-600 animate-pulse' 
                      : 'bg-[#F0F3FA] text-[#8892A4]'
                  }`}
                >
                  {isLive ? (
                    <>
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                      مباشر الآن
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-3 h-3" />
                      مزاد نشط
                    </>
                  )}
                </span>
                
                <h3 className="text-xl font-black group-hover:text-[#1A4FD6] transition-colors leading-tight" style={{ color: '#0A0E1A' }}>
                  {project.title}
                </h3>
              </div>
              <p className="text-[15px] leading-relaxed line-clamp-2 text-[#3D4560]" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {project.description}
              </p>
            </div>
          </div>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2 mt-4 justify-end">
            {skillsArray.slice(0, 4).map((skill: string) => (
              <span 
                key={skill} 
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all hover:bg-[#1A4FD6] hover:text-white cursor-default" 
                style={{ background: '#F0F3FA', color: '#3D4560' }}
              >
                {skill}
              </span>
            ))}
            {skillsArray.length > 4 && (
              <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#F8FAFF] text-[#1A4FD6]">
                +{skillsArray.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Left: Financials & Action */}
        <div className="lg:min-w-[240px] flex flex-col items-end justify-between py-1 border-r border-[#F0F3FA] pr-6 lg:border-r-0 lg:pr-0 lg:border-l lg:pl-6">
          <div className="w-full text-right space-y-4">
            {/* Budget */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest mb-1 text-[#8892A4]">ميزانية المشروع</p>
              <div className="flex items-center justify-end gap-1.5">
                 <span className="text-2xl font-black text-[#1A4FD6]">
                  ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Live Ticker Area */}
            {latestBid && (
              <div className="bg-[#FFF8F8] border border-red-50 rounded-xl p-3 animate-in fade-in slide-in-from-right-2 duration-500">
                <p className="text-[10px] font-black text-red-600 mb-1">آخر عرض مقدم</p>
                <p className="text-lg font-black text-[#0A0E1A]">${latestBid.toLocaleString()}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <div className="bg-[#F8FAFF] rounded-xl p-2.5 text-right flex flex-col items-end">
                <Users className="w-4 h-4 text-[#1A4FD6] mb-1" />
                <span className="text-sm font-black text-[#0A0E1A]">{bidCount}</span>
                <span className="text-[10px] font-bold text-[#8892A4]">عروض</span>
              </div>
              
              <div className="bg-[#FFF5F5] rounded-xl p-2.5 text-right flex flex-col items-end">
                <Clock className="w-4 h-4 text-red-600 mb-1" />
                <span className="text-sm font-black text-[#DC2626]">{calculateTimeLeft(project.deadline?.toLocaleString())}</span>
                <span className="text-[10px] font-bold text-[#8892A4]">متبقي</span>
              </div>
            </div>
          </div>

          <div className="w-full mt-6 group/btn">
             <div className="flex items-center justify-center gap-2 w-full py-3 bg-[#1A4FD6] text-white rounded-xl font-black text-sm transition-all hover:bg-[#1541B1] hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#1A4FD6]/20">
              تقديم عرض
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
