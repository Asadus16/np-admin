"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, User, Users, Loader2, AlertCircle, RefreshCw, X, Calendar } from "lucide-react";
import { getVendorOrders } from "@/lib/vendorOrder";
import { getTechnicians, assignTechnician } from "@/lib/technician";
import { getVendorCompany, getCalendarHoursFromCompanyHours } from "@/lib/vendorCompany";
import { VendorOrder } from "@/types/vendorOrder";
import { Technician } from "@/types/technician";

export default function SchedulingPage() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calendar hours range
  const [calendarStartHour, setCalendarStartHour] = useState(8);
  const [calendarEndHour, setCalendarEndHour] = useState(22);

  const [view, setView] = useState<"week" | "day">("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>("all");
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));

  // Assignment modal state
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [assigningTechId, setAssigningTechId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [ordersResponse, techniciansResponse, companyResponse] = await Promise.all([
        getVendorOrders({ status: "confirmed,in_progress" }),
        getTechnicians(),
        getVendorCompany(),
      ]);
      setOrders(ordersResponse.data);
      setTechnicians(techniciansResponse.data);

      // Calculate calendar hours from company hours
      if (companyResponse.data.company_hours && companyResponse.data.company_hours.length > 0) {
        const { startHour, endHour } = getCalendarHoursFromCompanyHours(companyResponse.data.company_hours);
        setCalendarStartHour(startHour);
        setCalendarEndHour(endHour);
      }
    } catch (err) {
      setError("Failed to load scheduling data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  function getWeekDays(startDate: Date) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  }

  const weekDays = getWeekDays(currentWeekStart);
  const hours = Array.from({ length: calendarEndHour - calendarStartHour }, (_, i) => i + calendarStartHour);

  const handlePrevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentWeekStart(getWeekStart(today));
    setSelectedDate(today);
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleJobClick = (order: VendorOrder) => {
    // Only allow assignment for unassigned jobs
    if (!order.technician) {
      setSelectedOrder(order);
      setShowAssignmentModal(true);
    }
  };

  const handleAssignTechnician = async (technicianId: string) => {
    if (!selectedOrder) return;

    setIsAssigning(true);
    setAssigningTechId(technicianId);
    try {
      await assignTechnician(selectedOrder.id, technicianId);
      setShowAssignmentModal(false);
      setSelectedOrder(null);
      // Refresh orders to show the updated assignment
      await loadData();
    } catch (err) {
      console.error("Failed to assign technician:", err);
      setError("Failed to assign technician");
    } finally {
      setIsAssigning(false);
      setAssigningTechId(null);
    }
  };

  // Filter scheduled orders
  const scheduledOrders = orders.filter(
    (order) =>
      order.scheduled_date &&
      order.scheduled_time &&
      (order.status === "confirmed" || order.status === "in_progress")
  );

  // Filter by technician
  const filteredOrders =
    selectedTechnicianId === "all"
      ? scheduledOrders
      : scheduledOrders.filter((order) => order.technician?.id === selectedTechnicianId);

  // Get orders for a specific day
  const getOrdersForDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredOrders.filter((order) => order.scheduled_date === dateStr);
  };

  // Get orders for a specific hour on a specific day
  const getOrdersForDayAndHour = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredOrders.filter((order) => {
      if (order.scheduled_date !== dateStr || !order.scheduled_time) return false;
      const orderHour = parseInt(order.scheduled_time.split(":")[0]);
      return orderHour === hour;
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getTechnicianColor = (techId?: string) => {
    if (!techId) return "bg-gray-50 border-gray-500 text-gray-900";
    const colors = [
      "bg-blue-50 border-blue-500 text-blue-900",
      "bg-green-50 border-green-500 text-green-900",
      "bg-purple-50 border-purple-500 text-purple-900",
      "bg-orange-50 border-orange-500 text-orange-900",
      "bg-pink-50 border-pink-500 text-pink-900",
    ];
    const index = technicians.findIndex((t) => t.id === techId);
    return colors[index % colors.length];
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  if (isLoading && orders.length === 0 && technicians.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Scheduling</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your job schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={handleRefresh}
            className="ml-auto text-sm font-medium text-red-700 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Technician Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Technician:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTechnicianId("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedTechnicianId === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Technicians
            </button>
            {technicians.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setSelectedTechnicianId(tech.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selectedTechnicianId === tech.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tech.first_name} {tech.last_name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">
              {currentWeekStart.toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
            <button onClick={handleNextWeek} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
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
                {weekDays.map((day, idx) => {
                  const isToday = isSameDay(day, new Date());
                  const ordersCount = getOrdersForDay(day).length;
                  return (
                    <div
                      key={idx}
                      className={`p-3 text-center border-r border-gray-200 last:border-r-0 ${
                        isToday ? "bg-blue-50" : ""
                      }`}
                    >
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p
                        className={`text-lg font-semibold ${
                          isToday
                            ? "text-white bg-gray-900 w-8 h-8 rounded-full mx-auto flex items-center justify-center"
                            : "text-gray-900"
                        }`}
                      >
                        {day.getDate()}
                      </p>
                      {ordersCount > 0 && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                            {ordersCount} job{ordersCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Time Grid */}
              <div className="relative">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
                    <div className="p-2 text-xs text-gray-500 text-right pr-3 border-r border-gray-200">
                      {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                    </div>
                    {weekDays.map((day, dayIdx) => {
                      const ordersInHour = getOrdersForDayAndHour(day, hour);
                      return (
                        <div
                          key={dayIdx}
                          className="h-16 border-r border-gray-100 last:border-r-0 relative p-1"
                        >
                          {ordersInHour.map((order) => (
                            <div
                              key={order.id}
                              onClick={() => handleJobClick(order)}
                              className={`absolute left-1 right-1 top-1 border-l-2 rounded p-1 cursor-pointer text-xs transition-all hover:shadow-md ${
                                !order.technician ? "animate-pulse border-yellow-500" : ""
                              } ${getTechnicianColor(order.technician?.id)}`}
                              style={{
                                minHeight: `${Math.min((order.total_duration_minutes / 60) * 64 - 8, 56)}px`,
                              }}
                              title={!order.technician ? "Click to assign technician" : ""}
                            >
                              <p className="font-medium truncate">
                                {order.items.length > 0 ? order.items[0].sub_service_name : "Service"}
                              </p>
                              <p className="opacity-75 truncate">
                                {order.technician
                                  ? `${order.technician.first_name} ${order.technician.last_name}`
                                  : "Click to assign"}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Day View */
          <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
              <p className="text-lg font-medium text-gray-900">{formatDate(selectedDate)}</p>
              <span className="text-sm text-gray-500">
                {getOrdersForDay(selectedDate).length} job
                {getOrdersForDay(selectedDate).length !== 1 ? "s" : ""} scheduled
              </span>
            </div>
            <div className="space-y-3">
              {getOrdersForDay(selectedDate).map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleJobClick(order)}
                  className={`flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all ${
                    !order.technician ? "cursor-pointer border-yellow-300 bg-yellow-50/30" : "cursor-default"
                  }`}
                >
                  <div className="w-20 text-center">
                    <p className="text-sm font-medium text-gray-900">
                      {order.scheduled_time ? formatTime(order.scheduled_time) : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">{order.total_duration_minutes} min</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {order.items.map((item) => item.sub_service_name).join(", ")}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        {order.customer.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {order.technician
                          ? `${order.technician.first_name} ${order.technician.last_name}`
                          : "Unassigned"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded ${
                      order.status === "in_progress"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.status === "in_progress" ? "In Progress" : "Confirmed"}
                  </span>
                </div>
              ))}
              {getOrdersForDay(selectedDate).length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">No jobs scheduled for this day</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Assign Technician</h3>
                <p className="text-sm text-gray-500 mt-1">Order: {selectedOrder.order_number}</p>
              </div>
              <button
                onClick={() => {
                  setShowAssignmentModal(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Job Details */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Customer:</span>
                  <span className="text-gray-600">{selectedOrder.customer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Date:</span>
                  <span className="text-gray-600">
                    {new Date(selectedOrder.scheduled_date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Time:</span>
                  <span className="text-gray-600">{formatTime(selectedOrder.scheduled_time)}</span>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Services:</span>
                  <p className="text-gray-600 mt-1">
                    {selectedOrder.items.map((item) => item.sub_service_name).join(", ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Technician List */}
            <div className="p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Select a technician:</p>
              <div className="space-y-2">
                {technicians.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No technicians available</p>
                ) : (
                  technicians.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => handleAssignTechnician(tech.id)}
                      disabled={isAssigning}
                      className={`w-full p-3 flex items-center justify-between border-2 rounded-lg transition-all ${
                        assigningTechId === tech.id
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {tech.first_name[0]}
                            {tech.last_name[0]}
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {tech.first_name} {tech.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{tech.email}</p>
                        </div>
                      </div>
                      {isAssigning && assigningTechId === tech.id && (
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowAssignmentModal(false);
                  setSelectedOrder(null);
                }}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
