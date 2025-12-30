"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";

const today = new Date();
const currentMonth = today.toLocaleString("default", { month: "long", year: "numeric" });

const events = [
  { id: 1, title: "Plumbing Repair", customer: "John Smith", time: "9:00 AM", duration: 60, technician: "Mike J.", day: 18 },
  { id: 2, title: "Drain Cleaning", customer: "Sarah Johnson", time: "11:00 AM", duration: 90, technician: "Mike J.", day: 18 },
  { id: 3, title: "Water Heater Install", customer: "Mike Brown", time: "2:00 PM", duration: 180, technician: "John D.", day: 19 },
  { id: 4, title: "Pipe Inspection", customer: "Emily Davis", time: "10:00 AM", duration: 45, technician: "Mike J.", day: 20 },
  { id: 5, title: "Faucet Replacement", customer: "Robert Wilson", time: "3:00 PM", duration: 45, technician: "John D.", day: 20 },
];

export default function SchedulingPage() {
  const [view, setView] = useState<"week" | "day">("week");
  const [selectedDate, setSelectedDate] = useState(18);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekDays = [
    { day: "Mon", date: 18 },
    { day: "Tue", date: 19 },
    { day: "Wed", date: 20 },
    { day: "Thu", date: 21 },
    { day: "Fri", date: 22 },
    { day: "Sat", date: 23 },
    { day: "Sun", date: 24 },
  ];

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  const getEventsForDay = (date: number) => events.filter((e) => e.day === date);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Scheduling</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your job schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView("day")}
              className={`px-3 py-1 text-sm font-medium rounded ${
                view === "day" ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-3 py-1 text-sm font-medium rounded ${
                view === "week" ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">{currentMonth}</h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Today
          </button>
        </div>

        {view === "week" ? (
          /* Week View */
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Week Header */}
              <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="p-3 text-xs font-medium text-gray-500 uppercase text-center border-r border-gray-200">
                  Time
                </div>
                {weekDays.map((d) => (
                  <div
                    key={d.date}
                    className={`p-3 text-center border-r border-gray-200 last:border-r-0 ${
                      d.date === selectedDate ? "bg-gray-50" : ""
                    }`}
                  >
                    <p className="text-xs font-medium text-gray-500 uppercase">{d.day}</p>
                    <p className={`text-lg font-semibold ${
                      d.date === 18 ? "text-gray-900 bg-gray-900 text-white w-8 h-8 rounded-full mx-auto flex items-center justify-center" : "text-gray-900"
                    }`}>
                      {d.date}
                    </p>
                  </div>
                ))}
              </div>

              {/* Time Grid */}
              <div className="relative">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
                    <div className="p-2 text-xs text-gray-500 text-right pr-3 border-r border-gray-200">
                      {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                    </div>
                    {weekDays.map((d) => (
                      <div key={d.date} className="h-16 border-r border-gray-100 last:border-r-0 relative">
                        {getEventsForDay(d.date)
                          .filter((e) => parseInt(e.time) === hour || (hour === 9 && e.time === "9:00 AM") || (hour === 11 && e.time === "11:00 AM") || (hour === 14 && e.time === "2:00 PM") || (hour === 10 && e.time === "10:00 AM") || (hour === 15 && e.time === "3:00 PM"))
                          .map((event) => (
                            <div
                              key={event.id}
                              className="absolute left-1 right-1 top-1 bg-blue-50 border-l-2 border-blue-500 rounded p-1 cursor-pointer hover:bg-blue-100"
                              style={{ minHeight: `${(event.duration / 60) * 64 - 8}px` }}
                            >
                              <p className="text-xs font-medium text-blue-900 truncate">{event.title}</p>
                              <p className="text-xs text-blue-600 truncate">{event.customer}</p>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Day View */
          <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
              <p className="text-lg font-medium text-gray-900">March {selectedDate}, 2024</p>
              <span className="text-sm text-gray-500">{getEventsForDay(selectedDate).length} jobs scheduled</span>
            </div>
            <div className="space-y-3">
              {getEventsForDay(selectedDate).map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300">
                  <div className="w-16 text-center">
                    <p className="text-sm font-medium text-gray-900">{event.time}</p>
                    <p className="text-xs text-gray-500">{event.duration} min</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        {event.customer}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {event.technician}
                      </span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    View
                  </button>
                </div>
              ))}
              {getEventsForDay(selectedDate).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500">No jobs scheduled for this day</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
