"use client";

import { useState } from "react";
import { Search, Download, Calendar, User, Activity } from "lucide-react";

const auditLogs = [
  { id: 1, action: "vendor.created", user: "Admin User", target: "Mike's Plumbing", ip: "192.168.1.100", timestamp: "2024-03-18 10:30:00" },
  { id: 2, action: "user.login", user: "john@example.com", target: "-", ip: "192.168.1.101", timestamp: "2024-03-18 10:25:00" },
  { id: 3, action: "category.updated", user: "Admin User", target: "Plumbing", ip: "192.168.1.100", timestamp: "2024-03-18 10:20:00" },
  { id: 4, action: "payout.processed", user: "System", target: "PR-2024-001", ip: "-", timestamp: "2024-03-18 10:00:00" },
  { id: 5, action: "vendor.suspended", user: "Admin User", target: "ProPaint Services", ip: "192.168.1.100", timestamp: "2024-03-18 09:45:00" },
  { id: 6, action: "feature_flag.enabled", user: "Admin User", target: "ai_recommendations", ip: "192.168.1.100", timestamp: "2024-03-18 09:30:00" },
  { id: 7, action: "user.logout", user: "sarah@example.com", target: "-", ip: "192.168.1.102", timestamp: "2024-03-18 09:15:00" },
  { id: 8, action: "role.created", user: "Admin User", target: "Viewer", ip: "192.168.1.100", timestamp: "2024-03-17 16:00:00" },
];

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredLogs = auditLogs.filter((log) =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionBadgeColor = (action: string) => {
    if (action.includes("created")) return "bg-green-50 text-green-700";
    if (action.includes("updated")) return "bg-blue-50 text-blue-700";
    if (action.includes("deleted") || action.includes("suspended")) return "bg-red-50 text-red-700";
    if (action.includes("login") || action.includes("logout")) return "bg-purple-50 text-purple-700";
    return "bg-gray-50 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-1">System activity and user action history</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{auditLogs.length}</div>
          <p className="text-sm text-gray-500 mt-1">Total Events</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {auditLogs.filter((l) => l.action.includes("login")).length}
          </div>
          <p className="text-sm text-gray-500 mt-1">Login Events</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {new Set(auditLogs.map((l) => l.user)).size}
          </div>
          <p className="text-sm text-gray-500 mt-1">Active Users</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {auditLogs.filter((l) => l.action.includes("created") || l.action.includes("updated")).length}
          </div>
          <p className="text-sm text-gray-500 mt-1">Changes Made</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Timestamp</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Action</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Target</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-mono font-medium rounded ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{log.target}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-gray-500">{log.ip}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No audit logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
