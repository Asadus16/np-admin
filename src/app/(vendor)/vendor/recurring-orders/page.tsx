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
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import {
  getVendorRecurringOrders,
  getVendorRecurringOrderStats,
  formatFrequency,
  getStatusColor,
  formatDate,
  formatTime,
  formatCurrency,
} from "@/lib/recurringOrder";
import { RecurringOrder, RecurringOrderStats } from "@/types/recurringOrder";

type StatusFilter = "all" | "active" | "paused" | "cancelled" | "completed";

export default function VendorRecurringOrdersPage() {
  const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>([]);
  const [stats, setStats] = useState<RecurringOrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadRecurringOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [ordersResponse, statsResponse] = await Promise.all([
        getVendorRecurringOrders({
          page: currentPage,
          per_page: 10,
          status: statusFilter === "all" ? undefined : statusFilter,
        }),
        getVendorRecurringOrderStats(),
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

  const getServiceSummary = (order: RecurringOrder) => {
    if (!order.items || order.items.length === 0) return "No services";
    if (order.items.length === 1) return order.items[0].sub_service_name;
    return `${order.items[0].sub_service_name} +${order.items.length - 1} more`;
  };

  const filteredOrders = recurringOrders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.customer?.name.toLowerCase().includes(query) ||
      order.customer?.email.toLowerCase().includes(query) ||
      order.items?.some(
        (item) =>
          item.service_name.toLowerCase().includes(query) ||
          item.sub_service_name.toLowerCase().includes(query)
      )
    );
  });

  const tabs = [
    { id: "all" as const, label: "All", count: stats?.total || 0 },
    { id: "active" as const, label: "Active", count: stats?.active || 0 },
    { id: "paused" as const, label: "Paused", count: stats?.paused || 0 },
    { id: "cancelled" as const, label: "Cancelled", count: stats?.cancelled || 0 },
    { id: "completed" as const, label: "Completed", count: stats?.completed || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Recurring Customers</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage customers with recurring appointments</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-4 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  statusFilter === tab.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer name, email, or service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
        />
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
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <RefreshCw className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No recurring customers found</p>
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
            <Link
              key={order.id}
              href={`/vendor/recurring-orders/${order.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">
                        {order.customer?.name || "Unknown Customer"}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{getServiceSummary(order)}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      {order.customer?.email && (
                        <span className="inline-flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {order.customer.email}
                        </span>
                      )}
                      {order.customer?.phone && (
                        <span className="inline-flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {order.customer.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </span>
                  <p className="text-xs text-gray-500">per order</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2 text-gray-500">
                  <RefreshCw className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{formatFrequency(order)}</span>
                </div>
                {order.status === "active" && order.next_scheduled_date && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Next: {formatDate(order.next_scheduled_date)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>{formatTime(order.scheduled_time)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{order.address?.city || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">{order.orders_generated}</span> orders generated
                  {order.status === "active" && (
                    <span className="ml-2">
                      since {formatDate(order.start_date)}
                    </span>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
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
