"use client";

import React, { useEffect, useState } from "react";
import { X, Bell, AlertCircle, CheckCircle, MessageSquare, Zap } from "lucide-react";

export interface Notification {
  id: string;
  type: "bid" | "message" | "project_update" | "alert";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoDismissMs?: number;
}

interface FloatingNotificationPanelProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  maxNotifications?: number;
}

export default function FloatingNotificationPanel({
  notifications,
  onDismiss,
  position = "bottom-right",
  maxNotifications = 3,
}: FloatingNotificationPanelProps) {
  const displayNotifications = notifications.slice(0, maxNotifications);

  const positionClasses = {
    "bottom-right": "bottom-8 right-8",
    "bottom-left": "bottom-8 left-8",
    "top-right": "top-8 right-8",
    "top-left": "top-8 left-8",
  };

  const typeConfig = {
    bid: { icon: Zap, bgColor: "bg-[#EEF3FF]", textColor: "text-[#1A4FD6]", borderColor: "border-[#1A4FD6]" },
    message: { icon: MessageSquare, bgColor: "bg-[#E6FAF8]", textColor: "text-[#00C2A8]", borderColor: "border-[#00C2A8]" },
    project_update: { icon: CheckCircle, bgColor: "bg-[#F0FDF4]", textColor: "text-[#10B981]", borderColor: "border-[#10B981]" },
    alert: { icon: AlertCircle, bgColor: "bg-[#FEF2F2]", textColor: "text-[#DC2626]", borderColor: "border-[#DC2626]" },
  };

  return (
    <div className={`fixed z-40 space-y-3 ${positionClasses[position]} pointer-events-none`}>
      {displayNotifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
          typeConfig={typeConfig[notification.type]}
          index={index}
        />
      ))}
    </div>
  );
}

function NotificationItem({
  notification,
  onDismiss,
  typeConfig,
  index,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
  typeConfig: any;
  index: number;
}) {
  const [isExiting, setIsExiting] = useState(false);

  const Icon = typeConfig.icon;

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(notification.id), 300);
      },
      notification.autoDismissMs || 5000
    );

    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  return (
    <div
      className={`
        pointer-events-auto w-80 max-w-[calc(100vw-2rem)]
        ${typeConfig.bgColor} border-l-4 ${typeConfig.borderColor}
        rounded-lg p-4 shadow-lg
        animate-slide-in-up
        transition-all duration-300 ease-out
        ${isExiting ? "opacity-0 transform translate-y-4" : "opacity-100 translate-y-0"}
      `}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      <div className="flex items-start gap-3 rtl">
        <Icon className={`w-5 h-5 ${typeConfig.textColor} flex-shrink-0 mt-0.5`} />

        <div className="flex-1 min-w-0 text-right">
          <h3 className={`font-bold text-sm ${typeConfig.textColor} mb-1`}>
            {notification.title}
          </h3>
          <p className="text-sm text-[#8892A4] line-clamp-2">
            {notification.message}
          </p>

          {notification.action && (
            <button
              onClick={() => {
                notification.action!.onClick();
                onDismiss(notification.id);
              }}
              className={`
                mt-2 text-xs font-bold
                ${typeConfig.textColor}
                hover:underline transition-all
              `}
            >
              {notification.action.label}
            </button>
          )}
        </div>

        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onDismiss(notification.id), 300);
          }}
          className="flex-shrink-0 text-[#8892A4] hover:text-[#0A0E1A] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
