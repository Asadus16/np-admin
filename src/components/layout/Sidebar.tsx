"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ChevronDown,
  X,
  FolderOpen,
  BarChart3,
  Mail,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Users",
    icon: <Users size={20} />,
    children: [
      { name: "All Users", href: "/dashboard/users" },
      { name: "Add User", href: "/dashboard/users/add" },
    ],
  },
  {
    name: "Projects",
    icon: <FolderOpen size={20} />,
    children: [
      { name: "All Projects", href: "/dashboard/projects" },
      { name: "Add Project", href: "/dashboard/projects/add" },
    ],
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: <BarChart3 size={20} />,
  },
  {
    name: "Documents",
    href: "/dashboard/documents",
    icon: <FileText size={20} />,
  },
  {
    name: "Messages",
    href: "/dashboard/messages",
    icon: <Mail size={20} />,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={20} />,
  },
];

export function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    navigation.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child) =>
          pathname.startsWith(child.href)
        );
        if (isChildActive && !expandedItems.includes(item.name)) {
          setExpandedItems((prev) => [...prev, item.name]);
        }
      }
    });
  }, [pathname]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isParentActive = (item: NavItem) => {
    if (item.href) return pathname === item.href;
    return item.children?.some((child) => pathname.startsWith(child.href));
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-[var(--sidebar-bg)]
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-[var(--border-color)]">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">NP</span>
              </div>
              <span className="font-semibold text-gray-900">
                NP Admin
              </span>
            </Link>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">NP</span>
            </div>
          )}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded hover:bg-[var(--sidebar-active)]"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-2.5 space-y-1 overflow-y-auto h-[calc(100vh-56px)]">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-[5px] text-sm font-medium
                    transition-colors duration-150
                    ${
                      isActive(item.href)
                        ? "bg-[var(--sidebar-active)] text-gray-900"
                        : "text-gray-700 hover:bg-[var(--sidebar-active)]"
                    }
                  `}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-[5px] text-sm font-medium
                      transition-colors duration-150
                      ${
                        isParentActive(item)
                          ? "bg-[var(--sidebar-active)] text-gray-900"
                          : "text-gray-700 hover:bg-[var(--sidebar-active)]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          expandedItems.includes(item.name) ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {!isCollapsed && expandedItems.includes(item.name) && (
                    <div className="mt-1 ml-4 pl-3 border-l border-gray-200 space-y-1">
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onCloseMobile}
                          className={`
                            block px-3 py-2 rounded-[5px] text-sm
                            transition-colors duration-150
                            ${
                              isActive(child.href)
                                ? "bg-[var(--sidebar-active)] text-gray-900 font-medium"
                                : "text-gray-600 hover:bg-[var(--sidebar-active)]"
                            }
                          `}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
