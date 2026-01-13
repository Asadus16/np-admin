"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, DollarSign, CheckCircle, XCircle, Clock, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  getAdminPayout,
  approvePayout,
  markPayoutPaid,
  cancelAdminPayout,
  formatCurrency,
  getPayoutStatusDisplay,
  formatDate,
  formatDateTime,
} from "@/lib/vendorPayout";
import { VendorPayout } from "@/types/vendorPayout";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPayoutDetailPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const payoutId = params.id as string;
  const [payout, setPayout] = useState<VendorPayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<"approve" | "mark-paid" | null>(null);
  const [approvedAmount, setApprovedAmount] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [paymentNotes, setPaymentNotes] = useState<string>("");

  useEffect(() => {
    if (!token || !payoutId) return;

    const fetchPayout = async () => {
      setIsLoading(true);
      try {
        const response = await getAdminPayout(payoutId);
        setPayout(response.data);
        setApprovedAmount(response.data.requested_amount.toFixed(2));
      } catch (err: any) {
        setError(err.message || "Failed to load payout");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayout();
  }, [token, payoutId]);

  const handleApprove = async () => {
    if (!payout) return;

    setIsProcessing(true);
    try {
      await approvePayout(payoutId, {
        approved_amount: parseFloat(approvedAmount),
        admin_notes: adminNotes || undefined,
      });
      router.push("/admin/payouts");
    } catch (err: any) {
      setError(err.message || "Failed to approve payout");
    } finally {
      setIsProcessing(false);
      setAction(null);
    }
  };

  const handleMarkPaid = async () => {
    if (!payout || !paymentReference) {
      setError("Payment reference is required");
      return;
    }

    setIsProcessing(true);
    try {
      await markPayoutPaid(payoutId, {
        payment_reference: paymentReference,
        payment_notes: paymentNotes || undefined,
      });
      router.push("/admin/payouts");
    } catch (err: any) {
      setError(err.message || "Failed to mark payout as paid");
    } finally {
      setIsProcessing(false);
      setAction(null);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this payout request?")) {
      return;
    }

    setIsProcessing(true);
    try {
      await cancelAdminPayout(payoutId, adminNotes || undefined);
      router.push("/admin/payouts");
    } catch (err: any) {
      setError(err.message || "Failed to cancel payout");
    } finally {
      setIsProcessing(false);
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
        <div className="text-center py-12 text-red-600">{error || "Payout not found"}</div>
      </div>
    );
  }

  const statusDisplay = getPayoutStatusDisplay(payout.status);
  const canApprove = payout.status === "pending";
  const canMarkPaid = payout.status === "processing";
  const canCancel = payout.status === "pending" || payout.status === "processing";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/payouts" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{payout.payout_number}</h1>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${statusDisplay.color}`}
            >
              {statusDisplay.label}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Payout Request Details</p>
        </div>
        <div className="flex gap-2">
          {canApprove && (
            <button
              onClick={() => setAction("approve")}
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Approve
            </button>
          )}
          {canMarkPaid && (
            <button
              onClick={() => setAction("mark-paid")}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Mark as Paid
            </button>
          )}
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="px-4 py-2 text-sm text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

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

          {/* Vendor Information */}
          {payout.company && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Vendor Information</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600">Company</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    <Link
                      href={`/admin/vendors/${payout.company.id}`}
                      className="hover:underline"
                    >
                      {payout.company.name}
                    </Link>
                  </p>
                  <p className="text-xs text-gray-500">{payout.company.email}</p>
                </div>
                {payout.requested_by && (
                  <div>
                    <span className="text-sm text-gray-600">Requested By</span>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {payout.requested_by.name}
                    </p>
                    <p className="text-xs text-gray-500">{payout.requested_by.email}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Request Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Request Details</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Request Date</span>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {formatDateTime(payout.created_at)}
                </p>
              </div>
              {payout.request_notes && (
                <div>
                  <span className="text-sm text-gray-600">Vendor Notes</span>
                  <p className="text-sm text-gray-900 mt-1">{payout.request_notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Actions */}
          {payout.processed_by && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Admin Actions</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600">Processed By</span>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {payout.processed_by.name}
                  </p>
                  <p className="text-xs text-gray-500">{payout.processed_by.email}</p>
                </div>
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

        {/* Action Sidebar */}
        <div className="space-y-6">
          {/* Approve Form */}
          {action === "approve" && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Approve Payout</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approved Amount (AED)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={payout.requested_amount}
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Add notes about this approval..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => setAction(null)}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mark Paid Form */}
          {action === "mark-paid" && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Mark as Paid</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Reference *
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Bank transfer reference..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Notes
                  </label>
                  <textarea
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Add payment notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkPaid}
                    disabled={isProcessing || !paymentReference}
                    className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Mark as Paid"}
                  </button>
                  <button
                    onClick={() => setAction(null)}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status Timeline */}
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
