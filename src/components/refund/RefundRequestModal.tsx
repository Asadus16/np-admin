"use client";

import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, RefreshCw, XCircle, CheckCircle, Clock } from "lucide-react";
import { getRefundReasons, createRefundRequest } from "@/lib/refund";
import { cancelOrder } from "@/lib/order";
import { RefundReasonOption, RefundReason } from "@/types/refund";

interface RefundRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orderId: string;
  orderNumber: string;
  orderTotal: number;
  /** If true, also cancels the order before creating refund request */
  shouldCancelOrder?: boolean;
}

export function RefundRequestModal({
  isOpen,
  onClose,
  onSuccess,
  orderId,
  orderNumber,
  orderTotal,
  shouldCancelOrder = false,
}: RefundRequestModalProps) {
  const [reasons, setReasons] = useState<RefundReasonOption[]>([]);
  const [loadingReasons, setLoadingReasons] = useState(true);
  const [selectedReason, setSelectedReason] = useState<RefundReason | "">("");
  const [reasonDetails, setReasonDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadReasons();
    }
  }, [isOpen]);

  const loadReasons = async () => {
    setLoadingReasons(true);
    setError(null);
    try {
      const response = await getRefundReasons();
      setReasons(response.data);
    } catch (err) {
      console.error("Failed to load refund reasons:", err);
      setError("Failed to load refund reasons. Please try again.");
    } finally {
      setLoadingReasons(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      setError("Please select a reason for your refund request.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Create the refund request first (before cancelling, so status is still valid)
      await createRefundRequest(orderId, {
        reason: selectedReason,
        reason_details: reasonDetails || undefined,
      });

      // If shouldCancelOrder is true, cancel the order after refund request is created
      if (shouldCancelOrder) {
        await cancelOrder(orderId, reasonDetails || undefined);
      }

      // Show success view instead of closing immediately
      setShowSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : shouldCancelOrder
        ? "Failed to cancel order and submit refund request"
        : "Failed to submit refund request";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    // If closing after success, call onSuccess to refresh the order
    if (showSuccess) {
      onSuccess();
    } else {
      onClose();
    }
    // Reset state
    setSelectedReason("");
    setReasonDetails("");
    setError(null);
    setShowSuccess(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Success View */}
        {showSuccess ? (
          <>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {shouldCancelOrder ? "Order Cancelled" : "Request Submitted"}
              </h3>
              <p className="text-gray-600 mb-6">
                {shouldCancelOrder
                  ? "Your order has been cancelled and a refund request has been submitted."
                  : "Your refund request has been submitted successfully."}
              </p>

              {/* Status Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pending Review</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Our team will review your request and determine the refund amount.
                      Once approved, the refund will be transferred to your bank account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-lg p-3 mb-6 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order</span>
                  <span className="font-medium text-gray-900">{orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Order Total</span>
                  <span className="font-medium text-gray-900">{formatCurrency(orderTotal)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Refund Status</span>
                  <span className="inline-flex items-center text-yellow-700 font-medium">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Review
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                You can track the status of your refund request on the order details page.
              </p>

              <button
                onClick={handleClose}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {shouldCancelOrder ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <RefreshCw className="h-5 w-5 text-gray-600" />
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {shouldCancelOrder ? "Cancel and Refund" : "Request Refund"}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order</span>
                <span className="font-medium text-gray-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium text-gray-900">{formatCurrency(orderTotal)}</span>
              </div>
            </div>

            {/* Info Notice */}
            <div className={`flex items-start gap-3 p-3 rounded-lg ${
              shouldCancelOrder
                ? "bg-amber-50 border border-amber-200"
                : "bg-blue-50 border border-blue-200"
            }`}>
              <AlertCircle className={`h-5 w-5 shrink-0 mt-0.5 ${
                shouldCancelOrder ? "text-amber-500" : "text-blue-500"
              }`} />
              <p className={`text-sm ${shouldCancelOrder ? "text-amber-700" : "text-blue-700"}`}>
                {shouldCancelOrder
                  ? "Your order will be cancelled and a refund request will be submitted. Our team will review your request and transfer the refund to your bank account."
                  : "Your refund request will be reviewed by our team. If approved, the refund will be transferred to your bank account."}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Reason Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for refund request <span className="text-red-500">*</span>
              </label>
              {loadingReasons ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              ) : (
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value as RefundReason)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  required
                >
                  <option value="">Select a reason...</option>
                  {reasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional details (optional)
              </label>
              <textarea
                value={reasonDetails}
                onChange={(e) => setReasonDetails(e.target.value)}
                placeholder="Please provide more details about your refund request..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                rows={3}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {reasonDetails.length}/1000
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end p-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loadingReasons || !selectedReason}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 inline-flex items-center ${
                shouldCancelOrder
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {submitting
                ? shouldCancelOrder ? "Processing..." : "Submitting..."
                : shouldCancelOrder ? "Cancel and Request Refund" : "Submit Request"}
            </button>
          </div>
        </form>
          </>
        )}
      </div>
    </div>
  );
}
