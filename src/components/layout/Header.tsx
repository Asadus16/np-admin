"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PanelLeft, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { getPrimaryRole, hasRole, getUserFullName } from "@/types/auth";
import { getUnreadNotifications, getUnreadCount, markNotificationAsRead } from "@/lib/notification";
import type { Notification } from "@/types/notification";
import type { SocketNotification } from "@/lib/socket";

interface HeaderProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleMobile: () => void;
}

export function Header({ isCollapsed, onToggleSidebar, onToggleMobile }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Handle incoming socket notification - this callback is passed to the hook
  // The hook stores it in a ref, so it doesn't need to be stable
  const handleSocketNotification = useCallback((data: SocketNotification) => {
    console.log('[Header] Received notification:', data);
    const newNotification: Notification = {
      id: data.id,
      type: data.type,
      title: data.title,
      message: data.message,
      priority: data.priority as any,
      data: data.data,
      is_read: false,
      read_at: data.read_at,
      created_at: data.created_at,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permission granted
    if (typeof Notification !== "undefined" && window.Notification?.permission === "granted") {
      new window.Notification(data.title, { body: data.message, icon: "/logo.png" });
    }
  }, []);

  // Use the notification socket hook - handles all socket connection and listener management
  useNotificationSocket(handleSocketNotification);

  // Load initial notifications when user is available
  useEffect(() => {
    if (isAuthLoading || !user) {
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
      }
      return;
    }

    // Load initial notifications from API
    loadNotifications();
    loadUnreadCount();

    // Request browser notification permission
    if (typeof Notification !== "undefined" && window.Notification?.permission === "default") {
      window.Notification.requestPermission();
    }
  }, [user, isAuthLoading]);

  const loadNotifications = async () => {
    try {
      setIsLoadingNotifications(true);
      const data = await getUnreadNotifications(5);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification.id);
        // Update local state
        setNotifications(prev =>
          prev.map(n => (n.id === notification.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
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

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getInitials = () => {
    if (!user) return "U";
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.[0]?.toUpperCase() || "U";
  };

  const getRoleBadge = () => {
    const primaryRole = getPrimaryRole(user);
    switch (primaryRole) {
      case "admin":
        return "Admin";
      case "vendor":
        return "Vendor";
      case "customer":
        return "Customer";
      case "technician":
        return "Technician";
      default:
        return primaryRole || "User";
    }
  };

  const getNotificationsPath = () => {
    if (hasRole(user, "customer")) {
      return "/customer/notifications";
    }
    if (hasRole(user, "vendor")) {
      return "/vendor/notifications";
    }
    if (hasRole(user, "technician")) {
      return "/technician/notifications";
    }
    return "/admin/notifications";
  };

  return (
    <header className="bg-white border border-[#e4e4e8] rounded-t-xl shadow-sm">
      <div className="flex h-14 items-center justify-between px-3 sm:px-4 lg:px-6 border-b border-gray-200">
        {/* Left side - Sidebar Toggle */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onToggleMobile}
            className="lg:hidden p-2 hover:bg-[#E4E4E8] rounded-[5px]"
          >
            <PanelLeft className="h-5 w-5 text-gray-600" />
          </button>
          {/* Desktop sidebar toggle */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:block p-2 hover:bg-[#E4E4E8] rounded-[5px]"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeft
              className={`h-5 w-5 text-gray-600 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Right side - Notifications & User Avatar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="p-2 hover:bg-[#E4E4E8] rounded-[5px] relative"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs text-gray-500">{unreadCount} unread</span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {isLoadingNotifications ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.is_read ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {!notification.is_read && (
                              <span className="mt-1.5 h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                            )}
                            <div className={notification.is_read ? "ml-5" : ""}>
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{formatNotificationTime(notification.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        router.push(getNotificationsPath());
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium w-full text-center"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            >
              <span className="text-white font-medium text-xs sm:text-sm">
                {getInitials()}
              </span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-56 bg-white border border-gray-200 rounded-[5px] shadow-lg">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{getUserFullName(user)}</p>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {getRoleBadge()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{user?.email || ""}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <LogOut className="h-4 w-4 text-gray-400 mr-3" />
                    <span>Log out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
