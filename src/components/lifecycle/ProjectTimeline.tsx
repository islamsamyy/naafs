"use client";

import React from "react";
import { CheckCircle, Clock, FileText, MessageSquare, AlertCircle, Upload, Zap } from "lucide-react";

interface Activity {
  id: string;
  activity_type: "status_change" | "milestone_created" | "milestone_completed" | "deliverable_submitted" | "deliverable_approved" | "comment" | "file_uploaded";
  title: string;
  description?: string;
  user: { name: string; avatar_url?: string };
  created_at: string;
}

interface ProjectTimelineProps {
  activities: Activity[];
  projectTitle?: string;
}

const activityConfig = {
  status_change: {
    icon: Zap,
    color: "#1A4FD6",
    bgColor: "#EEF3FF",
  },
  milestone_created: {
    icon: CheckCircle,
    color: "#00C2A8",
    bgColor: "#E6FAF8",
  },
  milestone_completed: {
    icon: CheckCircle,
    color: "#10B981",
    bgColor: "#D1FAE5",
  },
  deliverable_submitted: {
    icon: Upload,
    color: "#F59E0B",
    bgColor: "#FEF08A",
  },
  deliverable_approved: {
    icon: CheckCircle,
    color: "#10B981",
    bgColor: "#D1FAE5",
  },
  comment: {
    icon: MessageSquare,
    color: "#8B5CF6",
    bgColor: "#F3E8FF",
  },
  file_uploaded: {
    icon: FileText,
    color: "#3B82F6",
    bgColor: "#EFF6FF",
  },
};

export default function ProjectTimeline({ activities, projectTitle }: ProjectTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border text-center" style={{ borderColor: "#E8ECF4" }}>
        <Clock size={32} className="mx-auto mb-3" style={{ color: "#E8ECF4" }} />
        <p style={{ color: "#8892A4" }} className="text-sm font-bold">
          لا توجد أنشطة بعد
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: "#E8ECF4" }}>
      <h3 className="text-lg font-black text-right mb-6" style={{ color: "#0A0E1A" }}>
        سجل النشاط
      </h3>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute right-5 top-0 bottom-0 w-0.5" style={{ background: "#F0F3FA" }} />

        {/* Activities */}
        <div className="space-y-6">
          {activities.map((activity, idx) => {
            const config = activityConfig[activity.activity_type];
            const IconComponent = config.icon;
            const activityDate = new Date(activity.created_at).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "long",
            });
            const activityTime = new Date(activity.created_at).toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={activity.id} className="relative pr-16">
                {/* Timeline Dot */}
                <div
                  className="absolute right-0 top-1 w-10 h-10 rounded-full flex items-center justify-center border-4 flex-shrink-0"
                  style={{
                    background: config.bgColor,
                    borderColor: "#FFFFFF",
                    boxShadow: `0 0 0 3px ${config.bgColor}`,
                  }}
                >
                  <IconComponent size={16} style={{ color: config.color }} />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <h4 className="font-bold" style={{ color: "#0A0E1A" }}>
                      {activity.title}
                    </h4>
                    <img
                      src={activity.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.user.name)}&background=${config.color.slice(1)}&color=fff`}
                      alt={activity.user.name}
                      className="w-7 h-7 rounded-full"
                    />
                  </div>

                  <p className="text-xs text-right mb-2" style={{ color: "#8892A4" }}>
                    {activity.user.name} • {activityDate} في {activityTime}
                  </p>

                  {activity.description && (
                    <p className="text-sm text-right" style={{ color: "#3D4560", lineHeight: "1.6" }}>
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
