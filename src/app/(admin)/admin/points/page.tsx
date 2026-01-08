"use client";

import { useState, useEffect } from "react";
import { Coins, Save, CheckCircle, AlertCircle, Info, Calculator } from "lucide-react";
import { getPointsSettings, updatePointsSettings } from "@/lib/points";
import { PointsSettings } from "@/types/points";
import { ApiException } from "@/lib/auth";

export default function PointsPage() {
  const [settings, setSettings] = useState<PointsSettings>({
    aed_per_point: 100,
    discount_per_point: 1,
    min_points_to_redeem: 4,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPointsSettings();
      setSettings(response.data);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || "Failed to load points settings");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error loading points settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaved(false);

    // Validation
    if (settings.aed_per_point <= 0) {
      setError("AED per point must be greater than 0");
      setIsSaving(false);
      return;
    }
    if (settings.discount_per_point <= 0) {
      setError("Discount per point must be greater than 0");
      setIsSaving(false);
      return;
    }
    if (settings.min_points_to_redeem < 1) {
      setError("Minimum points to redeem must be at least 1");
      setIsSaving(false);
      return;
    }

    try {
      await updatePointsSettings({
        aed_per_point: settings.aed_per_point,
        discount_per_point: settings.discount_per_point,
        min_points_to_redeem: settings.min_points_to_redeem,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || "Failed to update points settings");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error updating points settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const calculatePoints = (orderTotal: number): number => {
    return Math.floor(orderTotal / settings.aed_per_point);
  };

  const calculateDiscount = (points: number): number => {
    return points * settings.discount_per_point;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading points settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Points System</h1>
          <p className="text-sm text-gray-500 mt-1">Configure how customers earn and redeem points</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earning Points */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Earning Points</h2>
              <p className="text-sm text-gray-500 mt-1">Configure how customers earn points from orders</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spend X AED to earn 1 point
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">AED</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={settings.aed_per_point}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        aed_per_point: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-12 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                    placeholder="100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Formula: Points Earned = floor(Order Total / X)
                </p>
              </div>
            </div>
          </div>

          {/* Redeeming Points */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Redeeming Points</h2>
              <p className="text-sm text-gray-500 mt-1">Configure how customers redeem points for discounts</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  1 point = Y AED discount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">AED</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={settings.discount_per_point}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        discount_per_point: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-12 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                    placeholder="1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Discount = Points Redeemed × Y
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum points required to redeem
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={settings.min_points_to_redeem}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      min_points_to_redeem: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                  placeholder="4"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Customers must have at least this many points to redeem
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Examples & Info */}
        <div className="space-y-6">
          {/* Examples Card */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-gray-600" />
                <h2 className="text-lg font-medium text-gray-900">Examples</h2>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Earning Points:</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">
                      Order: <span className="font-medium text-gray-900">50 AED</span>
                    </p>
                    <p className="text-gray-500">
                      Points: <span className="font-medium">{calculatePoints(50)}</span>
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">
                      Order: <span className="font-medium text-gray-900">100 AED</span>
                    </p>
                    <p className="text-gray-500">
                      Points: <span className="font-medium">{calculatePoints(100)}</span>
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">
                      Order: <span className="font-medium text-gray-900">250 AED</span>
                    </p>
                    <p className="text-gray-500">
                      Points: <span className="font-medium">{calculatePoints(250)}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Redeeming Points:</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">
                      Redeem: <span className="font-medium text-gray-900">4 points</span>
                    </p>
                    <p className="text-gray-500">
                      Discount: <span className="font-medium">{calculateDiscount(4).toFixed(2)} AED</span>
                    </p>
                  </div>
                  {settings.min_points_to_redeem > 0 && (
                    <div className="bg-blue-50 p-2 rounded border border-blue-200">
                      <p className="text-xs text-blue-700">
                        Minimum required: <span className="font-medium">{settings.min_points_to_redeem} points</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">How it works</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Points are always whole numbers (rounded down)</li>
                    <li>• Customers earn points automatically on order completion</li>
                    <li>• Points can be redeemed at checkout</li>
                    <li>• Minimum points must be met before redemption</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
