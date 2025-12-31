"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, User, X, Plus, CalendarOff, Users } from "lucide-react";

const today = new Date();
const currentMonth = today.toLocaleString("default", { month: "long", year: "numeric" });

const technicians = [
  { id: 1, name: "Mike J.", fullName: "Mike Johnson", color: "blue" },
  { id: 2, name: "John D.", fullName: "John Davis", color: "green" },
  { id: 3, name: "Sarah S.", fullName: "Sarah Smith", color: "purple" },
  { id: 4, name: "Emily B.", fullName: "Emily Brown", color: "orange" },
];

const initialEvents = [
  { id: 1, title: "Plumbing Repair", customer: "John Smith", time: "9:00 AM", duration: 60, technician: "Mike J.", day: 18 },
  { id: 2, title: "Drain Cleaning", customer: "Sarah Johnson", time: "11:00 AM", duration: 90, technician: "Mike J.", day: 18 },
  { id: 3, title: "Water Heater Install", customer: "Mike Brown", time: "2:00 PM", duration: 180, technician: "John D.", day: 19 },
  { id: 4, title: "Pipe Inspection", customer: "Emily Davis", time: "10:00 AM", duration: 45, technician: "Mike J.", day: 20 },
  { id: 5, title: "Faucet Replacement", customer: "Robert Wilson", time: "3:00 PM", duration: 45, technician: "John D.", day: 20 },
  { id: 6, title: "Bathroom Renovation", customer: "Lisa White", time: "9:00 AM", duration: 240, technician: "Sarah S.", day: 19 },
  { id: 7, title: "Leak Repair", customer: "Tom Green", time: "2:00 PM", duration: 60, technician: "Sarah S.", day: 20 },
];

const initialBlockedDates = [
  { id: 1, technician: "Mike J.", date: 21, reason: "Personal Leave" },
  { id: 2, technician: "John D.", date: 23, reason: "Training" },
  { id: 3, technician: "Sarah S.", date: 22, reason: "Medical Appointment" },
];

