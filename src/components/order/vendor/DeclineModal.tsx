"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { DeclineModalProps } from "./types";

export function DeclineModal({
  isOpen,
  onClose,
  onConfirm,
  reason,
  onReasonChange,
  loading,
}: DeclineModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-medium text-gray-900">Decline Order</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to decline this order? This action cannot be undone.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Enter reason for declining..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Decline Order
          </button>
        </div>
      </div>
    </div>
  );
}
