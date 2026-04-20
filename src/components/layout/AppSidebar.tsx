"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut, Settings, MessageSquare, Wallet, Gavel,
  LayoutDashboard, LifeBuoy, TrendingUp, FolderOpen, Star,
  Search, Users
} from "lucide-react";
import { NafisLogo } from "@/components/ui/NafisLogo";

interface AppSidebarProps {
  userRole?: "freelancer" | "client" | "admin";
  userName?: string;
  userTitle?: string;
  userImage?: string;
}

const navItems = {
  freelancer: [
    { icon: LayoutDashboard, label: "لوحة التحكم",  href: "/dashboard",            symbol: "dashboard" },
    { icon: Search,          label: "استكشف",        href: "/explore",              symbol: "explore" },
    { icon: Gavel,           label: "عروض البيع",    href: "/auctions",             symbol: "gavel" },
    { icon: FolderOpen,      label: "مشاريعي",       href: "/projects",             symbol: "folder_open" },
    { icon: MessageSquare,   label: "الرسائل",       href: "/messages",             symbol: "chat" },
    { icon: Wallet,          label: "المحفظة",       href: "/dashboard/wallet",     symbol: "account_balance_wallet" },
    { icon: Star,            label: "التقييمات",     href: "/dashboard/reviews",    symbol: "star" },
    { icon: TrendingUp,      label: "إحصائياتي",     href: "/dashboard/velocity",   symbol: "insights" },
    { icon: Settings,        label: "الإعدادات",     href: "/dashboard/settings",   symbol: "settings" },
  ],
  client: [
    { icon: LayoutDashboard, label: "لوحة التحكم",   href: "/dashboard/client",     symbol: "dashboard" },
    { icon: Search,          label: "استكشف",         href: "/explore",              symbol: "explore" },
    { icon: Users,           label: "المستقلون",     href: "/freelancers",          symbol: "group" },
    { icon: Gavel,           label: "مزاداتي",        href: "/auctions",             symbol: "gavel" },
    { icon: FolderOpen,      label: "المشاريع",       href: "/projects",             symbol: "work" },
    { icon: MessageSquare,   label: "الرسائل",        href: "/messages",             symbol: "chat" },
    { icon: Wallet,          label: "المدفوعات",      href: "/dashboard/wallet",     symbol: "payments" },
    { icon: Star,            label: "التقييمات",      href: "/dashboard/reviews",    symbol: "star" },
    { icon: Settings,        label: "الإعدادات",      href: "/dashboard/settings",   symbol: "settings" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "لوحة الإدارة",  href: "/admin/dashboard",  symbol: "admin_panel_settings" },
    { icon: MessageSquare,   label: "الرسائل",        href: "/admin/messages",   symbol: "chat" },
    { icon: Wallet,          label: "المالية",         href: "/admin/wallet",     symbol: "account_balance_wallet" },
    { icon: Settings,        label: "الإعدادات",      href: "/admin/settings",   symbol: "settings" },
  ],
};

