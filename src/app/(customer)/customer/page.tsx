"use client";

import {
  DollarSign,
  Gift,
  ShoppingCart,
  Star,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  MapPin,
  Plus,
} from "lucide-react";
import Link from "next/link";

// Static data
const stats = {
  totalSpent: 4250,
  pointsEarned: 1850,
  activeOrders: 2,
  completedOrders: 24,
};

const recentOrders = [
  {
    id: "ORD-2024-001",
    vendor: "Quick Fix Plumbing",
    service: "Pipe Repair",
    date: "Dec 28, 2024",
    amount: 350,
    status: "completed",
  },
  {
    id: "ORD-2024-002",
    vendor: "Spark Electric Co",
    service: "Electrical Inspection",
    date: "Dec 27, 2024",
    amount: 200,
    status: "in_progress",
  },
  {
    id: "ORD-2024-003",
    vendor: "Cool Air HVAC",
    service: "AC Maintenance",
    date: "Dec 25, 2024",
    amount: 450,
    status: "completed",
  },
  {
    id: "ORD-2024-004",
    vendor: "Green Clean Services",
    service: "Deep Cleaning",
    date: "Dec 22, 2024",
    amount: 280,
    status: "completed",
  },
];

const topVendors = [
  { id: 1, name: "Quick Fix Plumbing", category: "Plumbing", rating: 4.9, orders: 8 },
  { id: 2, name: "Spark Electric Co", category: "Electrical", rating: 4.8, orders: 5 },
  { id: 3, name: "Cool Air HVAC", category: "HVAC", rating: 4.7, orders: 4 },
  { id: 4, name: "Green Clean Services", category: "Cleaning", rating: 4.9, orders: 7 },
];

const upcomingServices = [
  {
    id: 1,
    vendor: "Cool Air HVAC",
    service: "Quarterly AC Service",
    date: "Jan 5, 2025",
    time: "10:00 AM",
    type: "subscription",
  },
  {
    id: 2,
    vendor: "Green Clean Services",
    service: "Weekly Home Cleaning",
    date: "Jan 2, 2025",
    time: "9:00 AM",
    type: "subscription",
  },
];

export default function CustomerDashboardPage() {
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
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Scheduled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s your activity overview</p>
        </div>
        <Link
          href="/customer/orders/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-gray-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex items-center text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12%
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
            <p className="text-sm text-gray-500">Total Spent</p>
          </div>
        </div>

        <Link href="/customer/points" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Gift className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex items-center text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +150
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-gray-900">{stats.pointsEarned.toLocaleString()} pts</p>
            <p className="text-sm text-gray-500">Points Earned</p>
          </div>
        </Link>

        <Link href="/customer/orders" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-gray-900">{stats.activeOrders}</p>
            <p className="text-sm text-gray-500">Active Orders</p>
          </div>
        </Link>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-gray-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-gray-900">{stats.completedOrders}</p>
            <p className="text-sm text-gray-500">Completed Orders</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-500">Your latest service orders</p>
            </div>
            <Link
              href="/customer/orders"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/customer/orders/${order.id}`}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.vendor}</p>
                    <p className="text-xs text-gray-500">{order.service} &bull; {order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                  {getStatusBadge(order.status)}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Your Top Vendors</h3>
              <p className="text-sm text-gray-500">Based on order frequency</p>
            </div>
            <Link
              href="/customer/vendors/favorites"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              Favorites <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {topVendors.map((vendor) => (
              <div key={vendor.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {vendor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                    <p className="text-xs text-gray-500">{vendor.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm text-amber-600">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {vendor.rating}
                  </div>
                  <p className="text-xs text-gray-500">{vendor.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Services */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Upcoming Services</h3>
            <p className="text-sm text-gray-500">Your scheduled and subscription services</p>
          </div>
          <Link
            href="/customer/subscriptions"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
          >
            Manage subscriptions <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {upcomingServices.map((service) => (
            <div key={service.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{service.service}</p>
                  <p className="text-xs text-gray-500">{service.vendor}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{service.date}</p>
                <p className="text-xs text-gray-500">{service.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/customer/orders/new"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Link>
          <Link
            href="/customer/points"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Gift className="h-4 w-4 mr-2" />
            View Points
          </Link>
          <Link
            href="/customer/addresses"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Manage Addresses
          </Link>
          <Link
            href="/customer/vendors/favorites"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Star className="h-4 w-4 mr-2" />
            Favorite Vendors
          </Link>
        </div>
      </div>
    </div>
  );
}
