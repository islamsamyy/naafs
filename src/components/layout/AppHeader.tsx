"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Mail, Plus, Menu, X, ChevronDown, BellDot, Edit2 } from "lucide-react";
import { NafisLogo } from "@/components/ui/NafisLogo";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";
import OptimizedImage from "@/components/common/OptimizedImage";
import ProfileEditModal from "@/components/common/ProfileEditModal";

interface AppHeaderProps {
  showSearch?: boolean;
  showAddProject?: boolean;
  activePath?: string;
}

const navLinks = [
  { label: "لوحة التحكم", href: "/dashboard" },
  { label: "المزادات المباشرة", href: "/auctions/live" },
  { label: "استكشف المبدعين", href: "/explore" },
  { label: "المشاريع المتاحة", href: "/projects" },
];

export function AppHeader({
  showSearch = true,
  showAddProject = true,
  activePath,
}: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userProfile, setUserProfile] = useState<{ role?: string; avatar_url?: string; name?: string } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Fetch unread count
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      setUnreadCount(count || 0);

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, avatar_url, name")
        .eq("id", user.id)
        .single();
      if (profile) setUserProfile(profile);
    };

    fetchUserData();

    const channel = supabase
      .channel("header-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        () => setUnreadCount(prev => prev + 1)
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        () => fetchUserData()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header
      className="fixed top-4 inset-x-4 lg:inset-x-8 z-50 rtl animate-fade-in-up"
      style={{
        zIndex: 1000,
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      <div
        className="max-w-[1440px] mx-auto flex flex-row-reverse items-center justify-between px-6 sm:px-8 rounded-3xl transition-all duration-500"
        style={{ 
          height: 72,
          background: "rgba(255, 255, 255, 0.72)",
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 12px 40px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(26, 79, 214, 0.05)"
        }}
      >
        {/* ── Right: Logo ── */}
        <Link href="/" className="flex-shrink-0 group relative">
          <div className="absolute inset-0 bg-[#1A4FD6]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full duration-500" />
          <div className="relative group-hover:scale-105 transition-transform duration-500 ease-out">
            <NafisLogo height={38} variant="light" />
          </div>
        </Link>

        {/* ── Center: Nav (desktop) ── */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/40 p-1 rounded-2xl border border-white/60 shadow-inner">
          {navLinks.map((link) => {
            const isActive = activePath?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2.5 text-sm font-black rounded-xl transition-all duration-500 group animate-in fade-in slide-in-from-top-2 ${
                  isActive ? "shadow-sm" : "hover:bg-white/50"
                }`}
                style={{
                  color: isActive ? "#1A4FD6" : "#475569",
                  background: isActive ? "white" : "transparent",
                  border: isActive ? "1px solid rgba(26, 79, 214, 0.08)" : "1px solid transparent",
                }}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 inset-x-4 h-[3px] rounded-t-full bg-gradient-to-r from-[#1A4FD6] to-[#00C2A8] shadow-[0_2px_10px_rgba(26,79,214,0.3)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>


        {/* ── Left: Actions ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search (desktop) */}
          {showSearch && (
            <div
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group hover:shadow-lg"
              style={{ background: "#F0F3FA", border: "1px solid #E8ECF4" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#EEF3FF";
                (e.currentTarget as HTMLElement).style.borderColor = "#1A4FD6";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#F0F3FA";
                (e.currentTarget as HTMLElement).style.borderColor = "#E8ECF4";
              }}
            >
              <Search
                className="w-4 h-4 flex-shrink-0 group-hover:text-primary transition-colors"
                style={{ color: "#8892A4" }}
              />
              <input
                className="bg-transparent text-sm outline-none w-44 text-right placeholder:text-[#8892A4] group-focus-within:text-primary transition-colors"
                placeholder="ابحث عن مشاريع..."
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontWeight: 400,
                  color: "#0A0E1A",
                }}
              />
            </div>
          )}

          <div className="relative">
            <button
              className="relative p-2 rounded-lg transition-all duration-300 hover:scale-110 group"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              style={{ color: "#3D4560" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#F0F3FA";
                (e.currentTarget as HTMLElement).style.color = "#1A4FD6";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#3D4560";
              }}
              aria-label="الإشعارات"
            >
              {unreadCount > 0 ? (
                <BellDot className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 text-[#DC2626]" />
              ) : (
                <Bell className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              )}
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse text-[8px] font-black leading-none text-white pointer-events-none"
                  style={{ background: "#DC2626" }}
                >
                  {unreadCount > 9 ? "+9" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setNotificationsOpen(false)} 
                />
                <NotificationDropdown onClose={() => setNotificationsOpen(false)} />
              </>
            )}
          </div>

          {/* Messages */}
          <Link
            href="/messages"
            className="relative p-2 rounded-lg transition-all duration-300 hover:scale-110 group"
            style={{ color: "#3D4560" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#F0F3FA";
              (e.currentTarget as HTMLElement).style.color = "#1A4FD6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#3D4560";
            }}
            aria-label="الرسائل"
          >
            <Mail className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white animate-pulse"
              style={{ background: "#DC2626" }}
            />
          </Link>

          {/* Add Project CTA - Only for business owners */}
          {userProfile?.role === "business_owner" && (
            <Link
              href="/projects/create"
              className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 active:scale-95 hover:shadow-xl group"
              style={{
                background: "linear-gradient(135deg, #1A4FD6, #2563EB)",
                color: "#FFFFFF",
                fontFamily: "'Cairo', sans-serif",
                boxShadow: "0 4px 16px rgba(26, 79, 214, 0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(26, 79, 214, 0.4)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(26, 79, 214, 0.25)";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>أضف مشروع</span>
            </Link>
          )}

          {/* User Avatar & Logout */}
          <div className="flex items-center gap-2">
            <div className="relative group flex-shrink-0">
              <button
                onClick={() => setEditModalOpen(true)}
                className="relative hover:scale-110 transition-transform duration-300 flex items-center gap-1"
              >
                <div
                  className="w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-300 group-hover:shadow-lg"
                  style={{ borderColor: "#E8ECF4" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#1A4FD6")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#E8ECF4")}
                >
                  <OptimizedImage
                    src={userProfile?.avatar_url}
                    alt="الملف الشخصي"
                    width={36}
                    height={36}
                    className="group-hover:scale-120 transition-transform duration-300"
                    fallback="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    loading="eager"
                  />
                </div>
                {/* Online dot */}
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse"
                  style={{ background: "#00C2A8" }}
                />
                {/* Edit icon on hover */}
                <div className="absolute -bottom-1 -left-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit2 className="w-3 h-3" style={{ color: "#1A4FD6" }} />
                </div>
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="hidden lg:block text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              خروج
            </button>
          </div>

          {/* Profile Edit Modal */}
          <ProfileEditModal
            user={userProfile}
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSaveSuccess={(updatedUser) => {
              setUserProfile(updatedUser);
            }}
          />

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "#3D4560" }}
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-[68px] right-0 left-0 animate-slide-down"
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
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-semibold rounded-lg transition-colors"
                style={{ color: "#3D4560", fontFamily: "'Cairo', sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
            {userProfile?.role === "business_owner" && (
              <Link
                href="/projects/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-lg text-sm font-bold"
                style={{ background: "#1A4FD6", color: "#FFFFFF", fontFamily: "'Cairo', sans-serif" }}
              >
                <Plus className="w-4 h-4" />
                أضف مشروع
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
