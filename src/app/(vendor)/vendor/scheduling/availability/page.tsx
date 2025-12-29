"use client";

import { useState } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";

const initialSchedule = {
  monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  friday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
  saturday: { enabled: true, slots: [{ start: "10:00", end: "14:00" }] },
  sunday: { enabled: false, slots: [] },
};

const dayNames: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export default function AvailabilityPage() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDay = (day: keyof typeof schedule) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        enabled: !schedule[day].enabled,
        slots: !schedule[day].enabled ? [{ start: "09:00", end: "17:00" }] : [],
      },
    });
  };

  const addSlot = (day: keyof typeof schedule) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        slots: [...schedule[day].slots, { start: "09:00", end: "17:00" }],
      },
    });
  };

  const removeSlot = (day: keyof typeof schedule, index: number) => {
    const newSlots = schedule[day].slots.filter((_, i) => i !== index);
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        slots: newSlots,
        enabled: newSlots.length > 0,
      },
    });
  };

  const updateSlot = (day: keyof typeof schedule, index: number, field: "start" | "end", value: string) => {
    const newSlots = [...schedule[day].slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], slots: newSlots },
    });
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Availability</h1>
        <p className="text-sm text-gray-500 mt-1">Set your working hours for each day of the week</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Weekly Schedule</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {(Object.keys(schedule) as Array<keyof typeof schedule>).map((day) => (
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
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Time Zone</h3>
        <p className="text-sm text-gray-600">Pacific Time (PT) - Los Angeles</p>
        <button className="text-sm text-gray-600 hover:text-gray-900 underline mt-1">Change</button>
      </div>
    </div>
  );
}
