"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Download,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHistoryStats, fetchHistoryJobs } from "@/store/slices/technicianJobSlice";

export default function HistoryPage() {
  const dispatch = useAppDispatch();
  const { historyStats, historyJobs, isLoading, error } = useAppSelector(
    (state) => state.technicianJob
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchHistoryStats());
    dispatch(fetchHistoryJobs());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchHistoryStats());
    dispatch(fetchHistoryJobs());
  };

  const filteredJobs = historyJobs.filter((job) => {
    const matchesSearch =
      job.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.items.some((item) =>
        item.service_name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (dateFilter === "all") return true;

    const completedDate = new Date(job.completed_at!);
    const today = new Date();

    switch (dateFilter) {
      case "today":
        return completedDate.toDateString() === today.toDateString();
      case "week": {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return completedDate >= weekAgo;
      }
      case "month": {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        return completedDate >= monthAgo;
      }
      case "quarter": {
        const quarterAgo = new Date(today);
        quarterAgo.setMonth(today.getMonth() - 3);
        return completedDate >= quarterAgo;
      }
      default:
        return true;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading && !historyStats && historyJobs.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Job History</h1>
          <p className="text-sm text-gray-500 mt-1">View your completed jobs</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Job History</h1>
          <p className="text-sm text-gray-500 mt-1">View your completed jobs</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error.message}</p>
          <button
            onClick={handleRefresh}
            className="ml-auto text-sm font-medium text-red-700 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Total Jobs
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {historyStats?.total_jobs || 0}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            This Month
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {historyStats?.this_month_jobs || 0}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            Total Earnings
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            AED {historyStats?.total_earnings?.toLocaleString() || 0}
          </p>
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
                  <span className="text-sm font-medium text-gray-900">
                    {job.customer.name}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {job.items.map((item) => item.service_name).join(", ")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Order: {job.order_number}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  AED {job.total}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(job.completed_at!)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(job.completed_at!)}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="truncate max-w-[200px]">
                  {job.address.street_address}, {job.address.city}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {filteredJobs.length === 0 && !isLoading && (
          <div className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery || dateFilter !== "all"
                ? "No completed jobs found matching your filters"
                : "No completed jobs yet"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      {filteredJobs.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredJobs.length} of {historyJobs.length} jobs
          </p>
        </div>
      )}
    </div>
  );
}
