"use client";

import { useState } from "react";
import { Filter, Zap, Target, Cpu, Layers } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface TalentFiltersProps {
  onFilterChange?: (filters: any) => void;
}

export function TalentFilters({ onFilterChange }: TalentFiltersProps) {
  const [activeCategory, setActiveCategory] = useState("تصميم UI/UX");
  const [experienceLevels, setExperienceLevels] = useState([
    { id: "expert", label: "خبير (10+ سنوات)", checked: false, icon: Target },
    { id: "pro", label: "محترف (5-10 سنوات)", checked: true, icon: Cpu },
    { id: "mid", label: "متوسط (2-5 سنوات)", checked: false, icon: Layers }
  ]);
  const [priceRange, setPriceRange] = useState([150]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    onFilterChange?.({ category, experienceLevels, priceRange: priceRange[0] });
  };

  const handleExperienceToggle = (id: string) => {
    const newLevels = experienceLevels.map(level => 
      level.id === id ? { ...level, checked: !level.checked } : level
    );
    setExperienceLevels(newLevels);
    onFilterChange?.({ category: activeCategory, experienceLevels: newLevels, priceRange: priceRange[0] });
  };

  return (
    <aside className="sticky top-24 rounded-[3rem] p-8 border border-white/50 bg-white/40 backdrop-blur-2xl shadow-[0_20px_40px_-20px_rgba(26,79,214,0.1)] overflow-hidden">
      {/* Dynamic Background Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-16 translate-x-16" />

      <div className="relative flex items-center gap-3 mb-10 justify-end">
        <h3 className="text-xl font-black tracking-tight text-[#0A0E1A]">تخصيص البحث</h3>
        <div className="w-10 h-10 rounded-2xl bg-[#1A4FD6] flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Filter className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-10">
        {/* Domain Selection */}
        <div className="relative">
          <label className="block text-[10px] font-black mb-5 text-right text-[#3D4560]/50 uppercase tracking-[0.2em]">القطاع التكنولوجي</label>
          <div className="flex flex-col gap-2">
            {["تصميم UI/UX", "هندسة AI", "بلوكتشين", "تطوير الويب", "إنترنت الأشياء"].map((tag, i) => (
              <button
                key={i}
                onClick={() => handleCategoryClick(tag)}
                className="group relative flex items-center justify-end gap-3 rounded-2xl p-4 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeCategory === tag ? 'bg-[#1A4FD6] opacity-100' : 'bg-white/0 group-hover:bg-white/50 opacity-100'}`} />
                <span className={`relative text-sm font-black transition-colors ${activeCategory === tag ? 'text-white' : 'text-[#3D4560]'}`}>
                  {tag}
                </span>
                {activeCategory === tag && (
                   <div className="relative w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="pt-8 border-t border-white/50">
          <label className="block text-[10px] font-black mb-5 text-right text-[#3D4560]/50 uppercase tracking-[0.2em]">مستوى الخبرة الرقمية</label>
          <div className="space-y-3">
            {experienceLevels.map((item) => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.id} 
                  onClick={() => handleExperienceToggle(item.id)}
                  className={`flex items-center gap-4 cursor-pointer group justify-between p-4 rounded-2xl border transition-all duration-300 ${item.checked ? 'border-[#1A4FD6] bg-[#1A4FD6]/5' : 'border-white bg-white/20'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${item.checked ? 'bg-[#1A4FD6] text-white' : 'bg-white text-[#8892A4]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-black transition-colors ${item.checked ? 'text-[#1A4FD6]' : 'text-[#3D4560]'}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div className="pt-8 border-t border-white/50">
          <div className="flex justify-between items-center mb-8 flex-row-reverse">
            <label className="text-[10px] font-black text-[#3D4560]/50 uppercase tracking-[0.2em]">نطاق الاستثمار</label>
            <div className="flex items-center gap-1 flex-row-reverse">
               <span className="text-2xl font-black text-[#1A4FD6]">${priceRange[0]}</span>
               <span className="text-[10px] font-black opacity-30">/ HR</span>
            </div>
          </div>
          
          <div className="px-2">
            <Slider
              defaultValue={[150]}
              max={200}
              min={20}
              step={5}
              value={priceRange}
              onValueChange={(val) => {
                const numVal = val as number[];
                setPriceRange(numVal);
                onFilterChange?.({ category: activeCategory, experienceLevels, priceRange: numVal[0] });
              }}
              className="py-4 cursor-pointer"
            />
          </div>
          
          <div className="flex justify-between mt-6 text-[10px] font-black text-[#3D4560]/30 uppercase tracking-[0.1em]">
            <span>بحد أقصى $200</span>
            <span>تبدأ من $20</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onFilterChange?.({ category: activeCategory, experienceLevels, priceRange: priceRange[0] })}
        className="group relative w-full mt-12 py-5 bg-[#0A0E1A] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <div className="relative flex items-center justify-center gap-3">
          <span>تحديث خوارزميات البحث</span>
          <Zap className="w-4 h-4 fill-[#1A4FD6] text-[#1A4FD6]" />
        </div>
      </button>
    </aside>
  );
}
