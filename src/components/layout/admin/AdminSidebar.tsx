"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ChevronDown,
  X,
  FolderOpen,
  CreditCard,
  Receipt,
  MessageSquare,
  Shield,
  Store,
  Wrench,
  MapPin,
  Users,
  ShoppingCart,
  RotateCcw,
  Tag,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";

interface AdminSidebarProps {
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
    href: "/admin",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: <Users className="h-4 w-4" />,
  },
  {
    name: "Vendors",
    icon: <Store className="h-4 w-4" />,
    children: [
      { name: "Applications", href: "/admin/vendors/applications" },
      { name: "All Vendors", href: "/admin/vendors" },
      { name: "Add Vendor", href: "/admin/vendors/add" },
    ],
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    name: "Refunds",
    href: "/admin/refunds",
    icon: <RotateCcw className="h-4 w-4" />,
  },
  {
    name: "Coupons",
    href: "/admin/coupons",
    icon: <Tag className="h-4 w-4" />,
  },
  {
    name: "Payouts",
    href: "/admin/payouts",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    name: "Categories",
    icon: <FolderOpen className="h-4 w-4" />,
    children: [
      { name: "All Categories", href: "/admin/categories" },
      { name: "Add Category", href: "/admin/categories/add" },
    ],
  },
  {
    name: "Service Areas",
    icon: <MapPin className="h-4 w-4" />,
    children: [
      { name: "All Service Areas", href: "/admin/service-areas" },
      { name: "Add Service Area", href: "/admin/service-areas/add" },
    ],
  },
  {
    name: "Technicians",
    icon: <Wrench className="h-4 w-4" />,
    children: [
      { name: "All Technicians", href: "/admin/technicians" },
    ],
  },
  {
    name: "Billing & Plans",
    icon: <CreditCard className="h-4 w-4" />,
    children: [
      { name: "Plans", href: "/admin/billing/plans" },
      { name: "Usage & Limits", href: "/admin/billing" },
      { name: "Feature Flags", href: "/admin/billing/feature-flags" },
    ],
  },
  {
    name: "Transactions",
    icon: <Receipt className="h-4 w-4" />,
    children: [
      { name: "Payout Runs", href: "/admin/transactions" },
      { name: "Fees", href: "/admin/transactions/fees" },
      { name: "Adjustments", href: "/admin/transactions/adjustments" },
    ],
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    name: "Audit & Security",
    icon: <Shield className="h-4 w-4" />,
    children: [
      { name: "Audit Logs", href: "/admin/audit-logs" },
      { name: "Roles & Permissions", href: "/admin/roles" },
      { name: "Organization", href: "/admin/organization" },
    ],
  },
];

export function AdminSidebar({ isCollapsed, isMobileOpen, onCloseMobile }: AdminSidebarProps) {
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
          fixed top-0 left-0 z-50 h-screen bg-[#f4f4f6]
          transition-all duration-300 ease-in-out border-none shadow-none
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div
          className={`flex h-20 items-center border-none ${
            isCollapsed ? "px-2 justify-center" : "px-2 sm:px-4"
          }`}
        >
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center">
              <Image
                src="/logos/Logo.svg"
                alt="NoProblem"
                width={260}
                height={100}
                className="h-[70px] w-auto"
                priority
              />
            </Link>
          )}
          {isCollapsed && (
            <Link href="/admin" className="flex items-center justify-center">
              <Image
                src="/logos/Logo.svg"
                alt="NP"
                width={56}
                height={56}
                className="h-12 w-12 object-cover object-left"
                priority
              />
            </Link>
          )}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 rounded hover:bg-[#DCDCDE] ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 overflow-y-auto h-[calc(100vh-80px)]" style={{ padding: "10px" }}>
          <div className="space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`
                      group flex items-center py-2 text-sm font-medium rounded-md transition-colors
                      text-gray-700 hover:bg-[#DCDCDE] hover:text-gray-900
                      ${isCollapsed ? "justify-center px-2" : "px-3"}
                      ${isActive(item.href) ? "bg-[#DCDCDE] text-gray-900" : ""}
                    `}
                    style={{ borderRadius: "5px" }}
                  >
                    <span className={isCollapsed ? "" : "mr-3"}>{item.icon}</span>
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`
                        group flex items-center w-full py-2 text-sm font-medium rounded-md transition-colors
                        text-gray-700 hover:bg-[#DCDCDE] hover:text-gray-900
                        ${isCollapsed ? "justify-center px-2" : "px-3"}
                        ${isParentActive(item) ? "bg-[#DCDCDE] text-gray-900" : ""}
                      `}
                      style={{ borderRadius: "5px" }}
                    >
                      <span className={isCollapsed ? "" : "mr-3"}>{item.icon}</span>
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                      {!isCollapsed && (
                        <ChevronDown
                          className={`ml-auto h-4 w-4 transition-transform ${
                            expandedItems.includes(item.name) ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                    {!isCollapsed && expandedItems.includes(item.name) && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onCloseMobile}
                            className={`
                              block px-3 py-1.5 text-sm transition-colors
                              ${
                                isActive(child.href)
                                  ? "bg-[#DCDCDE] text-gray-900"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-[#DCDCDE]"
                              }
                            `}
                            style={{ borderRadius: "5px" }}
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
          </div>
        </nav>
      </aside>
    </>
  );
}
