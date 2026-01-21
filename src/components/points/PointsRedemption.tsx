"use client";

import { useState, useEffect } from 'react';
import { usePointsBalance } from '@/hooks/usePointsBalance';
import { calculateRedemption, redeemPoints, cancelPointsRedemption } from '@/lib/customerPoints';
import { Coins, CheckCircle, AlertCircle, X } from 'lucide-react';

interface PointsRedemptionProps {
  orderId: number;
  orderTotal: number;
  onRedemptionSuccess?: (discount: number) => void;
  onRedemptionCancel?: () => void;
}

export default function PointsRedemption({
  orderId,
  orderTotal,
  onRedemptionSuccess,
  onRedemptionCancel,
}: PointsRedemptionProps) {
  const { balance, refresh } = usePointsBalance();
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [calculation, setCalculation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedeemed, setIsRedeemed] = useState(false);

  useEffect(() => {
    if (pointsToRedeem > 0 && balance) {
      const timeoutId = setTimeout(() => {
        calculateDiscount();
      }, 500); // Debounce
      return () => clearTimeout(timeoutId);
    } else {
      setCalculation(null);
    }
  }, [pointsToRedeem, orderTotal]);

  const calculateDiscount = async () => {
    if (!pointsToRedeem || pointsToRedeem <= 0) {
      setCalculation(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await calculateRedemption(pointsToRedeem, orderTotal);
      setCalculation(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate redemption');
      setCalculation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!pointsToRedeem || !calculation?.can_redeem) return;

    try {
      setLoading(true);
      setError(null);
      const response = await redeemPoints(orderId, pointsToRedeem);
      setIsRedeemed(true);
      await refresh();
      onRedemptionSuccess?.(response.data.discount_amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem points');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError(null);
      await cancelPointsRedemption(orderId);
      setIsRedeemed(false);
      setPointsToRedeem(0);
      setCalculation(null);
      await refresh();
      onRedemptionCancel?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel redemption');
    } finally {
      setLoading(false);
    }
  };

  if (!balance || balance.points === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500">
        <Coins className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p>You don't have any points to redeem.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Redeem Points</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Coins className="h-4 w-4" />
          <span>Available: {balance.points} points</span>
        </div>
      </div>

      {!isRedeemed ? (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Points to Redeem
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={calculation?.min_points_required || 1}
                max={balance.points}
                value={pointsToRedeem || ''}
                onChange={(e) => setPointsToRedeem(parseInt(e.target.value) || 0)}
                disabled={loading}
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 disabled:opacity-50"
                placeholder="Enter points"
              />
              <button
                onClick={() => setPointsToRedeem(balance.points)}
                disabled={loading}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Use All
              </button>
            </div>
          </div>

          {calculation && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Discount:</span>
                <span className="text-lg font-semibold text-green-600">
                  -{calculation.discount_amount.toFixed(2)} AED
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Total:</span>
                <span className="text-lg font-semibold text-gray-900">
                  {calculation.order_total_after_discount.toFixed(2)} AED
                </span>
              </div>
              {!calculation.can_redeem && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {pointsToRedeem < calculation.min_points_required
                    ? `Minimum ${calculation.min_points_required} points required`
                    : 'Insufficient points'}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleRedeem}
            disabled={loading || !calculation?.can_redeem || pointsToRedeem === 0}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Redeem Points'}
          </button>
        </>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <p className="font-medium">
              {pointsToRedeem} points redeemed successfully!
            </p>
          </div>
          <p className="text-sm text-green-700">
            Discount: {calculation?.discount_amount.toFixed(2)} AED
          </p>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-green-800 bg-white border border-green-300 rounded-lg hover:bg-green-50 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Cancel Redemption'}
          </button>
        </div>
      )}
    </div>
  );
}
