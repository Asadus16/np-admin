"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter, Clock, User, CheckCircle, MapPin, LogIn, LogOut, Wrench, Star, Download } from "lucide-react";

const activityLogs = [
  { id: 1, user: "Mike Johnson", action: "Completed job", details: "ORD-156 - Plumbing Repair", timestamp: "Today, 3:15 PM", type: "job" },
  { id: 2, user: "Mike Johnson", action: "Started job", details: "ORD-156 - Plumbing Repair", timestamp: "Today, 2:05 PM", type: "job" },
  { id: 3, user: "Mike Johnson", action: "Clocked in", details: "Location: 123 Main St", timestamp: "Today, 1:45 PM", type: "clock" },
  { id: 4, user: "Sarah Smith", action: "Received 5-star review", details: "ORD-155 - Drain Cleaning", timestamp: "Today, 12:30 PM", type: "review" },
  { id: 5, user: "Sarah Smith", action: "Completed job", details: "ORD-155 - Drain Cleaning", timestamp: "Today, 11:45 AM", type: "job" },
  { id: 6, user: "John Davis", action: "Clocked out", details: "Total hours: 8h 15m", timestamp: "Yesterday, 6:15 PM", type: "clock" },
  { id: 7, user: "John Davis", action: "Completed job", details: "ORD-154 - Water Heater Install", timestamp: "Yesterday, 5:30 PM", type: "job" },
  { id: 8, user: "Emily Brown", action: "Assigned to job", details: "ORD-157 - Pipe Inspection", timestamp: "Yesterday, 4:00 PM", type: "assignment" },
  { id: 9, user: "Mike Johnson", action: "Clocked out", details: "Total hours: 7h 45m", timestamp: "Yesterday, 5:00 PM", type: "clock" },
  { id: 10, user: "Sarah Smith", action: "Updated profile", details: "Changed phone number", timestamp: "2 days ago", type: "profile" },
  { id: 11, user: "John Davis", action: "Completed training", details: "Safety Certification", timestamp: "2 days ago", type: "training" },
  { id: 12, user: "Mike Johnson", action: "Received 4-star review", details: "ORD-150 - Faucet Replacement", timestamp: "3 days ago", type: "review" },
];

const technicians = [
  { id: 1, name: "Mike Johnson" },
  { id: 2, name: "Sarah Smith" },
  { id: 3, name: "John Davis" },
  { id: 4, name: "Emily Brown" },
];

export default function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUser = selectedUser === "all" || log.user === selectedUser;
    const matchesType = selectedType === "all" || log.type === selectedType;
    return matchesSearch && matchesUser && matchesType;
  });

  const getActionIcon = (type: string) => {
    switch (type) {
      case "job":
        return <Wrench className="h-4 w-4" />;
      case "clock":
        return <Clock className="h-4 w-4" />;
      case "review":
        return <Star className="h-4 w-4" />;
      case "assignment":
        return <User className="h-4 w-4" />;
      case "profile":
        return <User className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case "job":
        return "bg-blue-100 text-blue-600";
      case "clock":
        return "bg-purple-100 text-purple-600";
      case "review":
        return "bg-yellow-100 text-yellow-600";
      case "assignment":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/technicians" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Activity Logs</h1>
          <p className="text-sm text-gray-500 mt-1">View all technician activities and actions</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Technicians</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.name}>{tech.name}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Activities</option>
            <option value="job">Jobs</option>
            <option value="clock">Clock In/Out</option>
            <option value="review">Reviews</option>
            <option value="assignment">Assignments</option>
            <option value="profile">Profile Updates</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="divide-y divide-gray-200">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-4 flex items-start gap-4">
              <div className={`p-2 rounded-lg ${getActionColor(log.type)}`}>
                {getActionIcon(log.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{log.user}</span>
                  <span className="text-sm text-gray-500">{log.action}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{log.details}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                <Clock className="h-3 w-3" />
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No activity logs found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredLogs.length} of {activityLogs.length} activities
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
