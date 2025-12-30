"use client";

import { useState } from "react";
import {
  Store,
  Wrench,
  FolderOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for stats
const stats = [
  {
    name: "Total Vendors",
    value: "156",
    change: "+12%",
    trend: "up",
    icon: Store,
    href: "/admin/vendors",
  },
  {
    name: "Active Technicians",
    value: "482",
    change: "+8%",
    trend: "up",
    icon: Wrench,
    href: "/admin/technicians",
  },
  {
    name: "Categories",
    value: "24",
    change: "+2",
    trend: "up",
    icon: FolderOpen,
    href: "/admin/categories",
  },
  {
    name: "Monthly Revenue",
    value: "$84,230",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    href: "/admin/transactions",
  },
];

// Mock data for revenue chart (last 7 months)
const revenueData = [
  { month: "Jun", revenue: 45000 },
  { month: "Jul", revenue: 52000 },
  { month: "Aug", revenue: 48000 },
  { month: "Sep", revenue: 61000 },
  { month: "Oct", revenue: 55000 },
  { month: "Nov", revenue: 72000 },
  { month: "Dec", revenue: 84230 },
];

// Mock data for vendor applications
const applicationData = [
  { month: "Jun", approved: 12, pending: 5, rejected: 2 },
  { month: "Jul", approved: 18, pending: 8, rejected: 3 },
  { month: "Aug", approved: 15, pending: 6, rejected: 4 },
  { month: "Sep", approved: 22, pending: 10, rejected: 2 },
  { month: "Oct", approved: 19, pending: 7, rejected: 5 },
  { month: "Nov", approved: 25, pending: 12, rejected: 3 },
  { month: "Dec", approved: 28, pending: 15, rejected: 4 },
];

// Mock recent vendors
const recentVendors = [
  { id: 1, name: "ABC Plumbing", status: "pending", date: "Dec 28, 2024", category: "Plumbing" },
  { id: 2, name: "Quick Fix HVAC", status: "approved", date: "Dec 27, 2024", category: "HVAC" },
  { id: 3, name: "Elite Electrical", status: "approved", date: "Dec 26, 2024", category: "Electrical" },
  { id: 4, name: "Pro Painters", status: "rejected", date: "Dec 25, 2024", category: "Painting" },
  { id: 5, name: "Clean Masters", status: "pending", date: "Dec 24, 2024", category: "Cleaning" },
];

// Mock recent transactions
const recentTransactions = [
  { id: 1, vendor: "Mike's Plumbing", amount: "$1,250.00", type: "Payout", date: "Dec 28, 2024" },
  { id: 2, vendor: "Quick Fix Services", amount: "$890.50", type: "Payout", date: "Dec 27, 2024" },
  { id: 3, vendor: "Elite Electrical", amount: "$45.00", type: "Fee", date: "Dec 27, 2024" },
  { id: 4, vendor: "Pro HVAC", amount: "$2,100.00", type: "Payout", date: "Dec 26, 2024" },
  { id: 5, vendor: "Clean Masters", amount: "$32.50", type: "Fee", date: "Dec 26, 2024" },
];

// Mock category distribution
const categoryDistribution = [
  { name: "Plumbing", value: 42 },
  { name: "Electrical", value: 35 },
  { name: "HVAC", value: 28 },
  { name: "Cleaning", value: 25 },
  { name: "Painting", value: 15 },
  { name: "Other", value: 11 },
];

// Professional gray color palette
const GRAY_COLORS = ["#111827", "#374151", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"];

// Custom tooltip styles
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-gray-300">
            {entry.name}: {entry.name === "revenue" ? `$${(entry.value / 1000).toFixed(1)}k` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your platform performance</p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "30d", "90d"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedPeriod === period
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {period === "7d" ? "7 Days" : period === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <stat.icon className="h-5 w-5 text-gray-600" />
              </div>
              <div
                className={`flex items-center text-sm font-medium ${
                  stat.trend === "up" ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-sm text-gray-500">Monthly revenue trends</p>
            </div>
            <Link
              href="/admin/transactions"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#374151" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#374151" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#111827"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Applications Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Vendor Applications</h3>
              <p className="text-sm text-gray-500">Application status breakdown</p>
            </div>
            <Link
              href="/admin/vendors/applications"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="approved" stackId="a" fill="#111827" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" stackId="a" fill="#6b7280" radius={[0, 0, 0, 0]} />
                <Bar dataKey="rejected" stackId="a" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-900 rounded-sm" />
              <span className="text-xs text-gray-600">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-sm" />
              <span className="text-xs text-gray-600">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-sm" />
              <span className="text-xs text-gray-600">Rejected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Distribution + Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Categories</h3>
              <p className="text-sm text-gray-500">Vendor distribution</p>
            </div>
            <Link
              href="/admin/categories"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              Manage <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GRAY_COLORS[index % GRAY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
                          <p className="font-medium">{payload[0].name}</p>
                          <p className="text-gray-300">{payload[0].value} vendors</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {categoryDistribution.map((category, index) => (
              <div key={category.name} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: GRAY_COLORS[index % GRAY_COLORS.length] }}
                />
                <span className="text-xs text-gray-600 truncate">{category.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{category.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Vendors */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Recent Applications</h3>
              <p className="text-sm text-gray-500">Latest vendor signups</p>
            </div>
            <Link
              href="/admin/vendors/applications"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentVendors.slice(0, 4).map((vendor) => (
              <div key={vendor.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Store className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                    <p className="text-xs text-gray-500">{vendor.category}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    vendor.status === "approved"
                      ? "bg-gray-900 text-white"
                      : vendor.status === "pending"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {vendor.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                  {vendor.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                  {vendor.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                  {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-500">Latest payouts and fees</p>
            </div>
            <Link
              href="/admin/transactions"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTransactions.slice(0, 4).map((transaction) => (
              <div key={transaction.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    transaction.type === "Payout" ? "bg-gray-900" : "bg-gray-100"
                  }`}>
                    <DollarSign className={`h-4 w-4 ${
                      transaction.type === "Payout" ? "text-white" : "text-gray-500"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.vendor}</p>
                    <p className="text-xs text-gray-500">{transaction.type}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  transaction.type === "Payout" ? "text-gray-900" : "text-gray-500"
                }`}>
                  {transaction.type === "Payout" ? "-" : "+"}{transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/vendors/add"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            <Store className="h-4 w-4 mr-2" />
            Add Vendor
          </Link>
          <Link
            href="/admin/categories/add"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Add Category
          </Link>
          <Link
            href="/admin/vendors/applications"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Users className="h-4 w-4 mr-2" />
            Review Applications
          </Link>
          <Link
            href="/admin/transactions"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Process Payouts
          </Link>
        </div>
      </div>
    </div>
  );
}
