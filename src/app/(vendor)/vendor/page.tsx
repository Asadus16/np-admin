"use client";

import { useState, useEffect } from "react";
import { DollarSign, ClipboardList, Star, Calendar, Clock, Users, Crown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  getVendorDashboardData,
  VendorDashboardData,
  UpcomingJob,
  TeamMember,
  TopCustomer,
  RecentReview,
} from "@/lib/vendorDashboard";

export default function VendorDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<VendorDashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const response = await getVendorDashboardData('30d', token);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const stats = [
    {
      name: "Total Earnings",
      value: formatCurrency(dashboardData.stats.total_earnings),
      change: dashboardData.stats.earnings_change.value,
      trend: dashboardData.stats.earnings_change.trend,
      icon: DollarSign,
    },
    {
      name: "Active Orders",
      value: dashboardData.stats.active_orders.toString(),
      change: dashboardData.stats.orders_change.value,
      trend: dashboardData.stats.orders_change.trend,
      icon: ClipboardList,
    },
    {
      name: "Team Members",
      value: dashboardData.stats.team_members.toString(),
      change: "",
      trend: "neutral" as const,
      icon: Users,
    },
    {
      name: "Average Rating",
      value: dashboardData.stats.average_rating.toString(),
      change: `${dashboardData.stats.review_count} reviews`,
      trend: "neutral" as const,
      icon: Star,
    },
  ];

  const upcomingJobs: UpcomingJob[] = dashboardData.upcoming_jobs;
  const teamSchedule: TeamMember[] = dashboardData.team_schedule;
  const topCustomers: TopCustomer[] = dashboardData.top_customers;
  const recentReviews: RecentReview[] = dashboardData.recent_reviews;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back! Here is your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-gray-100 rounded-lg">
                <stat.icon className="h-5 w-5 text-gray-600" />
              </div>
              {stat.change && (
                <span className={`text-xs font-medium ${
                  stat.trend === "up" ? "text-green-600" :
                  stat.trend === "down" ? "text-red-600" :
                  "text-gray-500"
                }`}>
                  {stat.change}
                </span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Jobs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Upcoming Jobs</h2>
            </div>
            <Link href="/vendor/orders" className="text-sm text-gray-600 hover:text-gray-900">View all</Link>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingJobs.length > 0 ? (
              upcomingJobs.map((job) => (
                <div key={job.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{job.service}</p>
                    <p className="text-xs text-gray-500">{job.customer}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Assigned: {job.technician}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Clock className="h-3 w-3" />
                      {job.time}
                    </div>
                    <p className="text-xs text-gray-500">{job.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.status === "confirmed"
                      ? "bg-green-50 text-green-700"
                      : job.status === "in_progress"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No upcoming jobs
              </div>
            )}
          </div>
        </div>

        {/* Team Schedule */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Team Schedule</h2>
            </div>
            <Link href="/vendor/scheduling" className="text-sm text-gray-600 hover:text-gray-900">View calendar</Link>
          </div>
          <div className="divide-y divide-gray-200">
            {teamSchedule.length > 0 ? (
              teamSchedule.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      {member.current_job && (
                        <p className="text-xs text-gray-500">Working on: {member.current_job}</p>
                      )}
                      {!member.current_job && member.next_available && (
                        <p className="text-xs text-gray-500">Available: {member.next_available}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.status === "working"
                      ? "bg-blue-50 text-blue-700"
                      : member.status === "available"
                      ? "bg-green-50 text-green-700"
                      : member.status === "scheduled"
                      ? "bg-purple-50 text-purple-700"
                      : member.status === "break"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {member.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No team members
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Top Customers</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {topCustomers.length > 0 ? (
              topCustomers.map((customer, index) => (
                <div key={customer.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? "bg-yellow-100 text-yellow-700" :
                      index === 1 ? "bg-gray-200 text-gray-600" :
                      index === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {index + 1}
                    </span>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{customer.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.orders} orders</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(customer.spent)}</span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No customer data yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Recent Reviews</h2>
            </div>
            <Link href="/vendor/reviews" className="text-sm text-gray-600 hover:text-gray-900">View all</Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentReviews.length > 0 ? (
              recentReviews.map((review) => (
                <div key={review.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{review.customer}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                No reviews yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
