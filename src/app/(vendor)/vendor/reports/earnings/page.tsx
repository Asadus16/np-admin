"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, DollarSign, TrendingUp, Percent } from "lucide-react";

const earningsData = {
  total: 23650,
  platformFees: 2365,
  netEarnings: 21285,
  avgPerJob: 152,
};

const weeklyData = [
  { week: "Week 1", earnings: 4250, jobs: 28 },
  { week: "Week 2", earnings: 5120, jobs: 32 },
  { week: "Week 3", earnings: 4890, jobs: 30 },
  { week: "Week 4", earnings: 6025, jobs: 38 },
];

export default function EarningsReportPage() {
  const [dateRange, setDateRange] = useState("month");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/reports" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Earnings Report</h1>
          <p className="text-sm text-gray-500 mt-1">Detailed breakdown of your earnings (read-only)</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-100 rounded">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Total Earnings</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">${earningsData.total.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-red-100 rounded">
              <Percent className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">Platform Fees</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">-${earningsData.platformFees.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-100 rounded">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Net Earnings</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">${earningsData.netEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-purple-100 rounded">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Avg per Job</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">${earningsData.avgPerJob}</p>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Weekly Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Week</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Jobs</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Gross Earnings</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Fees (10%)</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Net Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {weeklyData.map((week) => (
                <tr key={week.week} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{week.week}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{week.jobs}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${week.earnings.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-600">-${(week.earnings * 0.1).toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">${(week.earnings * 0.9).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
