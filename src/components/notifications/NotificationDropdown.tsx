"use client";

import React, { useEffect, useState } from "react";
import { Bell, Check, ExternalLink, Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Notification } from "@/types/marketplace";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface NotificationDropdownProps {
  onClose?: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  // ── Fetch Initial Notifications ──
  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Mark as Read ──
  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // ── Subscribe to New Notifications ──
    const subscription = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications(prev => [newNotif, ...prev].slice(0, 10));
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div 
      className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border shadow-2xl z-50 overflow-hidden flex flex-col"
      style={{
        borderColor: "#E8ECF4",
        boxShadow: "0 10px 40px rgba(26, 79, 214, 0.12)",
        animation: "slideIn 0.2s ease-out"
      }}
    >
      <div className="p-4 border-b flex items-center justify-between flex-row-reverse" style={{ borderColor: "rgba(232, 236, 244, 0.6)" }}>
        <h4 className="font-bold text-[#0A0E1A]" style={{ fontFamily: "'Cairo', sans-serif" }}>الإشعارات</h4>
        <button 
          onClick={markAllAsRead}
          className="text-[10px] font-black uppercase text-[#1A4FD6] hover:opacity-70 transition-opacity"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          تحديد الكل كمقروء
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto bg-[#FAFBFF]">
        {loading ? (
          <div className="p-10 text-center space-y-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse mx-auto" />
             <div className="h-2 w-20 bg-slate-100 animate-pulse mx-auto rounded" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-3xl bg-white/40 flex items-center justify-center border border-dashed border-[#E8ECF4]">
                <Inbox className="w-8 h-8 text-[#8892A4]" />
             </div>
             <p className="text-xs font-bold text-[#8892A4]" style={{ fontFamily: "'Cairo', sans-serif" }}>لا يوجد إشعارات حالياً</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-4 border-b flex flex-row-reverse items-start gap-4 transition-all hover:bg-white cursor-pointer group ${!notif.is_read ? 'bg-[#EEF3FF]/40' : 'bg-transparent'}`}
              style={{ borderColor: "rgba(232, 236, 244, 0.4)" }}
            >
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                notif.type === 'bid_received' ? 'bg-[#00C2A8]/10 text-[#00C2A8]' : 'bg-[#1A4FD6]/10 text-[#1A4FD6]'
              }`}>
                {notif.type === 'bid_received' ? <Bell className="w-5 h-5" /> : <Check className="w-5 h-5" />}
              </div>
              <div className="flex-1 text-right">
                <div className="flex justify-between items-start flex-row-reverse mb-1">
                  <h5 className="text-xs font-black text-[#0A0E1A]" style={{ fontFamily: "'Cairo', sans-serif" }}>{notif.title}</h5>
                  <span className="text-[9px] font-bold text-[#8892A4]">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ar })}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#3D4560] font-medium mb-2" style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {notif.body}
                </p>
                {notif.link && (
                  <Link 
                    href={notif.link}
                    onClick={onClose}
                    className="inline-flex flex-row-reverse items-center gap-1.5 text-[10px] font-black text-[#1A4FD6] hover:gap-2 transition-all"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                  >
                    <span>عرض التفاصيل</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Link 
        href="/notifications"
        onClick={onClose}
        className="p-3 text-center text-xs font-black text-[#3D4560] border-t hover:bg-white transition-colors"
        style={{ borderColor: "rgba(232, 236, 244, 0.6)", fontFamily: "'Cairo', sans-serif" }}
      >
        مشاهدة جميع الإشعارات
      </Link>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
