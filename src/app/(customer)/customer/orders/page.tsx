"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Plus,
  ChevronRight,
  Loader2,
  AlertCircle,
  FileCheck,
  ChevronLeft,
  Car,
  MapPinned,
  Wrench,
  User,
  RefreshCw,
} from "lucide-react";
import { getOrders } from "@/lib/order";
import { Order } from "@/types/order";

type StatusFilter = "all" | "active" | "completed" | "cancelled";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Map filter to API status
      let apiStatus: string | undefined;
      if (statusFilter === "completed") {
        apiStatus = "completed";
      } else if (statusFilter === "cancelled") {
        apiStatus = "cancelled";
      } else if (statusFilter === "active") {
        // Active includes pending, confirmed, in_progress
        // We'll filter client-side for this
        apiStatus = undefined;
      }

      const response = await getOrders({
        page: currentPage,
        per_page: 10,
        status: apiStatus,
        sort: "latest",
      });

      let filteredOrders = response.data;

      // Client-side filter for "active" since it includes multiple statuses
      if (statusFilter === "active") {
        filteredOrders = filteredOrders.filter(
          (o) => o.status === "pending" || o.status === "confirmed" || o.status === "in_progress"
        );
      }

      setOrders(filteredOrders);
      setTotalPages(response.meta.last_page);
      setTotal(response.meta.total);
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Truck className="h-3 w-3 mr-1" />
            In Progress
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <FileCheck className="h-3 w-3 mr-1" />
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
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
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getVendorInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getServiceSummary = (order: Order) => {
    if (order.items.length === 0) return "No services";
    if (order.items.length === 1) return order.items[0].sub_service_name;
    return `${order.items[0].sub_service_name} +${order.items.length - 1} more`;
  };

  const getTechnicianStatusBadge = (order: Order) => {
    if (!order.technician_status || order.status === "completed" || order.status === "cancelled") {
      return null;
    }

    switch (order.technician_status) {
      case "on_the_way":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <Car className="h-3 w-3 mr-1" />
            On the Way
          </span>
        );
      case "arrived":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <MapPinned className="h-3 w-3 mr-1" />
            Arrived
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Wrench className="h-3 w-3 mr-1" />
            Working
          </span>
        );
      case "assigned":
      case "acknowledged":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <User className="h-3 w-3 mr-1" />
            Tech Assigned
          </span>
        );
      default:
        return null;
    }
  };

  const getRecurringBadge = (order: Order) => {
    if (!order.recurring_order_id) return null;

    const frequencyLabel = order.recurring_order?.frequency_label || "Recurring";

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
        <RefreshCw className="h-3 w-3 mr-1" />
        {frequencyLabel}
      </span>
    );
  };

  // Client-side search filter
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.order_number.toLowerCase().includes(query) ||
      order.vendor.name.toLowerCase().includes(query) ||
      order.items.some(
        (item) =>
          item.service_name.toLowerCase().includes(query) ||
          item.sub_service_name.toLowerCase().includes(query)
      )
    );
  });

  // Calculate stats from current orders
  const stats = {
    total: total,
    active: orders.filter(
      (o) => o.status === "pending" || o.status === "confirmed" || o.status === "in_progress"
    ).length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Order History</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your orders</p>
        </div>
        <Link
          href="/customer/orders/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">{stats.cancelled}</p>
          <p className="text-sm text-gray-500">Cancelled</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by ID, vendor, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "completed", "cancelled"] as const).map((status) => (
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
            onClick={loadOrders}
            className="ml-auto text-sm font-medium text-red-700 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="mt-2 text-sm font-medium text-gray-900 hover:underline"
              >
                View all orders
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={`/customer/orders/${order.id}`}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">
                    {getVendorInitials(order.vendor.name)}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                    {getStatusBadge(order.status)}
                    {getTechnicianStatusBadge(order)}
                    {getRecurringBadge(order)}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{order.vendor.name}</p>
                  <p className="text-xs text-gray-500 truncate">{getServiceSummary(order)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(order.total)}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.scheduled_date)}</p>
                  <p className="text-xs text-gray-500">{order.scheduled_time}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>
            </Link>
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
