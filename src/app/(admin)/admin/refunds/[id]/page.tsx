"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  FileText,
} from "lucide-react";

const refundData = {
  id: "REF-001",
  orderId: "ORD-1234",
  status: "pending",
  type: "partial",
  amount: 150,
  originalAmount: 350,
  reason: "Service incomplete",
  description: "The technician was unable to complete the full service as one of the required parts was not available. Customer requests partial refund for the incomplete portion.",
  requestedAt: "2024-12-28 10:30 AM",
  processedAt: null,
  customer: {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+971 50 123 4567",
  },
  vendor: {
    id: "VND-001",
    name: "Quick Fix Plumbing",
    email: "info@quickfix.com",
    phone: "+971 50 987 6543",
  },
  order: {
    id: "ORD-1234",
    date: "2024-12-27",
    services: [
      { name: "Pipe Leak Repair", price: 200 },
      { name: "Faucet Replacement", price: 150 },
    ],
    paymentMethod: "Card •••• 4242",
  },
  timeline: [
    { status: "Refund Requested", time: "2024-12-28 10:30 AM", user: "John Smith (Customer)", completed: true },
    { status: "Under Review", time: "2024-12-28 10:45 AM", user: "System", completed: true },
    { status: "Pending Approval", time: null, user: null, completed: false },
    { status: "Processed", time: null, user: null, completed: false },
  ],
  notes: [
    { id: 1, author: "John Smith", role: "Customer", text: "The pipe repair was done but the faucet replacement couldn't be completed.", createdAt: "2024-12-28 10:30 AM" },
    { id: 2, author: "Quick Fix Plumbing", role: "Vendor", text: "We confirm that the faucet replacement was not completed due to part unavailability. We support the partial refund request.", createdAt: "2024-12-28 11:00 AM" },
  ],
  attachments: [
    { name: "incomplete_work_photo.jpg", size: "2.4 MB" },
    { name: "service_report.pdf", size: "156 KB" },
  ],
};

export default function RefundDetailPage() {
  const params = useParams();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [newNote, setNewNote] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

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
              <h1 className="text-2xl font-semibold text-gray-900">{params.id}</h1>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(refundData.status)}`}>
                {refundData.status.charAt(0).toUpperCase() + refundData.status.slice(1)}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                refundData.type === "full" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
              }`}>
                {refundData.type.charAt(0).toUpperCase() + refundData.type.slice(1)} Refund
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Order: <Link href={`/admin/orders/${refundData.orderId}`} className="hover:underline">{refundData.orderId}</Link>
            </p>
          </div>
        </div>
        {refundData.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowApproveModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Refund
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </button>
          </div>
        )}
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
                  <p className="text-sm text-gray-500">Refund Amount</p>
                  <p className="text-2xl font-semibold text-gray-900">${refundData.amount}</p>
                  <p className="text-xs text-gray-500">of ${refundData.originalAmount} original order</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reason</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{refundData.reason}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{refundData.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Requested At</p>
                  <p className="text-sm text-gray-900 mt-1">{refundData.requestedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Processed At</p>
                  <p className="text-sm text-gray-900 mt-1">{refundData.processedAt || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Information</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-gray-400" />
                  <Link href={`/admin/orders/${refundData.order.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    {refundData.order.id}
                  </Link>
                </div>
                <span className="text-sm text-gray-500">{refundData.order.date}</span>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-2">Service</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {refundData.order.services.map((service, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{service.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">${service.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Paid via {refundData.order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Notes & Communication */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Notes & Communication</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {refundData.notes.map((note) => (
                <div key={note.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{note.author}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{note.role}</span>
                    </div>
                    <span className="text-xs text-gray-500">{note.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-600">{note.text}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                />
                <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {refundData.attachments.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Attachments</h2>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {refundData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <button className="text-sm text-gray-600 hover:text-gray-900">Download</button>
                    </div>
                  ))}
                </div>
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
                <Link href={`/admin/customers/${refundData.customer.id}`} className="text-sm text-gray-900 hover:underline">
                  {refundData.customer.name}
                </Link>
              </div>
              <p className="text-sm text-gray-600 pl-6">{refundData.customer.email}</p>
              <p className="text-sm text-gray-600 pl-6">{refundData.customer.phone}</p>
            </div>
          </div>

          {/* Vendor */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Vendor</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                <Link href={`/admin/vendors/${refundData.vendor.id}`} className="text-sm text-gray-900 hover:underline">
                  {refundData.vendor.name}
                </Link>
              </div>
              <p className="text-sm text-gray-600 pl-6">{refundData.vendor.email}</p>
              <p className="text-sm text-gray-600 pl-6">{refundData.vendor.phone}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Timeline</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {refundData.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      item.completed ? "bg-green-100" : "bg-gray-100"
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <Clock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${item.completed ? "text-gray-900" : "text-gray-400"}`}>
                        {item.status}
                      </p>
                      {item.time && (
                        <p className="text-xs text-gray-500">{item.time}</p>
                      )}
                      {item.user && (
                        <p className="text-xs text-gray-500">{item.user}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <MessageSquare className="h-4 w-4" />
              Contact Customer
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Building2 className="h-4 w-4" />
              Contact Vendor
            </button>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approve Refund</h3>
            <p className="text-sm text-gray-600 mb-4">
              You are about to approve a refund of <span className="font-semibold">${refundData.amount}</span> to {refundData.customer.name}.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refund Method</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                  <option value="original">Original Payment Method ({refundData.order.paymentMethod})</option>
                  <option value="wallet">Customer Wallet Credit</option>
                  <option value="points">Points ({refundData.amount * 10} pts)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (Optional)</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  placeholder="Internal notes about this refund..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">
                Confirm Approval
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
              Please provide a reason for rejecting this refund request.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                  <option value="">Select reason</option>
                  <option value="service_completed">Service Was Completed</option>
                  <option value="outside_policy">Outside Refund Policy</option>
                  <option value="insufficient_evidence">Insufficient Evidence</option>
                  <option value="fraud_suspected">Fraud Suspected</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  placeholder="Provide details for the rejection..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="notify" className="rounded border-gray-300" defaultChecked />
                <label htmlFor="notify" className="text-sm text-gray-700">Notify customer of rejection</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
