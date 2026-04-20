"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Zap, Upload, X, Plus, DollarSign, Clock, FileText,
  Briefcase, Tag, AlertCircle, CheckCircle, ChevronDown
} from "lucide-react";

const CATEGORIES = [
  "تطوير الويب", "تطوير تطبيقات الجوال", "تصميم UI/UX", "تصميم جرافيك",
  "تسويق رقمي", "كتابة محتوى", "ترجمة", "تحليل بيانات", "تطوير ألعاب",
  "ذكاء اصطناعي", "أخرى",
];

const SKILL_SUGGESTIONS = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "Django", "Flutter",
  "Figma", "Photoshop", "Illustrator", "SEO", "Google Ads", "WordPress",
  "PostgreSQL", "MongoDB", "Docker", "AWS", "Firebase",
];

export default function CreateProjectPage() {
  const [form, setForm] = useState({
    title: "", description: "", category: "",
    budgetMin: "", budgetMax: "", duration: "",
    auctionDuration: "48",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Check role authorization on mount
  React.useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role !== "business_owner") {
          router.push("/dashboard");
          return;
        }

        setAuthorized(true);
      } catch (err) {
        console.error("Authorization check failed:", err);
        router.push("/dashboard");
      }
    };

    checkAuthorization();
  }, []);

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill) && skills.length < 10) {
      setSkills([...skills, skill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, 5));
    }
  };

  const isStep1Valid = form.title.trim().length >= 10 && form.description.trim().length >= 50 && form.category;
  const isStep2Valid = Number(form.budgetMin) > 0 && Number(form.budgetMax) >= Number(form.budgetMin) && form.duration && skills.length > 0;

  const handlePublish = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("يجب تسجيل الدخول لنشر المشروع");

      // Upload files if any
      const attachmentUrls: string[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('project-attachments') // Assuming this bucket exists
            .upload(filePath, file);
            
          if (!uploadError) {
            const { data } = supabase.storage.from('project-attachments').getPublicUrl(filePath);
            attachmentUrls.push(data.publicUrl);
          }
        }
      }

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + parseInt(form.duration || "0"));

      const { error: insertError } = await supabase
        .from('projects')
        .insert({
          title: form.title,
          description: form.description,
          category: form.category,
          budget_min: Number(form.budgetMin),
          budget_max: Number(form.budgetMax),
          skills: skills,
          deadline: deadline.toISOString(),
          client_id: user.id,
          status: 'open',
          currency: 'SAR',
        });

      if (insertError) throw insertError;

      router.push("/projects");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ أثناء نشر المشروع");
    } finally {
      setLoading(false);
    }
  };

  // Guard: Show loading or unauthorized message during auth check
  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-[#8892A4] mb-4" />
        <h2 className="text-xl font-black text-[#0A0E1A]">جاري التحقق من الصلاحيات...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Header */}
      <div className="text-right mb-8">
        <div className="flex items-center gap-2 flex-row-reverse mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1A4FD6, #00C2A8)" }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-black" style={{ color: "#0A0E1A" }}>إنشاء مشروع جديد</h1>
        </div>
        <p className="text-sm" style={{ color: "#8892A4" }}>أنشئ مشروعك وسيتنافس المستقلون لتقديم أفضل عرض</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-3 mb-10 flex-row-reverse">
        {[
          { num: 1, label: "تفاصيل المشروع" },
          { num: 2, label: "الميزانية والمهارات" },
          { num: 3, label: "المراجعة والنشر" },
        ].map((s, i) => (
          <React.Fragment key={s.num}>
            <button
              onClick={() => s.num < step && setStep(s.num)}
              className="flex items-center gap-2 flex-row-reverse"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all"
                style={{
                  background: step >= s.num ? "#1A4FD6" : "#F0F3FA",
                  color: step >= s.num ? "white" : "#8892A4",
                }}
              >
                {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
              </div>
              <span className="text-sm font-bold hidden md:block" style={{ color: step >= s.num ? "#0A0E1A" : "#8892A4" }}>
                {s.label}
              </span>
            </button>
            {i < 2 && <div className="flex-1 h-0.5 rounded-full" style={{ background: step > s.num + 1 ? "#1A4FD6" : "#E8ECF4" }} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: "#E8ECF4" }}>
        {/* Step 1: Project Details */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-sm font-bold text-right mb-2" style={{ color: "#3D4560" }}>عنوان المشروع *</label>
              <input
                className="w-full px-4 py-3 rounded-xl border text-right outline-none text-sm"
                placeholder="مثال: تطوير تطبيق جوال لتوصيل الطعام (10 حروف على الأقل)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ borderColor: "#E8ECF4", fontFamily: "'Cairo', sans-serif" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#1A4FD6"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#E8ECF4"; }}
              />
              {form.title.length > 0 && form.title.trim().length < 10 && (
                <p className="text-xs text-red-500 text-right mt-1">يجب أن يكون العنوان 10 حروف على الأقل</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-right mb-2" style={{ color: "#3D4560" }}>وصف المشروع التفصيلي *</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border text-right outline-none text-sm resize-none"
                placeholder="اشرح متطلبات مشروعك بالتفصيل... ما الذي تحتاجه بالضبط؟ ما هي النتائج المتوقعة؟ (50 حرف على الأقل)"
                rows={6}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ borderColor: "#E8ECF4", fontFamily: "'Cairo', sans-serif" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#1A4FD6"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#E8ECF4"; }}
              />
              <div className="flex justify-between items-center mt-1">
                <p className={`text-xs text-left ${form.description.length > 0 && form.description.length < 50 ? 'text-red-500' : 'text-[#8892A4]'}`}>
                  {form.description.length > 0 && form.description.length < 50 ? 'يجب أن يكون الوصف 50 حرفًا على الأقل' : `${form.description.length}/2000`}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-right mb-2" style={{ color: "#3D4560" }}>تصنيف المشروع *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setForm({ ...form, category: cat })}
                    className="px-4 py-3 rounded-xl text-sm font-bold text-right transition-all"
                    style={{
                      background: form.category === cat ? "#EEF3FF" : "white",
                      border: `1.5px solid ${form.category === cat ? "#1A4FD6" : "#E8ECF4"}`,
                      color: form.category === cat ? "#1A4FD6" : "#3D4560",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold text-right mb-2" style={{ color: "#3D4560" }}>مرفقات (اختياري)</label>
              <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-[#FAFBFF] transition-all relative" style={{ borderColor: "#E8ECF4" }}>
                <input 
                  type="file" 
                  multiple 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleFileChange}
                />
                <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: "#8892A4" }} />
                <p className="text-sm font-bold" style={{ color: "#3D4560" }}>اسحب الملفات هنا أو انقر للرفع</p>
                <p className="text-xs mt-1" style={{ color: "#8892A4" }}>PDF, DOC, PNG, JPG — حتى 10MB (الحد الأقصى 5 ملفات)</p>
              </div>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-[#F5F7FC] rounded-lg text-sm font-semibold text-[#3D4560] border border-[#E8ECF4]">
                      <button onClick={() => setFiles(files.filter((_, index) => index !== i))} className="text-red-500 hover:text-red-700 transition-colors bg-white p-1 rounded-md shadow-sm">
                        <X className="w-4 h-4" />
                      </button>
                      <span className="truncate ml-4 flex-1 text-right">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => isStep1Valid && setStep(2)}
              disabled={!isStep1Valid}
              className="w-full py-4 rounded-xl font-bold text-white transition-all text-sm"
              style={{
                background: isStep1Valid ? "linear-gradient(135deg, #1A4FD6, #2563EB)" : "#E8ECF4",
                color: isStep1Valid ? "white" : "#8892A4",
                cursor: isStep1Valid ? "pointer" : "not-allowed",
              }}
            >
              التالي: الميزانية والمهارات
            </button>
          </div>
        )}

        {/* Step 2: Budget & Skills */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-right mb-2" style={{ color: "#3D4560" }}>الحد الأدنى (ج.م) *</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-4 py-3 pr-10 rounded-xl border text-right outline-none text-sm"
                    placeholder="3000"
                    value={form.budgetMin}
                    onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                    style={{ borderColor: "#E8ECF4" }}
                  />
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8892A4" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-right mb-2" style={{ color: "#3D4560" }}>الحد الأقصى (ج.م) *</label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-4 py-3 pr-10 rounded-xl border text-right outline-none text-sm"
                    placeholder="8000"
                    value={form.budgetMax}
                    onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                    style={{ borderColor: "#E8ECF4" }}
                  />
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8892A4" }} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-right mb-2" style={{ color: "#3D4560" }}>مدة التنفيذ *</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border text-right outline-none text-sm appearance-none"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  style={{ borderColor: "#E8ECF4", fontFamily: "'Cairo'" }}
                >
                  <option value="">اختر المدة</option>
                  <option value="7">أسبوع واحد</option>
                  <option value="14">أسبوعين</option>
                  <option value="30">شهر</option>
                  <option value="60">شهرين</option>
                  <option value="90">3 أشهر</option>
                  <option value="180">6 أشهر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-right mb-2" style={{ color: "#3D4560" }}>مدة المزاد</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border text-right outline-none text-sm appearance-none"
                  value={form.auctionDuration}
                  onChange={(e) => setForm({ ...form, auctionDuration: e.target.value })}
                  style={{ borderColor: "#E8ECF4", fontFamily: "'Cairo'" }}
                >
                  <option value="24">24 ساعة</option>
                  <option value="48">48 ساعة</option>
                  <option value="72">72 ساعة</option>
                  <option value="168">أسبوع</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-bold text-right mb-2" style={{ color: "#3D4560" }}>المهارات المطلوبة * ({skills.length}/10)</label>
              <div className="flex gap-2 flex-row-reverse mb-3">
                <input
                  className="flex-1 px-4 py-3 rounded-xl border text-right outline-none text-sm"
                  placeholder="أضف مهارة..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(skillInput))}
                  style={{ borderColor: "#E8ECF4" }}
                />
                <button onClick={() => addSkill(skillInput)} className="px-4 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "#1A4FD6" }}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {/* Selected Skills */}
              <div className="flex flex-wrap gap-2 mb-3 justify-end">
                {skills.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: "#EEF3FF", color: "#1A4FD6" }}>
                    <button onClick={() => removeSkill(s)}><X className="w-3 h-3" /></button>
                    {s}
                  </span>
                ))}
              </div>
              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5 justify-end">
                {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
                  <button key={s} onClick={() => addSkill(s)} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#EEF3FF]" style={{ background: "#F5F7FC", color: "#8892A4" }}>
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl text-sm font-bold" style={{ background: "#F5F7FC", color: "#3D4560" }}>
                رجوع
              </button>
              <button
                onClick={() => isStep2Valid && setStep(3)}
                disabled={!isStep2Valid}
                className="flex-[2] py-3.5 rounded-xl text-sm font-bold text-white"
                style={{ background: isStep2Valid ? "linear-gradient(135deg, #1A4FD6, #2563EB)" : "#E8ECF4", color: isStep2Valid ? "white" : "#8892A4" }}
              >
                التالي: مراجعة ونشر
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Publish */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1A4FD6, #00C2A8)" }}>
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-black" style={{ color: "#0A0E1A" }}>مراجعة مشروعك</h2>
              <p className="text-sm" style={{ color: "#8892A4" }}>تحقق من التفاصيل قبل نشر المشروع</p>
            </div>

            {/* Summary Card */}
            <div className="rounded-xl p-6" style={{ background: "#FAFBFF", border: "1px solid #E8ECF4" }}>
              <div className="space-y-4 text-right">
                <div className="flex justify-between items-start flex-row-reverse">
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: "#8892A4" }}>العنوان</p>
                    <p className="font-black" style={{ color: "#0A0E1A" }}>{form.title}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-bold" style={{ color: "#1A4FD6" }}>تعديل</button>
                </div>
                <div style={{ borderTop: "1px solid #E8ECF4" }} className="pt-3">
                  <p className="text-xs font-bold mb-0.5" style={{ color: "#8892A4" }}>الوصف</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#3D4560" }}>{form.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3" style={{ borderTop: "1px solid #E8ECF4" }}>
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: "#8892A4" }}>التصنيف</p>
                    <p className="text-sm font-bold" style={{ color: "#0A0E1A" }}>{form.category}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: "#8892A4" }}>الميزانية</p>
                    <p className="text-sm font-bold" style={{ color: "#1A4FD6" }}>{form.budgetMin} - {form.budgetMax} ج.م</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: "#8892A4" }}>مدة التنفيذ</p>
                    <p className="text-sm font-bold" style={{ color: "#0A0E1A" }}>{form.duration} يوم</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-0.5" style={{ color: "#8892A4" }}>مدة المزاد</p>
                    <p className="text-sm font-bold" style={{ color: "#0A0E1A" }}>{form.auctionDuration} ساعة</p>
                  </div>
                </div>
                <div className="pt-3" style={{ borderTop: "1px solid #E8ECF4" }}>
                  <p className="text-xs font-bold mb-2" style={{ color: "#8892A4" }}>المهارات المطلوبة</p>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {skills.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-lg text-xs font-bold" style={{ background: "#EEF3FF", color: "#1A4FD6" }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl flex-row-reverse" style={{ background: "#E6FAF8" }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#00C2A8" }} />
              <p className="text-xs text-right leading-relaxed" style={{ color: "#3D4560" }}>
                بمجرد نشر المشروع، سيبدأ المزاد وسيتمكن المستقلون من تقديم عروضهم. يمكنك تعديل التفاصيل خلال أول ساعة من النشر.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold text-right border border-red-100">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-xl text-sm font-bold" style={{ background: "#F5F7FC", color: "#3D4560" }}>
                رجوع
              </button>
              <button
                onClick={handlePublish}
                disabled={loading}
                className="flex-[2] py-4 rounded-xl text-sm font-black text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #1A4FD6, #00C2A8)", opacity: loading ? 0.7 : 1, boxShadow: "0 8px 24px rgba(26,79,214,0.3)" }}
              >
                {loading ? "جاري النشر..." : "🚀 نشر المشروع وبدء المزاد"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
