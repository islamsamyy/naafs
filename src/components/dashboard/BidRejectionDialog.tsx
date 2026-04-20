import React, { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/common/Toast';
import { createClient } from '@/lib/supabase/client';

interface BidRejectionDialogProps {
  bid: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BidRejectionDialog({ bid, isOpen, onClose, onSuccess }: BidRejectionDialogProps) {
  const [rejecting, setRejecting] = useState(false);
  const toast = useToast();

  if (!isOpen || !bid) return null;

  const handleRejectBid = async () => {
    setRejecting(true);
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('id', bid.id);

      if (error) throw error;

      toast.show('success', `تم رفض عرض ${bid.freelancer?.name} بنجاح`, 3000);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.show('error', 'فشل رفض العرض: ' + (err as Error).message, 3000);
    } finally {
      setRejecting(false);
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
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <h2 className="text-2xl font-black text-center mb-3">هل أنت متأكد؟</h2>
        <p className="text-[#8892A4] text-center mb-8">
          هل تريد رفض عرض <span className="font-black text-[#0A0E1A]">{bid.freelancer?.name}</span>؟
          <br />
          <span className="text-primary font-black block mt-1">{bid.amount?.toLocaleString()} ج</span>
        </p>

        <div className="flex gap-3 flex-row-reverse">
          <button
            onClick={handleRejectBid}
            disabled={rejecting}
            className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {rejecting && <Loader2 className="w-4 h-4 animate-spin" />}
            رفض العرض
          </button>
          <button
            onClick={onClose}
            disabled={rejecting}
            className="flex-1 py-3 bg-[#F0F4F8] text-[#0A0E1A] rounded-xl font-black hover:bg-[#E2E8F0] transition-all active:scale-95 disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
