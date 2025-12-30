"use client";

import { useState } from "react";
import { Search, Download, Calendar } from "lucide-react";

const fees = [
  { id: 1, transactionId: "TXN-001", vendor: "Mike's Plumbing", type: "Platform Fee", amount: 25.00, percentage: 5, date: "2024-03-18" },
  { id: 2, transactionId: "TXN-002", vendor: "ElectriCare Solutions", type: "Platform Fee", amount: 18.50, percentage: 5, date: "2024-03-18" },
  { id: 3, transactionId: "TXN-003", vendor: "Cool Air HVAC", type: "Platform Fee", amount: 45.00, percentage: 5, date: "2024-03-17" },
  { id: 4, transactionId: "TXN-004", vendor: "Mike's Plumbing", type: "Processing Fee", amount: 2.50, percentage: 2.9, date: "2024-03-17" },
  { id: 5, transactionId: "TXN-005", vendor: "Sparkle Cleaning Co", type: "Platform Fee", amount: 12.00, percentage: 5, date: "2024-03-16" },
  { id: 6, transactionId: "TXN-006", vendor: "ProPaint Services", type: "Processing Fee", amount: 3.80, percentage: 2.9, date: "2024-03-16" },
];

export default function FeesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFees = fees.filter((fee) =>
    fee.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const platformFees = fees.filter((f) => f.type === "Platform Fee").reduce((sum, f) => sum + f.amount, 0);
  const processingFees = fees.filter((f) => f.type === "Processing Fee").reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Fees</h1>
        <p className="text-sm text-gray-500 mt-1">View all transaction fees (read-only)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">${totalFees.toFixed(2)}</div>
          <p className="text-sm text-gray-500 mt-1">Total Fees</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">${platformFees.toFixed(2)}</div>
          <p className="text-sm text-gray-500 mt-1">Platform Fees</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">${processingFees.toFixed(2)}</div>
          <p className="text-sm text-gray-500 mt-1">Processing Fees</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{fees.length}</div>
          <p className="text-sm text-gray-500 mt-1">Total Transactions</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search fees..."
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
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Transaction ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Vendor</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Rate</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-gray-900">{fee.transactionId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{fee.vendor}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      fee.type === "Platform Fee" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                    }`}>
                      {fee.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{fee.percentage}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {fee.date}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-gray-900">${fee.amount.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No fees found</p>
          </div>
        )}
      </div>
    </div>
  );
}
