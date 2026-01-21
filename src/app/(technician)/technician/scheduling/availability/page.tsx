"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  X,
  Trash2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchWorkingHours,
  fetchUnavailableDays,
  requestDayOff,
  cancelDayOff,
  clearError,
} from "@/store/slices/technicianJobSlice";

export default function AvailabilityPage() {
  const dispatch = useAppDispatch();
  const { workingHours, unavailableDays, isLoading, isSubmitting, error } =
    useAppSelector((state) => state.technicianJob);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchWorkingHours());
    dispatch(fetchUnavailableDays());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchWorkingHours());
    dispatch(fetchUnavailableDays());
  };

  const handleSubmitRequest = async () => {
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

  const handleCancelDayOff = async (dayOffId: string) => {
    try {
      await dispatch(cancelDayOff(dayOffId)).unwrap();
      setConfirmDelete(null);
    } catch {
      // Error is handled by Redux
    }
  };

  // Get minimum date for date picker (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Convert 24-hour time to 12-hour format with AM/PM
  const formatTime12Hour = (time: string): string => {
    if (!time) return '';

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Sort unavailable days by date
  const sortedUnavailableDays = [...unavailableDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Separate past and upcoming unavailable days
  const today = new Date().toISOString().split("T")[0];
  const upcomingDays = sortedUnavailableDays.filter((d) => d.date >= today);
  const pastDays = sortedUnavailableDays.filter((d) => d.date < today);

  if (isLoading && workingHours.length === 0 && unavailableDays.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/technician/scheduling"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Availability
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your working hours and time off
            </p>
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Working Hours */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Working Hours</h2>
            <p className="text-sm text-gray-500 mt-1">
              Your regular working schedule (view only)
            </p>
          </div>
          {workingHours.length > 0 ? (
            <>
              <div className="divide-y divide-gray-200">
                {workingHours.map((schedule) => (
                  <div
                    key={schedule.day_of_week}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          schedule.is_available ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-900 w-24">
                        {schedule.day_name}
                      </span>
                    </div>
                    {schedule.is_available ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {formatTime12Hour(schedule.start_time)} - {formatTime12Hour(schedule.end_time)}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Off</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Working hours are set by your vendor. Contact your manager to
                  request changes.
                </p>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No working hours configured</p>
            </div>
          )}
        </div>

        {/* Blocked Dates */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Blocked Dates
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Days you&apos;re not available
              </p>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Request Time Off
            </button>
          </div>
          {upcomingDays.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {upcomingDays.map((blocked) => (
                <div
                  key={blocked.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(blocked.date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                      {blocked.reason && (
                        <p className="text-xs text-gray-500">{blocked.reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                      Blocked
                    </span>
                    {confirmDelete === blocked.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCancelDayOff(blocked.id)}
                          disabled={isSubmitting}
                          className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 disabled:opacity-50"
                        >
                          {isSubmitting ? "..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(blocked.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded"
                        title="Remove blocked date"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming blocked dates</p>
            </div>
          )}
        </div>
      </div>

      {/* Past Blocked Dates */}
      {pastDays.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Past Blocked Dates
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Previous days off (for reference)
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {pastDays.slice(0, 5).map((blocked) => (
              <div
                key={blocked.id}
                className="p-4 flex items-center justify-between opacity-60"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(blocked.date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                    {blocked.reason && (
                      <p className="text-xs text-gray-500">{blocked.reason}</p>
                    )}
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                  Past
                </span>
              </div>
            ))}
          </div>
          {pastDays.length > 5 && (
            <div className="p-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                +{pastDays.length - 5} more past dates
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Tips</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <p className="text-sm text-gray-600">
              Block dates at least 48 hours in advance for better planning
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <p className="text-sm text-gray-600">
              You can remove blocked dates if your plans change
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <p className="text-sm text-gray-600">
              Your vendor will be notified of all availability changes
            </p>
          </div>
        </div>
      </div>

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Request Time Off
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
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (optional)
                </label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                >
                  <option value="">Select reason</option>
                  <option value="Personal Leave">Personal Leave</option>
                  <option value="Medical">Medical</option>
                  <option value="Family Event">Family Event</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {blockDate && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    You are requesting time off on{" "}
                    <span className="font-medium">
                      {new Date(blockDate + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </p>
                </div>
              )}
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
                onClick={handleSubmitRequest}
                disabled={isSubmitting || !blockDate}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
