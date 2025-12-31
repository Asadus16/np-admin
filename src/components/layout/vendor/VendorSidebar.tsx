"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ChevronDown,
  X,
  ClipboardList,
  Package,
  Calendar,
  Users,
  Wallet,
  Star,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  Building2,
} from "lucide-react";

interface VendorSidebarProps {
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
    href: "/vendor",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    name: "Onboarding",
    icon: <Building2 className="h-4 w-4" />,
    children: [
      { name: "Company Profile", href: "/vendor/onboarding" },
      { name: "KYC Verification", href: "/vendor/onboarding/kyc" },
      { name: "Service Areas", href: "/vendor/onboarding/service-areas" },
      { name: "Teams", href: "/vendor/onboarding/teams" },
    ],
  },
  {
    name: "Service Catalog",
    icon: <Package className="h-4 w-4" />,
    children: [
      { name: "All Services", href: "/vendor/services" },
      { name: "Add Service", href: "/vendor/services/add" },
    ],
  },
  {
    name: "Orders",
    href: "/vendor/orders",
    icon: <ClipboardList className="h-4 w-4" />,
  },
  {
    name: "Scheduling",
    icon: <Calendar className="h-4 w-4" />,
    children: [
      { name: "Calendar", href: "/vendor/scheduling" },
      { name: "Availability", href: "/vendor/scheduling/availability" },
    ],
  },
  {
    name: "Technicians",
    icon: <Users className="h-4 w-4" />,
    children: [
      { name: "Team", href: "/vendor/technicians" },
      { name: "Invite", href: "/vendor/technicians/invite" },
      { name: "Roles", href: "/vendor/technicians/roles" },
      { name: "Assignments", href: "/vendor/technicians/assignments" },
    ],
  },
  {
    name: "Wallet & Payouts",
    icon: <Wallet className="h-4 w-4" />,
    children: [
      { name: "Balance", href: "/vendor/wallet" },
      { name: "Payout Methods", href: "/vendor/wallet/payout-methods" },
      { name: "History", href: "/vendor/wallet/history" },
    ],
  },
  {
    name: "Reviews",
    href: "/vendor/reviews",
    icon: <Star className="h-4 w-4" />,
  },
  {
    name: "Messages",
    href: "/vendor/messages",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    name: "Notifications",
    href: "/vendor/notifications",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    name: "Reports",
    icon: <BarChart3 className="h-4 w-4" />,
    children: [
      { name: "Jobs", href: "/vendor/reports" },
      { name: "Earnings", href: "/vendor/reports/earnings" },
      { name: "Utilization", href: "/vendor/reports/utilization" },
    ],
  },
  {
    name: "Settings",
    icon: <Settings className="h-4 w-4" />,
    children: [
      { name: "Company", href: "/vendor/settings" },
      { name: "Service Areas", href: "/vendor/settings/service-areas" },
      { name: "Taxes & Fees", href: "/vendor/settings/taxes" },
      { name: "Subscription & Billing", href: "/vendor/settings/subscription" },
      { name: "Preferences", href: "/vendor/settings/preferences" },
    ],
  },
];

export function VendorSidebar({ isCollapsed, isMobileOpen, onCloseMobile }: VendorSidebarProps) {
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
            <Link href="/vendor" className="flex items-center">
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
            <Link href="/vendor" className="flex items-center justify-center">
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
