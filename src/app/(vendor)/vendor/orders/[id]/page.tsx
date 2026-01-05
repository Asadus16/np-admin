"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, Clock, Package,
  MessageSquare, CheckCircle, CreditCard, Wallet, Star, StickyNote,
  Plus, RefreshCcw, AlertCircle
} from "lucide-react";

interface OrderRefund {
  amount: number;
  reason: string;
  status: string;
  date: string;
}

interface Order {
  id: string;
  status: string;
  customer: { name: string; email: string; phone: string };
  service: { name: string; price: number; duration: number; addons: { name: string; price: number }[] };
  address: string;
  scheduledDate: string;
  scheduledTime: string;
  notes: string;
  assignedTo: string;
  payment: { method: string; cardLast4: string; cardBrand: string; pointsUsed: number; status: string };
  review: { rating: number; comment: string; date: string } | null;
  refund: OrderRefund | null;
  internalNotes: { id: number; text: string; author: string; date: string }[];
  pointsEarned: number;
  timeline: { id: number; event: string; time: string; completed: boolean }[];
}

const order: Order = {
  id: "ORD-001",
  status: "completed",
  customer: {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
  },
  service: {
    name: "Plumbing Repair",
    price: 85,
    duration: 60,
    addons: [
      { name: "Emergency Service", price: 50 },
    ],
  },
  address: "123 Main Street, San Francisco, CA 94102",
  scheduledDate: "2024-03-18",
  scheduledTime: "2:00 PM",
  notes: "Leaky faucet in the kitchen. Has been dripping for about a week.",
  assignedTo: "Mike Johnson",
  payment: {
    method: "card",
    cardLast4: "4242",
    cardBrand: "Visa",
    pointsUsed: 0,
    status: "paid",
  },
  review: {
    rating: 5,
    comment: "Excellent service! Mike was very professional and fixed the issue quickly. Highly recommend!",
    date: "Mar 19, 2024",
  },
  refund: null,
  internalNotes: [
    { id: 1, text: "Customer prefers morning appointments", author: "Mike J.", date: "Mar 17, 2024" },
    { id: 2, text: "Spare parts may be needed - check inventory", author: "Admin", date: "Mar 17, 2024" },
  ],
  pointsEarned: 135,
  timeline: [
    { id: 1, event: "Order created", time: "Mar 17, 2024 10:30 AM", completed: true },
    { id: 2, event: "Order accepted", time: "Mar 17, 2024 11:00 AM", completed: true },
    { id: 3, event: "Technician assigned", time: "Mar 17, 2024 11:15 AM", completed: true },
    { id: 4, event: "En route to customer", time: "Mar 18, 2024 1:45 PM", completed: true },
    { id: 5, event: "Job started", time: "Mar 18, 2024 2:05 PM", completed: true },
    { id: 6, event: "Job completed", time: "Mar 18, 2024 3:15 PM", completed: true },
  ],
};

export default function OrderDetailPage() {
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const totalAmount = order.service.price + order.service.addons.reduce((sum, a) => sum + a.price, 0);

  const handleAddNote = () => {
    // Static implementation
    setNewNote("");
    setShowNoteModal(false);
  };

  const handleIssueRefund = () => {
    // Static implementation
    setRefundAmount("");
    setRefundReason("");
    setShowRefundModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/orders" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{order.id}</h1>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              order.status === "completed" ? "bg-green-50 text-green-700" :
              order.status === "assigned" ? "bg-yellow-50 text-yellow-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{order.service.name}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/vendor/messages"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 inline-flex items-center"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Link>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{order.customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{order.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">{order.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule & Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Schedule & Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">{order.scheduledDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium text-gray-900">{order.scheduledTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assigned To</p>
                  <p className="text-sm font-medium text-gray-900">{order.assignedTo}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Customer Notes</p>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{order.notes}</p>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-900">Internal Notes</h2>
              </div>
              <button
                onClick={() => setShowNoteModal(true)}
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Note
              </button>
            </div>
            <div className="space-y-3">
              {order.internalNotes.map((note) => (
                <div key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{note.text}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span className="font-medium">{note.author}</span>
                    <span>•</span>
                    <span>{note.date}</span>
                  </div>
                </div>
              ))}
              {order.internalNotes.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No internal notes yet</p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              {order.timeline.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    item.completed ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    {item.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${item.completed ? "text-gray-900" : "text-gray-400"}`}>
                      {item.event}
                    </p>
                    {item.time && (
                      <p className="text-xs text-gray-500">{item.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Review */}
          {order.review && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-900">Customer Review</h2>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < order.review!.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">{order.review!.rating}.0</span>
              </div>
              <p className="text-sm text-gray-600">{order.review!.comment}</p>
              <p className="text-xs text-gray-400 mt-2">{order.review!.date}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.service.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">${order.service.price}</span>
              </div>
              {order.service.addons.map((addon, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 pl-6">{addon.name}</span>
                  <span className="text-sm text-gray-600">${addon.price}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Total</span>
                <span className="text-lg font-semibold text-gray-900">${totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Payment</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Method</span>
                <div className="flex items-center gap-2">
                  {order.payment.method === "card" ? (
                    <>
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {order.payment.cardBrand} •••• {order.payment.cardLast4}
                      </span>
                    </>
                  ) : order.payment.method === "cash" ? (
                    <>
                      <Wallet className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">Cash</span>
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">Points</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  order.payment.status === "paid" ? "bg-green-50 text-green-700" :
                  order.payment.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                  "bg-red-50 text-red-700"
                }`}>
                  {order.payment.status}
                </span>
              </div>
              {order.payment.pointsUsed > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Points Used</span>
                  <span className="text-sm font-medium text-gray-900">{order.payment.pointsUsed} pts</span>
                </div>
              )}
              {order.pointsEarned > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-500">Points Earned</span>
                  <span className="text-sm font-medium text-green-600">+{order.pointsEarned} pts</span>
                </div>
              )}
            </div>
          </div>

          {/* Refund Status */}
          {order.refund && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCcw className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-900">Refund</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Amount</span>
                  <span className="text-sm font-medium text-gray-900">${order.refund.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    order.refund.status === "processed" ? "bg-green-50 text-green-700" :
                    "bg-yellow-50 text-yellow-700"
                  }`}>
                    {order.refund.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Reason</span>
                  <p className="text-sm text-gray-700 mt-1">{order.refund.reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                Reassign Technician
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                Reschedule
              </button>
              {!order.refund && order.status === "completed" && (
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-orange-600 bg-white border border-gray-300 rounded-lg hover:bg-orange-50 text-left inline-flex items-center"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Issue Refund
                </button>
              )}
              <button className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded-lg hover:bg-red-50 text-left">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Internal Note</h3>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 resize-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-medium text-gray-900">Issue Refund</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder="0.00"
                    max={totalAmount}
                    className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Max refund: ${totalAmount}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Enter refund reason..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleIssueRefund}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
              >
                Issue Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
