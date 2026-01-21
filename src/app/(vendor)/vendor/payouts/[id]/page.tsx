"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, DollarSign, Calendar, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import {
  getVendorPayout,
  cancelVendorPayout,
  formatCurrency,
  getPayoutStatusDisplay,
  formatDate,
  formatDateTime,
} from "@/lib/vendorPayout";
import { VendorPayout } from "@/types/vendorPayout";
import { useAuth } from "@/hooks/useAuth";

export default function PayoutDetailPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const payoutId = params.id as string;
  const [payout, setPayout] = useState<VendorPayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !payoutId) return;

    const fetchPayout = async () => {
      setIsLoading(true);
      try {
        const response = await getVendorPayout(payoutId);
        setPayout(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to load payout");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayout();
  }, [token, payoutId]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this payout request?")) {
      return;
    }

    setIsCancelling(true);
    try {
      await cancelVendorPayout(payoutId);
      router.push("/vendor/payouts");
    } catch (err: any) {
      setError(err.message || "Failed to cancel payout");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">Loading payout details...</div>
      </div>
    );
  }

  if (!payout || error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12 text-red-600">
          {error || "Payout not found"}
        </div>
      </div>
    );
  }

  const statusDisplay = getPayoutStatusDisplay(payout.status);
  const canCancel = payout.status === "pending";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/vendor/payouts"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              {payout.payout_number}
            </h1>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${statusDisplay.color}`}
            >
              {statusDisplay.label}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Payout Request Details</p>
        </div>
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="px-4 py-2 text-sm text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            {isCancelling ? "Cancelling..." : "Cancel Request"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Amount Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Requested Amount</span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(payout.requested_amount, "AED")}
                </span>
              </div>
              {payout.approved_amount && (
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Approved Amount</span>
                  <span className="text-lg font-semibold text-green-600">
                    {formatCurrency(payout.approved_amount, "AED")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Request Details</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Requested By</span>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {payout.requested_by?.name || "N/A"}
                </p>
                <p className="text-xs text-gray-500">{payout.requested_by?.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Request Date</span>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {formatDateTime(payout.created_at)}
                </p>
              </div>
              {payout.request_notes && (
                <div>
                  <span className="text-sm text-gray-600">Notes</span>
                  <p className="text-sm text-gray-900 mt-1">{payout.request_notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Information */}
          {(payout.processed_by || payout.admin_notes) && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Information</h2>
              <div className="space-y-4">
                {payout.processed_by && (
                  <div>
                    <span className="text-sm text-gray-600">Processed By</span>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {payout.processed_by.name}
                    </p>
                    <p className="text-xs text-gray-500">{payout.processed_by.email}</p>
                  </div>
                )}
                {payout.processed_at && (
                  <div>
                    <span className="text-sm text-gray-600">Processed At</span>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDateTime(payout.processed_at)}
                    </p>
                  </div>
                )}
                {payout.admin_notes && (
                  <div>
                    <span className="text-sm text-gray-600">Admin Notes</span>
                    <p className="text-sm text-gray-900 mt-1">{payout.admin_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          {payout.status === "paid" && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
              <div className="space-y-4">
                {payout.payment_reference && (
                  <div>
                    <span className="text-sm text-gray-600">Payment Reference</span>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {payout.payment_reference}
                    </p>
                  </div>
                )}
                {payout.paid_at && (
                  <div>
                    <span className="text-sm text-gray-600">Paid At</span>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDateTime(payout.paid_at)}
                    </p>
                  </div>
                )}
                {payout.payment_notes && (
                  <div>
                    <span className="text-sm text-gray-600">Payment Notes</span>
                    <p className="text-sm text-gray-900 mt-1">{payout.payment_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Included */}
          {payout.order_ids && payout.order_ids.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Orders Included ({payout.order_ids.length})
              </h2>
              <div className="space-y-2">
                {payout.order_ids.map((orderId) => (
                  <div
                    key={orderId}
                    className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700"
                  >
                    Order ID: {orderId}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Request Created</p>
                  <p className="text-xs text-gray-500">{formatDate(payout.created_at)}</p>
                </div>
              </div>

              {payout.status !== "pending" && payout.processed_at && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-yellow-100 rounded-full">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {payout.status === "processing" ? "Processing" : "Approved"}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(payout.processed_at)}</p>
                  </div>
                </div>
              )}

              {payout.status === "paid" && payout.paid_at && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Payment Completed</p>
                    <p className="text-xs text-gray-500">{formatDate(payout.paid_at)}</p>
                  </div>
                </div>
              )}

              {payout.status === "cancelled" && (
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-red-100 rounded-full">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Cancelled</p>
                    <p className="text-xs text-gray-500">{formatDate(payout.updated_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
