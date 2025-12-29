"use client";

import { useState } from "react";
import { Search, User, Calendar, MapPin, Clock } from "lucide-react";

const technicians = [
  { id: 1, name: "Mike Johnson", activeJobs: 3, available: true },
  { id: 2, name: "Sarah Smith", activeJobs: 2, available: true },
  { id: 3, name: "John Davis", activeJobs: 4, available: false },
];

const unassignedJobs = [
  { id: 1, orderId: "ORD-008", service: "Plumbing Repair", customer: "Alice Brown", date: "Mar 20", time: "9:00 AM", address: "456 Oak St" },
  { id: 2, orderId: "ORD-009", service: "Drain Cleaning", customer: "Bob Wilson", date: "Mar 20", time: "11:00 AM", address: "789 Pine Ave" },
  { id: 3, orderId: "ORD-010", service: "Pipe Inspection", customer: "Carol Davis", date: "Mar 21", time: "2:00 PM", address: "321 Elm Rd" },
];

export default function AssignmentsPage() {
  const [selectedTechnician, setSelectedTechnician] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAssign = (jobId: number) => {
    if (selectedTechnician) {
      console.log(`Assigning job ${jobId} to technician ${selectedTechnician}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Job Assignments</h1>
        <p className="text-sm text-gray-500 mt-1">Assign jobs to your technicians</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Technicians */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-900">Select Technician</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {technicians.map((tech) => (
              <button
                key={tech.id}
                onClick={() => setSelectedTechnician(tech.id)}
                disabled={!tech.available}
                className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                  selectedTechnician === tech.id
                    ? "bg-gray-50"
                    : tech.available
                    ? "hover:bg-gray-50"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedTechnician === tech.id
                      ? "bg-gray-900"
                      : "border-2 border-gray-300"
                  }`} />
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {tech.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tech.name}</p>
                    <p className="text-xs text-gray-500">{tech.activeJobs} active jobs</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  tech.available
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}>
                  {tech.available ? "Available" : "Busy"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Unassigned Jobs */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-900">Unassigned Jobs</h2>
                <span className="px-2 py-0.5 text-xs bg-yellow-50 text-yellow-700 rounded-full">
                  {unassignedJobs.length} pending
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

            <div className="divide-y divide-gray-200">
              {unassignedJobs.map((job) => (
                <div key={job.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{job.orderId}</span>
                        <span className="text-sm text-gray-600">{job.service}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {job.customer}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {job.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.time}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        {job.address}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAssign(job.id)}
                      disabled={!selectedTechnician}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                        selectedTechnician
                          ? "text-white bg-gray-900 hover:bg-gray-800"
                          : "text-gray-400 bg-gray-100 cursor-not-allowed"
                      }`}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {unassignedJobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No unassigned jobs</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
