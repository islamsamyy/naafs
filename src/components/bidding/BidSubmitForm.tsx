"use client";
import React, { useState } from "react";
import { useToast } from "@/components/common/Toast";
import * as bidService from "@/lib/services/bidService";

interface BidSubmitFormProps {
  projectId: string;
  freelancerId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function BidSubmitForm({
  projectId,
  freelancerId,
  onSuccess,
  onClose,
}: BidSubmitFormProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    delivery_time: "7",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.show('error', 'أدخل مبلغًا صحيحًا', 3000);
      return;
    }

    setLoading(true);
    try {
      const bid = await bidService.submitBid({
        project_id: projectId,
        freelancer_id: freelancerId,
        amount: parseFloat(formData.amount),
        delivery_time: formData.delivery_time,
        message: formData.message,
      });

      if (bid) {
        toast.show('success', 'تم إرسال العرض بنجاح', 3000);
        setFormData({ amount: "", delivery_time: "7", message: "" });
        onSuccess?.();
      } else {
        toast.show('error', 'فشل إرسال العرض', 3000);
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast.show('error', 'حدث خطأ', 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          المبلغ المطلوب (ريال)
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="أدخل المبلغ"
          step="0.01"
          min="0"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          وقت التسليم (أيام)
        </label>
        <select
          name="delivery_time"
          value={formData.delivery_time}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="3">3 أيام</option>
          <option value="5">5 أيام</option>
          <option value="7">7 أيام</option>
          <option value="14">14 يوم</option>
          <option value="30">30 يوم</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          رسالة للعميل
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="أخبر العميل لماذا أنت الخيار الأفضل..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {loading ? "جاري الإرسال..." : "إرسال العرض"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  );
}
