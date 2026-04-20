"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, Zap, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Talent } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface TalentCardProps {
  talent: Talent;
}

export function TalentCard({ talent }: TalentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const avatarUrl = talent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(talent.name)}&background=random`;

  return (
    <div 
      className="group relative overflow-hidden rounded-[3rem] border border-[#E2E8F0] bg-white transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-15px_rgba(26,79,214,0.15)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: "0 10px 40px -15px rgba(26, 79, 214, 0.08)"
      }}
    >
      {/* ─── FUTURISTIC OVERLAYS ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00C2A8]/30 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
        
        {/* Digital Scanline effect (subtle overlay) */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
        
        {/* Depth Glow */}
        <div 
          className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
          style={{ background: talent.verified ? 'radial-gradient(circle, #00C2A8, transparent)' : 'radial-gradient(circle, #1A4FD6, transparent)' }}
        />
      </div>

      <div className="relative p-8 flex flex-col sm:flex-row-reverse gap-8 z-10">
        {/* Avatar Section */}
        <div className="relative flex-shrink-0 mx-auto sm:mx-0">
          <div className="relative w-32 h-32">
            <div className={`absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br from-[#1A4FD6] via-[#00C2A8] to-[#1A4FD6] opacity-0 group-hover:opacity-100 blur-[2px] transition-opacity duration-700 animate-pulse`} />
            <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden border-2 border-white/50 bg-white shadow-xl transition-transform duration-700 group-hover:rotate-6">
              <Image 
                src={avatarUrl} 
                alt={talent.name} 
                width={128}
                height={128}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
            </div>
          </div>
          
          {talent.verified && (
            <div className="absolute -bottom-2 -left-2 w-9 h-9 bg-[#00C2A8] rounded-full flex items-center justify-center border-4 border-white shadow-2xl text-white transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
              <ShieldCheck className="w-5 h-5" strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-6 text-right">
          <div className="flex justify-between items-start flex-row-reverse">
            <div className="text-right">
              <h3 className="text-2xl font-black tracking-tight text-[#0A0E1A] mb-1 flex items-center gap-2 justify-end">
                {talent.name}
                {Math.random() > 0.5 && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
              </h3>
              <p className="text-[#1A4FD6] font-black text-xs uppercase tracking-[0.2em]">{talent.role}</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white flex flex-col items-center justify-center shadow-sm">
              <p className="text-xl font-black text-[#0A0E1A] leading-none mb-1">{talent.price}</p>
              <p className="text-[9px] font-black text-[#3D4560]/50 uppercase tracking-widest">سعر الساعة</p>
            </div>
          </div>

          <p className="text-sm font-bold text-[#3D4560]/70 leading-relaxed line-clamp-2">
            خبير معتمد متخصص في {talent.tags[0]} و {talent.tags[1]}، مع سجل حافل من المشاريع الناجحة في السوق الخليجي.
          </p>

          <div className="flex items-center gap-6 py-4 border-y border-white/50 justify-end flex-row-reverse">
            <div className="flex items-center gap-2 flex-row-reverse group/stat">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 group-hover/stat:bg-amber-100 transition-colors">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-[#0A0E1A]">{talent.rating}</p>
                <p className="text-[9px] font-black opacity-40 uppercase">{talent.reviews} تقييم</p>
              </div>
            </div>
            
            <div className="w-[1px] h-8 bg-white/50" />

            <div className="flex items-center gap-2 flex-row-reverse group/stat">
              <div className="w-10 h-10 rounded-xl bg-[#1A4FD6]/5 flex items-center justify-center border border-[#1A4FD6]/10 group-hover/stat:bg-[#1A4FD6]/10 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-[#1A4FD6]" />
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-[#0A0E1A]">{talent.projects}</p>
                <p className="text-[9px] font-black opacity-40 uppercase">مشروع</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            {talent.tags.slice(0, 3).map((tag, i) => (
              <Badge 
                key={i} 
                className="text-[9px] font-black opacity-80 px-4 py-2 bg-white/80 rounded-xl text-[#3D4560] border border-white shadow-sm hover:border-[#1A4FD6]/30 hover:bg-white transition-all duration-300 uppercase tracking-wider"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-4 pt-2">
            <button className="flex-1 bg-[#0A0E1A] hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-black/10">
               <span>عرض الملف الشخصي</span>
               <Zap className="w-3.5 h-3.5 fill-white" />
            </button>
            <button className="w-14 h-14 bg-white border border-white rounded-2xl flex items-center justify-center text-[#3D4560] hover:bg-[#1A4FD6] hover:text-white transition-all duration-500 shadow-sm group/btn">
               <ArrowUpRight className="w-5 h-5 group-hover/btn:rotate-45 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
