"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PanelLeft, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleMobile: () => void;
}

export function Header({ isCollapsed, onToggleSidebar, onToggleMobile }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Admin";
      case "vendor":
        return "Vendor";
      default:
        return role;
    }
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

        {/* Right side - User Avatar */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            >
              <span className="text-white font-medium text-xs sm:text-sm">
                {user ? getInitials(user.name) : "U"}
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
                      <p className="text-sm font-medium">{user?.name || "User"}</p>
                      {user?.role && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {getRoleBadge(user.role)}
                        </span>
                      )}
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
