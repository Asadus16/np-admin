"use client";

import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Building2,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  ArrowUpRight,
} from "lucide-react";

type ReportType = "overview" | "revenue" | "orders" | "vendors" | "customers";
type DateRange = "today" | "week" | "month" | "quarter" | "year" | "custom";

const overviewStats = {
  revenue: { current: 125450, previous: 98230, change: 27.7 },
  orders: { current: 1845, previous: 1523, change: 21.1 },
  avgOrderValue: { current: 68, previous: 64.5, change: 5.4 },
  customers: { current: 856, previous: 712, change: 20.2 },
  vendors: { current: 42, previous: 38, change: 10.5 },
  refunds: { current: 4520, previous: 5890, change: -23.3 },
};

const revenueByCategory = [
  { name: "Plumbing", value: 35420, percentage: 28 },
  { name: "Electrical", value: 28900, percentage: 23 },
  { name: "HVAC", value: 25340, percentage: 20 },
  { name: "Cleaning", value: 21560, percentage: 17 },
  { name: "Landscaping", value: 14230, percentage: 12 },
];

const topVendors = [
  { name: "Quick Fix Plumbing", orders: 245, revenue: 18450, rating: 4.8 },
  { name: "Spark Electric Co", orders: 198, revenue: 15320, rating: 4.7 },
  { name: "Cool Air HVAC", orders: 156, revenue: 14890, rating: 4.9 },
  { name: "Clean Pro Services", orders: 234, revenue: 12560, rating: 4.6 },
  { name: "Green Thumb Gardens", orders: 112, revenue: 8920, rating: 4.5 },
];

const recentExports = [
  { name: "December 2024 Revenue Report", type: "xlsx", date: "Dec 28, 2024", size: "2.4 MB" },
  { name: "Q4 2024 Vendor Performance", type: "pdf", date: "Dec 25, 2024", size: "1.8 MB" },
  { name: "November 2024 Orders Summary", type: "xlsx", date: "Dec 1, 2024", size: "3.1 MB" },
  { name: "Customer Analytics Q4", type: "pdf", date: "Nov 30, 2024", size: "2.2 MB" },
];

