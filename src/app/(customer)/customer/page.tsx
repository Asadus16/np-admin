"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Gift,
  ShoppingCart,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  CheckCircle,
  MapPin,
  Plus,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getCustomerDashboardData, CustomerDashboardData } from "@/lib/customerDashboard";

export default function CustomerDashboardPage() {
  const { token } = useAuth();
  const [dashboardData, setDashboardData] = useState<CustomerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await getCustomerDashboardData(token);
        if (response.status === 'success') {
          setDashboardData(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

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
      case "confirmed":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
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

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 mr-1" />;
    } else if (trend === 'down') {
      return <TrendingDown className="h-4 w-4 mr-1" />;
    }
    return null;
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">{error || 'Failed to load dashboard'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, recent_orders, top_vendors, upcoming_services } = dashboardData;

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
            {stats.spent_change && (
              <div className={`flex items-center text-sm font-medium ${getTrendColor(stats.spent_change.trend)}`}>
                {getTrendIcon(stats.spent_change.trend)}
                {stats.spent_change.value}
              </div>
            )}
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.total_spent)}</p>
            <p className="text-sm text-gray-500">Total Spent</p>
          </div>
        </div>

        <Link href="/customer/points" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Gift className="h-5 w-5 text-gray-600" />
            </div>
            {stats.recent_points_earned > 0 && (
              <div className="flex items-center text-sm font-medium text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +{stats.recent_points_earned}
              </div>
            )}
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-gray-900">{stats.points_balance.toLocaleString()} pts</p>
            <p className="text-sm text-gray-500">Points Balance</p>
          </div>
        </Link>

        <Link href="/customer/orders" className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-gray-900">{stats.active_orders}</p>
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
            <p className="text-2xl font-semibold text-gray-900">{stats.completed_orders}</p>
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
            {recent_orders.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No orders yet</p>
                <Link href="/customer/orders/new" className="text-sm text-gray-900 hover:underline mt-1 inline-block">
                  Place your first order
                </Link>
              </div>
            ) : (
              recent_orders.map((order) => (
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
              ))
            )}
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
            {top_vendors.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No favorite vendors yet</p>
                <p className="text-xs mt-1">Complete orders to see your top vendors</p>
              </div>
            ) : (
              top_vendors.map((vendor) => (
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
                      {vendor.rating > 0 ? vendor.rating : '-'}
                    </div>
                    <p className="text-xs text-gray-500">{vendor.orders} orders</p>
                  </div>
                </div>
              ))
            )}
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
          {upcoming_services.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No upcoming services</p>
              <p className="text-xs mt-1">Schedule an order or set up a subscription</p>
            </div>
          ) : (
            upcoming_services.map((service) => (
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
            ))
          )}
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
