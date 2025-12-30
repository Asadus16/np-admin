"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Calendar,
  Clock,
  Pause,
  Play,
  XCircle,
  MapPin,
  CreditCard,
  ChevronRight,
} from "lucide-react";

// Static subscription data
const subscriptionData = {
  id: "SUB-001",
  vendor: {
    name: "Green Clean Services",
    logo: "GC",
    phone: "+971 50 555 9999",
    rating: 4.9,
  },
  service: "Weekly Home Cleaning",
  description: "Professional deep cleaning service for your home",
  frequency: "Weekly",
  dayOfWeek: "Tuesday",
  time: "9:00 AM",
  nextDate: "Jan 2, 2025",
  amount: 280,
  status: "active",
  startDate: "Oct 1, 2024",
  ordersCompleted: 12,
  address: {
    label: "Home",
    full: "123 Sheikh Zayed Road, Marina Tower, Apt 1502, Dubai Marina, Dubai",
  },
  paymentMethod: "Visa •••• 4242",
  orderHistory: [
    { id: "ORD-2024-050", date: "Dec 24, 2024", amount: 280, status: "completed" },
    { id: "ORD-2024-045", date: "Dec 17, 2024", amount: 280, status: "completed" },
    { id: "ORD-2024-040", date: "Dec 10, 2024", amount: 280, status: "completed" },
    { id: "ORD-2024-035", date: "Dec 3, 2024", amount: 280, status: "completed" },
    { id: "ORD-2024-030", date: "Nov 26, 2024", amount: 280, status: "completed" },
  ],
};

export default function SubscriptionDetailsPage() {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Play className="h-4 w-4 mr-1.5" />
            Active
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Pause className="h-4 w-4 mr-1.5" />
            Paused
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
          href="/customer/subscriptions"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {subscriptionData.service}
            </h1>
            {getStatusBadge(subscriptionData.status)}
          </div>
          <p className="text-sm text-gray-500 mt-1">{subscriptionData.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-medium text-gray-600">{subscriptionData.vendor.logo}</span>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">{subscriptionData.vendor.name}</p>
                <p className="text-sm text-gray-500">{subscriptionData.description}</p>
              </div>
            </div>
          </div>

          {/* Schedule Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Schedule</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Frequency</p>
                  <p className="text-sm font-medium text-gray-900">{subscriptionData.frequency}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Day</p>
                  <p className="text-sm font-medium text-gray-900">{subscriptionData.dayOfWeek}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium text-gray-900">{subscriptionData.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next Service</p>
                  <p className="text-sm font-medium text-gray-900">{subscriptionData.nextDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Order History</h2>
              <p className="text-sm text-gray-500">{subscriptionData.ordersCompleted} orders completed</p>
            </div>
            <div className="divide-y divide-gray-100">
              {subscriptionData.orderHistory.map((order) => (
                <Link
                  key={order.id}
                  href={`/customer/orders/${order.id}`}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(order.amount)}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-center">
              <p className="text-3xl font-semibold text-gray-900">{formatCurrency(subscriptionData.amount)}</p>
              <p className="text-sm text-gray-500">per {subscriptionData.frequency.toLowerCase()} service</p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              Service Address
            </h3>
            <p className="text-sm text-gray-600">{subscriptionData.address.full}</p>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
              Payment Method
            </h3>
            <p className="text-sm text-gray-600">{subscriptionData.paymentMethod}</p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {subscriptionData.status === "active" ? (
              <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100">
                <Pause className="h-4 w-4 mr-2" />
                Pause Subscription
              </button>
            ) : subscriptionData.status === "paused" ? (
              <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100">
                <Play className="h-4 w-4 mr-2" />
                Resume Subscription
              </button>
            ) : null}
            <button
              onClick={() => setShowCancelDialog(true)}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Subscription
            </button>
          </div>

          {/* Info */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p>Started on {subscriptionData.startDate}</p>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Subscription?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel this subscription? This action cannot be undone and you will no longer receive scheduled services.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
