"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";
import { useToast } from "@/components/common/Toast";
import * as reviewService from "@/lib/services/reviewService";

interface ReviewFormProps {
  toUserId: string;
  projectId: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function ReviewForm({
  toUserId,
  projectId,
  onSuccess,
  onClose,
}: ReviewFormProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.show('error', 'أضف تعليقًا', 3000);
      return;
    }

    setLoading(true);
    try {
      const review = await reviewService.submitReview({
        project_id: projectId,
        from_user_id: "", // Will be set by service
        to_user_id: toUserId,
        rating,
        comment,
      });

      if (review) {
        toast.show('success', 'شكرًا على تقييمك', 3000);
        onSuccess?.();
      } else {
        toast.show('error', 'فشل إرسال التقييم', 3000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.show('error', 'حدث خطأ', 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          التقييم
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          التعليق
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="شارك رأيك..."
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
          {loading ? "جاري الإرسال..." : "إرسال التقييم"}
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
