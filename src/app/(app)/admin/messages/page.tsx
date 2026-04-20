"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Smile, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  LifeBuoy, 
  Ticket, 
  Star,
  ChevronLeft,
  Settings,
  X,
  Plus
} from "lucide-react";

export default function AdminMessagesPage() {
  const [selectedTicket, setSelectedTicket] = useState(0);

  const tickets = [
    {
      id: "TKT-2041",
      user: "أحمد العتيبي",
      subject: "مشكلة في سحب الرصيد",
      lastMessage: "شكراً، سأنتظر التحديث القادم.",
      time: "منذ ٥ دقائق",
      status: "open",
      priority: "high",
      unread: true
    },
    {
      id: "TKT-1982",
      user: "سارة الجاسم",
      subject: "استفسار حول رسوم المشروع",
      lastMessage: "هل يمكنني الحصول على فاتورة ضريبية؟",
      time: "منذ ساعة",
      status: "pending",
      priority: "medium",
      unread: false
    },
    {
      id: "TKT-1945",
      user: "مؤسسة الابتكار",
      subject: "توثيق الحساب التجاري",
      lastMessage: "تم رفع جميع المستندات المطلوبة.",
      time: "منذ ٣ ساعات",
      status: "resolved",
      priority: "low",
      unread: false
    }
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 rtl">
        <div className="text-right">
          <h1 className="text-3xl font-black text-on-surface mb-1 font-headline">مركز الدعم والمساعدة</h1>
          <p className="text-on-surface-variant text-sm font-medium">إدارة تذاكر الدعم الفني وطلبات المستخدمين</p>
        </div>
        <div className="flex gap-3 flex-row-reverse">
          <div className="relative">
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">٣</span>
            <button className="p-3 bg-surface-container rounded-2xl hover:bg-surface-container-high transition-colors">
              <LifeBuoy className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            تذكرة جديدة
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Ticket List Sidebar */}
        <div className="w-full md:w-[380px] flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-outline-variant/10 overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 text-right">
            <div className="relative mb-4">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input 
                type="text" 
                placeholder="البحث في التذاكر..." 
                className="w-full bg-surface-container-lowest pr-10 pl-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none border border-outline-variant/10 font-medium text-right"
              />
            </div>
            <div className="flex justify-between items-center flex-row-reverse">
              <span className="text-xs font-black text-on-surface-variant uppercase tracking-widest">تذاكر نشطة</span>
              <button className="p-1.5 hover:bg-surface-container rounded-lg group">
                <Filter className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {tickets.map((ticket, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedTicket(idx)}
                className={`w-full flex items-start gap-4 p-4 rounded-3xl transition-all duration-300 relative group mb-2 ${
                  selectedTicket === idx 
                  ? 'bg-primary/5 border border-primary/10 shadow-sm' 
                  : 'hover:bg-surface-container-low border border-transparent'
                }`}
              >
                {ticket.unread && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
                )}
                
                <div className="flex-1 text-right">
                  <div className="flex justify-between items-center mb-1 flex-row-reverse">
                    <span className="text-xs font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full">{ticket.id}</span>
                    <span className="text-[10px] text-on-surface-variant font-bold">{ticket.time}</span>
                  </div>
                  <h4 className="font-bold text-on-surface leading-tight mb-1">{ticket.subject}</h4>
                  <p className="text-xs text-on-surface-variant font-medium truncate opacity-80">{ticket.lastMessage}</p>
                </div>

                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 ${
                  ticket.status === 'resolved' ? 'bg-tertiary-container/10 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  <User className="w-6 h-6" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Canvas */}
        <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-outline-variant/10 overflow-hidden relative">
          {/* Canvas Header */}
          <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between flex-row-reverse bg-surface-container-lowest/30 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <User className="text-white w-7 h-7" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="px-2.5 py-0.5 bg-error/10 text-error text-[10px] font-black rounded-lg">أولوية عالية</span>
                  <h3 className="font-black text-on-surface text-lg">{tickets[selectedTicket].user}</h3>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium justify-end mt-1">
                  <span>قيد المعالجة</span>
                  <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse" />
                  <span className="mr-2 text-outline-variant opacity-50">|</span>
                  <span className="ltr">#TKT-2041</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-surface-container-low hover:bg-surface-container rounded-2xl transition-colors">
                <Star className="w-5 h-5 text-outline hover:text-warning" />
              </button>
              <button className="p-3 bg-surface-container-low hover:bg-surface-container rounded-2xl transition-colors">
                <Settings className="w-5 h-5 text-outline" />
              </button>
              <button className="p-3 bg-surface-container-low hover:bg-error/5 group rounded-2xl transition-colors">
                <X className="w-5 h-5 text-outline group-hover:text-error" />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-[radial-gradient(circle_at_top_right,rgba(26,79,214,0.03),transparent)] custom-scrollbar">
            {/* System Info */}
            <div className="flex justify-center">
              <div className="bg-surface-container-low px-6 py-2 rounded-full border border-outline-variant/10 flex items-center gap-3">
                <LifeBuoy className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-on-surface-variant">تم فتح التذكرة بواسطة أحمد العتيبي يوم أمس الساعة ٩:٣٠ م</span>
              </div>
            </div>

            {/* User Message */}
            <div className="flex justify-end pr-10">
              <div className="flex flex-col items-end gap-2 max-w-[70%]">
                <div className="bg-white p-6 rounded-[2rem] rounded-tr-none shadow-xl shadow-surface-container-high/20 border border-outline-variant/10 text-on-surface relative text-right">
                  <p className="font-medium text-lg leading-relaxed">السلام عليكم، أحاول سحب مبلغ ٣٥٠٠ ريال من حسابي للمرة الثالثة وتظهر لي رسالة خطأ رقم ٩٠٢. هل يمكنكم المساعدة؟</p>
                </div>
                <div className="flex items-center gap-2 px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  <span>٩:٣٠ م</span>
                  <CheckCircle2 className="w-3 h-3 text-secondary" />
                </div>
              </div>
            </div>

            {/* Admin Response */}
            <div className="flex justify-start pl-10">
              <div className="flex flex-col items-start gap-2 max-w-[70%]">
                <div className="bg-primary text-white p-6 rounded-[2rem] rounded-tl-none shadow-2xl shadow-primary/20 leading-relaxed relative text-right">
                  <p className="font-bold text-lg">أهلاً بك يا أحمد، نعتذر لهذا العائق. الخطأ ٩٠٢ يشير عادةً لنقص في تحديث بيانات الحساب البنكي (الآيبان). سأتأكد من بياناتك الآن.</p>
                </div>
                <div className="flex items-center gap-2 px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3 text-primary opacity-50" />
                  <span>١٠:١٥ م</span>
                </div>
              </div>
            </div>

            {/* Typing Indicator */}
            <div className="flex justify-start pl-10 opacity-60">
              <div className="bg-surface-container p-4 rounded-3xl flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant">دعم نافس يكتب...</span>
              </div>
            </div>
          </div>

          {/* Message Input Container */}
          <div className="p-8 bg-white border-t border-outline-variant/10">
            {/* Quick Actions Bar */}
            <div className="flex gap-3 mb-4 flex-row-reverse">
              <button className="px-4 py-2 bg-surface-container-low rounded-xl text-[10px] font-black hover:bg-primary/5 hover:text-primary transition-all uppercase tracking-wider">طلب وثائق إضافية</button>
              <button className="px-4 py-2 bg-surface-container-low rounded-xl text-[10px] font-black hover:bg-primary/5 hover:text-primary transition-all uppercase tracking-wider">تحويل تذكرة</button>
              <button className="px-4 py-2 bg-surface-container-low rounded-xl text-[10px] font-black hover:bg-tertiary/10 hover:text-tertiary transition-all uppercase tracking-wider">إغلاق التذكرة</button>
            </div>
            
            <div className="bg-surface-container-lowest p-2 rounded-[2rem] border border-outline-variant/15 shadow-sm flex items-center gap-2 relative">
              <button className="p-4 bg-primary text-white rounded-[1.5rem] shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                <Send className="w-6 h-6 rotate-180" />
              </button>
              <input 
                type="text" 
                placeholder="اكتب ردك هنا..." 
                className="flex-1 bg-transparent px-4 py-2 font-bold text-on-surface outline-none text-right"
              />
              <div className="flex items-center gap-1 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl">
                <button className="p-2.5 text-on-surface-variant hover:text-primary transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2.5 text-on-surface-variant hover:text-primary transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2.5 text-on-surface-variant hover:text-primary transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Panel (Optional/Summary) */}
        <div className="hidden xl:flex w-[320px] flex-col gap-6">
          <div className="bg-surface-container-low rounded-[2.5rem] p-8 border border-outline-variant/10 text-right">
            <h5 className="font-black text-on-surface text-lg mb-6">تفاصيل العميل</h5>
            <div className="space-y-6">
              <div className="flex items-center gap-4 flex-row-reverse">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-outline-variant/10 shadow-sm">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant font-bold">الاسم الكامل</p>
                  <p className="font-bold text-on-surface">أحمد العتيبي</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-row-reverse">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-outline-variant/10 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant font-bold">حالة التوثيق</p>
                  <p className="font-bold text-on-surface">حساب موثق (أعمال)</p>
                </div>
              </div>
              <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 mt-4">
                <p className="text-xs text-primary font-black mb-2 uppercase tracking-widest">إحصائيات</p>
                <div className="flex justify-between flex-row-reverse mb-3">
                  <span className="text-sm font-bold text-on-surface">إجمالي الطلبات</span>
                  <span className="font-black text-primary">١٤٨</span>
                </div>
                <div className="flex justify-between flex-row-reverse">
                  <span className="text-sm font-bold text-on-surface">معدل الالتزام</span>
                  <span className="font-black text-primary">٩٨٪</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-[2.5rem] p-8 border border-outline-variant/10 text-right flex-1">
            <h5 className="font-black text-on-surface text-lg mb-6">الملاحظات الداخلية</h5>
            <div className="space-y-4">
              <div className="bg-white/50 p-4 rounded-2xl border border-outline-variant/10">
                <p className="text-xs text-on-surface-variant leading-relaxed text-right">العميل لديه سجل ممتاز ولكن واجه مشاكل تقنية مؤخراً في بوابة الدفع.</p>
                <p className="text-[10px] text-outline mt-2 font-bold tracking-tight">بواسطة: فهد (منذ أسبوع)</p>
              </div>
              <button className="w-full py-4 border-2 border-dashed border-outline-variant/30 rounded-2xl text-on-surface-variant font-bold text-sm hover:border-primary/30 hover:text-primary transition-all">اضافة ملاحظة جديدة</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
