"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Plus,
  ChevronRight,
} from "lucide-react";

// Static orders data
const ordersData = [
  {
    id: "ORD-2024-001",
    vendor: "Quick Fix Plumbing",
    vendorLogo: "QF",
    service: "Pipe Repair & Maintenance",
    date: "Dec 28, 2024",
    time: "2:00 PM",
    amount: 350,
    status: "completed",
    pointsEarned: 35,
  },
  {
    id: "ORD-2024-002",
    vendor: "Spark Electric Co",
    vendorLogo: "SE",
    service: "Electrical Inspection",
    date: "Dec 27, 2024",
    time: "10:00 AM",
    amount: 200,
    status: "in_progress",
    pointsEarned: 0,
  },
  {
    id: "ORD-2024-003",
    vendor: "Cool Air HVAC",
    vendorLogo: "CA",
    service: "AC Maintenance & Filter Replacement",
    date: "Dec 25, 2024",
    time: "9:00 AM",
    amount: 450,
    status: "completed",
    pointsEarned: 45,
  },
  {
    id: "ORD-2024-004",
    vendor: "Green Clean Services",
    vendorLogo: "GC",
    service: "Deep Home Cleaning",
    date: "Dec 22, 2024",
    time: "8:00 AM",
    amount: 280,
    status: "completed",
    pointsEarned: 28,
  },
  {
    id: "ORD-2024-005",
    vendor: "Quick Fix Plumbing",
    vendorLogo: "QF",
    service: "Water Heater Installation",
    date: "Dec 20, 2024",
    time: "11:00 AM",
    amount: 650,
    status: "completed",
    pointsEarned: 65,
  },
  {
    id: "ORD-2024-006",
    vendor: "Pest Control Pro",
    vendorLogo: "PC",
    service: "General Pest Treatment",
    date: "Dec 18, 2024",
    time: "3:00 PM",
    amount: 180,
    status: "cancelled",
    pointsEarned: 0,
  },
  {
    id: "ORD-2024-007",
    vendor: "Green Clean Services",
    vendorLogo: "GC",
    service: "Move-out Cleaning",
    date: "Dec 15, 2024",
    time: "9:00 AM",
    amount: 400,
    status: "completed",
    pointsEarned: 40,
  },
  {
    id: "ORD-2024-008",
    vendor: "Spark Electric Co",
    vendorLogo: "SE",
    service: "Light Fixture Installation",
    date: "Dec 12, 2024",
    time: "2:00 PM",
    amount: 175,
    status: "completed",
    pointsEarned: 18,
  },
];

export default function OrderHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed" | "cancelled">("all");

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
      case "scheduled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
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

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && (order.status === "in_progress" || order.status === "scheduled")) ||
      statusFilter === order.status;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: ordersData.length,
    active: ordersData.filter((o) => o.status === "in_progress" || o.status === "scheduled").length,
    completed: ordersData.filter((o) => o.status === "completed").length,
    cancelled: ordersData.filter((o) => o.status === "cancelled").length,
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
        <div className="flex gap-2">
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

      {/* Orders List */}
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={`/customer/orders/${order.id}`}
              className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{order.vendorLogo}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{order.id}</p>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-gray-600">{order.vendor}</p>
                  <p className="text-xs text-gray-500">{order.service}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                  <p className="text-xs text-gray-500">{order.date}</p>
                  {order.pointsEarned > 0 && (
                    <p className="text-xs text-gray-500">+{order.pointsEarned} pts</p>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