const monthlyRevenue = [
  { month: "Jan", value: 85000 },
  { month: "Feb", value: 92000 },
  { month: "Mar", value: 88000 },
  { month: "Apr", value: 95000 },
  { month: "May", value: 102000 },
  { month: "Jun", value: 98000 },
  { month: "Jul", value: 105000 },
  { month: "Aug", value: 112000 },
  { month: "Sep", value: 108000 },
  { month: "Oct", value: 115000 },
  { month: "Nov", value: 118000 },
  { month: "Dec", value: 125450 },
];

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>("overview");
  const [dateRange, setDateRange] = useState<DateRange>("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const reports = [
    { id: "overview" as const, name: "Overview", icon: BarChart3 },
    { id: "revenue" as const, name: "Revenue", icon: DollarSign },
    { id: "orders" as const, name: "Orders", icon: ShoppingCart },
    { id: "vendors" as const, name: "Vendors", icon: Building2 },
    { id: "customers" as const, name: "Customers", icon: Users },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">View and export platform analytics</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Date Range:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
              { value: "quarter", label: "This Quarter" },
              { value: "year", label: "This Year" },
              { value: "custom", label: "Custom" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value as DateRange)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  dateRange === option.value
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeReport === report.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <report.icon className="h-4 w-4" />
                {report.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeReport === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: "Revenue", value: `$${overviewStats.revenue.current.toLocaleString()}`, change: overviewStats.revenue.change, icon: DollarSign },
                  { label: "Orders", value: overviewStats.orders.current.toLocaleString(), change: overviewStats.orders.change, icon: ShoppingCart },
                  { label: "Avg Order", value: `$${overviewStats.avgOrderValue.current}`, change: overviewStats.avgOrderValue.change, icon: TrendingUp },
                  { label: "Customers", value: overviewStats.customers.current.toLocaleString(), change: overviewStats.customers.change, icon: Users },
                  { label: "Vendors", value: overviewStats.vendors.current, change: overviewStats.vendors.change, icon: Building2 },
                  { label: "Refunds", value: `$${overviewStats.refunds.current.toLocaleString()}`, change: overviewStats.refunds.change, icon: TrendingDown },
                ].map((metric) => (
                  <div key={metric.label} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <metric.icon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{metric.label}</span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900">{metric.value}</p>
                    <div className={`flex items-center gap-1 mt-1 text-sm ${
                      metric.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {metric.change >= 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Monthly Revenue</h3>
                  <div className="flex items-end gap-2 h-48">
                    {monthlyRevenue.map((month) => (
                      <div key={month.month} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gray-900 rounded-t"
                          style={{ height: `${(month.value / maxRevenue) * 160}px` }}
                        />
                        <span className="text-xs text-gray-500 mt-2">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue by Category */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Revenue by Category</h3>
                  <div className="space-y-3">
                    {revenueByCategory.map((category) => (
                      <div key={category.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">{category.name}</span>
                          <span className="text-gray-900 font-medium">${category.value.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-900 h-2 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Vendors */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Top Performing Vendors</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                        <th className="pb-3">Vendor</th>
                        <th className="pb-3">Orders</th>
                        <th className="pb-3">Revenue</th>
                        <th className="pb-3">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {topVendors.map((vendor) => (
                        <tr key={vendor.name}>
                          <td className="py-3 text-sm text-gray-900">{vendor.name}</td>
                          <td className="py-3 text-sm text-gray-600">{vendor.orders}</td>
                          <td className="py-3 text-sm text-gray-900 font-medium">${vendor.revenue.toLocaleString()}</td>
                          <td className="py-3 text-sm text-gray-600">{vendor.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeReport === "revenue" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">$125,450</p>
                  <p className="text-sm text-green-600 mt-1">+27.7% vs last period</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Platform Commission</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">$18,817</p>
                  <p className="text-xs text-gray-500 mt-1">15% average rate</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Vendor Payouts</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">$106,633</p>
                  <p className="text-xs text-gray-500 mt-1">85% of revenue</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Refunds</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">$4,520</p>
                  <p className="text-xs text-gray-500 mt-1">3.6% of revenue</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Detailed revenue charts and breakdowns</p>
                <p className="text-sm text-gray-400 mt-1">Export to see full analysis</p>
              </div>
            </div>
          )}

          {activeReport === "orders" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">1,845</p>
                  <p className="text-sm text-green-600 mt-1">+21.1% vs last period</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">1,678</p>
                  <p className="text-xs text-gray-500 mt-1">91% completion rate</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Cancelled</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">89</p>
                  <p className="text-xs text-gray-500 mt-1">4.8% cancellation rate</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Avg Order Value</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">$68</p>
                  <p className="text-sm text-green-600 mt-1">+5.4% vs last period</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Order trends and analysis</p>
                <p className="text-sm text-gray-400 mt-1">Export to see full breakdown</p>
              </div>
            </div>
          )}

          {activeReport === "vendors" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Active Vendors</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">42</p>
                  <p className="text-sm text-green-600 mt-1">+4 new this month</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Avg Rating</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">4.7</p>
                  <p className="text-xs text-gray-500 mt-1">Based on 2,456 reviews</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Avg Response Time</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">12min</p>
                  <p className="text-xs text-gray-500 mt-1">To confirm orders</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">94%</p>
                  <p className="text-xs text-gray-500 mt-1">Platform average</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Vendor performance metrics</p>
                <p className="text-sm text-gray-400 mt-1">Export to see detailed analysis</p>
              </div>
            </div>
          )}

          {activeReport === "customers" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">856</p>
                  <p className="text-sm text-green-600 mt-1">+144 new this month</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Repeat Customers</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">412</p>
                  <p className="text-xs text-gray-500 mt-1">48% retention rate</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Avg Orders/Customer</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">2.4</p>
                  <p className="text-xs text-gray-500 mt-1">Lifetime average</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Customer LTV</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">$163</p>
                  <p className="text-xs text-gray-500 mt-1">Average lifetime value</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Customer analytics and segments</p>
                <p className="text-sm text-gray-400 mt-1">Export to see detailed breakdown</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Exports</h2>
          <button className="text-sm text-gray-600 hover:text-gray-900">View All</button>
        </div>
        <div className="divide-y divide-gray-200">
          {recentExports.map((file, index) => (
            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                {file.type === "xlsx" ? (
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                ) : (
                  <FileText className="h-8 w-8 text-red-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{file.date} • {file.size}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Download className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
