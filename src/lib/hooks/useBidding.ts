import { useState, useCallback } from 'react';
import * as bidService from '@/lib/services/bidService';
import { useToast } from '@/components/common/Toast';

export function useBidding() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [bids, setBids] = useState<any[]>([]);

  const submitBid = useCallback(
    async (data: {
      project_id: string;
      freelancer_id: string;
      amount: number;
      delivery_time: string;
      message: string;
    }) => {
      setLoading(true);
      try {
        const bid = await bidService.submitBid(data);
        if (bid) {
          toast.show('success', 'تم إرسال العرض بنجاح', 3000);
          return bid;
        } else {
          toast.show('error', 'فشل إرسال العرض', 3000);
          return null;
        }
      } catch (error) {
        console.error('Error submitting bid:', error);
        toast.show('error', 'حدث خطأ', 3000);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const acceptBid = useCallback(
    async (bidId: string, projectId: string) => {
      setLoading(true);
      try {
        const bid = await bidService.acceptBid(bidId, projectId);
        if (bid) {
          toast.show('success', 'تم قبول العرض بنجاح', 3000);
          return bid;
        } else {
          toast.show('error', 'فشل قبول العرض', 3000);
          return null;
        }
      } catch (error) {
        console.error('Error accepting bid:', error);
        toast.show('error', 'حدث خطأ', 3000);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const rejectBid = useCallback(
    async (bidId: string) => {
      setLoading(true);
      try {
        const bid = await bidService.rejectBid(bidId);
        if (bid) {
          toast.show('success', 'تم رفض العرض', 3000);
          return bid;
        } else {
          toast.show('error', 'فشل رفض العرض', 3000);
          return null;
        }
      } catch (error) {
        console.error('Error rejecting bid:', error);
        toast.show('error', 'حدث خطأ', 3000);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return {
    loading,
    bids,
    setBids,
    submitBid,
    acceptBid,
    rejectBid,
  };
}
