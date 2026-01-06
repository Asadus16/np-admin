"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Save,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import {
  getTechnician,
  getWorkingHours,
  setWorkingHours,
  getUnavailableDays,
  addUnavailableDay,
  removeUnavailableDay,
} from "@/lib/technician";
import { Technician, WorkingHour, UnavailableDay } from "@/types/technician";
import { ApiException } from "@/lib/auth";

export default function TechnicianAvailabilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [workingHours, setWorkingHoursState] = useState<WorkingHour[]>([]);
  const [unavailableDays, setUnavailableDays] = useState<UnavailableDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showAddDayModal, setShowAddDayModal] = useState(false);
  const [newDayDate, setNewDayDate] = useState("");
  const [newDayReason, setNewDayReason] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [techResponse, hoursResponse, daysResponse] = await Promise.all([
        getTechnician(id),
        getWorkingHours(id),
        getUnavailableDays(id),
      ]);
      setTechnician(techResponse.data);
      setWorkingHoursState(hoursResponse.data);
      setUnavailableDays(daysResponse.data);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError("Failed to load data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDay = (dayIndex: number) => {
    setWorkingHoursState((prev) =>
      prev.map((wh, idx) =>
        idx === dayIndex ? { ...wh, is_available: !wh.is_available } : wh
      )
    );
  };

  const handleTimeChange = (
    dayIndex: number,
    field: "start_time" | "end_time",
    value: string
  ) => {
    setWorkingHoursState((prev) =>
      prev.map((wh, idx) =>
        idx === dayIndex ? { ...wh, [field]: value } : wh
      )
    );
  };

  const handleSaveWorkingHours = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await setWorkingHours(id, {
        working_hours: workingHours.map((wh) => ({
          day_of_week: wh.day_of_week,
          start_time: wh.start_time.substring(0, 5),
          end_time: wh.end_time.substring(0, 5),
          is_available: wh.is_available,
        })),
      });
      setSuccess("Working hours updated successfully");
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError("Failed to update working hours");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddUnavailableDay = async () => {
    if (!newDayDate) return;
    setIsAddingDay(true);
    setError(null);
    try {
      const response = await addUnavailableDay(id, {
        date: newDayDate,
        reason: newDayReason || undefined,
      });
      setUnavailableDays((prev) =>
        [...prev, response.data].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
      setShowAddDayModal(false);
      setNewDayDate("");
      setNewDayReason("");
      setSuccess("Unavailable day added successfully");
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError("Failed to add unavailable day");
      }
    } finally {
      setIsAddingDay(false);
    }
  };

  const handleRemoveUnavailableDay = async (dayId: string) => {
    try {
      await removeUnavailableDay(id, dayId);
      setUnavailableDays((prev) => prev.filter((d) => d.id !== dayId));
      setConfirmDelete(null);
      setSuccess("Unavailable day removed successfully");
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError("Failed to remove unavailable day");
      }
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingDays = unavailableDays.filter((d) => d.date >= today);
  const pastDays = unavailableDays.filter((d) => d.date < today);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Technician not found</p>
        <Link
          href="/vendor/technicians"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Back to Technicians
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/vendor/technicians/${id}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Manage Availability
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {technician.first_name} {technician.last_name}
          </p>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-sm font-medium text-red-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
          <p className="text-sm text-green-700">{success}</p>
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-sm font-medium text-green-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Working Hours */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">
                Working Hours
              </h2>
            </div>
            <button
              onClick={handleSaveWorkingHours}
              disabled={isSaving}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {workingHours.map((wh, index) => (
              <div key={wh.day_of_week} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleDay(index)}
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        wh.is_available ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          wh.is_available ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-900 w-24">
                      {wh.day_name}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      wh.is_available
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {wh.is_available ? "Working" : "Off"}
                  </span>
                </div>
                {wh.is_available && (
                  <div className="flex items-center gap-2 ml-[52px]">
                    <input
                      type="time"
                      value={wh.start_time.substring(0, 5)}
                      onChange={(e) =>
                        handleTimeChange(index, "start_time", e.target.value)
                      }
                      className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="time"
                      value={wh.end_time.substring(0, 5)}
                      onChange={(e) =>
                        handleTimeChange(index, "end_time", e.target.value)
                      }
                      className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Unavailable Days */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">
                Blocked Dates
              </h2>
            </div>
            <button
              onClick={() => setShowAddDayModal(true)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </button>
          </div>
          {upcomingDays.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {upcomingDays.map((day) => (
                <div
                  key={day.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(day.date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                    {day.reason && (
                      <p className="text-xs text-gray-500 mt-1">{day.reason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                      Blocked
                    </span>
                    {confirmDelete === day.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRemoveUnavailableDay(day.id)}
                          className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
                        >
                          Confirm
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
                        onClick={() => setConfirmDelete(day.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded"
                        title="Remove"
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
              <p className="text-gray-500">No blocked dates</p>
              <p className="text-sm text-gray-400 mt-1">
                Add dates when this technician is unavailable
              </p>
            </div>
          )}

          {/* Past blocked dates */}
          {pastDays.length > 0 && (
            <div className="border-t border-gray-200">
              <div className="p-4 bg-gray-50">
                <p className="text-sm font-medium text-gray-500">
                  Past ({pastDays.length})
                </p>
              </div>
              <div className="divide-y divide-gray-200 opacity-60">
                {pastDays.slice(0, 3).map((day) => (
                  <div key={day.id} className="p-4">
                    <p className="text-sm text-gray-600">
                      {new Date(day.date + "T00:00:00").toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                      {day.reason && ` - ${day.reason}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Availability Tips
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            - Working hours determine when the technician can be assigned jobs
          </li>
          <li>
            - Blocked dates override working hours (technician will show as
            unavailable)
          </li>
          <li>
            - Changes to working hours apply immediately to future assignments
          </li>
        </ul>
      </div>

      {/* Add Unavailable Day Modal */}
      {showAddDayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Block Date
              </h3>
              <button
                onClick={() => {
                  setShowAddDayModal(false);
                  setNewDayDate("");
                  setNewDayReason("");
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
                  value={newDayDate}
                  onChange={(e) => setNewDayDate(e.target.value)}
                  min={getMinDate()}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (optional)
                </label>
                <select
                  value={newDayReason}
                  onChange={(e) => setNewDayReason(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                >
                  <option value="">Select reason</option>
                  <option value="Personal Leave">Personal Leave</option>
                  <option value="Medical">Medical</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Training">Training</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {newDayDate && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {technician.first_name} will be unavailable on{" "}
                    <span className="font-medium">
                      {new Date(newDayDate + "T00:00:00").toLocaleDateString(
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
                  setShowAddDayModal(false);
                  setNewDayDate("");
                  setNewDayReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUnavailableDay}
                disabled={isAddingDay || !newDayDate}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {isAddingDay ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                    Adding...
                  </>
                ) : (
                  "Block Date"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
