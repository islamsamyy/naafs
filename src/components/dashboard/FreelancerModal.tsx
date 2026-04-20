import React, { useState } from 'react';
import { Star, Mail, ExternalLink, Loader2 } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';
import { useToast } from '@/components/common/Toast';

interface FreelancerModalProps {
  freelancer: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function FreelancerModal({ freelancer, isOpen, onClose }: FreelancerModalProps) {
  const [sendingMessage, setSendingMessage] = useState(false);
  const toast = useToast();

  if (!isOpen || !freelancer) return null;

  const handleSendMessage = async () => {
    setSendingMessage(true);
    try {
      toast.show('info', 'سيتم إضافة الرسائل قريباً', 3000);
    } catch (err) {
      toast.show('error', 'حدث خطأ', 3000);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-right">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 flex-row-reverse">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4 flex-row-reverse">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-primary/20 flex-shrink-0">
                  <OptimizedImage
                    src={freelancer.avatar_url}
                    alt={freelancer.name}
                    width={96}
                    height={96}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black mb-1">{freelancer.name}</h2>
                  <p className="text-primary font-black text-sm mb-2">{freelancer.title || 'محترف'}</p>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-black text-sm">{freelancer.rating || 0}</span>
                    </div>
                    <span className="text-[#8892A4] text-xs">
                      ({freelancer.reviews_count || 0} تقييم)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-2xl text-[#8892A4] hover:text-[#0A0E1A] flex-shrink-0 transition-colors"
              aria-label="إغلاق"
            >
              ×
            </button>
          </div>

          {/* Bio */}
          {freelancer.bio && (
            <div className="mb-8">
              <p className="text-[10px] text-[#8892A4] font-black mb-2 uppercase">السيرة الذاتية</p>
              <p className="text-[#0A0E1A] leading-relaxed">{freelancer.bio}</p>
            </div>
          )}

          {/* Skills */}
          {freelancer.skills && freelancer.skills.length > 0 && (
            <div className="mb-8">
              <p className="text-[10px] text-[#8892A4] font-black mb-3 uppercase">المهارات</p>
              <div className="flex gap-2 flex-wrap flex-row-reverse">
                {freelancer.skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-black"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rate */}
          {freelancer.hourly_rate && (
            <div className="mb-8 p-4 bg-blue-50 rounded-2xl">
              <p className="text-[10px] text-[#8892A4] font-black mb-1 uppercase">السعر بالساعة</p>
              <p className="text-2xl font-black text-primary">
                {freelancer.hourly_rate.toLocaleString()} ج
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 flex-row-reverse">
            <button
              onClick={handleSendMessage}
              disabled={sendingMessage}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-black hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
            >
              {sendingMessage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              إرسال رسالة
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-[#F0F4F8] text-[#0A0E1A] rounded-xl font-black hover:bg-[#E2E8F0] transition-all active:scale-95"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
