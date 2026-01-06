"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Calendar,
  MapPin,
  ArrowRight,
  Navigation,
  PlayCircle,
  Phone,
  Loader2,
  AlertCircle,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchJobs,
  fetchJobStats,
  clearError,
} from "@/store/slices/technicianJobSlice";
import { TechnicianJob, TechnicianStatus } from "@/types/technicianJob";
import { formatTime } from "@/lib/vendorOrder";

export default function TechnicianDashboard() {
  const dispatch = useAppDispatch();
  const { jobs, stats, isLoading, error } = useAppSelector(
    (state) => state.technicianJob
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Fetch active jobs for today
    dispatch(fetchJobs({ status: "active" }));
    dispatch(fetchJobStats());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchJobs({ status: "active" }));
    dispatch(fetchJobStats());
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

  const getServiceSummary = (job: TechnicianJob) => {
    if (job.items.length === 0) return "No services";
    if (job.items.length === 1) return job.items[0].sub_service_name;
    return `${job.items[0].sub_service_name} +${job.items.length - 1} more`;
  };

  // Filter today's jobs
  const today = new Date().toISOString().split("T")[0];
  const todaysJobs = jobs.filter(
    (job) =>
      job.scheduled_date === today &&
      job.technician_status !== "completed" &&
      job.technician_status !== "cancelled"
  );

  // Get upcoming jobs (not today)
  const upcomingJobs = jobs
    .filter(
      (job) =>
        job.scheduled_date > today &&
        job.technician_status !== "completed" &&
        job.technician_status !== "cancelled"
    )
    .slice(0, 5);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (isLoading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Technician"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here&apos;s your schedule for today
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
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

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Today&apos;s Jobs
              </span>
            </div>
            <p className="text-3xl font-semibold text-gray-900">
              {stats.today_jobs}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Pending Accept
              </span>
            </div>
            <p className="text-3xl font-semibold text-gray-900">
              {stats.pending_acknowledge}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <PlayCircle className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                In Progress
              </span>
            </div>
            <p className="text-3xl font-semibold text-gray-900">
              {stats.in_progress}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Completed Today
              </span>
            </div>
            <p className="text-3xl font-semibold text-gray-900">
              {stats.completed_today}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/technician/scheduling"
          className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Calendar className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            View Calendar
          </span>
        </Link>
        <Link
          href="/technician/jobs"
          className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ClipboardList className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">All Jobs</span>
        </Link>
        <Link
          href="/technician/scheduling/availability"
          className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Clock className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Availability</span>
        </Link>
        <Link
          href="/technician/profile"
          className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <CheckCircle className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Profile</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Jobs */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Today&apos;s Jobs ({todaysJobs.length})
            </h2>
            <Link
              href="/technician/jobs"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {todaysJobs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {todaysJobs.map((job) => (
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
                      <p className="text-sm text-gray-600">
                        {getServiceSummary(job)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatTime(job.scheduled_time)}
                      </p>
                      <p className="text-xs text-gray-500">{job.order_number}</p>
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
          ) : (
            <div className="p-8 text-center">
              <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No jobs scheduled for today</p>
              <Link
                href="/technician/jobs"
                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
              >
                View all jobs
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Jobs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Jobs</h2>
          </div>
          {upcomingJobs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {upcomingJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/technician/jobs/${job.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {job.customer.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {job.order_number}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {getServiceSummary(job)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {new Date(job.scheduled_date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      { weekday: "short", month: "short", day: "numeric" }
                    )}{" "}
                    at {formatTime(job.scheduled_time)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming jobs</p>
            </div>
          )}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/technician/scheduling"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1"
            >
              View Full Schedule <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
