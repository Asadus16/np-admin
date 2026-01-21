"use client";

import { Loader2 } from "lucide-react";
import { CancelModalProps } from "./types";

export function CancelModal({
  isOpen,
  onClose,
  onConfirm,
  cancelling,
  cancelReason,
  onReasonChange,
}: CancelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Order</h3>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for cancellation (optional)
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Please let us know why you're cancelling..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            rows={3}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={cancelling}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            disabled={cancelling}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center"
          >
            {cancelling && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
