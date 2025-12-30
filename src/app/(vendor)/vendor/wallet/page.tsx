"use client";

import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

const recentTransactions = [
  { id: 1, type: "payout", description: "Weekly Payout", amount: 2450, date: "Mar 15, 2024", status: "completed" },
  { id: 2, type: "earning", description: "Job ORD-156", amount: 150, date: "Mar 14, 2024", status: "completed" },
  { id: 3, type: "earning", description: "Job ORD-155", amount: 85, date: "Mar 14, 2024", status: "completed" },
  { id: 4, type: "fee", description: "Platform Fee", amount: -12.50, date: "Mar 14, 2024", status: "completed" },
  { id: 5, type: "earning", description: "Job ORD-154", amount: 350, date: "Mar 13, 2024", status: "completed" },
];

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Wallet</h1>
        <p className="text-sm text-gray-500 mt-1">View your balance and earnings</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Available Balance</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">$3,245.00</p>
          <p className="text-sm text-gray-500 mt-2">Next payout: Mar 22</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">This Month</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">$8,920.00</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <ArrowUpRight className="h-4 w-4" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Pending</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">$585.00</p>
          <p className="text-sm text-gray-500 mt-2">From 3 jobs in progress</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link
          href="/vendor/wallet/payout-methods"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Manage Payout Methods
        </Link>
        <Link
          href="/vendor/wallet/history"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          View Full History
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
          <Link href="/vendor/wallet/history" className="text-sm text-gray-600 hover:text-gray-900">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  tx.type === "payout" ? "bg-blue-100" :
                  tx.type === "earning" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {tx.type === "payout" ? (
                    <ArrowUpRight className={`h-4 w-4 text-blue-600`} />
                  ) : tx.type === "earning" ? (
                    <DollarSign className={`h-4 w-4 text-green-600`} />
                  ) : (
                    <ArrowDownRight className={`h-4 w-4 text-red-600`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
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
      </div>
    </div>
  );
}
