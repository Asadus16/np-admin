"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building2,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Loader2,
  Banknote,
  Phone,
  Mail,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { getDispute, approveDispute, rejectDispute, completeDispute } from "@/lib/adminDispute";
import { AdminDispute, RefundStatus } from "@/types/refund";
import { formatPrice } from "@/lib/customerVendor";
import { useAppSelector } from "@/store/hooks";

export default function RefundDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { token } = useAppSelector((state) => state.auth);
  const id = params.id as string;
  const action = searchParams.get("action");

  const [dispute, setDispute] = useState<AdminDispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(action === "approve");
  const [showRejectModal, setShowRejectModal] = useState(action === "reject");
  const [showCompleteModal, setShowCompleteModal] = useState(action === "complete");

  // Form states
  const [refundPercentage, setRefundPercentage] = useState<number>(100);
  const [approveNotes, setApproveNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [transferNotes, setTransferNotes] = useState("");

  useEffect(() => {
    const fetchDispute = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await getDispute(id, token);
        setDispute(response.data);
      } catch (err) {
        setError("Failed to load dispute details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDispute();
  }, [id, token]);

  const handleApprove = async () => {
    if (!dispute || !token) return;
    try {
      setActionLoading(true);
      await approveDispute(id, {
        refund_percentage: refundPercentage,
        notes: approveNotes || undefined,
      }, token);
      setShowApproveModal(false);
      // Refresh dispute data
      const response = await getDispute(id, token);
      setDispute(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to approve dispute");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!dispute || !rejectReason || !token) return;
    try {
      setActionLoading(true);
      await rejectDispute(id, {
        reason: rejectReason,
      }, token);
      setShowRejectModal(false);
      // Refresh dispute data
      const response = await getDispute(id, token);
      setDispute(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to reject dispute");
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!dispute || !transferReference || !token) return;
    try {
      setActionLoading(true);
      await completeDispute(id, {
        transfer_reference: transferReference,
        notes: transferNotes || undefined,
      }, token);
      setShowCompleteModal(false);
      // Refresh dispute data
      const response = await getDispute(id, token);
      setDispute(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to mark as complete");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: RefundStatus) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "completed": return "bg-blue-100 text-blue-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "cancelled": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateApprovedAmount = () => {
    if (!dispute) return 0;
    return (dispute.order_total * refundPercentage) / 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-gray-600">{error || "Dispute not found"}</p>
        <Link href="/admin/refunds" className="text-blue-600 hover:underline">
          Back to Refunds
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/refunds"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                Refund Request
              </h1>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(dispute.status)}`}>
                {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Order: <Link href={`/admin/orders/${dispute.order_id}`} className="hover:underline">{dispute.order_number}</Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {dispute.status === "pending" && (
            <>
              <button
                onClick={() => setShowApproveModal(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </button>
            </>
          )}
          {dispute.status === "approved" && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Banknote className="h-4 w-4 mr-2" />
              Mark Transfer Complete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Refund Details */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Refund Details</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatPrice(dispute.order_total)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reason</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{dispute.reason_label}</p>
                </div>
              </div>

              {dispute.reason_details && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Additional Details</p>
                  <p className="text-sm text-gray-700">{dispute.reason_details}</p>
                </div>
              )}

              {dispute.approved_amount !== null && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Approved Amount</span>
                  </div>
                  <p className="text-2xl font-semibold text-green-700">
                    {formatPrice(dispute.approved_amount)}
                  </p>
                  {dispute.refund_percentage && (
                    <p className="text-sm text-green-600 mt-1">
                      {dispute.refund_percentage}% of order total
                    </p>
                  )}
                </div>
              )}

              {dispute.vendor_response && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Response/Notes</p>
                  <p className="text-sm text-gray-700">{dispute.vendor_response}</p>
                </div>
              )}

              {dispute.transfer_reference && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-blue-800 mb-2">Transfer Details</p>
                  <p className="text-sm text-blue-700">Reference: {dispute.transfer_reference}</p>
                  {dispute.transfer_notes && (
                    <p className="text-sm text-blue-600 mt-1">{dispute.transfer_notes}</p>
                  )}
                  {dispute.transfer_completed_at && (
                    <p className="text-xs text-blue-500 mt-2">
                      Completed: {formatDate(dispute.transfer_completed_at)}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Requested At</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(dispute.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reviewed At</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(dispute.reviewed_at)}</p>
                </div>
              </div>

              {dispute.reviewer && (
                <div>
                  <p className="text-sm text-gray-500">Reviewed By</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {dispute.reviewer.name} ({dispute.reviewer.role})
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Information */}
          {dispute.order && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Information</h2>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-gray-400" />
                    <Link href={`/admin/orders/${dispute.order.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                      {dispute.order.order_number}
                    </Link>
                  </div>
                  <span className="text-sm text-gray-500">{dispute.order.scheduled_date}</span>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Service</th>
                        <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-2">Qty</th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-2">Price</th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dispute.order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-center">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatPrice(item.price)}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">{formatPrice(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900 text-right">Total</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatPrice(dispute.order.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Payment: {dispute.order.payment_type}</span>
                </div>
              </div>
            </div>
          )}

          {/* Customer Bank Details (for approved refunds) */}
          {(dispute.status === "approved" || dispute.status === "completed") && dispute.customer.bank_details && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Customer Bank Details</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Bank Name</p>
                    <p className="text-sm font-medium text-gray-900">{dispute.customer.bank_details.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Holder</p>
                    <p className="text-sm font-medium text-gray-900">{dispute.customer.bank_details.account_holder_name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">IBAN</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">{dispute.customer.bank_details.iban}</p>
                </div>
                {dispute.customer.bank_details.swift_code && (
                  <div>
                    <p className="text-sm text-gray-500">SWIFT Code</p>
                    <p className="text-sm font-medium text-gray-900">{dispute.customer.bank_details.swift_code}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Customer</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {dispute.customer.name}
                </span>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{dispute.customer.email}</span>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{dispute.customer.phone}</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Company</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-10 w-10 text-gray-400" />
                <div>
                  <Link
                    href={`/admin/vendors/${dispute.company.id}`}
                    className="text-sm font-medium text-gray-900 hover:underline"
                  >
                    {dispute.company.name}
                  </Link>
                  {dispute.company.category && (
                    <p className="text-xs text-gray-500">{dispute.company.category.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 pl-1">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{dispute.company.email}</span>
              </div>
              <div className="flex items-center gap-2 pl-1">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{dispute.company.phone}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Timeline</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-green-100">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Refund Requested</p>
                    <p className="text-xs text-gray-500">{formatDate(dispute.created_at)}</p>
                    <p className="text-xs text-gray-500">{dispute.customer.name}</p>
                  </div>
                </div>

                {dispute.reviewed_at && (
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      dispute.status === "rejected" ? "bg-red-100" : "bg-green-100"
                    }`}>
                      {dispute.status === "rejected" ? (
                        <XCircle className="h-3 w-3 text-red-600" />
                      ) : (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {dispute.status === "rejected" ? "Rejected" : "Approved"}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(dispute.reviewed_at)}</p>
                      {dispute.reviewer && (
                        <p className="text-xs text-gray-500">{dispute.reviewer.name}</p>
                      )}
                    </div>
                  </div>
                )}

                {dispute.transfer_completed_at && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-blue-100">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Transfer Completed</p>
                      <p className="text-xs text-gray-500">{formatDate(dispute.transfer_completed_at)}</p>
                    </div>
                  </div>
                )}

                {dispute.status === "pending" && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-gray-100">
                      <Clock className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Awaiting Review</p>
                    </div>
                  </div>
                )}

                {dispute.status === "approved" && !dispute.transfer_completed_at && (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-gray-100">
                      <Clock className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Awaiting Transfer</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <Link
              href={`/admin/messages?customer=${dispute.customer.id}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <MessageSquare className="h-4 w-4" />
              Contact Customer
            </Link>
            <Link
              href={`/admin/vendors/${dispute.company.id}`}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Building2 className="h-4 w-4" />
              View Company
            </Link>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approve Refund</h3>
            <p className="text-sm text-gray-600 mb-4">
              Set the refund percentage for this request. The customer will receive the approved amount via bank transfer.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Percentage
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[25, 50, 75, 90, 100].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => setRefundPercentage(percent)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        refundPercentage === percent
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Order Total:</span>
                    <span className="text-gray-900">{formatPrice(dispute.order_total)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Refund Amount:</span>
                    <span className="font-semibold text-green-600">{formatPrice(calculateApprovedAmount())}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  placeholder="Internal notes about this approval..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  "Confirm Approval"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Refund</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this refund request. This will be communicated to the customer.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  placeholder="Explain why this refund request is being rejected..."
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  "Confirm Rejection"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Transfer Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mark Transfer Complete</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter the bank transfer reference to mark this refund as completed.
            </p>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <p className="text-sm text-green-800">
                Amount to transfer: <span className="font-semibold">{formatPrice(dispute.approved_amount || 0)}</span>
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transfer Reference *
                </label>
                <input
                  type="text"
                  value={transferReference}
                  onChange={(e) => setTransferReference(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  placeholder="Bank transfer reference number..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCompleteModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleComplete}
                disabled={actionLoading || !transferReference.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  "Confirm Complete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
