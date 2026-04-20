"use client";
import React from "react";
import Link from "next/link";
import { Zap, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center" style={{ background: "linear-gradient(135deg, #EEF3FF, #E6FAF8)", fontFamily: "'Cairo', sans-serif" }}>
      <div>
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1A4FD6, #00C2A8)" }}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-black bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #1A4FD6, #00C2A8)" }}>نافِس</span>
        </div>
        <div className="text-9xl font-black mb-4" style={{ color: "#1A4FD6", opacity: 0.2 }}>404</div>
        <h1 className="text-4xl font-black mb-3" style={{ color: "#0A0E1A" }}>الصفحة غير موجودة</h1>
        <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: "#3D4560" }}>
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #1A4FD6, #2563EB)" }}>
            <Home className="w-4 h-4" /> الرئيسية
          </Link>
          <Link href="/auctions" className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold border-2 transition-all hover:bg-[#EEF3FF]" style={{ color: "#1A4FD6", borderColor: "#1A4FD6" }}>
            <Search className="w-4 h-4" /> تصفح المزادات
          </Link>
        </div>
      </div>
    </div>
  );
}