export default function SchedulingPage() {
  const [view, setView] = useState<"week" | "day">("week");
  const [selectedDate, setSelectedDate] = useState(18);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("all");
  const [events] = useState(initialEvents);
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [newBlockedDate, setNewBlockedDate] = useState({
    technician: "",
    date: "",
    reason: "",
  });

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

  const filteredEvents = selectedTechnician === "all"
    ? events
    : events.filter((e) => e.technician === selectedTechnician);

  const getEventsForDay = (date: number) => filteredEvents.filter((e) => e.day === date);

  const getBlockedForDay = (date: number) => {
    if (selectedTechnician === "all") {
      return blockedDates.filter((b) => b.date === date);
    }
    return blockedDates.filter((b) => b.date === date && b.technician === selectedTechnician);
  };

  const isDateBlocked = (date: number, technician?: string) => {
    if (technician) {
      return blockedDates.some((b) => b.date === date && b.technician === technician);
    }
    if (selectedTechnician === "all") {
      return blockedDates.some((b) => b.date === date);
    }
    return blockedDates.some((b) => b.date === date && b.technician === selectedTechnician);
  };

  const getTechnicianColor = (techName: string) => {
    const tech = technicians.find((t) => t.name === techName);
    switch (tech?.color) {
      case "blue": return "bg-blue-50 border-blue-500 text-blue-900";
      case "green": return "bg-green-50 border-green-500 text-green-900";
      case "purple": return "bg-purple-50 border-purple-500 text-purple-900";
      case "orange": return "bg-orange-50 border-orange-500 text-orange-900";
      default: return "bg-gray-50 border-gray-500 text-gray-900";
    }
  };

  const handleAddBlockedDate = () => {
    if (newBlockedDate.technician && newBlockedDate.date && newBlockedDate.reason) {
      setBlockedDates([
        ...blockedDates,
        {
          id: blockedDates.length + 1,
          technician: newBlockedDate.technician,
          date: parseInt(newBlockedDate.date),
          reason: newBlockedDate.reason,
        },
      ]);
      setNewBlockedDate({ technician: "", date: "", reason: "" });
      setShowBlockedModal(false);
    }
  };

  const handleRemoveBlockedDate = (id: number) => {
    setBlockedDates(blockedDates.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Scheduling</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your job schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBlockedModal(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <CalendarOff className="h-4 w-4 mr-2" />
            Blocked Dates
          </button>
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

      {/* Technician Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Technician:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTechnician("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedTechnician === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Technicians
            </button>
            {technicians.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setSelectedTechnician(tech.name)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selectedTechnician === tech.name
                    ? tech.color === "blue" ? "bg-blue-600 text-white"
                    : tech.color === "green" ? "bg-green-600 text-white"
                    : tech.color === "purple" ? "bg-purple-600 text-white"
                    : "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tech.fullName}
              </button>
            ))}
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
                    } ${isDateBlocked(d.date) ? "bg-red-50" : ""}`}
                  >
                    <p className="text-xs font-medium text-gray-500 uppercase">{d.day}</p>
                    <p className={`text-lg font-semibold ${
                      d.date === 18 ? "text-gray-900 bg-gray-900 text-white w-8 h-8 rounded-full mx-auto flex items-center justify-center" : "text-gray-900"
                    }`}>
                      {d.date}
                    </p>
                    {getBlockedForDay(d.date).length > 0 && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                          <CalendarOff className="h-3 w-3 mr-0.5" />
                          {getBlockedForDay(d.date).length}
                        </span>
                      </div>
                    )}
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
                              className={`absolute left-1 right-1 top-1 border-l-2 rounded p-1 cursor-pointer ${getTechnicianColor(event.technician)}`}
                              style={{ minHeight: `${(event.duration / 60) * 64 - 8}px` }}
                            >
                              <p className="text-xs font-medium truncate">{event.title}</p>
                              <p className="text-xs opacity-75 truncate">{event.technician}</p>
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

              {/* Blocked dates for selected day */}
              {getBlockedForDay(selectedDate).length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <CalendarOff className="h-4 w-4 text-red-500" />
                    Blocked/Unavailable
                  </h3>
                  <div className="space-y-2">
                    {getBlockedForDay(selectedDate).map((blocked) => (
                      <div key={blocked.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-red-900">{blocked.technician}</p>
                          <p className="text-xs text-red-600">{blocked.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Blocked Dates Modal */}
      {showBlockedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Manage Blocked Dates</h2>
              <button
                onClick={() => setShowBlockedModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Add New Blocked Date */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Add New Blocked Date</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Technician</label>
                    <select
                      value={newBlockedDate.technician}
                      onChange={(e) => setNewBlockedDate({ ...newBlockedDate, technician: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                    >
                      <option value="">Select technician</option>
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.name}>{tech.fullName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                    <select
                      value={newBlockedDate.date}
                      onChange={(e) => setNewBlockedDate({ ...newBlockedDate, date: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                    >
                      <option value="">Select date</option>
                      {weekDays.map((d) => (
                        <option key={d.date} value={d.date}>{d.day}, {d.date}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
                  <input
                    type="text"
                    value={newBlockedDate.reason}
                    onChange={(e) => setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })}
                    placeholder="e.g., Personal Leave, Training, Medical Appointment"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                  />
                </div>
                <button
                  onClick={handleAddBlockedDate}
                  disabled={!newBlockedDate.technician || !newBlockedDate.date || !newBlockedDate.reason}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Blocked Date
                </button>
              </div>

              {/* Existing Blocked Dates */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Current Blocked Dates</h3>
                {blockedDates.length === 0 ? (
                  <p className="text-sm text-gray-500">No blocked dates configured</p>
                ) : (
                  <div className="space-y-2">
                    {blockedDates.map((blocked) => (
                      <div key={blocked.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <CalendarOff className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{blocked.technician}</p>
                            <p className="text-xs text-gray-500">
                              {weekDays.find((d) => d.date === blocked.date)?.day}, {blocked.date} - {blocked.reason}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveBlockedDate(blocked.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowBlockedModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
