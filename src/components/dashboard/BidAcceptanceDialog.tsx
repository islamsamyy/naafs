import React, { useState } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/common/Toast';
import { createClient } from '@/lib/supabase/client';

interface BidAcceptanceDialogProps {
  bid: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BidAcceptanceDialog({ bid, isOpen, onClose, onSuccess }: BidAcceptanceDialogProps) {
  const [accepting, setAccepting] = useState(false);
  const toast = useToast();

  if (!isOpen || !bid) return null;

  const handleAcceptBid = async () => {
    if (!bid || !bid.project) {
      toast.show('error', 'خطأ: لم يتم العثور على المشروع', 3000);
      return;
    }

    setAccepting(true);
    try {
      const supabase = createClient();

      const { data: existingBids } = await supabase
        .from('bids')
        .select('id')
        .eq('project_id', bid.project.id)
        .eq('status', 'accepted')
        .single();

      if (existingBids) {
        toast.show('warning', 'تم بالفعل قبول عرض لهذا المشروع', 3000);
        onClose();
        return;
      }

      const { error: bidError } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bid.id);

      if (bidError) throw bidError;

      const { error: projError } = await supabase
        .from('projects')
        .update({
          status: 'in_progress',
          awarded_freelancer_id: bid.freelancer_id
        })
        .eq('id', bid.project.id);

      if (projError) throw projError;

      await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('project_id', bid.project.id)
        .neq('id', bid.id)
        .eq('status', 'pending');

      toast.show('success', 'تم قبول العرض بنجاح!', 3000);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.show('error', 'فشل قبول العرض: ' + (err as Error).message, 3000);
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-center mb-3">قبول العرض</h2>
        <p className="text-[#8892A4] text-center mb-2">
          هل تريد قبول عرض <span className="font-black text-[#0A0E1A]">{bid.freelancer?.name}</span>
        </p>
        <p className="text-center mb-8">
          <span className="text-primary font-black text-lg block mt-2">{bid.amount?.toLocaleString()} ج</span>
          <span className="text-[#8892A4] text-sm">في المشروع: {bid.project?.title}</span>
        </p>

        <div className="flex gap-3 flex-row-reverse">
          <button
            onClick={handleAcceptBid}
            disabled={accepting}
            className="flex-1 py-3 bg-green-500 text-white rounded-xl font-black hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {accepting && <Loader2 className="w-4 h-4 animate-spin" />}
            نعم، أقبل العرض
          </button>
          <button
            onClick={onClose}
            disabled={accepting}
            className="flex-1 py-3 bg-[#F0F4F8] text-[#0A0E1A] rounded-xl font-black hover:bg-[#E2E8F0] transition-all active:scale-95 disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
