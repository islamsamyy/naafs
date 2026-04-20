"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  User, Mail, Lock, Bell, Shield, Camera, Eye, EyeOff,
  CreditCard, Save, Trash2, LogOut, Plus, X, Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

const TABS = [
  { id: "profile", label: "الملف الشخصي", icon: <User className="w-4 h-4" /> },
  { id: "security", label: "الأمان", icon: <Shield className="w-4 h-4" /> },
  { id: "notifications", label: "الإشعارات", icon: <Bell className="w-4 h-4" /> },
  { id: "billing", label: "الفوترة", icon: <CreditCard className="w-4 h-4" /> },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    bio: "",
    hourlyRate: "",
    avatar_url: "",
    title: "",
    skills: [] as string[],
  });

  const [notifications, setNotifications] = useState({
    emailBids: true, emailMessages: true, emailPayments: true,
    pushBids: true, pushMessages: true, pushPayments: false,
    weeklyReport: true, marketing: false,
  });

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (p) {
        setProfile({
          id: user.id,
          name: p.name || "",
          email: user.email || "",
          bio: p.bio || "",
          hourlyRate: p.hourly_rate?.toString() || "",
          avatar_url: p.avatar_url || "",
          title: p.title || "",
          skills: Array.isArray(p.skills) ? p.skills : [],
        });
      } else {
        setProfile((prev) => ({ ...prev, id: user.id, email: user.email || "" }));
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile.id) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("الحجم الأقصى للصورة هو 5MB");
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", profile.id);

      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Upload failed");
      }

      const { avatar_url } = await res.json();
      setProfile((prev) => ({ ...prev, avatar_url }));
    } catch (err) {
      console.error(err);
      toast.error("فشل رفع الصورة، يرجى المحاولة مرة أخرى");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    const { error } = await supabase.from("profiles").upsert({
      id: profile.id,
      name: profile.name,
      bio: profile.bio,
      title: profile.title,
      hourly_rate: profile.hourlyRate ? parseFloat(profile.hourlyRate) : null,
      skills: profile.skills,
    });

    setSaving(false);
    if (error) {
      setSaveMsg("حدث خطأ أثناء الحفظ");
    } else {
      setSaveMsg("تم حفظ التغييرات بنجاح ✓");
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.next !== passwords.confirm) {
      toast.warning("كلمتا المرور غير متطابقتين");
      return;
    }
    if (passwords.next.length < 8) {
      toast.warning("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwords.next });
    if (error) toast.error("فشل تغيير كلمة المرور: " + error.message);
    else {
      toast.success("تم تغيير كلمة المرور بنجاح");
      setPasswords({ current: "", next: "", confirm: "" });
    }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || profile.skills.includes(s)) return;
    setProfile((prev) => ({ ...prev, skills: [...prev.skills, s] }));
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  const initials = profile.name
    ? profile.name.split(" ").slice(0, 2).map((w) => w[0]).join("")
    : "؟";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#1A4FD6" }} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="text-right mb-8">
        <h1 className="text-3xl font-black mb-1" style={{ color: "#0A0E1A" }}>الإعدادات</h1>
        <p className="text-sm" style={{ color: "#8892A4" }}>إدارة حسابك وتفضيلاتك</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 flex-row-reverse">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-row-reverse"
            style={{
              background: activeTab === tab.id ? "#1A4FD6" : "#FFFFFF",
              color: activeTab === tab.id ? "#FFFFFF" : "#3D4560",
              border: `1px solid ${activeTab === tab.id ? "#1A4FD6" : "#E8ECF4"}`,
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="bg-white rounded-2xl p-6 border text-right" style={{ borderColor: "#E8ECF4" }}>
            <h2 className="text-lg font-black mb-4" style={{ color: "#0A0E1A" }}>الصورة الشخصية</h2>
            <div className="flex items-center gap-5 flex-row-reverse">
              <div className="relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white"
                    style={{ background: "linear-gradient(135deg, #1A4FD6, #00C2A8)" }}
                  >
                    {initials}
                  </div>
                )}
                <button
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-md hover:bg-blue-50 transition-colors disabled:opacity-50"
                  style={{ borderColor: "#E8ECF4" }}
                  title="تغيير الصورة"
                >
                  {uploadingAvatar
                    ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#1A4FD6" }} />
                    : <Camera className="w-4 h-4" style={{ color: "#1A4FD6" }} />
                  }
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <p className="font-bold" style={{ color: "#0A0E1A" }}>{profile.name || "اسم المستخدم"}</p>
                <p className="text-sm" style={{ color: "#8892A4" }}>PNG, JPG — حتى 5MB</p>
                <button
                  onClick={handleAvatarClick}
                  className="mt-2 text-xs font-bold underline"
                  style={{ color: "#1A4FD6" }}
                >
                  {profile.avatar_url ? "تغيير الصورة" : "رفع صورة"}
                </button>
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-2xl p-6 border text-right" style={{ borderColor: "#E8ECF4" }}>
            <h2 className="text-lg font-black mb-6" style={{ color: "#0A0E1A" }}>المعلومات الشخصية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "الاسم الكامل", key: "name", type: "text", icon: <User className="w-4 h-4" /> },
                { label: "البريد الإلكتروني", key: "email", type: "email", icon: <Mail className="w-4 h-4" />, disabled: true },
                { label: "المسمى الوظيفي", key: "title", type: "text", icon: <User className="w-4 h-4" /> },
                { label: "السعر/الساعة ($)", key: "hourlyRate", type: "number", icon: <CreditCard className="w-4 h-4" /> },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: "#3D4560" }}>{f.label}</label>
                  <div className="relative">
                    <input
                      type={f.type}
                      value={profile[f.key as keyof typeof profile] as string}
                      disabled={(f as any).disabled}
                      onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 pr-10 rounded-xl border text-right outline-none text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                      style={{ borderColor: "#E8ECF4", fontFamily: "'Cairo'" }}
                      onFocus={(e) => { if (!(f as any).disabled) e.currentTarget.style.borderColor = "#1A4FD6"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "#E8ECF4"; }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#8892A4" }}>{f.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="mt-5">
              <label className="block text-sm font-bold mb-1.5" style={{ color: "#3D4560" }}>نبذة تعريفية</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border text-right outline-none text-sm resize-none"
                style={{ borderColor: "#E8ECF4", fontFamily: "'Cairo'" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#1A4FD6"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#E8ECF4"; }}
              />
            </div>

            {/* Skills */}
            <div className="mt-5">
              <label className="block text-sm font-bold mb-2" style={{ color: "#3D4560" }}>المهارات</label>
              <div className="flex flex-wrap gap-2 mb-3 flex-row-reverse">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold flex-row-reverse"
                    style={{ background: "#EEF3FF", color: "#1A4FD6" }}
                  >
                    <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                    {skill}
                  </span>
                ))}
                {profile.skills.length === 0 && (
                  <span className="text-xs" style={{ color: "#8892A4" }}>لم تضف مهارات بعد</span>
                )}
              </div>
              <div className="flex gap-2 flex-row-reverse">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  placeholder="مثال: React, Python, Figma..."
                  className="flex-1 px-4 py-2.5 rounded-xl border text-right outline-none text-sm"
                  style={{ borderColor: "#E8ECF4", fontFamily: "'Cairo'" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#1A4FD6"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#E8ECF4"; }}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-1"
                  style={{ background: "#1A4FD6" }}
                >
                  <Plus className="w-4 h-4" /> إضافة
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4 flex-row-reverse">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 flex-row-reverse disabled:opacity-70 disabled:scale-100"
                style={{ background: "linear-gradient(135deg, #1A4FD6, #2563EB)" }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                حفظ التغييرات
              </button>
              {saveMsg && (
                <span className="text-sm font-bold" style={{ color: saveMsg.includes("خطأ") ? "#DC2626" : "#00C2A8" }}>
                  {saveMsg}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border text-right" style={{ borderColor: "#E8ECF4" }}>
            <h2 className="text-lg font-black mb-6" style={{ color: "#0A0E1A" }}>تغيير كلمة المرور</h2>
            <div className="space-y-4 max-w-md">
              {[
                { label: "كلمة المرور الجديدة", key: "next", placeholder: "8 أحرف على الأقل" },
                { label: "تأكيد كلمة المرور", key: "confirm", placeholder: "أعد كتابة كلمة المرور" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: "#3D4560" }}>{f.label}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={f.placeholder}
                      value={passwords[f.key as keyof typeof passwords]}
                      onChange={(e) => setPasswords({ ...passwords, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border text-right outline-none text-sm"
                      style={{ borderColor: "#E8ECF4" }}
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#8892A4" }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={handlePasswordChange}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white flex-row-reverse"
                style={{ background: "#1A4FD6" }}
              >
                <Lock className="w-4 h-4" /> تحديث كلمة المرور
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border text-right" style={{ borderColor: "#FEE2E2" }}>
            <h2 className="text-lg font-black mb-2" style={{ color: "#DC2626" }}>منطقة الخطر</h2>
            <p className="text-sm mb-4" style={{ color: "#8892A4" }}>هذه الإجراءات لا يمكن التراجع عنها</p>
            <div className="flex gap-3 flex-row-reverse">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border flex-row-reverse" style={{ borderColor: "#FEE2E2", color: "#DC2626" }}>
                <Trash2 className="w-4 h-4" /> حذف الحساب
              </button>
              <button
                onClick={() => supabase.auth.signOut().then(() => window.location.href = "/")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border flex-row-reverse"
                style={{ borderColor: "#E8ECF4", color: "#3D4560" }}
              >
                <LogOut className="w-4 h-4" /> تسجيل الخروج من جميع الأجهزة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-2xl p-6 border text-right" style={{ borderColor: "#E8ECF4" }}>
          <h2 className="text-lg font-black mb-6" style={{ color: "#0A0E1A" }}>تفضيلات الإشعارات</h2>
          <div className="space-y-5">
            {[
              { section: "البريد الإلكتروني", items: [
                { key: "emailBids", label: "العروض الجديدة على مشاريعي" },
                { key: "emailMessages", label: "الرسائل المباشرة" },
                { key: "emailPayments", label: "المدفوعات والتحويلات" },
              ]},
              { section: "إشعارات الهاتف", items: [
                { key: "pushBids", label: "تحديثات المزادات" },
                { key: "pushMessages", label: "الرسائل الفورية" },
                { key: "pushPayments", label: "تنبيهات الدفع" },
              ]},
              { section: "تقارير ونشرات", items: [
                { key: "weeklyReport", label: "تقرير الأداء الأسبوعي" },
                { key: "marketing", label: "عروض وأخبار نافِس" },
              ]},
            ].map((group) => (
              <div key={group.section}>
                <h3 className="text-sm font-black mb-3" style={{ color: "#3D4560" }}>{group.section}</h3>
                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.key} className="flex items-center justify-between flex-row-reverse p-3 rounded-xl" style={{ background: "#FAFBFF" }}>
                      <span className="text-sm" style={{ color: "#0A0E1A" }}>{item.label}</span>
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                        className="w-11 h-6 rounded-full relative transition-all"
                        style={{ background: notifications[item.key as keyof typeof notifications] ? "#1A4FD6" : "#E8ECF4" }}
                      >
                        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all" style={{ left: notifications[item.key as keyof typeof notifications] ? "2px" : "calc(100% - 22px)" }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border text-right" style={{ borderColor: "#E8ECF4" }}>
            <h2 className="text-lg font-black mb-4" style={{ color: "#0A0E1A" }}>طرق الدفع</h2>
            <p className="text-sm" style={{ color: "#8892A4" }}>لا توجد طرق دفع مضافة حتى الآن</p>
            <button className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border flex-row-reverse" style={{ borderColor: "#E8ECF4", color: "#1A4FD6" }}>
              <CreditCard className="w-4 h-4" /> إضافة طريقة دفع جديدة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
