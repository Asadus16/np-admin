"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Header } from "../Header";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebar-collapsed");
    if (savedCollapsed) {
      setIsCollapsed(JSON.parse(savedCollapsed));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={closeMobile}
      />

      {/* Main Content Area */}
      <div
        className={`
          h-screen p-2 transition-all duration-300 bg-[#f4f4f6] border border-gray-200
          pl-2 ${isCollapsed ? "lg:pl-16" : "lg:pl-64"}
        `}
      >
        {/* Header - Inside content area with rounded-t-xl */}
        <Header
          isCollapsed={isCollapsed}
          onToggleSidebar={toggleSidebar}
          onToggleMobile={toggleMobile}
        />

        {/* Page Content - Connected to header with rounded-b-xl */}
        <main className="p-3 sm:p-4 lg:p-6 border border-[#e4e4e8] border-t-0 rounded-b-xl shadow-sm bg-white h-[calc(100vh-72px)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
