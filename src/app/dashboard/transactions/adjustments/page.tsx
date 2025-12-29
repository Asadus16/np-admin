"use client";

import { useState } from "react";
import { Search, Download, Calendar, ArrowUp, ArrowDown } from "lucide-react";

const adjustments = [
  { id: 1, adjustmentId: "ADJ-001", vendor: "Mike's Plumbing", reason: "Refund - Customer complaint", type: "credit", amount: 150.00, date: "2024-03-18", status: "applied" },
  { id: 2, adjustmentId: "ADJ-002", vendor: "ElectriCare Solutions", reason: "Late completion penalty", type: "debit", amount: 50.00, date: "2024-03-17", status: "applied" },
  { id: 3, adjustmentId: "ADJ-003", vendor: "Cool Air HVAC", reason: "Promotional bonus", type: "credit", amount: 200.00, date: "2024-03-16", status: "applied" },
  { id: 4, adjustmentId: "ADJ-004", vendor: "Sparkle Cleaning Co", reason: "Equipment damage deduction", type: "debit", amount: 75.00, date: "2024-03-15", status: "pending" },
  { id: 5, adjustmentId: "ADJ-005", vendor: "ProPaint Services", reason: "Performance bonus", type: "credit", amount: 100.00, date: "2024-03-14", status: "applied" },
];

export default function AdjustmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAdjustments = adjustments.filter((adj) =>
    adj.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adj.adjustmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    adj.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const credits = adjustments.filter((a) => a.type === "credit").reduce((sum, a) => sum + a.amount, 0);
  const debits = adjustments.filter((a) => a.type === "debit").reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Adjustments</h1>
        <p className="text-sm text-gray-500 mt-1">View all payment adjustments (read-only)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{adjustments.length}</div>
          <p className="text-sm text-gray-500 mt-1">Total Adjustments</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-1">
            <ArrowUp className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-semibold text-green-600">${credits.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Credits</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-1">
            <ArrowDown className="h-5 w-5 text-red-500" />
            <span className="text-2xl font-semibold text-red-600">${debits.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Debits</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">${(credits - debits).toFixed(2)}</div>
          <p className="text-sm text-gray-500 mt-1">Net Adjustment</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search adjustments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Adjustment ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Vendor</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Reason</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdjustments.map((adj) => (
                <tr key={adj.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-gray-900">{adj.adjustmentId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{adj.vendor}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{adj.reason}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      adj.type === "credit" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                      {adj.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {adj.date}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      adj.status === "applied" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {adj.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${adj.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {adj.type === "credit" ? "+" : "-"}${adj.amount.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAdjustments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No adjustments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
