"use client";

import { useState } from "react";
import { Gift, TrendingUp, ShoppingCart, ArrowUp, ArrowDown, Download, Calendar } from "lucide-react";

// Static points data
const pointsData = {
  balance: 1850,
  lifetimeEarned: 3200,
  lifetimeRedeemed: 1350,
  expiringPoints: 150,
  expiryDate: "Mar 31, 2025",
};

const transactions = [
  { id: 1, type: "earned", amount: 35, description: "Order ORD-2024-001", date: "Dec 28, 2024", order: "ORD-2024-001" },
  { id: 2, type: "redeemed", amount: 200, description: "Discount on Order", date: "Dec 25, 2024", order: "ORD-2024-003" },
  { id: 3, type: "earned", amount: 45, description: "Order ORD-2024-003", date: "Dec 25, 2024", order: "ORD-2024-003" },
  { id: 4, type: "earned", amount: 28, description: "Order ORD-2024-004", date: "Dec 22, 2024", order: "ORD-2024-004" },
  { id: 5, type: "earned", amount: 65, description: "Order ORD-2024-005", date: "Dec 20, 2024", order: "ORD-2024-005" },
  { id: 6, type: "earned", amount: 40, description: "Order ORD-2024-007", date: "Dec 15, 2024", order: "ORD-2024-007" },
  { id: 7, type: "redeemed", amount: 500, description: "Discount on Order", date: "Dec 10, 2024", order: "ORD-2024-008" },
  { id: 8, type: "earned", amount: 18, description: "Order ORD-2024-008", date: "Dec 12, 2024", order: "ORD-2024-008" },
  { id: 9, type: "bonus", amount: 100, description: "Welcome Bonus", date: "Dec 1, 2024", order: null },
  { id: 10, type: "earned", amount: 50, description: "Referral Bonus", date: "Nov 28, 2024", order: null },
];

const rewards = [
  { id: 1, name: "AED 50 Off", points: 500, description: "Get AED 50 off your next order" },
  { id: 2, name: "AED 100 Off", points: 950, description: "Get AED 100 off your next order" },
  { id: 3, name: "Free Cleaning", points: 2500, description: "Redeem for a free basic cleaning service" },
  { id: 4, name: "Priority Booking", points: 300, description: "Get priority booking for 1 month" },
];

export default function PointsPage() {
  const [filter, setFilter] = useState<"all" | "earned" | "redeemed">("all");

  const filteredTransactions = filter === "all"
    ? transactions
    : transactions.filter((t) => t.type === filter || (filter === "earned" && t.type === "bonus"));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Points & Rewards</h1>
          <p className="text-sm text-gray-500 mt-1">Earn and redeem points on every order</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export History
        </button>
      </div>

      {/* Points Balance Card */}
      <div className="bg-gray-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Available Points</p>
            <p className="text-4xl font-bold mt-1">{pointsData.balance.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-2">
              = AED {Math.floor(pointsData.balance / 10)} value
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Gift className="h-8 w-8" />
          </div>
        </div>
        {pointsData.expiringPoints > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20 text-sm">
            <p className="text-gray-400">
              {pointsData.expiringPoints} points expiring on {pointsData.expiryDate}
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{pointsData.lifetimeEarned.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Lifetime Earned</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{pointsData.lifetimeRedeemed.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Redeemed</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Gift className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">10%</p>
              <p className="text-sm text-gray-500">Earn Rate (per AED)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Available Rewards</h2>
          <p className="text-sm text-gray-500">Redeem your points for these rewards</p>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`p-4 rounded-lg border-2 ${
                pointsData.balance >= reward.points
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <p className="font-medium text-gray-900">{reward.name}</p>
              <p className="text-xs text-gray-500 mt-1">{reward.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">{reward.points} pts</span>
                <button
                  disabled={pointsData.balance < reward.points}
                  className={`px-3 py-1 text-xs font-medium rounded-lg ${
                    pointsData.balance >= reward.points
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-gray-900">Points History</h2>
            <p className="text-sm text-gray-500">Your points transactions</p>
          </div>
          <div className="flex gap-2">
            {(["all", "earned", "redeemed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize ${
                  filter === f
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-gray-100">
                  {tx.type === "earned" || tx.type === "bonus" ? (
                    <ArrowUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {tx.date}
                  </div>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {tx.type === "earned" || tx.type === "bonus" ? "+" : "-"}{tx.amount} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
