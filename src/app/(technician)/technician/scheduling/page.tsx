"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Loader2,
  AlertCircle,
  RefreshCw,
  Calendar,
  Plus,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSchedule,
  requestDayOff,
  cancelDayOff,
  clearError,
} from "@/store/slices/technicianJobSlice";
import { TechnicianJob, TechnicianStatus } from "@/types/technicianJob";
import { formatDate, formatTime } from "@/lib/vendorOrder";

export default function SchedulingPage() {
  const dispatch = useAppDispatch();
  const { schedule, isLoading, isSubmitting, error } = useAppSelector(
    (state) => state.technicianJob
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Calculate date range for fetching
  const dateRange = useMemo(() => {
    const from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return {
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
    };
  }, [currentDate]);

  useEffect(() => {
    dispatch(fetchSchedule(dateRange));
  }, [dispatch, dateRange]);

  const handleRefresh = () => {
    dispatch(fetchSchedule(dateRange));
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const formatCalendarDate = (day: number) => {
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${currentDate.getFullYear()}-${month}-${dayStr}`;
  };

  const getJobsForDate = (date: string): TechnicianJob[] => {
    if (!schedule?.orders) return [];
    return schedule.orders.filter((job) => job.scheduled_date === date);
  };

  const isBlocked = (date: string) => {
    if (!schedule?.unavailable_days) return false;
    return schedule.unavailable_days.some((d) => d.date === date);
  };

  const getBlockedDay = (date: string) => {
    if (!schedule?.unavailable_days) return null;
    return schedule.unavailable_days.find((d) => d.date === date);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      formatCalendarDate(day) === today.toISOString().split("T")[0]
    );
  };

  const selectedDateJobs = getJobsForDate(selectedDate);
  const selectedBlockedDay = getBlockedDay(selectedDate);

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

  const handleBlockDate = async () => {
    if (!blockDate) return;
    try {
      await dispatch(
        requestDayOff({ date: blockDate, reason: blockReason || undefined })
      ).unwrap();
      setShowBlockModal(false);
      setBlockDate("");
      setBlockReason("");
    } catch {
      // Error is handled by Redux
    }
  };

  const handleUnblockDate = async (dayOffId: string) => {
    try {
      await dispatch(cancelDayOff(dayOffId)).unwrap();
    } catch {
      // Error is handled by Redux
    }
  };

  if (isLoading && !schedule) {
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
          <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">
            View your assigned schedule
          </p>
        </div>
        <div className="flex gap-2">
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
          <Link
            href="/technician/scheduling/availability"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Manage Availability
          </Link>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">{monthName}</h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first of the month */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = formatCalendarDate(day);
                const jobsOnDay = getJobsForDate(date);
                const blocked = isBlocked(date);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`h-24 p-1 rounded-lg text-left transition-colors ${
                      selectedDate === date
                        ? "bg-gray-900 text-white"
                        : blocked
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isToday(day) && selectedDate !== date
                          ? "text-blue-600"
                          : ""
                      }`}
                    >
                      {day}
                    </span>
                    {jobsOnDay.length > 0 && (
                      <div className="mt-1">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            selectedDate === date
                              ? "bg-white/20"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {jobsOnDay.length} job{jobsOnDay.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                    {blocked && (
                      <span
                        className={`text-xs ${
                          selectedDate === date ? "text-white/70" : "text-red-400"
                        }`}
                      >
                        Blocked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Day Jobs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedDateJobs.length} job(s) scheduled
                </p>
              </div>
              {!isBlocked(selectedDate) && (
                <button
                  onClick={() => {
                    setBlockDate(selectedDate);
                    setShowBlockModal(true);
                  }}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  title="Block this date"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {selectedBlockedDay && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">
                    Day Blocked
                  </p>
                  {selectedBlockedDay.reason && (
                    <p className="text-sm text-red-600 mt-1">
                      {selectedBlockedDay.reason}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleUnblockDate(selectedBlockedDay.id)}
                  disabled={isSubmitting}
                  className="text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
                >
                  {isSubmitting ? "..." : "Unblock"}
                </button>
              </div>
            </div>
          )}

          {selectedDateJobs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {selectedDateJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/technician/jobs/${job.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {formatTime(job.scheduled_time)}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(
                        job.technician_status
                      )}`}
                    >
                      {getStatusLabel(job.technician_status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 mb-1">
                    {job.customer.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {job.items.length > 0
                      ? job.items[0].sub_service_name
                      : "No service"}
                    {job.items.length > 1 && ` +${job.items.length - 1} more`}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {job.address.street_address}, {job.address.city}
                  </div>
                </Link>
              ))}
            </div>
          ) : !selectedBlockedDay ? (
            <div className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No jobs scheduled for this day</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Working Hours */}
      {schedule?.working_hours && schedule.working_hours.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Working Hours
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {schedule.working_hours.map((wh) => (
              <div
                key={wh.day_of_week}
                className={`p-3 rounded-lg text-center ${
                  wh.is_available
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    wh.is_available ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {wh.day_name}
                </p>
                {wh.is_available ? (
                  <p className="text-xs text-green-600 mt-1">
                    {wh.start_time} - {wh.end_time}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">Off</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 rounded" />
            <span className="text-sm text-gray-600">Jobs scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded" />
            <span className="text-sm text-gray-600">Blocked/Unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-900 rounded" />
            <span className="text-sm text-gray-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600">28</span>
            <span className="text-sm text-gray-600">Today</span>
          </div>
        </div>
      </div>

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Request Day Off
              </h3>
              <button
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockDate("");
                  setBlockReason("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {new Date(blockDate + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (optional)
                </label>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g., Personal appointment, vacation..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockDate("");
                  setBlockReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockDate}
                disabled={isSubmitting || !blockDate}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                    Requesting...
                  </>
                ) : (
                  "Request Day Off"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
