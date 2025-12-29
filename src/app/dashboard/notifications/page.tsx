"use client";

import { useState } from "react";
import { Bell, Check, Trash2, Filter } from "lucide-react";

const notifications = [
  { id: 1, title: "New vendor application", message: "John's Electric has submitted a new vendor application", type: "info", time: "5 minutes ago", read: false },
  { id: 2, title: "Payout completed", message: "Payout run PR-2024-001 has been completed successfully", type: "success", time: "1 hour ago", read: false },
  { id: 3, title: "Low balance alert", message: "Platform wallet balance is below the threshold", type: "warning", time: "2 hours ago", read: true },
  { id: 4, title: "New review", message: "Mike's Plumbing received a 5-star review from Alice Wilson", type: "info", time: "3 hours ago", read: true },
  { id: 5, title: "Vendor suspended", message: "ProPaint Services has been automatically suspended due to policy violation", type: "error", time: "5 hours ago", read: true },
  { id: 6, title: "Feature flag enabled", message: "The 'ai_recommendations' feature has been enabled in staging", type: "info", time: "Yesterday", read: true },
  { id: 7, title: "System update", message: "Platform will undergo scheduled maintenance on March 25th", type: "warning", time: "Yesterday", read: true },
];

export default function NotificationsPage() {
  const [items, setItems] = useState(notifications);
  const [filter, setFilter] = useState("all");

  const filteredNotifications = items.filter((item) => {
    if (filter === "unread") return !item.read;
    if (filter === "read") return item.read;
    return true;
  });

  const markAsRead = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const markAllAsRead = () => {
    setItems(items.map((item) => ({ ...item, read: true })));
  };

  const deleteNotification = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Check className="h-4 w-4 mr-2" />
          Mark all as read
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <div className="flex gap-2">
          {["all", "unread", "read"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm rounded-lg ${
                filter === f
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white border rounded-lg p-4 ${
              !notification.read ? "border-l-4 border-l-blue-500" : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getTypeStyles(notification.type)}`}>
                  <Bell className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <h3 className={`text-sm ${notification.read ? "text-gray-700" : "font-medium text-gray-900"}`}>
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
