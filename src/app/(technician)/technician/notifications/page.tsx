"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  Settings,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "job_assigned",
    title: "New Job Assigned",
    message: "You have been assigned a new job: Pipe Leak Repair at Villa 24, Palm Jumeirah",
    jobId: "JOB-1234",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "job_reminder",
    title: "Upcoming Job Reminder",
    message: "Your job at Apt 1502, Marina Heights is scheduled for 2:00 PM today",
    jobId: "JOB-1235",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "message",
    title: "New Message",
    message: "John Smith sent you a message about job JOB-1234",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "schedule_change",
    title: "Schedule Updated",
    message: "Job JOB-1236 has been rescheduled to 4:30 PM",
    jobId: "JOB-1236",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "job_completed",
    title: "Job Completed",
    message: "Great job! You completed the service for Lisa White. +AED 150 earned.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 6,
    type: "request_approved",
    title: "Time Off Approved",
    message: "Your time off request for January 5th has been approved",
    time: "Dec 26",
    read: true,
  },
  {
    id: 7,
    type: "rating",
    title: "New Rating Received",
    message: "You received a 5-star rating from Mike Brown for excellent service",
    time: "Dec 25",
    read: true,
  },
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notificationList, setNotificationList] = useState(notifications);

  const filteredNotifications = notificationList.filter((notif) => {
    if (filter === "unread") return !notif.read;
    return true;
  });

  const markAsRead = (id: number) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notificationList.filter((n) => !n.read).length;

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
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
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
            onClick={() => markAsRead(notification.id)}
            className={`p-4 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              !notification.read ? "bg-blue-50/50" : ""
            }`}
          >
            <div className={`p-2 rounded-lg ${getIconBg(notification.type)}`}>
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"} text-gray-900`}>
                  {notification.title}
                </p>
                {!notification.read && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
            </div>
            {notification.jobId && (
              <Link
                href={`/technician/jobs/${notification.jobId}`}
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
