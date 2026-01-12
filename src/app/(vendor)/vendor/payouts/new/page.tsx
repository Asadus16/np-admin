"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import {
  getVendorEarnings,
  createVendorPayout,
  formatCurrency,
} from "@/lib/vendorPayout";
import { VendorEarnings } from "@/types/vendorPayout";
import { useAuth } from "@/hooks/useAuth";

export default function NewPayoutPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [earnings, setEarnings] = useState<VendorEarnings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestedAmount, setRequestedAmount] = useState<string>("");
  const [requestNotes, setRequestNotes] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchEarnings = async () => {
      setIsLoading(true);
      try {
        const response = await getVendorEarnings();
        setEarnings(response.data);
        setRequestedAmount(response.data.total_earnings.toFixed(2));
      } catch (err: any) {
        setError(err.message || "Failed to load earnings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !earnings) return;

    const amount = parseFloat(requestedAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amount > earnings.total_earnings) {
      setError("Requested amount cannot exceed available earnings");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createVendorPayout({
        requested_amount: amount,
        request_notes: requestNotes || undefined,
        order_ids: selectedOrders.length > 0 ? selectedOrders : undefined,
      });

      router.push("/vendor/payouts");
    } catch (err: any) {
      setError(err.message || "Failed to create payout request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">Loading earnings...</div>
      </div>
    );
  }

  if (!earnings) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-red-600">
          {error || "Failed to load earnings"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/vendor/payouts"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Request Payout</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new payout request</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Amount ({earnings.currency})
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={earnings.total_earnings}
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Available: {formatCurrency(earnings.total_earnings, earnings.currency)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Add any notes about this payout request..."
              />
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
              <Link
                href="/vendor/payouts"
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>

          {/* Orders List */}
          {earnings.orders.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Orders Included ({earnings.total_orders})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {earnings.orders.map((order) => (
                  <div
                    key={order.order_id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {order.order_number}
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Order Total:</span>{" "}
                            {formatCurrency(order.order_total, earnings.currency)}
                          </div>
                          <div>
                            <span className="font-medium">Commission:</span>{" "}
                            {formatCurrency(order.commission_amount, earnings.currency)} (
                            {order.commission_rate}%)
                          </div>
                          <div>
                            <span className="font-medium">Your Earnings:</span>{" "}
                            <span className="text-green-600 font-semibold">
                              {formatCurrency(order.vendor_earnings, earnings.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-medium text-gray-900">{earnings.total_orders}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available Earnings</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(earnings.total_earnings, earnings.currency)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-900">Requested Amount</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(parseFloat(requestedAmount || "0"), earnings.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Payout Process</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Your request will be reviewed by admin</li>
                  <li>Once approved, payment will be processed</li>
                  <li>You'll be notified when payment is completed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
