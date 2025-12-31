"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  Building2,
  CreditCard,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Star,
} from "lucide-react";

const orderData = {
  id: "ORD-1234",
  txnId: "TXN-5678",
  status: "in_progress",
  createdAt: "2024-12-28 10:30 AM",
  scheduledDate: "2024-12-28 2:00 PM",
  completedAt: null,
  customer: {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+971 50 123 4567",
    address: "Villa 24, Palm Jumeirah, Dubai",
  },
  vendor: {
    id: "VND-001",
    name: "Quick Fix Plumbing",
    email: "info@quickfix.com",
    phone: "+971 50 987 6543",
    technician: "Ahmed Hassan",
  },
  services: [
    { name: "Pipe Leak Repair", quantity: 1, price: 200 },
    { name: "Faucet Replacement", quantity: 2, price: 75 },
  ],
  subtotal: 350,
  discount: 0,
  tax: 17.5,
  total: 367.5,
  payment: {
    method: "Card",
    status: "paid",
    cardLast4: "4242",
    paidAt: "2024-12-28 10:32 AM",
  },
  pointsUsed: 0,
  pointsEarned: 37,
  notes: [
    { id: 1, author: "Customer", text: "Please call before arriving", createdAt: "2024-12-28 10:30 AM" },
    { id: 2, author: "Vendor", text: "Technician en route", createdAt: "2024-12-28 1:45 PM" },
  ],
  timeline: [
    { status: "Order Placed", time: "2024-12-28 10:30 AM", completed: true },
    { status: "Payment Confirmed", time: "2024-12-28 10:32 AM", completed: true },
    { status: "Vendor Confirmed", time: "2024-12-28 10:45 AM", completed: true },
    { status: "Technician Assigned", time: "2024-12-28 11:00 AM", completed: true },
    { status: "In Progress", time: "2024-12-28 2:00 PM", completed: true },
    { status: "Completed", time: null, completed: false },
  ],
  refund: null,
  review: null,
};

export default function OrderDetailPage() {
  const params = useParams();
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "confirmed": return "bg-gray-900 text-white";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "refunded": return "bg-red-100 text-red-700";
      case "partial_refund": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{params.id}</h1>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(orderData.status)}`}>
                {orderData.status.replace("_", " ").charAt(0).toUpperCase() + orderData.status.replace("_", " ").slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Transaction: {orderData.txnId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRefundModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Issue Refund
          </button>
          <button
            onClick={() => setShowCancelModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Created:</span>
                  <span className="text-gray-900">{orderData.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Scheduled:</span>
                  <span className="text-gray-900">{orderData.scheduledDate}</span>
                </div>
              </div>

              {/* Services */}
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
                    {orderData.services.map((service, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{service.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-center">{service.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">${service.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">${(service.price * service.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr className="border-t border-gray-200">
                      <td colSpan={3} className="px-4 py-2 text-sm text-gray-500 text-right">Subtotal</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">${orderData.subtotal.toFixed(2)}</td>
                    </tr>
                    {orderData.discount > 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-sm text-green-600 text-right">Discount</td>
                        <td className="px-4 py-2 text-sm text-green-600 text-right">-${orderData.discount.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-sm text-gray-500 text-right">Tax (5%)</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">${orderData.tax.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td colSpan={3} className="px-4 py-2 text-sm font-semibold text-gray-900 text-right">Total</td>
                      <td className="px-4 py-2 text-sm font-semibold text-gray-900 text-right">${orderData.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{orderData.payment.method} •••• {orderData.payment.cardLast4}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span className={`inline-flex mt-1 px-2 py-0.5 text-xs font-medium rounded ${getPaymentStatusColor(orderData.payment.status)}`}>
                    {orderData.payment.status.charAt(0).toUpperCase() + orderData.payment.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Paid At</p>
                  <p className="text-sm text-gray-900 mt-1">{orderData.payment.paidAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Points</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {orderData.pointsUsed > 0 && <span className="text-red-600">-{orderData.pointsUsed} used</span>}
                    {orderData.pointsUsed > 0 && orderData.pointsEarned > 0 && " / "}
                    {orderData.pointsEarned > 0 && <span className="text-green-600">+{orderData.pointsEarned} earned</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Notes & Communication</h2>
              <button className="text-sm text-gray-600 hover:text-gray-900">Add Note</button>
            </div>
            <div className="divide-y divide-gray-200">
              {orderData.notes.map((note) => (
                <div key={note.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{note.author}</span>
                    <span className="text-xs text-gray-500">{note.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-600">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
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
                <Link href={`/admin/customers/${orderData.customer.id}`} className="text-sm text-gray-900 hover:underline">
                  {orderData.customer.name}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{orderData.customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{orderData.customer.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-600">{orderData.customer.address}</span>
              </div>
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
                <Link href={`/admin/vendors/${orderData.vendor.id}`} className="text-sm text-gray-900 hover:underline">
                  {orderData.vendor.name}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{orderData.vendor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{orderData.vendor.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Technician: {orderData.vendor.technician}</span>
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
                {orderData.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      item.completed ? "bg-green-100" : "bg-gray-100"
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${item.completed ? "text-gray-900" : "text-gray-400"}`}>
                        {item.status}
                      </p>
                      {item.time && (
                        <p className="text-xs text-gray-500">{item.time}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <MessageSquare className="h-4 w-4" />
              Contact Customer
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <FileText className="h-4 w-4" />
              View Invoice
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <AlertTriangle className="h-4 w-4" />
              Report Issue
            </button>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Refund</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder={orderData.total.toFixed(2)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Max refundable: ${orderData.total.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                >
                  <option value="">Select reason</option>
                  <option value="customer_request">Customer Request</option>
                  <option value="service_incomplete">Service Incomplete</option>
                  <option value="quality_issue">Quality Issue</option>
                  <option value="vendor_no_show">Vendor No Show</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Order</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Reason</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                  <option value="">Select reason</option>
                  <option value="customer_request">Customer Request</option>
                  <option value="vendor_unavailable">Vendor Unavailable</option>
                  <option value="duplicate_order">Duplicate Order</option>
                  <option value="fraud">Suspected Fraud</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="refund" className="rounded border-gray-300" />
                <label htmlFor="refund" className="text-sm text-gray-700">Issue full refund (${orderData.total.toFixed(2)})</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Keep Order
              </button>
              <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
