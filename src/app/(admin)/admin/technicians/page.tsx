"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Star, Loader2, Users, MoreVertical, Ban, UserCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Technician {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: "active" | "suspended";
  vendor: {
    id: string;
    name: string;
  } | null;
  jobs_count: number;
  rating: number;
  created_at: string;
}

interface PaginatedResponse {
  data: Technician[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function TechniciansPage() {
  const { token } = useAuth();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTechnicians, setTotalTechnicians] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchTechnicians = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await api.get<PaginatedResponse>(
        `/admin/technicians?${params.toString()}`,
        token
      );

      setTechnicians(response.data);
      setTotalPages(response.meta.last_page);
      setTotalTechnicians(response.meta.total);
    } catch (err) {
      console.error("Failed to fetch technicians:", err);
      setError("Failed to load technicians. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [token, currentPage, statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchTechnicians();
      } else {
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSuspend = async (technicianId: string) => {
    if (!token) return;

    setActionLoading(technicianId);
    try {
      await api.post(`/admin/technicians/${technicianId}/suspend`, {}, token);
      setTechnicians((prev) =>
        prev.map((t) => (t.id === technicianId ? { ...t, status: "suspended" as const } : t))
      );
      setOpenDropdown(null);
    } catch (err) {
      console.error("Failed to suspend technician:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnsuspend = async (technicianId: string) => {
    if (!token) return;

    setActionLoading(technicianId);
    try {
      await api.post(`/admin/technicians/${technicianId}/unsuspend`, {}, token);
      setTechnicians((prev) =>
        prev.map((t) => (t.id === technicianId ? { ...t, status: "active" as const } : t))
      );
      setOpenDropdown(null);
    } catch (err) {
      console.error("Failed to unsuspend technician:", err);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const activeTechnicians = technicians.filter((t) => t.status === "active").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Technicians</h1>
        <p className="text-sm text-gray-500 mt-1">Directory of all technicians</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{totalTechnicians}</div>
          <p className="text-sm text-gray-500 mt-1">Total Technicians</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-green-600">{activeTechnicians}</div>
          <p className="text-sm text-gray-500 mt-1">Active</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-red-600">
            {technicians.filter((t) => t.status === "suspended").length}
          </div>
          <p className="text-sm text-gray-500 mt-1">Suspended</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
          {error}
          <button onClick={fetchTechnicians} className="ml-2 underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-gray-200 rounded-lg p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Loading technicians...</p>
          </div>
        </div>
      )}

      {/* Technicians Table */}
      {!isLoading && !error && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Technician
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Vendor
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Phone
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Joined
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {technicians.map((tech) => (
                  <tr key={tech.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tech.name}</div>
                        <div className="text-sm text-gray-500">{tech.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {tech.vendor ? (
                        <Link
                          href={`/admin/vendors/${tech.vendor.id}`}
                          className="text-sm text-gray-900 hover:underline"
                        >
                          {tech.vendor.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">{tech.phone || "-"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{tech.created_at}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                          tech.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tech.status.charAt(0).toUpperCase() + tech.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative" data-dropdown>
                        <button
                          onClick={() =>
                            setOpenDropdown(openDropdown === tech.id ? null : tech.id)
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                        {openDropdown === tech.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <Link
                              href={`/admin/technicians/${tech.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </Link>
                            {tech.status === "active" ? (
                              <button
                                onClick={() => handleSuspend(tech.id)}
                                disabled={actionLoading === tech.id}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 disabled:opacity-50"
                              >
                                {actionLoading === tech.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Ban className="h-4 w-4 mr-2" />
                                )}
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnsuspend(tech.id)}
                                disabled={actionLoading === tech.id}
                                className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-50 disabled:opacity-50"
                              >
                                {actionLoading === tech.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <UserCheck className="h-4 w-4 mr-2" />
                                )}
                                Unsuspend
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {technicians.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No technicians found</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalTechnicians > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {technicians.length} of {totalTechnicians} technicians
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
