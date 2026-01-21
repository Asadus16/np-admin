"use client";

import { useState } from "react";
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Clock, Gift, Info, Coins } from "lucide-react";
import Link from "next/link";

const recentTransactions = [
  { id: 1, type: "payout", description: "Weekly Payout", amount: 2450, date: "Mar 15, 2024", status: "completed" },
  { id: 2, type: "earning", description: "Job ORD-156", amount: 150, date: "Mar 14, 2024", status: "completed" },
  { id: 3, type: "earning", description: "Job ORD-155", amount: 85, date: "Mar 14, 2024", status: "completed" },
  { id: 4, type: "fee", description: "Platform Fee", amount: -12.50, date: "Mar 14, 2024", status: "completed" },
  { id: 5, type: "earning", description: "Job ORD-154", amount: 350, date: "Mar 13, 2024", status: "completed" },
];

const pointsTransactions = [
  { id: 1, type: "redemption", customer: "John Smith", order: "ORD-156", points: 500, value: 50, date: "Mar 14, 2024" },
  { id: 2, type: "redemption", customer: "Sarah Johnson", order: "ORD-155", points: 200, value: 20, date: "Mar 14, 2024" },
  { id: 3, type: "redemption", customer: "Mike Brown", order: "ORD-152", points: 1000, value: 100, date: "Mar 12, 2024" },
  { id: 4, type: "redemption", customer: "Emily Davis", order: "ORD-149", points: 350, value: 35, date: "Mar 10, 2024" },
];

const pointsStats = {
  totalRedemptions: 2050,
  totalValue: 205,
  thisMonth: 1700,
  lastMonth: 1250,
};

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"transactions" | "points">("transactions");

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

      {/* Points-Based Payments Banner */}
      <div className="bg-gray-900 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Points-Based Payments</h2>
              <p className="text-sm text-gray-400 mt-1 max-w-md">
                Customers can use their earned points to pay for services. You receive the full payment amount - we cover the points redemption.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{pointsStats.totalRedemptions.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Points redeemed on your services</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-gray-400">Total Points Value</p>
            <p className="text-xl font-semibold mt-1">AED {pointsStats.totalValue}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-gray-400">This Month</p>
            <p className="text-xl font-semibold mt-1">{pointsStats.thisMonth} pts</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-gray-400">Last Month</p>
            <p className="text-xl font-semibold mt-1">{pointsStats.lastMonth} pts</p>
          </div>
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

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "transactions"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Recent Transactions
            </button>
            <button
              onClick={() => setActiveTab("points")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "points"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Points Redemptions
            </button>
          </div>
        </div>

        {activeTab === "transactions" ? (
          <div>
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
        ) : (
          <div>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium text-gray-900">Points Redemptions</h2>
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="hidden group-hover:block absolute left-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                    When customers pay with points, you receive the full service amount. The platform covers the points redemption value.
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray-500">Showing recent redemptions</span>
            </div>
            <div className="divide-y divide-gray-200">
              {pointsTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Gift className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.customer}</p>
                      <p className="text-xs text-gray-500">{tx.order} - {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{tx.points} pts</p>
                    <p className="text-xs text-gray-500">= AED {tx.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* How Points Work */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Coins className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">How Points-Based Payments Work</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold text-sm shrink-0">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Customer Earns Points</p>
              <p className="text-xs text-gray-500 mt-1">Customers earn points on every completed order (1 point per AED 10 spent)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold text-sm shrink-0">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Points Applied at Checkout</p>
              <p className="text-xs text-gray-500 mt-1">Customers can redeem points to pay for all or part of their service (10 pts = AED 1)</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold text-sm shrink-0">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">You Get Full Payment</p>
              <p className="text-xs text-gray-500 mt-1">The platform covers the points value - you receive the full service amount</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
