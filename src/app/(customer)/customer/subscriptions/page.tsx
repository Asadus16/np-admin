"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw, Calendar, ChevronRight, Pause, Play, XCircle, Clock } from "lucide-react";

// Static subscriptions data
const subscriptions = [
  {
    id: "SUB-001",
    vendor: "Green Clean Services",
    vendorLogo: "GC",
    service: "Weekly Home Cleaning",
    frequency: "Weekly",
    nextDate: "Jan 2, 2025",
    time: "9:00 AM",
    amount: 280,
    status: "active",
    ordersCompleted: 12,
    startDate: "Oct 1, 2024",
  },
  {
    id: "SUB-002",
    vendor: "Cool Air HVAC",
    vendorLogo: "CA",
    service: "Quarterly AC Maintenance",
    frequency: "Every 3 months",
    nextDate: "Jan 5, 2025",
    time: "10:00 AM",
    amount: 450,
    status: "active",
    ordersCompleted: 3,
    startDate: "Apr 5, 2024",
  },
  {
    id: "SUB-003",
    vendor: "Pest Control Pro",
    vendorLogo: "PC",
    service: "Monthly Pest Treatment",
    frequency: "Monthly",
    nextDate: "-",
    time: "-",
    amount: 180,
    status: "paused",
    ordersCompleted: 6,
    startDate: "Jun 15, 2024",
  },
  {
    id: "SUB-004",
    vendor: "Garden Masters",
    vendorLogo: "GM",
    service: "Bi-weekly Lawn Care",
    frequency: "Every 2 weeks",
    nextDate: "-",
    time: "-",
    amount: 150,
    status: "cancelled",
    ordersCompleted: 8,
    startDate: "Mar 1, 2024",
    endDate: "Nov 15, 2024",
  },
];

export default function SubscriptionsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "cancelled">("all");

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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Play className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const filteredSubscriptions = filter === "all"
    ? subscriptions
    : subscriptions.filter((s) => s.status === filter);

  const stats = {
    active: subscriptions.filter((s) => s.status === "active").length,
    paused: subscriptions.filter((s) => s.status === "paused").length,
    monthlySpend: subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + s.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Subscriptions</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your recurring services</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Play className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-500">Active Subscriptions</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Pause className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{stats.paused}</p>
              <p className="text-sm text-gray-500">Paused</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.monthlySpend)}</p>
              <p className="text-sm text-gray-500">Est. Monthly Spend</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "active", "paused", "cancelled"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize ${
              filter === status
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {filteredSubscriptions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No subscriptions found</p>
          </div>
        ) : (
          filteredSubscriptions.map((sub) => (
            <Link
              key={sub.id}
              href={`/customer/subscriptions/${sub.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{sub.vendorLogo}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{sub.service}</p>
                      {getStatusBadge(sub.status)}
                    </div>
                    <p className="text-sm text-gray-600">{sub.vendor}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        {sub.frequency}
                      </span>
                      {sub.status === "active" && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Next: {sub.nextDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(sub.amount)}</p>
                    <p className="text-xs text-gray-500">{sub.ordersCompleted} orders completed</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
