"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Star,
  DollarSign,
  Filter,
  Download,
  CheckCircle,
} from "lucide-react";

const completedJobs = [
  {
    id: "JOB-1233",
    orderId: "ORD-5677",
    customer: "Lisa White",
    service: "Toilet Repair",
    category: "Plumbing",
    address: "Apt 2301, Downtown Views, Dubai",
    completedDate: "2024-12-27",
    completedTime: "4:30 PM",
    duration: "1.5 hrs",
    amount: 180,
    rating: 5,
    review: "Excellent service! Very professional and quick.",
  },
  {
    id: "JOB-1232",
    orderId: "ORD-5676",
    customer: "Tom Green",
    service: "Sink Installation",
    category: "Plumbing",
    address: "Villa 5, Jumeirah Islands, Dubai",
    completedDate: "2024-12-27",
    completedTime: "11:30 AM",
    duration: "2 hrs",
    amount: 250,
    rating: 5,
    review: "Great job, very clean work.",
  },
  {
    id: "JOB-1231",
    orderId: "ORD-5675",
    customer: "Anna Martinez",
    service: "Water Heater Repair",
    category: "Plumbing",
    address: "Villa 18, The Springs, Dubai",
    completedDate: "2024-12-26",
    completedTime: "3:00 PM",
    duration: "2.5 hrs",
    amount: 350,
    rating: 4,
    review: "Good service, arrived on time.",
  },
  {
    id: "JOB-1230",
    orderId: "ORD-5674",
    customer: "David Lee",
    service: "Pipe Replacement",
    category: "Plumbing",
    address: "Apt 1804, JLT Cluster C, Dubai",
    completedDate: "2024-12-26",
    completedTime: "11:00 AM",
    duration: "3 hrs",
    amount: 450,
    rating: 5,
    review: null,
  },
  {
    id: "JOB-1229",
    orderId: "ORD-5673",
    customer: "Emma Wilson",
    service: "Faucet Installation",
    category: "Plumbing",
    address: "Villa 7, Arabian Ranches 2, Dubai",
    completedDate: "2024-12-25",
    completedTime: "2:00 PM",
    duration: "1 hr",
    amount: 120,
    rating: 5,
    review: "Fast and efficient. Highly recommended!",
  },
  {
    id: "JOB-1228",
    orderId: "ORD-5672",
    customer: "James Brown",
    service: "Drain Cleaning",
    category: "Plumbing",
    address: "Apt 502, Marina Quays, Dubai",
    completedDate: "2024-12-24",
    completedTime: "4:00 PM",
    duration: "1.5 hrs",
    amount: 150,
    rating: 4,
    review: "Good job, but arrived 10 minutes late.",
  },
];

const stats = {
  totalJobs: 456,
  thisMonth: 24,
  avgRating: 4.8,
  totalEarnings: 12450,
};

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = completedJobs.filter((job) => {
    const matchesSearch =
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Job History</h1>
          <p className="text-sm text-gray-500 mt-1">View your completed jobs</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Total Jobs
          </div>
          <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            This Month
          </div>
          <p className="text-2xl font-semibold text-gray-900">{stats.thisMonth}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Avg Rating
          </div>
          <p className="text-2xl font-semibold text-gray-900">{stats.avgRating}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            Earnings
          </div>
          <p className="text-2xl font-semibold text-gray-900">AED {stats.totalEarnings.toLocaleString()}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search completed jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {filteredJobs.map((job) => (
          <Link
            key={job.id}
            href={`/technician/jobs/${job.id}`}
            className="block p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">{job.customer}</span>
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-600">{job.service}</p>
                <p className="text-xs text-gray-500 mt-1">Order: {job.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">AED {job.amount}</p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < job.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {job.completedDate}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {job.completedTime} ({job.duration})
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate max-w-[200px]">{job.address}</span>
              </div>
            </div>
            {job.review && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 italic">&ldquo;{job.review}&rdquo;</p>
              </div>
            )}
          </Link>
        ))}
        {filteredJobs.length === 0 && (
          <div className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No completed jobs found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredJobs.length} of {completedJobs.length} jobs
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
