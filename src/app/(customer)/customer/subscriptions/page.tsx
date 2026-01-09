"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Calendar, ChevronRight, Pause, Play, XCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  getRecurringOrders,
  getRecurringOrderStats,
  pauseRecurringOrder,
  resumeRecurringOrder,
  cancelRecurringOrder,
  formatFrequency,
  formatDate,
  formatCurrency,
} from "@/lib/recurringOrder";
import { RecurringOrder, RecurringOrderStats, RecurringOrderStatus } from "@/types/recurringOrder";

export default function SubscriptionsPage() {
  const [filter, setFilter] = useState<"all" | RecurringOrderStatus>("all");
  const [subscriptions, setSubscriptions] = useState<RecurringOrder[]>([]);
  const [stats, setStats] = useState<RecurringOrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [ordersResponse, statsResponse] = await Promise.all([
        getRecurringOrders({ status: filter === "all" ? undefined : filter }),
        getRecurringOrderStats(),
      ]);

      setSubscriptions(ordersResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
      setError("Failed to load subscriptions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handlePause = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setActionLoading(id);
      await pauseRecurringOrder(id);
      fetchData();
    } catch (err) {
      console.error("Failed to pause subscription:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setActionLoading(id);
      await resumeRecurringOrder(id);
      fetchData();
    } catch (err) {
      console.error("Failed to resume subscription:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: RecurringOrderStatus) => {
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
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  const getVendorInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const calculateMonthlySpend = () => {
    return subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => {
        // Estimate monthly spend based on frequency
        let multiplier = 1;
        switch (s.frequency_type) {
          case "daily":
            multiplier = 30;
            break;
          case "weekly":
            multiplier = 4;
            break;
          case "biweekly":
            multiplier = 2;
            break;
          case "monthly":
            multiplier = 1;
            break;
          default:
            multiplier = 30 / (s.frequency_interval || 1);
        }
        return sum + s.total * multiplier;
      }, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">Something went wrong</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              <p className="text-2xl font-semibold text-gray-900">{stats?.active || 0}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{stats?.paused || 0}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(calculateMonthlySpend())}</p>
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
        {subscriptions.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No subscriptions found</p>
            <p className="text-sm text-gray-400 mt-1">
              {filter === "all"
                ? "Create a recurring order to see it here"
                : `No ${filter} subscriptions`}
            </p>
          </div>
        ) : (
          subscriptions.map((sub) => (
            <Link
              key={sub.id}
              href={`/customer/subscriptions/${sub.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {sub.vendor ? getVendorInitials(sub.vendor.name) : "??"}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {sub.items && sub.items.length > 0
                          ? sub.items[0].service_name
                          : "Recurring Service"}
                      </p>
                      {getStatusBadge(sub.status)}
                    </div>
                    <p className="text-sm text-gray-600">{sub.vendor?.name || "Unknown Vendor"}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        {formatFrequency(sub)}
                      </span>
                      {sub.status === "active" && sub.next_scheduled_date && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Next: {formatDate(sub.next_scheduled_date)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(sub.total)}</p>
                    <p className="text-xs text-gray-500">{sub.orders_generated} orders completed</p>
                  </div>
                  {/* Quick actions */}
                  <div className="flex items-center gap-2">
                    {sub.status === "active" && (
                      <button
                        onClick={(e) => handlePause(e, sub.id)}
                        disabled={actionLoading === sub.id}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-50"
                        title="Pause subscription"
                      >
                        {actionLoading === sub.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Pause className="h-4 w-4" />
                        )}
                      </button>
                    )}
                    {sub.status === "paused" && (
                      <button
                        onClick={(e) => handleResume(e, sub.id)}
                        disabled={actionLoading === sub.id}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                        title="Resume subscription"
                      >
                        {actionLoading === sub.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
