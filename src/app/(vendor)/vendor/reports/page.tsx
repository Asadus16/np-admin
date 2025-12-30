"use client";

import { useState } from "react";
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

const jobStats = {
  total: 156,
  completed: 142,
  cancelled: 8,
  inProgress: 6,
  completionRate: 94.7,
};

const monthlyData = [
  { month: "Jan", jobs: 42 },
  { month: "Feb", jobs: 38 },
  { month: "Mar", jobs: 56 },
];

const topServices = [
  { name: "Plumbing Repair", count: 45, revenue: 3825 },
  { name: "Drain Cleaning", count: 32, revenue: 3840 },
  { name: "Water Heater Install", count: 28, revenue: 9800 },
  { name: "Pipe Inspection", count: 24, revenue: 3600 },
  { name: "Faucet Replacement", count: 27, revenue: 2565 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("month");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Jobs Report</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your job performance (read-only)</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3">
        <Link
          href="/vendor/reports/earnings"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Earnings Report
        </Link>
        <Link
          href="/vendor/reports/utilization"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Utilization Report
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Jobs</p>
          <p className="text-2xl font-semibold text-gray-900">{jobStats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold text-green-600">{jobStats.completed}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-semibold text-blue-600">{jobStats.inProgress}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-2xl font-semibold text-red-600">{jobStats.cancelled}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <p className="text-2xl font-semibold text-gray-900">{jobStats.completionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Trend</h2>
          <div className="flex items-end justify-between h-48 gap-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gray-900 rounded-t"
                  style={{ height: `${(data.jobs / 60) * 100}%` }}
                />
                <p className="text-sm text-gray-500 mt-2">{data.month}</p>
                <p className="text-xs text-gray-400">{data.jobs} jobs</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Top Services</h2>
          <div className="space-y-4">
            {topServices.map((service, index) => (
              <div key={service.name} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-400 w-4">{index + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{service.name}</span>
                    <span className="text-sm text-gray-500">{service.count} jobs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full"
                      style={{ width: `${(service.count / 50) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">${service.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
