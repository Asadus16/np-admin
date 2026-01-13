"use client";

import { CheckCircle } from "lucide-react";
import { VendorOrderTimelineProps } from "./types";
import { formatDateTime } from "./helpers";

export function VendorOrderTimeline({ timeline }: VendorOrderTimelineProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
      <div className="space-y-4">
        {timeline.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div
              className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center ${
                item.completed ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              {item.completed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <div className="w-2 h-2 bg-gray-300 rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  item.completed ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {item.event}
              </p>
              {item.time && (
                <p className="text-xs text-gray-500">{formatDateTime(item.time)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
