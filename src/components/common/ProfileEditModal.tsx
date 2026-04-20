"use client";

import React, { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { createClient } from "@/lib/supabase/client";

interface ProfileEditModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (updatedUser: any) => void;
}

export default function ProfileEditModal({
  user,
  isOpen,
  onClose,
  onSaveSuccess,
}: ProfileEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar_url: user?.avatar_url || "",
    hourly_rate: user?.hourly_rate || 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  if (!isOpen) return null;

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      avatar_url: url,
    }));
    setError(null);
  };

  const handleImageError = (error: string) => {
    setError(error);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "hourly_rate" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setSuccess(true);
      onSaveSuccess?.(data);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-[#0A0E1A]/40 backdrop-blur-xl animate-fade-in" 
        onClick={onClose}
      />
      
      <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(26,79,214,0.3)] max-w-lg w-full relative z-10 overflow-hidden border border-[#1A4FD6]/10 animate-fade-in-scale">
        <style jsx>{`
          .premium-input {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            transition: all 0.3s ease;
          }
          .premium-input:focus {
            background: #FFFFFF;
            border-color: #1A4FD6;
            box-shadow: 0 0 0 4px rgba(26, 79, 214, 0.05);
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-[#F1F5F9]">
          <div className="text-right">
            <h2 className="text-2xl font-black text-[#0A0E1A] tracking-tight">إعدادات الهوية الرقمية</h2>
            <p className="text-[10px] font-black text-[#8892A4] uppercase tracking-widest mt-1">Profile Configuration</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#64748B] hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-10 py-8 space-y-8" dir="rtl">
          {/* Messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[11px] font-black text-red-600 flex items-center gap-3 animate-slide-in-up">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-2xl text-[11px] font-black text-accent flex items-center gap-3 animate-slide-in-up">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              تم مزامنة البيانات بنجاح
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center">
              <label className="text-xs font-black text-[#8892A4] uppercase tracking-widest mb-6 w-full text-right">
                السمت الشخصي (Avatar)
              </label>
              <div className="relative group/avatar">
                 <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-accent rounded-[2.5rem] blur-lg opacity-20 group-hover/avatar:opacity-40 transition-opacity" />
                 <ImageUpload
                   onUploadSuccess={handleImageUpload}
                   onUploadError={handleImageError}
                   currentImageUrl={formData.avatar_url}
                   bucket="profile-avatars"
                   maxSize={5}
                 />
              </div>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-3">
                <label htmlFor="name" className="text-xs font-black text-[#0A0E1A] mr-2">
                  الاسم الكامل
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-14 px-6 rounded-2xl premium-input outline-none font-bold text-sm"
                  placeholder="مثال: أحمد المحمدي"
                  disabled={loading}
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-3">
                <label htmlFor="bio" className="text-xs font-black text-[#0A0E1A] mr-2">
                  النبذة المهنية
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-6 rounded-2xl premium-input outline-none font-bold text-sm resize-none"
                  placeholder="حدثنا عن خبراتك..."
                  disabled={loading}
                />
              </div>

              {/* Hourly Rate (Conditional or for all for now) */}
              <div className="space-y-3">
                <label htmlFor="hourly_rate" className="text-xs font-black text-[#0A0E1A] mr-2">
                  التكلفة التقديرية (بالساعة)
                </label>
                <div className="relative">
                  <input
                    id="hourly_rate"
                    name="hourly_rate"
                    type="number"
                    step="0.01"
                    value={formData.hourly_rate}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-2xl premium-input outline-none font-black text-sm tabular-nums"
                    disabled={loading}
                  />
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#8892A4] uppercase">EGP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-14 border border-[#E2E8F0] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#64748B] hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] h-14 bg-[#0A0E1A] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:bg-primary transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  برمجة التعديلات...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  حفظ الهوية
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>

  );
}
