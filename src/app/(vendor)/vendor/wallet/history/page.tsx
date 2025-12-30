"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Download, DollarSign, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";

const transactions = [
  { id: 1, type: "payout", description: "Weekly Payout", amount: 2450, date: "Mar 15, 2024", status: "completed" },
  { id: 2, type: "earning", description: "Plumbing Repair - ORD-156", amount: 150, date: "Mar 14, 2024", status: "completed" },
  { id: 3, type: "earning", description: "Drain Cleaning - ORD-155", amount: 85, date: "Mar 14, 2024", status: "completed" },
  { id: 4, type: "fee", description: "Platform Fee (ORD-155)", amount: -8.50, date: "Mar 14, 2024", status: "completed" },
  { id: 5, type: "earning", description: "Water Heater Install - ORD-154", amount: 350, date: "Mar 13, 2024", status: "completed" },
  { id: 6, type: "fee", description: "Platform Fee (ORD-154)", amount: -35.00, date: "Mar 13, 2024", status: "completed" },
  { id: 7, type: "payout", description: "Weekly Payout", amount: 1890, date: "Mar 8, 2024", status: "completed" },
  { id: 8, type: "earning", description: "Pipe Inspection - ORD-148", amount: 150, date: "Mar 7, 2024", status: "completed" },
];

export default function TransactionHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredTransactions = transactions
    .filter((tx) =>
      tx.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((tx) => filterType === "all" || tx.type === filterType);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/wallet" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Transaction History</h1>
          <p className="text-sm text-gray-500 mt-1">View all your earnings, payouts, and fees</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Types</option>
            <option value="earning">Earnings</option>
            <option value="payout">Payouts</option>
            <option value="fee">Fees</option>
          </select>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  tx.type === "payout" ? "bg-blue-100" :
                  tx.type === "earning" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {tx.type === "payout" ? (
                    <ArrowUpRight className="h-4 w-4 text-blue-600" />
                  ) : tx.type === "earning" ? (
                    <DollarSign className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {tx.date}
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded capitalize">
                      {tx.type}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                tx.amount > 0 ? "text-green-600" : "text-red-600"
              }`}>
                {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
