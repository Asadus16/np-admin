"use client";

import { useState, useEffect } from "react";
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
  Loader2,
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
import { useAuth } from "@/hooks/useAuth";
import {
  getDashboardData,
  DashboardData,
  RevenueChartData,
  ApplicationsChartData,
  CategoryDistributionData,
  RecentVendor,
  RecentTransaction,
  PendingRefund,
} from "@/lib/adminDashboard";

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
  const { token } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const response = await getDashboardData(selectedPeriod, token);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, selectedPeriod]);

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

  // Format number with commas
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Stats cards
  const statsCards = dashboardData ? [
    {
      name: "Total Customers",
      value: formatNumber(dashboardData.stats.total_customers),
      change: dashboardData.stats.customer_change.value,
      trend: dashboardData.stats.customer_change.trend,
      icon: Users,
      href: "/admin/customers",
    },
    {
      name: "Total Vendors",
      value: formatNumber(dashboardData.stats.total_vendors),
      change: dashboardData.stats.vendor_change.value,
      trend: dashboardData.stats.vendor_change.trend,
      icon: Store,
      href: "/admin/vendors",
    },
    {
      name: "Total Orders",
      value: formatNumber(dashboardData.stats.total_orders),
      change: dashboardData.stats.order_change.value,
      trend: dashboardData.stats.order_change.trend,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      name: "Total Revenue",
      value: formatCurrency(dashboardData.stats.total_revenue),
      change: dashboardData.stats.revenue_change.value,
      trend: dashboardData.stats.revenue_change.trend,
      icon: DollarSign,
      href: "/admin/transactions",
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const revenueData: RevenueChartData[] = dashboardData.revenue_chart;
  const applicationData: ApplicationsChartData[] = dashboardData.applications_chart;
  const categoryDistribution: CategoryDistributionData[] = dashboardData.category_distribution;
  const recentVendors: RecentVendor[] = dashboardData.recent_vendors;
  const recentTransactions: RecentTransaction[] = dashboardData.recent_transactions;
  const quickStats = dashboardData.quick_stats;
  const pendingRefunds: PendingRefund[] = dashboardData.pending_refunds;

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
                  stat.trend === "up" ? "text-gray-900" : stat.trend === "down" ? "text-red-600" : "text-gray-500"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : stat.trend === "down" ? (
                  <TrendingDown className="h-4 w-4 mr-1" />
                ) : null}
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
                    data={categoryDistribution as { name: string; value: number }[]}
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
              <h3 className="font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-500">Latest completed orders</p>
            </div>
            <Link
              href="/admin/orders"
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
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.vendor}</p>
                      <p className="text-xs text-gray-500">{transaction.type}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No recent orders
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
              <p className="text-2xl font-semibold text-gray-900">{quickStats.pending_approvals}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{quickStats.pending_refunds}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{quickStats.payouts_due}</p>
              <p className="text-xs text-gray-500">Payouts Due</p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/refunds?status=pending"
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{quickStats.open_disputes}</p>
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
          {pendingRefunds.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Order</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Customer</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Vendor</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Reason</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingRefunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{refund.order_number}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{refund.customer}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{refund.vendor}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(refund.amount)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{refund.reason}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{refund.date}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/refunds/${refund.id}`}
                        className="px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded hover:bg-gray-800"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              No pending refund requests
            </div>
          )}
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
