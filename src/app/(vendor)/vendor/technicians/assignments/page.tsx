"use client";

import { useState, useEffect } from "react";
import {
  Search,
  User,
  Calendar,
  MapPin,
  Clock,
  Loader2,
  AlertCircle,
  Zap,
  RefreshCw,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchTechniciansWithAvailability,
  fetchUnassignedOrders,
  assignTechnicianToOrder,
  autoAssignTechnicianToOrder,
  setSelectedTechnician,
  setSelectedDate,
  clearSelection,
  clearError,
} from "@/store/slices/technicianAssignmentSlice";
import { formatDate, formatTime, formatCurrency } from "@/lib/vendorOrder";
import { VendorOrder } from "@/types/vendorOrder";

export default function AssignmentsPage() {
  const dispatch = useAppDispatch();
  const {
    technicians,
    unassignedOrders,
    selectedTechnicianId,
    selectedDate,
    isLoading,
    isSubmitting,
    error,
  } = useAppSelector((state) => state.technicianAssignment);

  const [searchQuery, setSearchQuery] = useState("");
  const [actionOrderId, setActionOrderId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTechniciansWithAvailability(selectedDate));
    dispatch(fetchUnassignedOrders());
  }, [dispatch, selectedDate]);

  const handleRefresh = () => {
    dispatch(fetchTechniciansWithAvailability(selectedDate));
    dispatch(fetchUnassignedOrders());
  };

  const handleDateChange = (date: string) => {
    dispatch(setSelectedDate(date));
  };

  const handleSelectTechnician = (techId: string) => {
    dispatch(setSelectedTechnician(techId));
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  const handleAssign = async (orderId: string) => {
    if (!selectedTechnicianId) return;

    setActionOrderId(orderId);
    try {
      await dispatch(assignTechnicianToOrder({ orderId, technicianId: selectedTechnicianId })).unwrap();
      dispatch(fetchTechniciansWithAvailability(selectedDate));
    } catch (err) {
      console.error(err);
    } finally {
      setActionOrderId(null);
    }
  };

  const handleAutoAssign = async (orderId: string) => {
    setActionOrderId(orderId);
    try {
      await dispatch(autoAssignTechnicianToOrder(orderId)).unwrap();
      dispatch(fetchTechniciansWithAvailability(selectedDate));
    } catch (err) {
      console.error(err);
    } finally {
      setActionOrderId(null);
    }
  };

  const getServiceSummary = (order: VendorOrder) => {
    if (order.items.length === 0) return "No services";
    if (order.items.length === 1) return order.items[0].sub_service_name;
    return `${order.items[0].sub_service_name} +${order.items.length - 1} more`;
  };

  const filteredJobs = unassignedOrders.filter((job) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.order_number.toLowerCase().includes(query) ||
      job.customer.name.toLowerCase().includes(query) ||
      getServiceSummary(job).toLowerCase().includes(query)
    );
  });

  if (isLoading && technicians.length === 0) {
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
          <h1 className="text-2xl font-semibold text-gray-900">Job Assignments</h1>
          <p className="text-sm text-gray-500 mt-1">Assign jobs to your technicians</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
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
        {/* Technicians Panel */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Select Technician</h2>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              />
            </div>
          </div>

          {technicians.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No technicians found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {technicians.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => handleSelectTechnician(tech.id)}
                  disabled={!tech.is_available}
                  className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                    selectedTechnicianId === tech.id
                      ? "bg-gray-50"
                      : tech.is_available
                      ? "hover:bg-gray-50"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedTechnicianId === tech.id
                          ? "bg-gray-900"
                          : "border-2 border-gray-300"
                      }`}
                    />
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {tech.first_name[0]}
                        {tech.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {tech.first_name} {tech.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tech.active_jobs} active job{tech.active_jobs !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      tech.is_available
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {tech.is_available ? "Available" : "Busy"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {selectedTechnicianId && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleClearSelection}
                className="w-full px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 inline-flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Unassigned Jobs Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-900">Unassigned Jobs</h2>
                <span className="px-2 py-0.5 text-xs bg-yellow-50 text-yellow-700 rounded-full">
                  {unassignedOrders.length} pending
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No unassigned jobs</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-900">
                            {job.order_number}
                          </span>
                          <span className="text-sm text-gray-600 truncate">
                            {getServiceSummary(job)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {job.customer.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(job.scheduled_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(job.scheduled_time)}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          {job.address.city}, {job.address.emirate}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(job.total)}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAutoAssign(job.id)}
                            disabled={isSubmitting && actionOrderId === job.id}
                            className="px-2 py-1.5 text-xs font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 inline-flex items-center disabled:opacity-50"
                            title="Auto-assign best available technician"
                          >
                            {isSubmitting && actionOrderId === job.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Zap className="h-3 w-3" />
                            )}
                          </button>
                          <button
                            onClick={() => handleAssign(job.id)}
                            disabled={!selectedTechnicianId || (isSubmitting && actionOrderId === job.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg inline-flex items-center ${
                              selectedTechnicianId
                                ? "text-white bg-gray-900 hover:bg-gray-800"
                                : "text-gray-400 bg-gray-100 cursor-not-allowed"
                            }`}
                          >
                            {isSubmitting && actionOrderId === job.id ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : null}
                            Assign
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
