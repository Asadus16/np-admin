"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Download, Calendar, User, Activity, ChevronLeft, ChevronRight, RefreshCw, Radio } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  AuditLog,
  AuditLogListResponse,
  AuditLogFilters,
} from "@/types/auditLog";
import {
  initializeSocket,
  connectSocket,
  authenticateUser,
  getSocket,
  SocketAuditLog,
} from "@/lib/socket";

export default function AuditLogsPage() {
  const { token, user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<Record<string, number | Record<string, number>> | null>(null);
  const [actionTypes, setActionTypes] = useState<string[]>([]);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [newLogIds, setNewLogIds] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<AuditLogFilters>({
    search: "",
    action: "",
    user_type: "",
    entity_type: "",
    date_filter: "",
    per_page: 20,
  });

  // Refs for socket handler (declared after state)
  const socketInitialized = useRef(false);
  const currentPageRef = useRef(currentPage);
  const filtersRef = useRef<AuditLogFilters>(filters);

  const fetchLogs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      if (filters.per_page) params.append("per_page", filters.per_page.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.action) params.append("action", filters.action);
      if (filters.user_type) params.append("user_type", filters.user_type);
      if (filters.entity_type) params.append("entity_type", filters.entity_type);
      if (filters.date_filter) params.append("date_filter", filters.date_filter);
      if (filters.from_date) params.append("from_date", filters.from_date);
      if (filters.to_date) params.append("to_date", filters.to_date);

      const response = await api.get<AuditLogListResponse>(
        `/admin/audit-logs?${params.toString()}`,
        token
      );
      setLogs(response.data);
      setTotalPages(response.meta.last_page);
      setTotal(response.meta.total);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, filters]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get<{ status: string; data: Record<string, number | Record<string, number>> }>(
        "/admin/audit-logs/stats",
        token
      );
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, [token]);

  const fetchActionTypes = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get<{ status: string; data: { actions: string[]; grouped: Record<string, string[]> } }>(
        "/admin/audit-logs/action-types",
        token
      );
      setActionTypes(response.data.actions || []);
    } catch (error) {
      console.error("Failed to fetch action types:", error);
    }
  }, [token]);

  const fetchEntityTypes = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get<{ status: string; data: string[] }>(
        "/admin/audit-logs/entity-types",
        token
      );
      setEntityTypes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch entity types:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetchStats();
    fetchActionTypes();
    fetchEntityTypes();
  }, [fetchStats, fetchActionTypes, fetchEntityTypes]);

  // Keep refs in sync with state
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Socket connection for real-time updates
  useEffect(() => {
    if (!user?.id) return;

    console.log('[AuditLogs] Setting up socket for user:', user.id);

    // Initialize and connect
    const socket = initializeSocket();
    connectSocket();
    authenticateUser(user.id);

    // Join audit logs room
    const joinRoom = () => {
      console.log('[AuditLogs] Joining audit-logs room');
      socket.emit('join_audit_logs');
    };

    // If already connected, join immediately
    if (socket.connected) {
      joinRoom();
    }

    // Join on connect/reconnect
    socket.on('connect', joinRoom);

    // Simple direct listener for audit logs
    const handleAuditLog = (data: SocketAuditLog) => {
      console.log('[AuditLogs] RECEIVED:', data.action);

      const currentFilters = filtersRef.current;

      // Only add if on page 1 with no filters
      if (currentPageRef.current !== 1) return;
      if (currentFilters.search || currentFilters.action || currentFilters.user_type || currentFilters.entity_type || currentFilters.date_filter) return;

      const newLog: AuditLog = {
        id: data.id,
        user_id: data.user_id,
        user_type: data.user_type,
        action: data.action,
        entity_type: data.entity_type,
        entity_id: data.entity_id,
        entity_name: data.entity_name,
        old_values: data.old_values,
        new_values: data.new_values,
        metadata: data.metadata,
        ip_address: data.ip_address,
        user_agent: data.user_agent,
        created_at: data.created_at,
        user: data.user,
      };

      setLogs((prev) => {
        if (prev.some(log => log.id === newLog.id)) return prev;
        const updated = [newLog, ...prev];
        if (updated.length > (currentFilters.per_page || 20)) updated.pop();
        return updated;
      });

      setNewLogIds((prev) => new Set(prev).add(newLog.id));
      setTimeout(() => {
        setNewLogIds((prev) => {
          const updated = new Set(prev);
          updated.delete(newLog.id);
          return updated;
        });
      }, 3000);

      setTotal((prev) => prev + 1);
    };

    // Register listener
    socket.on('audit_log', handleAuditLog);
    setIsLive(true);

    console.log('[AuditLogs] Listeners registered, socket connected:', socket.connected);

    return () => {
      console.log('[AuditLogs] Cleanup');
      socket.off('connect', joinRoom);
      socket.off('audit_log', handleAuditLog);
      socket.emit('leave_audit_logs');
      setIsLive(false);
    };
  }, [user?.id]);

  const handleExport = async () => {
    if (!token) return;
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.action) params.append("action", filters.action);
      if (filters.user_type) params.append("user_type", filters.user_type);
      if (filters.entity_type) params.append("entity_type", filters.entity_type);
      if (filters.date_filter) params.append("date_filter", filters.date_filter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/audit-logs/export?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      console.error("Failed to export:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes("created")) return "bg-green-50 text-green-700";
    if (action.includes("updated")) return "bg-blue-50 text-blue-700";
    if (action.includes("deleted") || action.includes("suspended") || action.includes("declined") || action.includes("cancelled")) return "bg-red-50 text-red-700";
    if (action.includes("login") || action.includes("logout")) return "bg-purple-50 text-purple-700";
    if (action.includes("completed")) return "bg-emerald-50 text-emerald-700";
    if (action.includes("confirmed") || action.includes("approved")) return "bg-teal-50 text-teal-700";
    if (action.includes("started") || action.includes("acknowledged")) return "bg-amber-50 text-amber-700";
    return "bg-gray-50 text-gray-700";
  };

  const getUserTypeColor = (userType: string | null) => {
    switch (userType) {
      case "admin": return "bg-purple-100 text-purple-800";
      case "vendor": return "bg-blue-100 text-blue-800";
      case "technician": return "bg-orange-100 text-orange-800";
      case "customer": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserDisplay = (log: AuditLog) => {
    if (log.user) {
      return `${log.user.first_name} ${log.user.last_name}`;
    }
    return "System";
  };

  const getTargetDisplay = (log: AuditLog) => {
    if (log.entity_name) return log.entity_name;
    if (log.entity_type && log.entity_id) return `${log.entity_type} #${log.entity_id}`;
    return "-";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Audit Logs</h1>
            {isLive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                <Radio className="h-3 w-3 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">System activity and user action history</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { fetchLogs(); fetchStats(); }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Download className={`h-4 w-4 mr-2 ${exporting ? "animate-bounce" : ""}`} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{stats?.total_logs as number ?? 0}</div>
          <p className="text-sm text-gray-500 mt-1">Total Events</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{stats?.today_logs as number ?? 0}</div>
          <p className="text-sm text-gray-500 mt-1">Today</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{stats?.active_users_today as number ?? 0}</div>
          <p className="text-sm text-gray-500 mt-1">Active Users Today</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{stats?.login_events as number ?? 0}</div>
          <p className="text-sm text-gray-500 mt-1">Login Events</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange("action", e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              >
                <option value="">All Actions</option>
                {actionTypes.map((action) => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
              <select
                value={filters.user_type}
                onChange={(e) => handleFilterChange("user_type", e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              >
                <option value="">All User Types</option>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
                <option value="technician">Technician</option>
                <option value="customer">Customer</option>
              </select>
              <select
                value={filters.entity_type}
                onChange={(e) => handleFilterChange("entity_type", e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              >
                <option value="">All Entity Types</option>
                {entityTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={filters.date_filter}
                onChange={(e) => handleFilterChange("date_filter", e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Timestamp</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Action</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">User</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">User Type</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Target</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className={`transition-colors duration-500 ${
                        newLogIds.has(log.id)
                          ? "bg-green-50 animate-pulse"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(log.created_at)}
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
                          <span className="text-sm text-gray-900">{getUserDisplay(log)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {log.user_type && (
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded capitalize ${getUserTypeColor(log.user_type)}`}>
                            {log.user_type}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{getTargetDisplay(log)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-gray-500">{log.ip_address || "-"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {logs.length === 0 && (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No audit logs found</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {logs.length} of {total} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
