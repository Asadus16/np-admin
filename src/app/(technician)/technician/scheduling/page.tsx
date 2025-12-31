"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";

const scheduledJobs = [
  { id: "JOB-1234", date: "2024-12-28", time: "10:00 AM", customer: "John Smith", service: "Pipe Leak Repair", address: "Villa 24, Palm Jumeirah", status: "in_progress" },
  { id: "JOB-1235", date: "2024-12-28", time: "2:00 PM", customer: "Sarah Johnson", service: "Faucet Installation", address: "Apt 1502, Marina Heights", status: "assigned" },
  { id: "JOB-1236", date: "2024-12-28", time: "4:30 PM", customer: "Mike Brown", service: "Water Heater Check", address: "Villa 8, Emirates Hills", status: "assigned" },
  { id: "JOB-1237", date: "2024-12-29", time: "9:00 AM", customer: "Emily Davis", service: "Drain Cleaning", address: "Apt 804, JBR Walk", status: "assigned" },
  { id: "JOB-1238", date: "2024-12-29", time: "11:30 AM", customer: "Robert Wilson", service: "Pipe Replacement", address: "Villa 12, Arabian Ranches", status: "assigned" },
  { id: "JOB-1239", date: "2024-12-30", time: "10:00 AM", customer: "Lisa White", service: "Toilet Repair", address: "Apt 2301, Downtown Views", status: "assigned" },
];

const blockedDates = ["2024-12-25", "2024-12-31", "2025-01-01"];

export default function SchedulingPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 28)); // December 28, 2024
  const [selectedDate, setSelectedDate] = useState("2024-12-28");

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatDate = (day: number) => {
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${currentDate.getFullYear()}-${month}-${dayStr}`;
  };

  const getJobsForDate = (date: string) => {
    return scheduledJobs.filter((job) => job.date === date);
  };

  const isBlocked = (date: string) => blockedDates.includes(date);
  const isToday = (day: number) => formatDate(day) === "2024-12-28";

  const selectedDateJobs = getJobsForDate(selectedDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "assigned": return "bg-yellow-100 text-yellow-700";
      case "completed": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">View your assigned schedule</p>
        </div>
        <Link
          href="/technician/scheduling/availability"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Manage Availability
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">{monthName}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
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
                const date = formatDate(day);
                const jobsOnDay = getJobsForDate(date);
                const blocked = isBlocked(date);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    disabled={blocked}
                    className={`h-24 p-1 rounded-lg text-left transition-colors ${
                      selectedDate === date
                        ? "bg-gray-900 text-white"
                        : blocked
                        ? "bg-red-50 text-red-300 cursor-not-allowed"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      isToday(day) && selectedDate !== date ? "text-blue-600" : ""
                    }`}>
                      {day}
                    </span>
                    {jobsOnDay.length > 0 && (
                      <div className="mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          selectedDate === date ? "bg-white/20" : "bg-blue-100 text-blue-700"
                        }`}>
                          {jobsOnDay.length} job{jobsOnDay.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                    {blocked && (
                      <span className="text-xs text-red-400">Blocked</span>
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
            <h3 className="text-lg font-medium text-gray-900">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <p className="text-sm text-gray-500">{selectedDateJobs.length} job(s) scheduled</p>
          </div>
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
                      <span className="text-sm font-medium text-gray-900">{job.time}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(job.status)}`}>
                      {job.status === "in_progress" ? "In Progress" : "Assigned"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 mb-1">{job.customer}</p>
                  <p className="text-sm text-gray-600 mb-2">{job.service}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {job.address}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No jobs scheduled for this day</p>
            </div>
          )}
        </div>
      </div>

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
        </div>
      </div>
    </div>
  );
}
