"use client";

import React, { useEffect, useState } from "react";
import { Bell, Check, Zap, Star, MessageCircle, Wallet, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        setNotifications(data || []);
      } catch (err) {
        console.error("Fetch notifications error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to new notifications
    const sub = supabase
      .channel('realtime-notifications-page')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  const markAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#1A4FD6] mb-4" />
        <h2 className="text-xl font-black text-[#0A0E1A]">جاري تحميل إشعاراتك...</h2>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_bid': return { icon: <TrendingUp className="w-5 h-5" />, color: "#1A4FD6", bg: "#EEF3FF" };
      case 'message': return { icon: <MessageCircle className="w-5 h-5" />, color: "#00C2A8", bg: "#E6FAF8" };
      case 'payment': return { icon: <Wallet className="w-5 h-5" />, color: "#10B981", bg: "#D1FAE5" };
      case 'review': return { icon: <Star className="w-5 h-5" />, color: "#F59E0B", bg: "#FEF3C7" };
      default: return { icon: <Bell className="w-5 h-5" />, color: "#8B5CF6", bg: "#EDE9FE" };
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen" style={{ background: "#FAFBFF", fontFamily: "'Cairo', sans-serif" }}>
      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm font-bold flex items-center gap-1" style={{ color: "#1A4FD6" }}>
              <Check className="w-4 h-4" /> تحديد الكل كمقروء
            </button>
          )}
          <div className="text-right">
            <h1 className="text-3xl font-black" style={{ color: "#0A0E1A" }}>الإشعارات</h1>
            <p className="text-sm font-bold" style={{ color: "#8892A4" }}>
              {unreadCount > 0 ? `لديك ${unreadCount} إشعارات غير مقروءة` : "أنت مطلع على كل شيء!"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const style = getIcon(n.type);
              return (
                <Link key={n.id} href={n.link || '#'} onClick={() => !n.is_read && markAsRead(n.id)}>
                  <div
                    className={`bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl group mb-4 relative ${!n.is_read ? 'border-l-4' : ''}`}
                    style={{ 
                      borderColor: !n.is_read ? style.color : "#E8ECF4",
                      boxShadow: !n.is_read ? `0 8px 16px ${style.color}10` : 'none'
                    }}
                  >
                    <div className="flex items-start gap-4 flex-row-reverse">
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-[10px] font-black text-[#8892A4]">
                             {new Date(n.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                           </span>
                           <h3 className="font-black text-lg text-[#0A0E1A] group-hover:text-[#1A4FD6] transition-colors">{n.title}</h3>
                        </div>
                        <p className="text-sm font-bold leading-relaxed text-[#3D4560] mb-1">{n.body}</p>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300" 
                          style={{ background: style.bg, color: style.color }}>
                          {style.icon}
                        </div>
                        {!n.is_read && <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: style.color }} />}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="p-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-[#E8ECF4]">
               <Bell className="w-16 h-16 text-[#E1E8F7] mx-auto mb-4" />
               <p className="text-[#8892A4] font-bold">لا توجد إشعارات حتى الآن</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
