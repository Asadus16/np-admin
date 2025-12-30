"use client";

import { useState } from "react";
import { Bell, CheckCircle, ShoppingCart, Gift, CreditCard, AlertCircle, Check, Trash2 } from "lucide-react";

// Static notifications data
const initialNotifications = [
  {
    id: "1",
    type: "order",
    title: "Order Completed",
    message: "Your order ORD-2024-001 with Quick Fix Plumbing has been completed.",
    time: "5 min ago",
    date: "Dec 28, 2024",
    read: false,
  },
  {
    id: "2",
    type: "order",
    title: "Technician En Route",
    message: "Your technician from Spark Electric Co is on the way. ETA: 15 minutes.",
    time: "1 hour ago",
    date: "Dec 28, 2024",
    read: false,
  },
  {
    id: "3",
    type: "payment",
    title: "Payment Successful",
    message: "Payment of AED 350 for ORD-2024-001 was successful.",
    time: "2 hours ago",
    date: "Dec 28, 2024",
    read: true,
  },
  {
    id: "4",
    type: "points",
    title: "Points Earned!",
    message: "You earned 35 points from your recent order. Total balance: 1,850 pts",
    time: "2 hours ago",
    date: "Dec 28, 2024",
    read: true,
  },
  {
    id: "5",
    type: "promo",
    title: "Special Offer!",
    message: "Get 20% off on your next cleaning service. Use code CLEAN20.",
    time: "1 day ago",
    date: "Dec 27, 2024",
    read: true,
  },
  {
    id: "6",
    type: "order",
    title: "Order Confirmed",
    message: "Your order ORD-2024-002 has been confirmed. Scheduled for Dec 29.",
    time: "2 days ago",
    date: "Dec 26, 2024",
    read: true,
  },
  {
    id: "7",
    type: "reminder",
    title: "Upcoming Service Reminder",
    message: "You have a scheduled AC maintenance tomorrow at 10:00 AM.",
    time: "3 days ago",
    date: "Dec 25, 2024",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5 text-gray-600" />;
      case "payment":
        return <CreditCard className="h-5 w-5 text-gray-600" />;
      case "points":
        return <Gift className="h-5 w-5 text-gray-600" />;
      case "promo":
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
      case "reminder":
        return <Bell className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getIconBg = () => {
    return "bg-gray-100";
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            filter === "all"
              ? "bg-gray-900 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            filter === "unread"
              ? "bg-gray-900 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white border rounded-lg p-4 ${
                notification.read ? "border-gray-200" : "border-blue-200 bg-blue-50/30"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconBg()}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm font-medium ${notification.read ? "text-gray-900" : "text-gray-900"}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
