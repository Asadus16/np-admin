"use client";

import { useEffect, useState } from 'react';
import { calculateOrderPoints } from '@/lib/customerPoints';
import { Star, AlertCircle } from 'lucide-react';

interface OrderPointsDisplayProps {
  orderId: number;
  orderTotal: number;
}

export default function OrderPointsDisplay({
  orderId,
  orderTotal,
}: OrderPointsDisplayProps) {
  const [pointsInfo, setPointsInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await calculateOrderPoints(orderId);
        setPointsInfo(response.data);
      } catch (err) {
        console.error('Failed to calculate points:', err);
        setError(err instanceof Error ? err.message : 'Failed to calculate points');
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        <span>Calculating points...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  }

  if (!pointsInfo || pointsInfo.points_earned === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Star className="h-5 w-5 text-blue-600" />
        <p className="text-sm font-medium text-blue-900">
          You'll earn {pointsInfo.points_earned} points from this order
        </p>
      </div>
      <p className="text-xs text-blue-700">{pointsInfo.formula}</p>
    </div>
  );
}
