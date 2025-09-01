"use client";

import { useNotificationContext } from "@/components/providers/notification-provider";

export function NotificationBadge() {
  const { unreadCount } = useNotificationContext();

  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
}
