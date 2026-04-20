"use client";

import React, { useState } from "react";
import { FileText, Download, CheckCircle, XCircle, Clock, Plus, Trash2 } from "lucide-react";

interface Deliverable {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  status: "pending" | "submitted" | "approved" | "rejected";
  submitted_at?: string;
  submitted_by?: { name: string; avatar_url?: string };
  notes?: string;
}

interface DeliverablesListProps {
  deliverables: Deliverable[];
  isFreelancer?: boolean;
  isClient?: boolean;
  onAddDeliverable?: () => void;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "#EEF3FF",
    textColor: "#1A4FD6",
    label: "قيد الانتظار",
  },
  submitted: {
    icon: FileText,
    color: "#FEF08A",
    textColor: "#F59E0B",
    label: "مُسلّم",
  },
  approved: {
    icon: CheckCircle,
    color: "#D1FAE5",
    textColor: "#10B981",
    label: "موافق عليه",
  },
  rejected: {
    icon: XCircle,
    color: "#FEE2E2",
    textColor: "#DC2626",
    label: "مرفوض",
  },
};

export default function DeliverablesList({
  deliverables,
  isFreelancer = false,
  isClient = false,
  onAddDeliverable,
  onApprove,
  onReject,
  onDelete,
}: DeliverablesListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setApproving(id);
    try {
      await onApprove?.(id);
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (id: string) => {
    setRejecting(id);
    try {
      await onReject?.(id);
    } finally {
      setRejecting(null);
    }
  };

  if (deliverables.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border text-center" style={{ borderColor: "#E8ECF4" }}>
        <FileText size={32} className="mx-auto mb-3" style={{ color: "#E8ECF4" }} />
        <p style={{ color: "#8892A4" }} className="text-sm font-bold mb-4">
          لا توجد مخرجات بعد
        </p>
        {isFreelancer && onAddDeliverable && (
          <button
            onClick={onAddDeliverable}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white inline-flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #1A4FD6, #2563EB)" }}
          >
            <Plus size={16} /> أضف مخرج جديد
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black" style={{ color: "#0A0E1A" }}>
          المخرجات ({deliverables.length})
        </h3>
        {isFreelancer && onAddDeliverable && (
          <button
            onClick={onAddDeliverable}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1"
            style={{ background: "linear-gradient(135deg, #1A4FD6, #2563EB)" }}
          >
            <Plus size={14} /> جديد
          </button>
        )}
      </div>

      <div className="space-y-3">
        {deliverables.map((deliverable) => {
          const config = statusConfig[deliverable.status];
          const IconComponent = config.icon;
          const isExpanded = expandedId === deliverable.id;
          const submittedDate = deliverable.submitted_at
            ? new Date(deliverable.submitted_at).toLocaleDateString("ar-EG")
            : null;

          return (
            <div
              key={deliverable.id}
              className="bg-white rounded-xl border p-4 transition-all"
              style={{ borderColor: "#E8ECF4" }}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : deliverable.id)}
                className="w-full text-right flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 justify-end mb-2">
                    <h4 className="font-bold" style={{ color: "#0A0E1A" }}>
                      {deliverable.title}
                    </h4>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: config.color }}
                    >
                      <IconComponent size={16} style={{ color: config.textColor }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-end text-xs" style={{ color: "#8892A4" }}>
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{ background: config.color, color: config.textColor }}
                    >
                      {config.label}
                    </span>
                    {submittedDate && deliverable.submitted_by && (
                      <>
                        <span>•</span>
                        <span>
                          {deliverable.submitted_by.name} في {submittedDate}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "#F0F3FA" }}>
                  {deliverable.description && (
                    <p className="text-sm text-right mb-4" style={{ color: "#3D4560", lineHeight: "1.6" }}>
                      {deliverable.description}
                    </p>
                  )}

                  {/* File */}
                  {deliverable.file_url && (
                    <a
                      href={deliverable.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 justify-end p-3 rounded-lg mb-4 text-sm font-bold transition-colors"
                      style={{ background: "#F0F3FA", color: "#1A4FD6" }}
                    >
                      <Download size={14} />
                      تحميل الملف
                    </a>
                  )}

                  {/* Notes */}
                  {deliverable.notes && (
                    <div className="p-3 rounded-lg mb-4" style={{ background: "#FAFBFF", borderRight: "3px solid #F59E0B" }}>
                      <p className="text-xs font-bold mb-1" style={{ color: "#F59E0B" }}>ملاحظات:</p>
                      <p className="text-sm" style={{ color: "#3D4560" }}>
                        {deliverable.notes}
                      </p>
                    </div>
                  )}

                  {/* Client Actions */}
                  {isClient && deliverable.status === "submitted" && (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleReject(deliverable.id)}
                        disabled={rejecting === deliverable.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all disabled:opacity-50"
                        style={{ borderColor: "#DC2626", color: "#DC2626" }}
                      >
                        {rejecting === deliverable.id ? "جاري الرفض..." : "رفض"}
                      </button>
                      <button
                        onClick={() => handleApprove(deliverable.id)}
                        disabled={approving === deliverable.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-50"
                        style={{ background: "#10B981" }}
                      >
                        {approving === deliverable.id ? "جاري الموافقة..." : "موافق"}
                      </button>
                    </div>
                  )}

                  {/* Freelancer Delete */}
                  {isFreelancer && deliverable.status === "pending" && onDelete && (
                    <button
                      onClick={() => onDelete(deliverable.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} /> حذف
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
