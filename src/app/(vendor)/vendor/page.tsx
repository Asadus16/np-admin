"use client";

import { DollarSign, ClipboardList, Star, TrendingUp, Calendar, Clock } from "lucide-react";

const stats = [
  { name: "Total Earnings", value: "$12,450", change: "+12%", icon: DollarSign, trend: "up" },
  { name: "Active Orders", value: "8", change: "+3", icon: ClipboardList, trend: "up" },
  { name: "Average Rating", value: "4.8", change: "+0.2", icon: Star, trend: "up" },
  { name: "Jobs Completed", value: "156", change: "+24", icon: TrendingUp, trend: "up" },
];

const upcomingJobs = [
  { id: 1, service: "Plumbing Repair", customer: "John Smith", date: "Today", time: "2:00 PM", status: "confirmed" },
  { id: 2, service: "Drain Cleaning", customer: "Sarah Johnson", date: "Today", time: "4:30 PM", status: "pending" },
  { id: 3, service: "Water Heater Install", customer: "Mike Brown", date: "Tomorrow", time: "10:00 AM", status: "confirmed" },
  { id: 4, service: "Pipe Inspection", customer: "Emily Davis", date: "Tomorrow", time: "2:00 PM", status: "confirmed" },
];

const recentReviews = [
  { id: 1, customer: "John D.", rating: 5, comment: "Excellent service! Very professional.", date: "2 days ago" },
  { id: 2, customer: "Sarah M.", rating: 4, comment: "Good work, arrived on time.", date: "3 days ago" },
  { id: 3, customer: "Robert K.", rating: 5, comment: "Fixed the issue quickly. Highly recommend!", date: "5 days ago" },
];

export default function VendorDashboard() {
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
              <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.change}
              </span>
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
            <a href="/vendor/orders" className="text-sm text-gray-600 hover:text-gray-900">View all</a>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingJobs.map((job) => (
              <div key={job.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{job.service}</p>
                  <p className="text-xs text-gray-500">{job.customer}</p>
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
                    : "bg-yellow-50 text-yellow-700"
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Recent Reviews</h2>
            </div>
            <a href="/vendor/reviews" className="text-sm text-gray-600 hover:text-gray-900">View all</a>
          </div>
          <div className="divide-y divide-gray-200">
            {recentReviews.map((review) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
