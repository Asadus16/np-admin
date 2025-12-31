"use client";

import { useState, useEffect } from "react";
import { Clock, Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { 
  getCompanyHours, 
  createOrUpdateCompanyHours 
} from "@/lib/companyHours";
import { CompanyHour, DayOfWeek, CompanyHourSlotInput } from "@/types/companyHours";
import { ApiException } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

const dayNames: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const dayOrder: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface DaySchedule {
  enabled: boolean;
  slots: { start: string; end: string }[];
  id?: string;
}

type ScheduleState = Record<DayOfWeek, DaySchedule>;

const defaultSchedule: ScheduleState = {
  monday: { enabled: false, slots: [] },
  tuesday: { enabled: false, slots: [] },
  wednesday: { enabled: false, slots: [] },
  thursday: { enabled: false, slots: [] },
  friday: { enabled: false, slots: [] },
  saturday: { enabled: false, slots: [] },
  sunday: { enabled: false, slots: [] },
};

export default function AvailabilityPage() {
  const [schedule, setSchedule] = useState<ScheduleState>(defaultSchedule);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load company hours on mount
  useEffect(() => {
    loadCompanyHours();
  }, []);

  const loadCompanyHours = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCompanyHours();
      const hours = response.data;

      // Transform API data to UI format
      const newSchedule: ScheduleState = { ...defaultSchedule };
      
      hours.forEach((hour: CompanyHour) => {
        newSchedule[hour.day] = {
          enabled: hour.is_available,
          slots: hour.slots.map((slot) => ({
            start: slot.start_time,
            end: slot.end_time,
          })),
          id: hour.id,
        };
      });

      setSchedule(newSchedule);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || "Failed to load company hours");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error loading company hours:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (day: DayOfWeek) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        enabled: !schedule[day].enabled,
        slots: !schedule[day].enabled ? [{ start: "09:00", end: "17:00" }] : [],
      },
    });
    setError(null);
    setSuccess(null);
  };

  const addSlot = (day: DayOfWeek) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        slots: [...schedule[day].slots, { start: "09:00", end: "17:00" }],
      },
    });
    setError(null);
    setSuccess(null);
  };

  const removeSlot = (day: DayOfWeek, index: number) => {
    const newSlots = schedule[day].slots.filter((_, i) => i !== index);
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        slots: newSlots,
        enabled: newSlots.length > 0,
      },
    });
    setError(null);
    setSuccess(null);
  };

  const updateSlot = (
    day: DayOfWeek,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const newSlots = [...schedule[day].slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], slots: newSlots },
    });
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Transform UI data to API format
      const hours = dayOrder.map((day) => {
        const daySchedule = schedule[day];
        const slots: CompanyHourSlotInput[] = daySchedule.enabled
          ? daySchedule.slots.map((slot) => ({
              start_time: slot.start,
              end_time: slot.end,
            }))
          : [];

        return {
          day,
          is_available: daySchedule.enabled,
          slots,
        };
      });

      await createOrUpdateCompanyHours({ hours });
      setSuccess("Company hours saved successfully");
      
      // Reload to get updated IDs
      await loadCompanyHours();
    } catch (err) {
      if (err instanceof ApiException) {
        const errorMessage = err.errors
          ? Object.values(err.errors).flat().join(", ")
          : err.message || "Failed to save company hours";
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error saving company hours:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Availability</h1>
          <p className="text-sm text-gray-500 mt-1">Set your working hours for each day of the week</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">Loading company hours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Availability</h1>
        <p className="text-sm text-gray-500 mt-1">Set your working hours for each day of the week</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Success</p>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Weekly Schedule</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {dayOrder.map((day) => (
            <div key={day} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDay(day)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      schedule[day].enabled ? "bg-green-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        schedule[day].enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-gray-900">{dayNames[day]}</span>
                </div>
                {schedule[day].enabled && (
                  <button
                    onClick={() => addSlot(day)}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add slot
                  </button>
                )}
              </div>

              {schedule[day].enabled && (
                <div className="ml-14 space-y-2">
                  {schedule[day].slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateSlot(day, index, "start", e.target.value)}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateSlot(day, index, "end", e.target.value)}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                        />
                      </div>
                      {schedule[day].slots.length > 1 && (
                        <button
                          onClick={() => removeSlot(day, index)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!schedule[day].enabled && (
                <p className="ml-14 text-sm text-gray-400">Unavailable</p>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="primary"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

     
    </div>
  );
}
