"use client";

import { Calendar, Clock } from "lucide-react";
import { ScheduleNotesCardProps } from "./types";
import { formatDate, formatTime } from "@/lib/vendorOrder";

export function ScheduleNotesCard({
  scheduledDate,
  scheduledTime,
  totalDurationMinutes,
  notes,
}: ScheduleNotesCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Schedule & Notes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Date</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(scheduledDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Time</p>
            <p className="text-sm font-medium text-gray-900">
              {formatTime(scheduledTime)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-medium text-gray-900">
              {totalDurationMinutes} mins
            </p>
          </div>
        </div>
      </div>
      {notes && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Customer Notes</p>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{notes}</p>
        </div>
      )}
    </div>
  );
}
