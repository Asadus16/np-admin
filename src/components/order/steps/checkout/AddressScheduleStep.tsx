"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Calendar, Clock, Loader2, AlertCircle } from "lucide-react";
import { AddressScheduleStepProps, TIME_SLOTS } from "../../types";
import { getAvailableTimeSlots, AvailableTimeSlot } from "@/lib/customerVendor";

export function AddressScheduleStep({
  addresses,
  selectedAddress,
  onSelectAddress,
  orderType,
  onOrderTypeChange,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  recurringFrequency,
  onFrequencyChange,
  vendorId,
  totalDuration = 0,
}: AddressScheduleStepProps) {
  const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Fetch available time slots when date or vendor changes
  useEffect(() => {
    if (orderType !== "now" && selectedDate && vendorId && totalDuration > 0) {
      fetchAvailableSlots();
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, vendorId, totalDuration, orderType]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !vendorId || totalDuration <= 0) return;

    setLoadingSlots(true);
    setSlotsError(null);
    try {
      const response = await getAvailableTimeSlots(vendorId, selectedDate, totalDuration);
      setAvailableSlots(response.data);
    } catch (err) {
      console.error("Failed to fetch available time slots:", err);
      setSlotsError("Failed to load available time slots");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Get available time slots or fallback to all slots
  const getTimeSlots = () => {
    if (availableSlots.length > 0) {
      return availableSlots;
    }
    // Fallback to all time slots if no data available
    return TIME_SLOTS.map((time) => ({
      time,
      available_technicians: [],
      available_count: 0,
    }));
  };

  const timeSlots = getTimeSlots();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Address</h2>
        {addresses.length === 0 ? (
          <div className="text-center py-6 border border-gray-200 rounded-lg">
            <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 mb-3">No addresses saved</p>
            <Link
              href="/customer/addresses"
              className="text-sm font-medium text-gray-900 hover:underline"
            >
              Add an address
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => onSelectAddress(addr.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedAddress === addr.id
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{addr.label}</p>
                      {addr.is_primary && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{addr.street_address}, {addr.city}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Type</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "now", label: "Order Now", desc: "As soon as possible" },
            { id: "schedule", label: "Schedule Later", desc: "Pick date & time" },
            { id: "recurring", label: "Recurring", desc: "Set frequency" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => onOrderTypeChange(type.id as typeof orderType)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                orderType === type.id
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="font-medium text-gray-900 text-sm">{type.label}</p>
              <p className="text-xs text-gray-500">{type.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {orderType !== "now" && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {orderType === "recurring" ? "First Appointment" : "Select Date & Time"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Select Time
                {loadingSlots && (
                  <Loader2 className="h-3 w-3 inline ml-2 animate-spin text-gray-400" />
                )}
              </label>
              {slotsError && (
                <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {slotsError}
                </div>
              )}
              <select
                value={selectedTime}
                onChange={(e) => onTimeChange(e.target.value)}
                disabled={loadingSlots}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingSlots ? "Loading available times..." : "Choose a time"}
                </option>
                {timeSlots.map((slot) => {
                  const isAvailable = slot.available_count > 0;
                  return (
                    <option
                      key={slot.time}
                      value={slot.time}
                      disabled={!isAvailable}
                      className={!isAvailable ? "text-gray-400" : ""}
                    >
                      {slot.time}
                      {isAvailable && slot.available_count > 0
                        ? ` (${slot.available_count} technician${slot.available_count > 1 ? "s" : ""} available)`
                        : " (Unavailable)"}
                    </option>
                  );
                })}
              </select>
              {selectedDate && vendorId && totalDuration > 0 && availableSlots.length === 0 && !loadingSlots && (
                <p className="mt-1 text-xs text-gray-500">
                  No available time slots for this date. Please select another date.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {orderType === "recurring" && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recurring Frequency</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: "daily", label: "Daily", desc: "Every day" },
              { id: "weekly", label: "Weekly", desc: "Every week" },
              { id: "biweekly", label: "Bi-weekly", desc: "Every 2 weeks" },
              { id: "monthly", label: "Monthly", desc: "Every month" },
            ].map((freq) => (
              <button
                key={freq.id}
                onClick={() => onFrequencyChange(freq.id as typeof recurringFrequency)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  recurringFrequency === freq.id
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-medium text-gray-900 text-sm">{freq.label}</p>
                <p className="text-xs text-gray-500">{freq.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