export function AppSidebar({
  userRole = "freelancer",
  userName = "أحمد المحمد",
  userTitle = "مستقل محترف",
  userImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuB8uVmdczvFCx4tOrZmNrho1cxkiWZfLhRdmjxSHl-bVk7FsFmd85crvCUATO-lSYfVvEgn80hOUtYZYNhf-YPhPrD-a7KA4vCRPrPUS80vPgDo0LsxHIQ6hW7EUcGMTqGGxl8wohPqzY9fGFr5NJbdz9qeG4ivWdDxQwI3KAPdQ-bEe8StPu6z55QPzR9iAW7KRsB2--fDmKWJw9ps09ZaBWASOfnvOt9gdCam5Rq5zfhbEetCOWMr3DeRAL1MEOvHrx8FyvImfcBO",
}: AppSidebarProps) {
  const pathname = usePathname();
  const currentNav = navItems[userRole];

  return (
    <aside
      className="hidden lg:flex flex-col h-screen w-64 fixed right-0 top-0 z-40"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(32px) saturate(180%)",
        WebkitBackdropFilter: "blur(32px) saturate(180%)",
        borderLeft: "1px solid rgba(232, 236, 244, 0.5)",
        boxShadow: "-8px 0 32px rgba(0, 0, 0, 0.03)",
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      {/* ── Logo Header ── */}
      <div
        className="flex items-center justify-end px-6 relative"
        style={{ height: 68 }}
      >
        <Link href="/" className="relative z-10">
          <NafisLogo height={34} variant="light" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#E8ECF4] to-transparent" />
      </div>

      {/* ── User Card ── */}
      <div className="px-5 py-6">
        <div
          className="relative group p-4 rounded-[1.5rem] border border-white/60 shadow-[0_8px_20px_rgba(26,79,214,0.06)] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_28px_rgba(26,79,214,0.1)]"
          style={{ background: "rgba(255, 255, 255, 0.7)" }}
        >
          {/* Subtle Background Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#1A4FD6]/5 rounded-full blur-2xl group-hover:bg-[#1A4FD6]/10 transition-colors" />
          
          <div className="flex items-center gap-3 flex-row-reverse relative z-10">
            <div
              className="relative flex-shrink-0 w-12 h-12 rounded-2xl p-0.5"
              style={{ background: "linear-gradient(135deg, #1A4FD6, #7C3AED)" }}
            >
              <img
                alt={userName}
                className="w-full h-full rounded-[0.9rem] object-cover ring-2 ring-white"
                src={userImage}
              />
              <span
                className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white shadow-sm animate-pulse"
                style={{ background: "#00C2A8" }}
              />
            </div>
            <div className="flex-1 text-right min-w-0">
              <p className="text-sm font-black truncate text-[#0A0E1A]">{userName}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#1A4FD6] mt-0.5 bg-[#1A4FD6]/5 px-2 py-0.5 rounded-md inline-block">
                {userRole === 'client' ? 'حساب أعمال' : 'مستقل موثق'}
              </p>
            </div>
          </div>
          
          {/* Profile Completion or Mini Stat */}
          <div className="mt-4 pt-3 border-t border-dashed border-[#E8ECF4] flex justify-between items-center flex-row-reverse">
             <span className="text-[10px] font-bold text-[#8892A4]">نسبة الإكمال</span>
             <span className="text-[10px] font-black text-[#1A4FD6]">85%</span>
          </div>
          <div className="mt-1.5 h-1 w-full bg-[#F0F3FA] rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-l from-[#1A4FD6] to-[#00C2A8]" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Upgrade CTA - Floating Glass */}
        <button
          className="w-full mt-4 py-3 rounded-xl text-[11px] font-black tracking-wide uppercase transition-all duration-300 hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0A0E1A, #1A4FD6)",
            color: "white",
            boxShadow: "0 10px 20px -5px rgba(26, 79, 214, 0.4)",
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            نافس بريميوم <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 group-hover:rotate-12 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pt-2">
        {currentNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-row-reverse items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive ? "shadow-sm" : "hover:bg-white/50"
              }`}
              style={{
                background: isActive ? "white" : "transparent",
                color: isActive ? "#1A4FD6" : "#64748B",
                border: isActive ? "1px solid rgba(26, 79, 214, 0.1)" : "1px solid transparent",
              }}
            >
              {/* Active Background Glow */}
              {isActive && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1A4FD6]/10 rounded-full blur-xl" />
              )}
              
              <span
                className={`material-symbols-outlined transition-all duration-300 ${
                  isActive ? "scale-110 text-[#1A4FD6]" : "text-[#94A3B8] group-hover:text-[#1A4FD6]"
                }`}
                style={{ fontSize: "1.3rem" }}
              >
                {item.symbol}
              </span>
              
              <span className={`text-sm tracking-tight transition-all duration-300 ${
                isActive ? "font-black" : "font-bold group-hover:translate-x-[-2px]"
              }`}>
                {item.label}
              </span>

              {/* Active Indicator Bar */}
              {isActive && (
                <div 
                  className="absolute right-0 top-3 bottom-3 w-1 rounded-l-full bg-gradient-to-b from-[#1A4FD6] to-[#7C3AED]"
                />
              )}
            </Link>
          );
        })}
      </nav>


      {/* ── Footer Actions ── */}
      <div className="px-3 pb-6 pt-3" style={{ borderTop: "1px solid #E8ECF4" }}>
        <button
          className="flex flex-row-reverse items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-colors text-sm font-semibold"
          style={{ color: "#8892A4" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#F5F7FC";
            (e.currentTarget as HTMLElement).style.color = "#3D4560";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#8892A4";
          }}
        >
          <LifeBuoy className="w-5 h-5" />
          <span>الدعم والمساعدة</span>
        </button>
        <button
          className="flex flex-row-reverse items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-colors text-sm font-semibold mt-0.5"
          style={{ color: "#DC2626" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#FEF2F2";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
