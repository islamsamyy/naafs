"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/components/common/Toast";
import * as messagingService from "@/lib/services/messagingService";

interface MessageFormProps {
  receiverId: string;
  onMessageSent?: () => void;
}

export default function MessageForm({ receiverId, onMessageSent }: MessageFormProps) {
  const toast = useToast();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    setLoading(true);
    try {
      const message = await messagingService.sendMessage({
        sender_id: "", // Will be set by service
        receiver_id: receiverId,
        content: content.trim(),
      });

      if (message) {
        setContent("");
        onMessageSent?.();
      } else {
        toast.show('error', 'فشل إرسال الرسالة', 3000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.show('error', 'حدث خطأ', 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 bg-white border-t border-gray-200">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="اكتب رسالتك..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
