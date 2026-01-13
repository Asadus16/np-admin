"use client";

import { Clock, CheckCircle, XCircle } from "lucide-react";
import { RefundStatusCardProps } from "./types";
import { formatCurrency, formatDateTime } from "./helpers/orderFormatters";

const statusBadges = {
  pending: {
    icon: Clock,
    label: "Pending Review",
    className: "bg-yellow-100 text-yellow-800",
  },
  approved: {
    icon: CheckCircle,
    label: "Approved",
    className: "bg-blue-100 text-blue-800",
  },
  completed: {
    icon: CheckCircle,
    label: "Refunded",
    className: "bg-green-100 text-green-800",
  },
  rejected: {
    icon: XCircle,
    label: "Rejected",
    className: "bg-red-100 text-red-800",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    className: "bg-gray-100 text-gray-800",
  },
};

export function RefundStatusCard({ refundRequest }: RefundStatusCardProps) {
  const badgeConfig = statusBadges[refundRequest.status as keyof typeof statusBadges];
  const BadgeIcon = badgeConfig?.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Refund Request</h2>
          {badgeConfig && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeConfig.className}`}>
              <BadgeIcon className="h-3 w-3 mr-1" />
              {badgeConfig.label}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 space-y-4">
        {/* Reason */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Reason</p>
          <p className="text-sm text-gray-900">{refundRequest.reason_label}</p>
          {refundRequest.reason_details && (
            <p className="text-sm text-gray-600 mt-1">{refundRequest.reason_details}</p>
          )}
        </div>

        {/* Requested On */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Requested On</p>
          <p className="text-sm text-gray-900">{formatDateTime(refundRequest.created_at)}</p>
        </div>

        {/* Refund Amount - show when approved or completed */}
        {(refundRequest.status === "approved" || refundRequest.status === "completed") &&
          refundRequest.approved_amount && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-700">Refund Amount</p>
                  <p className="text-lg font-semibold text-green-800">
                    {formatCurrency(refundRequest.approved_amount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-600">
                    {refundRequest.refund_percentage}% of order total
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Vendor Response */}
        {refundRequest.vendor_response && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              {refundRequest.status === "rejected" ? "Rejection Reason" : "Vendor Notes"}
            </p>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              {refundRequest.vendor_response}
            </p>
          </div>
        )}

        {/* Transfer Reference - show when completed */}
        {refundRequest.status === "completed" && refundRequest.transfer_reference && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Transaction Reference</p>
            <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
              {refundRequest.transfer_reference}
            </p>
            {refundRequest.transfer_completed_at && (
              <p className="text-xs text-gray-500 mt-1">
                Refunded on {formatDateTime(refundRequest.transfer_completed_at)}
              </p>
            )}
          </div>
        )}

        {/* Pending status message */}
        {refundRequest.status === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Your refund request is being reviewed by the vendor. You will be notified once a decision is made.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
