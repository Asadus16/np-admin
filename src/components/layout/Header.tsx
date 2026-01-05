"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PanelLeft, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getPrimaryRole, hasRole, getUserFullName } from "@/types/auth";

interface HeaderProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleMobile: () => void;
}

export function Header({ isCollapsed, onToggleSidebar, onToggleMobile }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuth();

  // Mock notifications data
  const notifications = [
    { id: 1, title: "New vendor application", message: "ABC Plumbing submitted an application", time: "5 min ago", unread: true },
    { id: 2, title: "Payment processed", message: "Payout of $2,500 completed", time: "1 hour ago", unread: true },
    { id: 3, title: "New review", message: "5-star review for Quick Fix Services", time: "3 hours ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;
  const router = useRouter();

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
      case "user":
        return "Customer";
      case "technician":
        return "Technician";
      default:
        return primaryRole || "User";
    }
  };

  const getNotificationsPath = () => {
    if (hasRole(user, "customer") || hasRole(user, "user")) {
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
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <span className="mt-1.5 h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                          <div className={notification.unread ? "" : "ml-5"}>
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
