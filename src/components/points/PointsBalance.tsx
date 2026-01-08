"use client";

import { usePointsBalance } from '@/hooks/usePointsBalance';
import { Coins, RefreshCw, AlertCircle } from 'lucide-react';

export default function PointsBalance() {
  const { balance, loading, error, refresh } = usePointsBalance();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading points balance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={refresh}
              className="mt-3 text-sm text-red-700 hover:text-red-800 underline"
            >
              Retry
            </button>
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
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Your Points</h2>
          <button
            onClick={refresh}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Refresh balance"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="text-5xl font-bold mb-2">{balance.points}</div>
        <p className="text-purple-100 text-sm">Available Points</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Lifetime Earned</p>
          <p className="text-2xl font-semibold text-gray-900">{balance.lifetime_earned}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Lifetime Redeemed</p>
          <p className="text-2xl font-semibold text-gray-900">{balance.lifetime_redeemed}</p>
        </div>
        {balance.pending_points > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Pending</p>
            <p className="text-2xl font-semibold text-gray-900">{balance.pending_points}</p>
          </div>
        )}
        {balance.expiring_soon > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-xs text-yellow-700 mb-1">Expiring Soon</p>
            <p className="text-2xl font-semibold text-yellow-800">{balance.expiring_soon}</p>
          </div>
        )}
      </div>
    </div>
  );
}
