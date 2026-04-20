"use client";
import React, { useState } from "react";
import { useToast } from "@/components/common/Toast";
import * as projectService from "@/lib/services/projectService";

interface ProjectPostFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const CATEGORIES = [
  "تطوير الويب",
  "تطوير الموبايل",
  "ديزاين",
  "كتابة المحتوى",
  "تسويق رقمي",
  "إدارة المشاريع",
  "استشارات تقنية",
  "أخرى",
];

export default function ProjectPostForm({ onSuccess, onClose }: ProjectPostFormProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget_min: "",
    budget_max: "",
    deadline: "",
    skills_required: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast.show('error', 'يرجى ملء جميع الحقول المطلوبة', 3000);
      return;
    }

    const budgetMin = parseFloat(formData.budget_min);
    const budgetMax = parseFloat(formData.budget_max);

    if (isNaN(budgetMin) || isNaN(budgetMax) || budgetMin < 0 || budgetMax < budgetMin) {
      toast.show('error', 'تحقق من الميزانية', 3000);
      return;
    }

    setLoading(true);
    try {
      const project = await projectService.createProject({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget_min: budgetMin,
        budget_max: budgetMax,
        deadline: formData.deadline,
        skills_required: formData.skills_required
          .split(",")
          .map(s => s.trim())
          .filter(s => s),
        client_id: "",
      });

      if (project) {
        toast.show('success', 'تم نشر المشروع بنجاح', 3000);
        onSuccess?.();
      } else {
        toast.show('error', 'فشل نشر المشروع', 3000);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.show('error', 'حدث خطأ', 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          عنوان المشروع *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="أدخل عنوان المشروع"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الفئة *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">اختر الفئة</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          وصف المشروع *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="صف المشروع بالتفصيل..."
          rows={4}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الحد الأدنى للميزانية (ريال)
          </label>
          <input
            type="number"
            name="budget_min"
            value={formData.budget_min}
            onChange={handleChange}
            placeholder="0"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الحد الأقصى للميزانية (ريال)
          </label>
          <input
            type="number"
            name="budget_max"
            value={formData.budget_max}
            onChange={handleChange}
            placeholder="0"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الموعد النهائي
        </label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          المهارات المطلوبة (مفصولة بفواصل)
        </label>
        <input
          type="text"
          name="skills_required"
          value={formData.skills_required}
          onChange={handleChange}
          placeholder="React, TypeScript, Node.js"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {loading ? "جاري النشر..." : "نشر المشروع"}
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
