"use client";

import { BarChart3, Users, FileText, Database } from "lucide-react";

const usageData = {
  currentPlan: "Business",
  billingCycle: "Monthly",
  nextBilling: "2024-04-01",
  limits: [
    { name: "Active Vendors", used: 45, limit: 100, icon: Users },
    { name: "Monthly Jobs", used: 856, limit: 2000, icon: FileText },
    { name: "API Calls", used: 45200, limit: 100000, icon: BarChart3 },
    { name: "Storage", used: 2.4, limit: 10, unit: "GB", icon: Database },
  ],
  history: [
    { month: "March 2024", vendors: 45, jobs: 856, apiCalls: 45200, amount: 299 },
    { month: "February 2024", vendors: 42, jobs: 792, apiCalls: 41500, amount: 299 },
    { month: "January 2024", vendors: 38, jobs: 654, apiCalls: 38200, amount: 299 },
  ],
};

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Usage & Limits</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor your resource usage and limits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">Current Plan</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">{usageData.currentPlan}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">Billing Cycle</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">{usageData.billingCycle}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">Next Billing Date</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">{usageData.nextBilling}</div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Resource Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {usageData.limits.map((item, index) => {
            const percentage = (item.used / item.limit) * 100;
            const Icon = item.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {item.used.toLocaleString()} / {item.limit.toLocaleString()} {item.unit || ""}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      percentage > 90 ? "bg-red-500" : percentage > 70 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">{percentage.toFixed(1)}% used</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Usage History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Month</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Vendors</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Jobs</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">API Calls</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase pb-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usageData.history.map((row, index) => (
                <tr key={index}>
                  <td className="py-3 text-sm text-gray-900">{row.month}</td>
                  <td className="py-3 text-sm text-gray-500">{row.vendors}</td>
                  <td className="py-3 text-sm text-gray-500">{row.jobs}</td>
                  <td className="py-3 text-sm text-gray-500">{row.apiCalls.toLocaleString()}</td>
                  <td className="py-3 text-sm text-gray-900 text-right">${row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
