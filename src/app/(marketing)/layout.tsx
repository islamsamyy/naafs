"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { NafisLogo } from "@/components/ui/NafisLogo";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient(); // module-level singleton — not re-created on re-render

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المزادات الحية", href: "/auctions" },
  { label: "المشاريع", href: "/projects" },
  { label: "المستقلين", href: "/freelancers" },
  { label: "استكشف", href: "/explore" },
  { label: "كيف يعمل؟", href: "/how-it-works" },
  { label: "الأسعار", href: "/pricing" },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => { setScrolled(window.scrollY > 20); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Auth initialization
    const getInitialUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Cairo', 'Noto Sans Arabic', sans-serif" }}>
      {/* Navbar */}
      <nav
        className="fixed top-0 w-full z-50 rtl transition-all duration-500"
        style={{
          background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(30px) saturate(2)",
          WebkitBackdropFilter: "blur(30px) saturate(2)",
          borderBottom: "1px solid rgba(232,236,244,0.6)",
          boxShadow: scrolled ? "0 8px 40px rgba(26,79,214,0.12)" : "0 2px 12px rgba(26,79,214,0.06)",
        }}
      >
        <div className="max-w-[1440px] mx-auto flex flex-row-reverse justify-between items-center px-6 sm:px-8 h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <NafisLogo height={40} className="group-hover:scale-110 transition-transform duration-300" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                  style={{
                    color: isActive ? "#1A4FD6" : "#3D4560",
                    background: isActive ? "#EEF3FF" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = "#1A4FD6";
                      (e.currentTarget as HTMLElement).style.background = "#F5F7FF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = "#3D4560";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 right-2 left-2 h-0.5 rounded-full"
                      style={{ background: "linear-gradient(90deg, #1A4FD6, #00C2A8)" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth CTAs & User Menu */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-white hover:bg-surface-container-low transition-all duration-200"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-black leading-none" style={{ color: "#0A0E1A" }}>
                      {user.user_metadata?.name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] font-bold text-ink-muted mt-1 uppercase tracking-tighter">
                      الحساب الشخصي
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-border bg-primary/5 flex items-center justify-center">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-primary opacity-40" />
                    )}
                  </div>
                </button>

                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div 
                      className="absolute top-full left-0 mt-3 w-56 glass-panel-strong rounded-2xl border border-white/20 shadow-2xl p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200"
                      style={{ background: scrolled ? "rgba(255,255,255,0.98)" : "white" }}
                    >
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-ink-secondary hover:bg-primary/5 hover:text-primary transition-all flex-row-reverse"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>لوحة التحكم</span>
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-ink-secondary hover:bg-primary/5 hover:text-primary transition-all flex-row-reverse"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>الإعدادات</span>
                      </Link>
                      <div className="h-px bg-border my-1 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all flex-row-reverse"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200"
                  style={{ color: "#1A4FD6" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#EEF3FF"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-lg text-sm font-bold text-white transition-all duration-200 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #1A4FD6, #2563EB)",
                    boxShadow: "0 4px 16px rgba(26,79,214,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(26,79,214,0.45)";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(26,79,214,0.3)";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  }}
                >
                  ابدأ مجاناً
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg"
            style={{ color: "#3D4560" }}
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="lg:hidden absolute top-[68px] right-0 left-0"
            style={{
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid #E8ECF4",
            }}
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-semibold rounded-lg text-right"
                  style={{ color: "#3D4560" }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-2">
                {user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setMobileOpen(false)} 
                      className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold bg-primary/5 text-primary flex-row-reverse"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>لوحة التحكم</span>
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-bold bg-red-50 text-red-500 flex-row-reverse"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 px-4 py-3 rounded-lg text-sm font-bold text-center border" style={{ color: "#1A4FD6", borderColor: "#1A4FD6" }}>
                      دخول
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 px-4 py-3 rounded-lg text-sm font-bold text-center text-white" style={{ background: "#1A4FD6" }}>
                      ابدأ مجاناً
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="pt-[68px]">{children}</main>

      {/* Footer */}
      <footer style={{ background: "#0A0E1A", color: "#8892A4" }} className="py-16 mt-20">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-right">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2 justify-end">
                <NafisLogo height={32} variant="white" />
              </div>
              <p className="text-sm leading-relaxed">منصة المزادات الحية الأولى عربياً — المنافسة تصنع أفضل سعر</p>
              <div className="flex gap-3 justify-end">
                {["twitter", "linkedin", "instagram"].map((s) => (
                  <a key={s} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <span className="text-xs text-white">{s[0].toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-white">المنصة</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "المزادات الحية", href: "/auctions" },
                  { label: "المشاريع", href: "/projects" },
                  { label: "المستقلين", href: "/freelancers" },
                  { label: "استكشف", href: "/explore" },
                  { label: "كيف يعمل؟", href: "/how-it-works" }
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-white">الشركة</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "عن نافس", href: "/how-it-works" },
                  { label: "المدونة", href: "/" },
                  { label: "الأسعار", href: "/pricing" },
                  { label: "التوثيق", href: "/" }
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-white">الدعم</h4>
              <ul className="space-y-2 text-sm">
                {[
                  { label: "مركز المساعدة", href: "/" },
                  { label: "الأسئلة الشائعة", href: "/" },
                  { label: "تواصل معنا", href: "/" },
                  { label: "الشروط والأحكام", href: "/" }
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <p>جميع الحقوق محفوظة © 2025 نافِس</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
