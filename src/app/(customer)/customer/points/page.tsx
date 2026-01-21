"use client";

import { useState } from "react";
import { Gift, TrendingUp, ShoppingCart, ArrowUp, ArrowDown, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { usePointsBalance } from "@/hooks/usePointsBalance";
import { usePointsHistory } from "@/hooks/usePointsHistory";
import { format } from "date-fns";
import type { PointsTransaction } from "@/types/points";

// Default discount per point (1 point = 1 AED discount)
// This matches the typical default setting and actual redemption will use the correct value from the API
const DEFAULT_DISCOUNT_PER_POINT = 1;

// Predefined reward tiers based on points
const getRewardTiers = (discountPerPoint: number) => [
  { id: 1, name: "AED 50 Off", points: Math.ceil(50 / discountPerPoint), description: "Get AED 50 off your next order" },
  { id: 2, name: "AED 100 Off", points: Math.ceil(100 / discountPerPoint), description: "Get AED 100 off your next order" },
  { id: 3, name: "AED 200 Off", points: Math.ceil(200 / discountPerPoint), description: "Get AED 200 off your next order" },
  { id: 4, name: "AED 500 Off", points: Math.ceil(500 / discountPerPoint), description: "Get AED 500 off your next order" },
];

export default function PointsPage() {
  const [filter, setFilter] = useState<"all" | "earned" | "redeemed" | "expired" | "adjusted">("all");
  const [page, setPage] = useState(1);
  
  // Use default discount per point (1 AED per point)
  // The actual redemption calculation will use the correct value from the API
  const discountPerPoint = DEFAULT_DISCOUNT_PER_POINT;

  const { balance, loading: balanceLoading, error: balanceError, refresh: refreshBalance } = usePointsBalance();
  const { history, loading: historyLoading, error: historyError } = usePointsHistory({
    page,
    perPage: 20,
    type: filter === "all" ? undefined : filter,
  });

  const rewards = getRewardTiers(discountPerPoint);

  const filteredTransactions = history?.data || [];

  // Calculate AED value from points
  const calculateAEDValue = (points: number) => {
    return (points * discountPerPoint).toFixed(2);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "earned":
      case "adjusted":
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case "redeemed":
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      case "expired":
        return <Calendar className="h-4 w-4 text-gray-600" />;
      default:
        return <ArrowUp className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earned":
      case "adjusted":
        return "text-green-600";
      case "redeemed":
        return "text-red-600";
      case "expired":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  if (balanceLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading points data...</p>
        </div>
      </div>
    );
  }

  if (balanceError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error Loading Points</p>
              <p className="text-sm text-red-700 mt-1">{balanceError}</p>
              <button
                onClick={refreshBalance}
                className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No balance data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Points & Rewards</h1>
          <p className="text-sm text-gray-500 mt-1">Earn and redeem points on every order</p>
        </div>
        <button
          onClick={refreshBalance}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Points Balance Card */}
      <div className="bg-gray-900 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Available Points</p>
            <p className="text-4xl font-bold mt-1">{balance.available_points.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-2">
              = AED {calculateAEDValue(balance.available_points)} value
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Gift className="h-8 w-8" />
          </div>
        </div>
        {balance.expiring_soon > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20 text-sm">
            <p className="text-yellow-300">
              ⚠️ {balance.expiring_soon} points expiring soon
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
              <p className="text-2xl font-semibold text-gray-900">{balance.lifetime_earned.toLocaleString()}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{balance.lifetime_redeemed.toLocaleString()}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{balance.pending_points.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Pending Points</p>
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
          {rewards.map((reward) => {
            const canRedeem = balance.available_points >= reward.points;
            return (
              <div
                key={reward.id}
                className={`p-4 rounded-lg border-2 ${
                  canRedeem
                    ? "border-gray-300 bg-gray-50 hover:border-gray-400 transition-colors"
                    : "border-gray-200 bg-gray-50 opacity-75"
                }`}
              >
                <p className="font-medium text-gray-900">{reward.name}</p>
                <p className="text-xs text-gray-500 mt-1">{reward.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">{reward.points} pts</span>
                  <button
                    disabled={!canRedeem}
                    className={`px-3 py-1 text-xs font-medium rounded-lg ${
                      canRedeem
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-gray-900">Points History</h2>
            <p className="text-sm text-gray-500">Your points transactions</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "earned", "redeemed", "expired", "adjusted"] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
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
        {historyLoading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading history...</p>
          </div>
        ) : historyError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg m-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 mt-1">{historyError}</p>
              </div>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">No transactions found</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((tx: PointsTransaction) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-gray-100 flex-shrink-0">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                      {tx.order_number && (
                        <p className="text-xs text-gray-500 mt-1">Order: {tx.order_number}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(tx.created_at), "MMM dd, yyyy HH:mm")}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right ml-4">
                    <span className={`text-sm font-semibold ${getTransactionColor(tx.type)}`}>
                      {tx.points > 0 ? "+" : ""}{tx.points} pts
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Balance: {tx.balance_after}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {history && history.meta.last_page > 1 && (
              <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing {history.meta.from} to {history.meta.to} of {history.meta.total} transactions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600 flex items-center">
                    Page {history.meta.current_page} of {history.meta.last_page}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === history.meta.last_page}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
