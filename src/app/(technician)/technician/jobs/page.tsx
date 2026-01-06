"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Filter,
  Navigation,
  Phone,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  ClipboardList,
  XCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchJobs,
  fetchJobStats,
  fetchAvailability,
  toggleAvailability,
  setFilter,
  clearError,
} from "@/store/slices/technicianJobSlice";
import { TechnicianJob, TechnicianStatus } from "@/types/technicianJob";
import { formatDate, formatTime } from "@/lib/vendorOrder";

export default function JobsPage() {
  const dispatch = useAppDispatch();
  const { jobs, stats, filter, isAvailable, isLoading, error } = useAppSelector(
    (state) => state.technicianJob
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs({ status: filter.status, date: filter.date || undefined }));
    dispatch(fetchJobStats());
    dispatch(fetchAvailability());
  }, [dispatch, filter.status, filter.date]);

  const handleRefresh = () => {
    dispatch(fetchJobs({ status: filter.status, date: filter.date || undefined }));
    dispatch(fetchJobStats());
  };

  const handleStatusChange = (status: string) => {
    dispatch(setFilter({ status }));
  };

  const handleDateChange = (date: string) => {
    dispatch(setFilter({ date }));
  };

  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.order_number.toLowerCase().includes(query) ||
      job.customer.name.toLowerCase().includes(query) ||
      getServiceSummary(job).toLowerCase().includes(query) ||
      job.address.city.toLowerCase().includes(query)
    );
  });

  const getServiceSummary = (job: TechnicianJob) => {
    if (job.items.length === 0) return "No services";
    if (job.items.length === 1) return job.items[0].sub_service_name;
    return `${job.items[0].sub_service_name} +${job.items.length - 1} more`;
  };

  const getStatusColor = (status: TechnicianStatus) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-100 text-yellow-700";
      case "acknowledged":
        return "bg-blue-100 text-blue-700";
      case "on_the_way":
        return "bg-orange-100 text-orange-700";
      case "arrived":
        return "bg-purple-100 text-purple-700";
      case "in_progress":
        return "bg-indigo-100 text-indigo-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: TechnicianStatus) => {
    switch (status) {
      case "assigned":
        return "Assigned";
      case "acknowledged":
        return "Acknowledged";
      case "on_the_way":
        return "On the Way";
      case "arrived":
        return "Arrived";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const openNavigation = (job: TechnicianJob) => {
    if (job.address.latitude && job.address.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${job.address.latitude},${job.address.longitude}`;
      window.open(url, "_blank");
    }
  };

  const activeJobs = filteredJobs.filter(
    (j) => j.technician_status !== "completed" && j.technician_status !== "cancelled"
  );
  const completedJobs = filteredJobs.filter((j) => j.technician_status === "completed");

  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your assigned jobs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleAvailability(!isAvailable))}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              isAvailable
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="h-4 w-4 inline mr-1" />
                Available
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 inline mr-1" />
                Unavailable
              </>
            )}
          </button>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {!isAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-900">You are currently unavailable</p>
              <p className="text-sm text-yellow-700 mt-1">
                You won't receive new job assignments. You can still complete your current jobs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.today_jobs}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">Pending Accept</p>
            <p className="text-2xl font-semibold text-yellow-600">
              {stats.pending_acknowledge}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-semibold text-blue-600">{stats.in_progress}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-500">Completed Today</p>
            <p className="text-2xl font-semibold text-green-600">{stats.completed_today}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error.message}</p>
          <button
            onClick={() => {
              dispatch(clearError());
              handleRefresh();
            }}
            className="ml-auto text-sm font-medium text-red-700 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filter.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              >
                <option value="active">Active</option>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={filter.date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              />
            </div>
          </div>
        )}
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Active Jobs ({activeJobs.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {activeJobs.map((job) => (
              <div key={job.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {job.customer.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(
                          job.technician_status
                        )}`}
                      >
                        {getStatusLabel(job.technician_status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{getServiceSummary(job)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Order: {job.order_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {formatDate(job.scheduled_date)}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(job.scheduled_time)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {job.address.street_address}, {job.address.city}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/technician/jobs/${job.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Link>
                  <button
                    onClick={() => openNavigation(job)}
                    disabled={!job.address.latitude || !job.address.longitude}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Navigation className="h-4 w-4" />
                    Navigate
                  </button>
                  <a
                    href={`tel:${job.customer.phone}`}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Completed ({completedJobs.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {completedJobs.map((job) => (
              <Link
                key={job.id}
                href={`/technician/jobs/${job.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {job.customer.name}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700">
                        <CheckCircle2 className="h-3 w-3 inline mr-1" />
                        Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{getServiceSummary(job)}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{formatDate(job.scheduled_date)}</p>
                    <p>{formatTime(job.scheduled_time)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {job.address.city}, {job.address.emirate}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {filteredJobs.length === 0 && !isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No jobs found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
