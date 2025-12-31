"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Users, Phone, Mail, MoreVertical, History, Eye, Edit2, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getTechnicians, deleteTechnician } from "@/lib/technician";
import { Technician } from "@/types/technician";
import { ApiException } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export default function TechniciansPage() {
  const router = useRouter();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTechnicians();
      setTechnicians(response.data);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || "Failed to load technicians");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error loading technicians:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (technicianId: string) => {
    if (!confirm("Are you sure you want to remove this technician?")) {
      return;
    }

    setDeletingId(technicianId);
    setError(null);
    setSuccess(null);
    try {
      await deleteTechnician(technicianId);
      setSuccess("Technician removed successfully");
      await loadTechnicians();
      setOpenMenu(null);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || "Failed to delete technician");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error deleting technician:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const getTechnicianName = (tech: Technician) => {
    return `${tech.first_name} ${tech.last_name}`;
  };

  const getInitials = (tech: Technician) => {
    return `${tech.first_name[0]}${tech.last_name[0]}`.toUpperCase();
  };

  const filteredTechnicians = technicians.filter((tech) => {
    const fullName = getTechnicianName(tech).toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Technicians</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your team of technicians</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/vendor/technicians/activity"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <History className="h-4 w-4 mr-2" />
            Activity Logs
          </Link>
          <Link
            href="/vendor/technicians/invite"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Invite Technician
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Success</p>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">{technicians.length}</p>
          <p className="text-sm text-gray-500">Total Team</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">
            {technicians.filter((t) => t.email_verified_at).length}
          </p>
          <p className="text-sm text-gray-500">Verified</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">
            {technicians.filter((t) => !t.email_verified_at).length}
          </p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search technicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Loading technicians...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTechnicians.map((tech) => (
              <div key={tech.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {getInitials(tech)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{getTechnicianName(tech)}</p>
                      {tech.email_verified_at ? (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Technician</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        {tech.email}
                      </span>
                      {tech.phone && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Phone className="h-3 w-3" />
                          {tech.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === tech.id ? null : tech.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                    {openMenu === tech.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 z-50 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                          <button
                            onClick={() => {
                              router.push(`/vendor/technicians/${tech.id}`);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 inline-flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </button>
                          <button
                            onClick={() => {
                              router.push(`/vendor/technicians/${tech.id}?edit=true`);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 inline-flex items-center"
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                          <Link
                            href={`/vendor/technicians/activity?user=${tech.id}`}
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 inline-flex items-center"
                            onClick={() => setOpenMenu(null)}
                          >
                            <History className="h-4 w-4 mr-2" />
                            View Activity
                          </Link>
                          <button
                            onClick={() => handleDelete(tech.id)}
                            disabled={deletingId === tech.id}
                            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 inline-flex items-center disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deletingId === tech.id ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredTechnicians.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">
              {searchQuery ? "No technicians found matching your search" : "No technicians found"}
            </p>
            {!searchQuery && (
              <Link
                href="/vendor/technicians/invite"
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Invite Your First Technician
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
