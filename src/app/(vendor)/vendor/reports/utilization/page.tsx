"use client";

import Link from "next/link";
import { ArrowLeft, Download, Clock, Users, Calendar, TrendingUp } from "lucide-react";

const utilizationData = {
  avgUtilization: 72,
  totalHours: 320,
  billedHours: 230,
  technicianUtilization: [
    { name: "Mike Johnson", hours: 85, utilization: 85 },
    { name: "Sarah Smith", hours: 72, utilization: 72 },
    { name: "John Davis", hours: 45, utilization: 56 },
    { name: "Emily Brown", hours: 28, utilization: 35 },
  ],
};

const dailyBreakdown = [
  { day: "Mon", hours: 8, utilized: 7 },
  { day: "Tue", hours: 8, utilized: 6.5 },
  { day: "Wed", hours: 8, utilized: 7.5 },
  { day: "Thu", hours: 8, utilized: 6 },
  { day: "Fri", hours: 8, utilized: 5.5 },
  { day: "Sat", hours: 4, utilized: 3 },
];

export default function UtilizationReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/reports" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Utilization Report</h1>
          <p className="text-sm text-gray-500 mt-1">Team efficiency and time utilization (read-only)</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-100 rounded">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Avg Utilization</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{utilizationData.avgUtilization}%</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-gray-100 rounded">
              <Clock className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-sm text-gray-500">Total Hours</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{utilizationData.totalHours}h</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-100 rounded">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Billed Hours</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{utilizationData.billedHours}h</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-purple-100 rounded">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Active Technicians</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technician Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">By Technician</h2>
          <div className="space-y-4">
            {utilizationData.technicianUtilization.map((tech) => (
              <div key={tech.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{tech.name}</span>
                  <span className="text-sm text-gray-500">{tech.hours}h ({tech.utilization}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      tech.utilization >= 70 ? "bg-green-500" :
                      tech.utilization >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${tech.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Pattern</h2>
          <div className="flex items-end justify-between h-48 gap-2">
            {dailyBreakdown.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t relative" style={{ height: "100%" }}>
                  <div
                    className="absolute bottom-0 w-full bg-gray-900 rounded-t"
                    style={{ height: `${(day.utilized / day.hours) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{day.day}</p>
                <p className="text-xs text-gray-400">{day.utilized}h</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
