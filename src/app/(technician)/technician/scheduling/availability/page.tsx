"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, AlertCircle, CheckCircle } from "lucide-react";

const workingHours = [
  { day: "Sunday", start: "09:00", end: "18:00", enabled: true },
  { day: "Monday", start: "09:00", end: "18:00", enabled: true },
  { day: "Tuesday", start: "09:00", end: "18:00", enabled: true },
  { day: "Wednesday", start: "09:00", end: "18:00", enabled: true },
  { day: "Thursday", start: "09:00", end: "18:00", enabled: true },
  { day: "Friday", start: "14:00", end: "22:00", enabled: true },
  { day: "Saturday", start: "10:00", end: "16:00", enabled: false },
];

const blockedDates = [
  { date: "2024-12-25", reason: "Holiday - Christmas" },
  { date: "2024-12-31", reason: "Personal Leave" },
  { date: "2025-01-01", reason: "Holiday - New Year" },
];

const pendingRequests = [
  { id: 1, date: "2025-01-05", reason: "Family event", status: "pending" },
];

export default function AvailabilityPage() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/technician/scheduling"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Availability</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your working hours and time off</p>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Current Status</h2>
            <p className="text-sm text-gray-500 mt-1">
              {isAvailable ? "You are currently available to receive jobs" : "You are currently unavailable"}
            </p>
          </div>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative inline-flex h-10 w-48 items-center rounded-full transition-colors ${
              isAvailable ? "bg-green-100" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-flex items-center justify-center h-9 w-24 rounded-full text-sm font-medium transition-all ${
                isAvailable
                  ? "translate-x-[92px] bg-green-600 text-white"
                  : "translate-x-0.5 bg-gray-500 text-white"
              }`}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </span>
            <span
              className={`absolute text-sm font-medium ${
                isAvailable ? "left-4 text-green-700" : "right-4 text-gray-600"
              }`}
            >
              {isAvailable ? "On Duty" : "Off Duty"}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Working Hours */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Working Hours</h2>
            <p className="text-sm text-gray-500 mt-1">Your regular working schedule (view only)</p>
          </div>
          <div className="divide-y divide-gray-200">
            {workingHours.map((schedule) => (
              <div key={schedule.day} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${schedule.enabled ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className="text-sm font-medium text-gray-900 w-24">{schedule.day}</span>
                </div>
                {schedule.enabled ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {schedule.start} - {schedule.end}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Off</span>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Working hours are set by your vendor. Contact your manager to request changes.
            </p>
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Blocked Dates</h2>
              <p className="text-sm text-gray-500 mt-1">Days you&apos;re not available</p>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Request Time Off
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {blockedDates.map((blocked, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(blocked.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-500">{blocked.reason}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                  Blocked
                </span>
              </div>
            ))}
            {blockedDates.length === 0 && (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No blocked dates</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="p-4 border-b border-yellow-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-medium text-yellow-800">Pending Requests</h2>
            </div>
          </div>
          <div className="divide-y divide-yellow-200">
            {pendingRequests.map((request) => (
              <div key={request.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    {new Date(request.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-yellow-700">{request.reason}</p>
                </div>
                <span className="px-2 py-0.5 text-xs font-medium bg-yellow-200 text-yellow-800 rounded">
                  Awaiting Approval
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Tips</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <p className="text-sm text-gray-600">Set yourself as unavailable when you can&apos;t take new jobs</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <p className="text-sm text-gray-600">Request time off at least 48 hours in advance</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            <p className="text-sm text-gray-600">Your vendor will be notified of all availability changes</p>
          </div>
        </div>
      </div>

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Time Off</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                >
                  <option value="">Select reason</option>
                  <option value="personal">Personal Leave</option>
                  <option value="medical">Medical</option>
                  <option value="family">Family Event</option>
                  <option value="emergency">Emergency</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Any additional details..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
