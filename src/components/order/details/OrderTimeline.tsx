"use client";

import { OrderTimelineProps } from "./types";

export function OrderTimeline({ timeline }: OrderTimelineProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Activity Timeline</h2>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.status === "Order Cancelled"
                      ? "bg-red-500"
                      : item.completed
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                {idx < timeline.length - 1 && (
                  <div
                    className={`w-0.5 h-8 ${
                      item.completed ? "bg-green-200" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    item.status === "Order Cancelled"
                      ? "text-red-600"
                      : item.completed
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  {item.status}
                </p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
