"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { getAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/notification";
import type { Notification } from "@/types/notification";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.is_read;
    return true;
  });

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

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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

  const getIcon = (type: string) => {
    switch (type) {
      case "job_assigned": return <ClipboardList className="h-5 w-5 text-blue-600" />;
      case "job_reminder": return <Calendar className="h-5 w-5 text-yellow-600" />;
      case "message": return <MessageSquare className="h-5 w-5 text-gray-600" />;
      case "schedule_change": return <Calendar className="h-5 w-5 text-orange-600" />;
      case "job_completed": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "request_approved": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rating": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "job_assigned": return "bg-blue-100";
      case "job_reminder": return "bg-yellow-100";
      case "message": return "bg-gray-100";
      case "schedule_change": return "bg-orange-100";
      case "job_completed": return "bg-green-100";
      case "request_approved": return "bg-green-100";
      case "rating": return "bg-yellow-100";
      default: return "bg-gray-100";
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isMarkingAll && <Loader2 className="h-4 w-4 animate-spin" />}
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === "all"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filter === "unread"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => markAsRead(notification)}
            className={`p-4 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              !notification.is_read ? "bg-blue-50/50" : ""
            }`}
          >
            <div className={`p-2 rounded-lg ${getIconBg(notification.type)}`}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm ${!notification.is_read ? "font-semibold" : "font-medium"} text-gray-900`}>
                  {notification.title}
                </p>
                {!notification.is_read && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-2">{formatNotificationTime(notification.created_at)}</p>
            </div>
            {notification.data?.job_id && (
              <Link
                href={`/technician/jobs/${notification.data.job_id}`}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                View Job
              </Link>
            )}
          </div>
        ))}
        {filteredNotifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications to show</p>
          </div>
        )}
      </div>
    </div>
  );
}
