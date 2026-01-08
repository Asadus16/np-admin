"use client";

import { useState, useEffect } from "react";
import { Bell, ClipboardList, DollarSign, Star, Users, Settings, Check, Loader2 } from "lucide-react";
import { getAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/notification";
import type { Notification } from "@/types/notification";

const getIcon = (type: string) => {
  switch (type) {
    case "order":
      return <ClipboardList className="h-5 w-5 text-blue-600" />;
    case "payment":
      return <DollarSign className="h-5 w-5 text-green-600" />;
    case "review":
      return <Star className="h-5 w-5 text-yellow-600" />;
    case "team":
      return <Users className="h-5 w-5 text-purple-600" />;
    case "system":
      return <Settings className="h-5 w-5 text-gray-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
};

const getIconBg = (type: string) => {
  switch (type) {
    case "order":
      return "bg-blue-100";
    case "payment":
      return "bg-green-100";
    case "review":
      return "bg-yellow-100";
    case "team":
      return "bg-purple-100";
    case "system":
      return "bg-gray-100";
    default:
      return "bg-gray-100";
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getAllNotifications(50);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifs = filter === "all"
    ? notifications
    : filter === "unread"
    ? notifications.filter((n) => !n.is_read)
    : notifications.filter((n) => n.type === filter);

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAll(true);
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const markAsRead = async (notification: Notification) => {
    if (notification.is_read) return;

    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const formatNotificationTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMarkingAll ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "all", label: "All" },
          { id: "unread", label: "Unread" },
          { id: "order", label: "Orders" },
          { id: "payment", label: "Payments" },
          { id: "review", label: "Reviews" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
              filter === f.id
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="divide-y divide-gray-200">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 flex items-start gap-4 ${!notif.is_read ? "bg-blue-50/30" : ""}`}
            >
              <div className={`p-2 rounded-lg ${getIconBg(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-sm ${!notif.is_read ? "font-medium text-gray-900" : "text-gray-700"}`}>
                      {notif.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                  </div>
                  {!notif.is_read && (
                    <button
                      onClick={() => markAsRead(notif)}
                      className="text-xs text-gray-500 hover:text-gray-700 whitespace-nowrap"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{formatNotificationTime(notif.created_at)}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifs.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
