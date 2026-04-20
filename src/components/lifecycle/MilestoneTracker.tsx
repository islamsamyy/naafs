"use client";

import React, { useState } from "react";
import { CheckCircle, Circle, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "delayed";
  expected_completion?: string;
  actual_completion?: string;
  order_index: number;
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
  isFreelancer?: boolean;
  onMilestoneClick?: (milestone: Milestone) => void;
}

const statusConfig = {
  pending: {
    icon: Circle,
    color: "#E8ECF4",
    textColor: "#8892A4",
    label: "قيد الانتظار",
  },
  in_progress: {
    icon: Clock,
    color: "#FEF08A",
    textColor: "#F59E0B",
    label: "قيد التنفيذ",
  },
  completed: {
    icon: CheckCircle,
    color: "#D1FAE5",
    textColor: "#10B981",
    label: "مكتمل",
  },
  delayed: {
    icon: AlertCircle,
    color: "#FEE2E2",
    textColor: "#DC2626",
    label: "متأخر",
  },
};

export default function MilestoneTracker({ milestones, isFreelancer = false, onMilestoneClick }: MilestoneTrackerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedMilestones = [...milestones].sort((a, b) => a.order_index - b.order_index);
  const completedCount = sortedMilestones.filter((m) => m.status === "completed").length;
  const progressPercent = sortedMilestones.length > 0 ? (completedCount / sortedMilestones.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#E8ECF4" }}>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold" style={{ color: "#8892A4" }}>التقدم الإجمالي</span>
            <span className="text-lg font-black" style={{ color: "#1A4FD6" }}>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#F0F3FA" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(90deg, #1A4FD6, #00C2A8)",
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-black" style={{ color: "#1A4FD6" }}>{sortedMilestones.length}</p>
            <p className="text-xs" style={{ color: "#8892A4" }}>إجمالي المراحل</p>
          </div>
          <div>
            <p className="text-2xl font-black" style={{ color: "#10B981" }}>{completedCount}</p>
            <p className="text-xs" style={{ color: "#8892A4" }}>مكتملة</p>
          </div>
          <div>
            <p className="text-2xl font-black" style={{ color: "#F59E0B" }}>{sortedMilestones.filter((m) => m.status === "in_progress").length}</p>
            <p className="text-xs" style={{ color: "#8892A4" }}>جارية</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <h3 className="font-bold text-right" style={{ color: "#0A0E1A" }}>مراحل المشروع</h3>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute right-5 top-0 bottom-0 w-0.5" style={{ background: "#F0F3FA" }} />

          {/* Milestones */}
          <div className="space-y-4">
            {sortedMilestones.map((milestone, idx) => {
              const config = statusConfig[milestone.status];
              const IconComponent = config.icon;
              const isExpanded = expandedId === milestone.id;
              const expectedDate = milestone.expected_completion
                ? new Date(milestone.expected_completion).toLocaleDateString("ar-EG")
                : null;
              const actualDate = milestone.actual_completion
                ? new Date(milestone.actual_completion).toLocaleDateString("ar-EG")
                : null;

              return (
                <div key={milestone.id}>
                  <button
                    onClick={() => {
                      setExpandedId(isExpanded ? null : milestone.id);
                      onMilestoneClick?.(milestone);
                    }}
                    className="w-full text-right"
                  >
                    <div className="flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-md" style={{ borderColor: "#E8ECF4", background: isExpanded ? "#FAFBFF" : "#FFFFFF" }}>
                      {/* Timeline Dot */}
                      <div className="relative mt-1 flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all"
                          style={{
                            background: "#FFFFFF",
                            borderColor: config.color,
                          }}
                        >
                          <IconComponent size={16} style={{ color: config.textColor }} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4 flex-row-reverse mb-2">
                          <div className="flex-1 text-right">
                            <h4 className="font-bold" style={{ color: "#0A0E1A" }}>
                              {milestone.title}
                            </h4>
                          </div>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
                            style={{
                              background: `${config.color}`,
                              color: config.textColor,
                            }}
                          >
                            {config.label}
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={16} style={{ color: "#8892A4" }} />
                          ) : (
                            <ChevronDown size={16} style={{ color: "#8892A4" }} />
                          )}
                        </div>

                        {/* Dates */}
                        {(expectedDate || actualDate) && (
                          <div className="text-xs flex gap-4 justify-end" style={{ color: "#8892A4" }}>
                            {expectedDate && <span>المتوقع: {expectedDate}</span>}
                            {actualDate && <span>التسليم: {actualDate}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && milestone.description && (
                    <div className="mt-2 mr-10 p-4 rounded-xl border" style={{ borderColor: "#F0F3FA", background: "#FAFBFF" }}>
                      <p className="text-sm text-right" style={{ color: "#3D4560", lineHeight: "1.6" }}>
                        {milestone.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
