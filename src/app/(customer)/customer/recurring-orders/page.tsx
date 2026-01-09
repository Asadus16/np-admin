"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Search,
  ChevronRight,
  Loader2,
  AlertCircle,
  ChevronLeft,
  Play,
  Pause,
  XCircle,
  CheckCircle,
  Calendar,
  Clock,
} from "lucide-react";
import {
  getRecurringOrders,
  getRecurringOrderStats,
  pauseRecurringOrder,
  resumeRecurringOrder,
  cancelRecurringOrder,
  formatFrequency,
  getStatusColor,
  formatDate,
  formatCurrency,
} from "@/lib/recurringOrder";
import { RecurringOrder, RecurringOrderStats } from "@/types/recurringOrder";

type StatusFilter = "all" | "active" | "paused" | "cancelled" | "completed";

export default function RecurringOrdersPage() {
  const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>([]);
  const [stats, setStats] = useState<RecurringOrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadRecurringOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [ordersResponse, statsResponse] = await Promise.all([
        getRecurringOrders({
          page: currentPage,
          per_page: 10,
          status: statusFilter === "all" ? undefined : statusFilter,
        }),
        getRecurringOrderStats(),
      ]);

      setRecurringOrders(ordersResponse.data);
      setTotalPages(ordersResponse.meta.last_page);
      setStats(statsResponse.data);
    } catch (err) {
      setError("Failed to load recurring orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    loadRecurringOrders();
  }, [loadRecurringOrders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const handlePause = async (id: string) => {
    setActionLoading(id);
    try {
      await pauseRecurringOrder(id);
      loadRecurringOrders();
    } catch (err) {
      console.error("Failed to pause recurring order:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (id: string) => {
    setActionLoading(id);
    try {
      await resumeRecurringOrder(id);
      loadRecurringOrders();
    } catch (err) {
      console.error("Failed to resume recurring order:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this recurring order? This action cannot be undone.")) {
      return;
    }
    setActionLoading(id);
    try {
      await cancelRecurringOrder(id);
      loadRecurringOrders();
    } catch (err) {
      console.error("Failed to cancel recurring order:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status);
    const icons: Record<string, React.ReactNode> = {
      active: <Play className="h-3 w-3 mr-1" />,
      paused: <Pause className="h-3 w-3 mr-1" />,
      cancelled: <XCircle className="h-3 w-3 mr-1" />,
      completed: <CheckCircle className="h-3 w-3 mr-1" />,
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getVendorInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getServiceSummary = (order: RecurringOrder) => {
    if (!order.items || order.items.length === 0) return "No services";
    if (order.items.length === 1) return order.items[0].sub_service_name;
    return `${order.items[0].sub_service_name} +${order.items.length - 1} more`;
  };

  const filteredOrders = recurringOrders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.vendor?.name.toLowerCase().includes(query) ||
      order.items?.some(
        (item) =>
          item.service_name.toLowerCase().includes(query) ||
          item.sub_service_name.toLowerCase().includes(query)
      )
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Recurring Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your recurring appointments</p>
        </div>
        <Link
          href="/customer/orders/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          New Recurring Order
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-semibold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-semibold text-yellow-600">{stats.paused}</p>
            <p className="text-sm text-gray-500">Paused</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-semibold text-red-600">{stats.cancelled}</p>
            <p className="text-sm text-gray-500">Cancelled</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-2xl font-semibold text-gray-600">{stats.completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by vendor or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "paused", "cancelled", "completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize ${
                statusFilter === status
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={loadRecurringOrders}
            className="ml-auto text-sm font-medium text-red-700 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Recurring Orders List */}
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recurring orders found</p>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="mt-2 text-sm font-medium text-gray-900 hover:underline"
              >
                View all recurring orders
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <Link
                  href={`/customer/recurring-orders/${order.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">
                      {getVendorInitials(order.vendor?.name || "N/A")}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{order.vendor?.name || "Unknown Vendor"}</p>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{getServiceSummary(order)}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="inline-flex items-center">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        {formatFrequency(order)}
                      </span>
                      {order.next_scheduled_date && order.status === "active" && (
                        <span className="inline-flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Next: {formatDate(order.next_scheduled_date)}
                        </span>
                      )}
                      <span className="inline-flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {order.scheduled_time}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-gray-500">{order.orders_generated} orders</p>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {order.status === "active" && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handlePause(order.id);
                        }}
                        disabled={actionLoading === order.id}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Pause"
                      >
                        {actionLoading === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Pause className="h-4 w-4" />
                        )}
                      </button>
                    )}
                    {order.status === "paused" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleResume(order.id);
                          }}
                          disabled={actionLoading === order.id}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Resume"
                        >
                          {actionLoading === order.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleCancel(order.id);
                          }}
                          disabled={actionLoading === order.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Cancel"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {(order.status === "active" || order.status === "paused") && (
                      <Link
                        href={`/customer/recurring-orders/${order.id}`}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                    {(order.status === "cancelled" || order.status === "completed") && (
                      <Link
                        href={`/customer/recurring-orders/${order.id}`}
                        className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                currentPage === totalPages
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
