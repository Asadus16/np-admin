"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface RejectionReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
  companyName?: string;
}

export default function RejectionReasonDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  companyName,
}: RejectionReasonDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedReason = rejectionReason.trim();
    
    if (!trimmedReason) {
      setError("Please provide a reason for rejection.");
      return;
    }

    if (trimmedReason.length < 10) {
      setError("The rejection reason must be at least 10 characters.");
      return;
    }

    if (trimmedReason.length > 1000) {
      setError("The rejection reason must not exceed 1000 characters.");
      return;
    }

    onConfirm(trimmedReason);
  };

  const handleClose = () => {
    if (!isLoading) {
      setRejectionReason("");
      setError("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Reject Vendor Application</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4">
            {companyName && (
              <p className="text-sm text-gray-600 mb-4">
                You are about to reject <strong>{companyName}</strong>. Please provide a reason for rejection.
              </p>
            )}

            <div>
              <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  setError("");
                }}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                placeholder="Please provide a detailed reason for rejecting this vendor application..."
                disabled={isLoading}
                required
                minLength={10}
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  Minimum 10 characters, maximum 1000 characters
                </p>
                <p className="text-xs text-gray-500">
                  {rejectionReason.length}/1000
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !rejectionReason.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Rejecting..." : "Confirm Rejection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
