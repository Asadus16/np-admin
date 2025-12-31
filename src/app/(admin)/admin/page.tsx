"use client";

import { useState } from "react";
import {
  Store,
  FolderOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  ShoppingCart,
  RotateCcw,
  AlertTriangle,
  Wallet,
  FileText,
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

// Professional gray color palette
const GRAY_COLORS = ["#111827", "#374151", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"];

// Static data
const revenueData = [
  { month: "Jul", revenue: 42000 },
  { month: "Aug", revenue: 38000 },
  { month: "Sep", revenue: 51000 },
  { month: "Oct", revenue: 47000 },
  { month: "Nov", revenue: 53000 },
  { month: "Dec", revenue: 58000 },
];

const applicationData = [
  { month: "Jul", approved: 12, pending: 5, rejected: 2 },
  { month: "Aug", approved: 15, pending: 8, rejected: 3 },
  { month: "Sep", approved: 18, pending: 6, rejected: 4 },
  { month: "Oct", approved: 14, pending: 9, rejected: 2 },
  { month: "Nov", approved: 20, pending: 7, rejected: 3 },
  { month: "Dec", approved: 22, pending: 10, rejected: 5 },
];

const categoryDistribution: Array<{ name: string; value: number; [key: string]: string | number }> = [
  { name: "Plumbing", value: 45 },
  { name: "Electrical", value: 32 },
  { name: "HVAC", value: 28 },
  { name: "Landscaping", value: 22 },
  { name: "Cleaning", value: 18 },
  { name: "Other", value: 15 },
];

const recentVendors = [
  { id: 1, name: "Quick Fix Plumbing", status: "approved" as const, date: "2024-12-28", category: "Plumbing" },
  { id: 2, name: "Spark Electric Co", status: "pending" as const, date: "2024-12-27", category: "Electrical" },
  { id: 3, name: "Cool Air HVAC", status: "approved" as const, date: "2024-12-26", category: "HVAC" },
  { id: 4, name: "Green Thumb Gardens", status: "rejected" as const, date: "2024-12-25", category: "Landscaping" },
];

const recentTransactions = [
  { id: 1, vendor: "Quick Fix Plumbing", amount: "$1,250", type: "Payout" as const, date: "2024-12-28" },
  { id: 2, vendor: "Spark Electric Co", amount: "$85", type: "Fee" as const, date: "2024-12-27" },
  { id: 3, vendor: "Cool Air HVAC", amount: "$2,100", type: "Payout" as const, date: "2024-12-26" },
  { id: 4, vendor: "Green Thumb Gardens", amount: "$45", type: "Fee" as const, date: "2024-12-25" },
];

const pendingRefunds = [
  { id: "REF-001", orderId: "ORD-1234", customer: "John Smith", vendor: "Quick Fix Plumbing", amount: "$150", type: "Partial", reason: "Service incomplete", status: "pending", date: "2024-12-28" },
  { id: "REF-002", orderId: "ORD-1230", customer: "Sarah Johnson", vendor: "Spark Electric Co", amount: "$350", type: "Full", reason: "No show", status: "pending", date: "2024-12-27" },
  { id: "REF-003", orderId: "ORD-1225", customer: "Mike Brown", vendor: "Cool Air HVAC", amount: "$85", type: "Partial", reason: "Quality issue", status: "pending", date: "2024-12-26" },
];

const quickStats = {
  pendingApprovals: 12,
  pendingRefunds: 8,
  payoutsDue: 15,
  openDisputes: 3,
};

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
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const handlePeriodChange = (period: '7d' | '30d' | '90d') => {
    setSelectedPeriod(period);
  };

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Static stats cards
  const statsCards = [
    {
      name: "Total Customers",
      value: "2,845",
      change: "+18%",
      trend: "up" as const,
      icon: Users,
      href: "/admin/customers",
    },
    {
      name: "Total Vendors",
      value: "156",
      change: "+12%",
      trend: "up" as const,
      icon: Store,
      href: "/admin/vendors",
    },
    {
      name: "Total Orders",
      value: "1,247",
      change: "+24%",
      trend: "up" as const,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      name: "Total Revenue",
      value: formatCurrency(284500),
      change: "+15%",
      trend: "up" as const,
      icon: DollarSign,
      href: "/admin/transactions",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your platform performance</p>
        </div>
        <div className="flex items-center gap-2">
          {(["7d", "30d", "90d"] as const).map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
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
        {statsCards.map((stat) => (
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
            {revenueData.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No revenue data available
              </div>
            )}
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
            {applicationData.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No application data available
              </div>
            )}
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
            {categoryDistribution.length > 0 ? (
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
                    {categoryDistribution.map((_, index) => (
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
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No category data available
              </div>
            )}
          </div>
          {categoryDistribution.length > 0 && (
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
          )}
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
            {recentVendors.length > 0 ? (
              recentVendors.slice(0, 4).map((vendor) => (
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
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No recent applications
              </div>
            )}
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
            {recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 4).map((transaction) => (
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
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No recent transactions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/vendors/applications"
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{quickStats.pendingApprovals}</p>
              <p className="text-xs text-gray-500">Pending Approvals</p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/refunds"
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <RotateCcw className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{quickStats.pendingRefunds}</p>
              <p className="text-xs text-gray-500">Pending Refunds</p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/payouts"
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Wallet className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{quickStats.payoutsDue}</p>
              <p className="text-xs text-gray-500">Payouts Due</p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/refunds?status=dispute"
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{quickStats.openDisputes}</p>
              <p className="text-xs text-gray-500">Open Disputes</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Refund Requests Widget */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Pending Refund Requests</h3>
            <p className="text-sm text-gray-500">Requests awaiting approval</p>
          </div>
          <Link
            href="/admin/refunds"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
          >
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Refund ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Order</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Customer</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Vendor</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Reason</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingRefunds.map((refund) => (
                <tr key={refund.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{refund.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{refund.orderId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{refund.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{refund.vendor}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{refund.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                      refund.type === "Full" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-700"
                    }`}>
                      {refund.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{refund.reason}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{refund.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded hover:bg-gray-800">
                        Approve
                      </button>
                      <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            href="/admin/coupons/add"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Coupon
          </Link>
          <Link
            href="/admin/payouts"
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
