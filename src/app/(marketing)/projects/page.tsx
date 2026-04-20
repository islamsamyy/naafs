"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Zap,
  Briefcase, Code, Palette, BarChart3, Megaphone, Globe,
  Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ProjectCard } from "@/components/marketplace/ProjectCard";
import { Clock, Star, MapPin } from "lucide-react";

const CATEGORIES = [
  { label: "الكل", icon: <Briefcase className="w-4 h-4" /> },
  { label: "تطوير الويب", icon: <Code className="w-4 h-4" /> },
  { label: "التصميم", icon: <Palette className="w-4 h-4" /> },
  { label: "التسويق", icon: <Megaphone className="w-4 h-4" /> },
  { label: "تحليل البيانات", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "ترجمة", icon: <Globe className="w-4 h-4" /> },
];

export default function ProjectsListPage() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      fetchProjects();
    }
    
    async function fetchProjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          client:profiles!projects_client_id_fkey(name, avatar_url),
          bids(id)
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (data) setProjects(data);
      setLoading(false);
    }

    init();
  }, []);

  const filtered = projects.filter((p) => {
    const matchCategory = activeCategory === "الكل" || p.category === activeCategory;
    const matchSearch = p.title?.includes(searchQuery) || p.description?.includes(searchQuery);
    return matchCategory && (searchQuery === "" || matchSearch);
  });

  // Stats are calculated from fetched projects
  const categoryStats = CATEGORIES.map(cat => ({
    ...cat,
    count: cat.label === "الكل"
      ? projects.length
      : projects.filter(p => p.category === cat.label).length
  }));

  return (
    <div className="max-w-[1400px] mx-auto pb-20" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row-reverse items-start md:items-center justify-between gap-6 mb-8">
        <div className="text-right">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1" style={{ color: "#0A0E1A" }}>
            تصفح المشاريع
          </h1>
          <p className="text-sm" style={{ color: "#8892A4" }}>
            {projects.length} مشروع متاح للمنافسة الآن
          </p>
        </div>
        <Link
          href={user ? "/projects/create" : "/login"}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{ background: "linear-gradient(135deg, #1A4FD6, #2563EB)", boxShadow: "0 8px 24px rgba(26,79,214,0.3)" }}
        >
          <Zap className="w-4 h-4" /> {user ? "أضف مشروع جديد" : "سجل دخول لنشر مشروع"}
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          className="w-full px-6 py-4 pr-14 rounded-2xl text-right outline-none transition-all text-sm"
          placeholder="ابحث عن مشروع... (مثال: تطبيق جوال، تصميم شعار)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ background: "#FFFFFF", border: "1px solid #E8ECF4", fontFamily: "'Cairo', sans-serif" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#1A4FD6"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(26,79,214,0.1)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#E8ECF4"; e.currentTarget.style.boxShadow = "none"; }}
        />
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#8892A4" }} />
      </div>

      {/* Category Chips */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 flex-row-reverse scrollbar-hide">
        {categoryStats.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.label)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
            style={{
              background: activeCategory === cat.label ? "#1A4FD6" : "#FFFFFF",
              color: activeCategory === cat.label ? "#FFFFFF" : "#3D4560",
              border: `1px solid ${activeCategory === cat.label ? "#1A4FD6" : "#E8ECF4"}`,
              boxShadow: activeCategory === cat.label ? "0 4px 16px rgba(26,79,214,0.3)" : "none",
            }}
          >
            {cat.icon}
            <span>{cat.label}</span>
            <span className="text-xs opacity-70">({cat.count})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border p-6 animate-pulse" style={{ borderColor: "#E8ECF4" }}>
              <div className="flex justify-between items-start mb-4 flex-row-reverse">
                <div className="w-24 h-8 bg-gray-100 rounded-lg"></div>
                <div className="w-20 h-6 bg-gray-100 rounded-full"></div>
              </div>
              <div className="w-3/4 h-7 bg-gray-100 rounded mb-3 ml-auto"></div>
              <div className="w-full h-4 bg-gray-100 rounded mb-2 ml-auto"></div>
              <div className="w-1/2 h-4 bg-gray-100 rounded mb-6 ml-auto"></div>
              <div className="flex items-center gap-6 pt-4 border-t flex-row-reverse" style={{ borderColor: "#F0F3FA" }}>
                <div className="w-20 h-5 bg-gray-100 rounded"></div>
                <div className="w-20 h-5 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Projects Grid */}
          <div className="space-y-4">
            {filtered.map((project, i) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                animationDelay={`${i * 0.1}s`} 
              />
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border" style={{ borderColor: "#E8ECF4" }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "#EEF3FF" }}>
                <Search className="w-7 h-7" style={{ color: "#1A4FD6" }} />
              </div>
              <h3 className="text-lg font-black mb-2" style={{ color: "#0A0E1A" }}>لا توجد مشاريع مطابقة</h3>
              <p className="text-sm" style={{ color: "#8892A4" }}>جرّب تغيير الفلتر أو مصطلح البحث</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
