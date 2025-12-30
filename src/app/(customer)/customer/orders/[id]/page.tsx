"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  MessageSquare,
  Star,
  AlertTriangle,
  RefreshCw,
  Gift,
  Phone,
  FileText,
  Truck,
  User,
  Calendar,
} from "lucide-react";

// Static order data
const orderData = {
  id: "ORD-2024-001",
  status: "completed",
  vendor: {
    name: "Quick Fix Plumbing",
    logo: "QF",
    phone: "+971 50 555 1234",
    rating: 4.9,
  },
  services: [
    { name: "Pipe Inspection", price: 100, duration: "30 min" },
    { name: "Pipe Repair", price: 200, duration: "1 hr" },
    { name: "Parts & Materials", price: 50, duration: "-" },
  ],
  subtotal: 350,
  discount: 0,
  tax: 0,
  total: 350,
  paymentMethod: "Visa •••• 4242",
  pointsEarned: 35,
  address: {
    label: "Home",
    full: "123 Sheikh Zayed Road, Marina Tower, Apt 1502, Dubai Marina, Dubai",
  },
  schedule: {
    date: "Dec 28, 2024",
    time: "2:00 PM - 4:00 PM",
    actualArrival: "2:15 PM",
    completedAt: "3:45 PM",
  },
  technician: {
    name: "Mohammed Ali",
    phone: "+971 50 555 5678",
    rating: 4.8,
  },
  timeline: [
    { status: "Order Placed", time: "Dec 27, 2024 - 10:30 AM", completed: true },
    { status: "Order Confirmed", time: "Dec 27, 2024 - 10:45 AM", completed: true },
    { status: "Technician Assigned", time: "Dec 27, 2024 - 11:00 AM", completed: true },
    { status: "Technician En Route", time: "Dec 28, 2024 - 1:45 PM", completed: true },
    { status: "Service Started", time: "Dec 28, 2024 - 2:15 PM", completed: true },
    { status: "Service Completed", time: "Dec 28, 2024 - 3:45 PM", completed: true },
  ],
  notes: {
    customer: "Please call before arriving",
    technician: "Replaced worn-out pipe section. Recommended full pipe replacement in 6 months.",
  },
  refundStatus: null,
  review: null,
};

export default function OrderDetailsPage() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Completed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Truck className="h-4 w-4 mr-1.5" />
            In Progress
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/customer/orders"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{orderData.id}</h1>
            {getStatusBadge(orderData.status)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {orderData.timeline[0].time.split(" - ")[0]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600">{orderData.vendor.logo}</span>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{orderData.vendor.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span>{orderData.vendor.rating}</span>
                    <span>•</span>
                    <span>{orderData.vendor.phone}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Phone className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Services</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {orderData.services.map((service, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">{service.duration}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(service.price)}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(orderData.subtotal)}</span>
              </div>
              {orderData.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-green-600">-{formatCurrency(orderData.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(orderData.total)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Activity Timeline</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {orderData.timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${item.completed ? "bg-green-500" : "bg-gray-300"}`} />
                      {idx < orderData.timeline.length - 1 && (
                        <div className={`w-0.5 h-8 ${item.completed ? "bg-green-200" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${item.completed ? "text-gray-900" : "text-gray-500"}`}>
                        {item.status}
                      </p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Notes</h2>
            </div>
            <div className="p-4 space-y-4">
              {orderData.notes.customer && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Your Note</p>
                  <p className="text-sm text-gray-700">{orderData.notes.customer}</p>
                </div>
              )}
              {orderData.notes.technician && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Technician Note</p>
                  <p className="text-sm text-gray-700">{orderData.notes.technician}</p>
                </div>
              )}
            </div>
          </div>

          {/* Review Section */}
          {orderData.status === "completed" && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Leave a Review</h2>
              </div>
              {showReviewForm ? (
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Rating</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= reviewRating
                                ? "text-amber-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Comment</p>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
                      Submit Review
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              Schedule
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-900">{orderData.schedule.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time Slot</span>
                <span className="text-gray-900">{orderData.schedule.time}</span>
              </div>
              {orderData.schedule.actualArrival && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Actual Arrival</span>
                  <span className="text-gray-900">{orderData.schedule.actualArrival}</span>
                </div>
              )}
              {orderData.schedule.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Completed At</span>
                  <span className="text-gray-900">{orderData.schedule.completedAt}</span>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              Service Address
            </h3>
            <p className="text-sm text-gray-600">{orderData.address.full}</p>
          </div>

          {/* Technician */}
          {orderData.technician && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                Technician
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{orderData.technician.name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Star className="h-3 w-3 text-amber-500 fill-current mr-1" />
                    {orderData.technician.rating}
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-gray-400" />
              Payment
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="text-gray-900">{orderData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="text-gray-900 font-medium">{formatCurrency(orderData.total)}</span>
              </div>
            </div>
          </div>

          {/* Points Earned */}
          {orderData.pointsEarned > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Gift className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Points Earned</p>
                  <p className="text-lg font-semibold text-gray-700">+{orderData.pointsEarned} pts</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat with Vendor
            </button>
            <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              Request Refund
            </button>
            <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Lodge Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
