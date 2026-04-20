"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Send, 
  Mic, 
  Image as ImageIcon, 
  PlusCircle, 
  Video, 
  Phone, 
  Play, 
  Download,
  FileText,
  Star,
  CheckCheck,
  Mail,
  Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect } from "react";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchConversations = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;
      setUser(currentUser);

      // Fetch from the custom view I just created
      const { data, error } = await supabase
        .from("messages") // Actually better to fetch unique sender/receiver combinations
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, name, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(id, name, avatar_url)
        `)
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order("created_at", { ascending: false });

      if (data) {
        // Simple deduplication for UI
        const uniqueConversations: any[] = [];
        const seen = new Set();
        data.forEach((m: any) => {
          const otherUser = m.sender_id === currentUser.id ? m.receiver : m.sender;
          if (otherUser && !seen.has(otherUser.id)) {
            seen.add(otherUser.id);
            uniqueConversations.push({
              ...m,
              otherUser,
              name: otherUser.name,
              avatar: otherUser.avatar_url,
              online: true, // simplified
            });
          }
        });
        setConversations(uniqueConversations);
        if (uniqueConversations.length > 0 && !selectedChat) {
          setSelectedChat(uniqueConversations[0]);
        }
      }
      setLoading(false);
    };

    fetchConversations();
  }, [supabase]);

  useEffect(() => {
    if (!selectedChat || !user) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedChat.otherUser.id}),and(sender_id.eq.${selectedChat.otherUser.id},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat-${selectedChat.otherUser.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new;
          if (
            (newMsg.sender_id === user.id && newMsg.receiver_id === selectedChat.otherUser.id) ||
            (newMsg.sender_id === selectedChat.otherUser.id && newMsg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat, user, supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !user) return;

    const content = message;
    setMessage("");

    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedChat.otherUser.id,
      content: content,
    });

    if (error) {
      console.error(error);
      setMessage(content);
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.20))] overflow-hidden bg-[#F8FAFC]" dir="rtl">
      {/* Dynamic Style Injection for Kinetic UI */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Cairo:wght@400;600;700;900&display=swap');
        
        :root {
          --naf-primary: #1A4FD6;
          --naf-accent: #00C2A8;
          --naf-glass: rgba(255, 255, 255, 0.75);
        }

        .kinetic-text {
          background: linear-gradient(135deg, #0A0E1A, #1A4FD6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .chat-mesh {
          background-image: 
            radial-gradient(at 0% 0%, rgba(26, 79, 214, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(0, 194, 168, 0.05) 0px, transparent 50%);
        }

        .glass-card {
           background: var(--naf-glass);
           backdrop-filter: blur(20px);
           border: 1px solid rgba(255, 255, 255, 0.4);
           box-shadow: 0 8px 32px rgba(26, 79, 214, 0.04);
        }

        .bubble-mine {
           background: linear-gradient(135deg, #0A0E1A, #1A4FD6);
           box-shadow: 0 10px 20px -5px rgba(26, 79, 214, 0.3);
           border-radius: 24px 24px 4px 24px;
        }

        .bubble-other {
           background: white;
           border: 1px solid #F1F5F9;
           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
           border-radius: 24px 24px 24px 4px;
        }

        .neon-status {
           box-shadow: 0 0 12px var(--naf-accent);
        }
      `}</style>

      {/* Conversations List Sidebar */}
      <section className="w-full md:w-[400px] flex flex-col border-l border-[#F1F5F9] bg-white relative z-20 shadow-xl">
        <div className="p-8 border-b border-[#F1F5F9]">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-[#0A0E1A] tracking-tight">مركز النبض</h1>
            <div className="flex gap-2">
               <button className="p-2.5 bg-[#F8FAFC] hover:bg-[#EEF3FF] text-[#1A4FD6] rounded-xl transition-all"><Search size={20}/></button>
               <button className="p-2.5 bg-[#F8FAFC] hover:bg-[#EEF3FF] text-[#1A4FD6] rounded-xl transition-all"><Plus size={20}/></button>
            </div>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar flex-row-reverse">
             {/* Dynamic Stories or Quick Links */}
             {[1,2,3].map(x => (
               <div key={x} className="flex-shrink-0 w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-[#1A4FD6] to-[#00C2A8]">
                  <div className="w-full h-full rounded-[0.9rem] bg-white p-0.5 overflow-hidden">
                     <img src={`https://i.pravatar.cc/150?u=${x+40}`} className="w-full h-full object-cover rounded-[0.7rem]" />
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40">
                <Loader2 className="w-10 h-10 animate-spin text-[#1A4FD6]" />
                <p className="mt-4 text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">مزامنة البيانات</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-20 px-8">
                <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-6">
                   <Mail className="w-10 h-10 text-[#CBD5E1]" />
                </div>
                <p className="font-black text-[#64748B]">صندوق الوارد فارغ</p>
                <p className="text-sm text-[#94A3B8] mt-2">ابدأ محادثات جديدة مع المستقلين</p>
              </div>
            ) : (
              conversations.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`group p-5 rounded-[2rem] cursor-pointer transition-all duration-500 flex flex-row-reverse gap-5 relative overflow-hidden ${
                    selectedChat?.otherUser?.id === chat.otherUser?.id 
                      ? "bg-[#0A0E1A] text-white shadow-2xl scale-[1.02] z-10" 
                      : "bg-white hover:bg-[#F8FAFC] text-[#434654] border border-transparent shadow-sm"
                  }`}
                >
                  {selectedChat?.otherUser?.id === chat.otherUser?.id && (
                     <div className="absolute top-0 right-0 w-24 h-24 bg-[#1A4FD6]/20 rounded-full blur-3xl -mr-12 -mt-12" />
                  )}
                  
                  <div className="relative flex-shrink-0">
                    <img 
                      src={chat.avatar || `https://i.pravatar.cc/150?u=${chat.id}`} 
                      className={`w-14 h-14 rounded-2xl object-cover ring-2 ${
                        selectedChat?.otherUser?.id === chat.otherUser?.id ? "ring-[#1A4FD6]" : "ring-[#F1F5F9]"
                      }`}
                      alt=""
                    />
                    {chat.online && (
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#00C2A8] border-2 border-white rounded-full neon-status animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-right min-w-0 flex flex-col justify-center">
                    <div className="flex flex-row-reverse justify-between items-baseline mb-1">
                      <h3 className={`font-black truncate ${
                        selectedChat?.otherUser?.id === chat.otherUser?.id ? "text-white" : "text-[#0A0E1A]"
                      }`}>
                        {chat.name}
                      </h3>
                      <span className={`text-[10px] font-black tracking-wider ${
                        selectedChat?.otherUser?.id === chat.otherUser?.id ? "text-[#1A4FD6]" : "text-[#94A3B8]"
                      }`}>
                        {new Date(chat.created_at).toLocaleTimeString("ar-SA", { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className={`text-sm truncate font-medium ${
                      chat.lastMessage === "يكتب الآن..." ? "text-[#00C2A8] animate-pulse" : (selectedChat?.otherUser?.id === chat.otherUser?.id ? "text-white/60" : "text-[#64748B]")
                    }`}>
                      {chat.content}
                    </p>
                  </div>
                </div>
              ))
            )}
        </div>
      </section>

      {/* Active Chat Window */}
      <section className="hidden md:flex flex-1 flex-col bg-[#F8FAFC] overflow-hidden relative chat-mesh">
        {!selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-in fade-in zoom-in duration-1000">
            <div className="relative group">
               <div className="absolute inset-0 bg-[#1A4FD6]/20 blur-3xl rounded-full scale-150 animate-pulse" />
               <div className="relative w-40 h-40 bg-white rounded-[3rem] shadow-2xl border border-white flex items-center justify-center mb-10 translate-y-[-10%] group-hover:scale-110 transition-transform duration-700">
                  <Mail className="w-16 h-16 text-[#1A4FD6]" />
               </div>
            </div>
            <h2 className="text-3xl font-black text-[#0A0E1A] mb-4">قنوات تواصل آمنة</h2>
            <p className="text-[#64748B] font-bold max-w-sm leading-relaxed">اختر محادثة لبدء النقاش حول مشاريعك، تواصل بفعالية واصنع النجاح.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <header className="h-24 glass-card border-b border-[#F1F5F9] px-10 flex flex-row-reverse items-center justify-between z-30 shrink-0">
              <div className="flex flex-row-reverse items-center gap-5">
                <div className="relative">
                  <img 
                    src={selectedChat.avatar || `https://i.pravatar.cc/150?u=${selectedChat.otherUser.id}`} 
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#00C2A8]/20"
                    alt=""
                  />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-[#00C2A8] border-2 border-white rounded-full shadow-lg" />
                </div>
                <div className="text-right">
                  <h2 className="font-black text-[#0A0E1A] text-xl tracking-tight">{selectedChat.name}</h2>
                  <div className="flex flex-row-reverse items-center gap-2">
                    <span className="text-[11px] font-black text-[#00C2A8] uppercase tracking-widest bg-[#E6FAF8] px-2 py-0.5 rounded">متصل بالشبكة</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 mr-4">
                   <button className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl border border-[#E2E8F0] text-sm font-black text-[#0A0E1A] hover:bg-[#F8FAFC] transition-all"><FileText size={18} className="text-[#1A4FD6]"/> الملفات</button>
                </div>
                <button className="p-3 bg-white shadow-sm border border-[#F1F5F9] rounded-2xl text-[#1A4FD6] hover:scale-110 transition-all"><Video className="w-5 h-5" /></button>
                <button className="p-3 bg-white shadow-sm border border-[#F1F5F9] rounded-2xl text-[#1A4FD6] hover:scale-110 transition-all"><Phone className="w-5 h-5" /></button>
                <button className="p-3 bg-white shadow-sm border border-[#F1F5F9] rounded-2xl text-[#94A3B8] hover:text-[#0A0E1A] transition-all"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </header>

            {/* Messages Canvas */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 z-10 custom-scrollbar overscroll-contain">
              <div className="flex flex-col gap-8">
              {messages.map((m, idx) => {
                const isMine = m.sender_id === user?.id;
                const showAvatar = idx === 0 || messages[idx-1]?.sender_id !== m.sender_id;

                return (
                  <div key={m.id} className={`flex ${isMine ? "flex-row" : "flex-row-reverse"} items-end gap-4 max-w-[85%] ${isMine ? "mr-auto" : ""} animate-in slide-in-from-bottom-5 duration-500`}>
                    {!isMine && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 mb-6">
                        {showAvatar ? (
                           <img src={selectedChat.avatar || `https://i.pravatar.cc/150?u=${selectedChat.otherUser.id}`} alt="" />
                        ) : <div className="w-full h-full" />}
                      </div>
                    )}
                    <div className={`flex flex-col ${isMine ? "items-start" : "items-end"} gap-2`}>
                      <div className={`${isMine ? "bubble-mine text-white" : "bubble-other text-[#1E293B]"} p-5 text-right`}>
                        <p className="text-[15px] font-semibold leading-relaxed">
                          {m.content}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-1 ${isMine ? "flex-row" : "flex-row-reverse"}`}>
                        {isMine && <CheckCheck className="w-3.5 h-3.5 text-[#00C2A8]" />}
                        <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-tighter">
                          {new Date(m.created_at).toLocaleTimeString("ar-SA", { hour: "numeric", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            {/* Chat Input Area */}
            <footer className="p-8 z-30 shrink-0">
              <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto relative">
                <div className="absolute inset-0 bg-[#1A4FD6]/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full" />
                <div className="relative glass-card bg-white/90 p-4 rounded-[2.5rem] flex flex-row-reverse items-center gap-4 border border-white shadow-2xl">
                  <div className="flex gap-1 flex-row-reverse">
                    <button type="button" className="p-3 text-[#94A3B8] hover:text-[#1A4FD6] rounded-2xl hover:bg-[#EEF3FF] transition-all"><PlusCircle className="w-6 h-6" /></button>
                    <button type="button" className="p-3 text-[#94A3B8] hover:text-[#1A4FD6] rounded-2xl hover:bg-[#EEF3FF] transition-all"><ImageIcon className="w-6 h-6" /></button>
                  </div>
                  
                  <div className="h-10 w-[1px] bg-[#F1F5F9]" />

                  <input 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-right text-[#0A0E1A] font-bold placeholder:text-[#CBD5E1] py-3 text-lg outline-none" 
                    placeholder="ابدأ بكتابة رسالتك هنا..." 
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />

                  <div className="flex items-center gap-2 flex-row-reverse">
                    <button type="button" className="p-3 text-[#94A3B8] hover:text-[#1A4FD6] rounded-2xl hover:bg-[#EEF3FF] transition-all"><Mic className="w-6 h-6" /></button>
                    <button type="submit" className="w-14 h-14 bg-[#0A0E1A] text-white rounded-[1.2rem] flex items-center justify-center shadow-lg hover:scale-105 active:scale-90 transition-all duration-300">
                      <Send className="w-6 h-6 rotate-180" />
                    </button>
                  </div>
                </div>
              </form>
            </footer>
          </>
        )}
      </section>


      {/* Mobile View Placeholder Interaction */}
      <div className="md:hidden fixed inset-0 flex items-center justify-center p-8 text-center bg-white z-[60]">
        <div>
          <Mail className="w-16 h-16 text-[#0038ac] mx-auto mb-4" />
          <h2 className="text-xl font-bold headline mb-2">نسخة الحواسيب فقط</h2>
          <p className="text-[#747686]">يرجى استخدام جهاز حاسوب للوصول إلى مركز الرسائل والتمتع بتجربة كاملة.</p>
        </div>
      </div>
    </div>
  );
}
