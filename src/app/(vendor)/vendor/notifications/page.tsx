"use client";

import { useState } from "react";
import { Bell, ClipboardList, DollarSign, Star, Users, Settings, Check } from "lucide-react";

const notifications = [
  { id: 1, type: "order", title: "New Order Received", message: "John Smith requested Plumbing Repair service", time: "5 minutes ago", read: false },
  { id: 2, type: "payment", title: "Payment Received", message: "You received $150 for order ORD-156", time: "1 hour ago", read: false },
  { id: 3, type: "review", title: "New Review", message: "Sarah Johnson left a 5-star review", time: "2 hours ago", read: false },
  { id: 4, type: "team", title: "Team Update", message: "Mike Johnson accepted your invitation", time: "5 hours ago", read: true },
  { id: 5, type: "order", title: "Order Completed", message: "Order ORD-155 has been marked as completed", time: "1 day ago", read: true },
  { id: 6, type: "system", title: "Profile Updated", message: "Your business profile has been updated", time: "2 days ago", read: true },
  { id: 7, type: "payment", title: "Payout Processed", message: "Your weekly payout of $2,450 has been sent", time: "3 days ago", read: true },
];

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
  const [notifs, setNotifs] = useState(notifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filteredNotifs = filter === "all"
    ? notifs
    : filter === "unread"
    ? notifs.filter((n) => !n.read)
    : notifs.filter((n) => n.type === filter);

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

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
            onClick={markAllRead}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Check className="h-4 w-4 mr-2" />
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
              className={`p-4 flex items-start gap-4 ${!notif.read ? "bg-blue-50/30" : ""}`}
            >
              <div className={`p-2 rounded-lg ${getIconBg(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-sm ${!notif.read ? "font-medium text-gray-900" : "text-gray-700"}`}>
                      {notif.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">{notif.message}</p>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs text-gray-500 hover:text-gray-700 whitespace-nowrap"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
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
