"use client";

import { useState } from "react";
import { Search, Download, Eye, Calendar } from "lucide-react";

const payoutRuns = [
  { id: 1, runId: "PR-2024-001", date: "2024-03-15", vendors: 45, totalAmount: 125400, status: "completed" },
  { id: 2, runId: "PR-2024-002", date: "2024-03-08", vendors: 42, totalAmount: 118200, status: "completed" },
  { id: 3, runId: "PR-2024-003", date: "2024-03-01", vendors: 48, totalAmount: 132800, status: "completed" },
  { id: 4, runId: "PR-2024-004", date: "2024-02-23", vendors: 41, totalAmount: 98500, status: "completed" },
  { id: 5, runId: "PR-2024-005", date: "2024-02-16", vendors: 39, totalAmount: 105600, status: "completed" },
];

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRuns = payoutRuns.filter((run) =>
    run.runId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPaid = payoutRuns.reduce((sum, run) => sum + run.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Payout Runs</h1>
        <p className="text-sm text-gray-500 mt-1">View all payout transactions (read-only)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{payoutRuns.length}</div>
          <p className="text-sm text-gray-500 mt-1">Total Runs</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            ${(totalPaid / 1000).toFixed(0)}K
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Paid Out</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {payoutRuns.reduce((sum, run) => sum + run.vendors, 0)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Vendors Paid</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-green-600">
            ${(totalPaid / payoutRuns.length).toFixed(0)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Avg Per Run</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search payout runs..."
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
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Run ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Vendors</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Total Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRuns.map((run) => (
                <tr key={run.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{run.runId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {run.date}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{run.vendors}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">${run.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
                      {run.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRuns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No payout runs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
