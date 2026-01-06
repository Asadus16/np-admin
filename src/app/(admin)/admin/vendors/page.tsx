"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Loader2, Building2, AlertCircle, X, Calendar, MessageSquare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchApprovedCompanies, clearError } from "@/store/slices/companySlice";
import { fetchCategories } from "@/store/slices/categorySlice";
import { startOrGetConversation } from "@/store/slices/chatSlice";

export default function VendorsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { approvedCompanies, isLoading, error, approvedPagination } = useAppSelector(
    (state) => state.company
  );
  const { categories } = useAppSelector((state) => state.category);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [messageLoading, setMessageLoading] = useState<string | null>(null);

  // Get unique service areas from all vendors
  const uniqueServiceAreas = useMemo(() => {
    const areasMap = new Map<string, string>();
    approvedCompanies.forEach((company) => {
      company.service_areas?.forEach((area) => {
        areasMap.set(area.id, area.name);
      });
    });
    return Array.from(areasMap.entries()).map(([id, name]) => ({ id, name }));
  }, [approvedCompanies]);

  useEffect(() => {
    dispatch(fetchApprovedCompanies(1));
    dispatch(fetchCategories(1));
  }, [dispatch]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    if (openMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenu]);

  const handleSendMessage = async (userId: string) => {
    setMessageLoading(userId);
    setOpenMenu(null);

    try {
      // Start or get conversation with this vendor
      await dispatch(startOrGetConversation(userId)).unwrap();
      // Navigate to messages page
      router.push("/admin/messages");
    } catch (err) {
      console.error("Failed to start conversation:", err);
    } finally {
      setMessageLoading(null);
    }
  };

  const filteredVendors = approvedCompanies.filter((company) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!company.name.toLowerCase().includes(query) &&
          !(company.email && company.email.toLowerCase().includes(query))) {
        return false;
      }
    }

    // Status filter (based on approved field - all are approved here, but we can filter by active services)
    if (statusFilter === "active" && !company.approved) return false;
    if (statusFilter === "inactive" && company.approved) return false;

    // Category filter
    if (categoryFilter !== "all" && company.category?.id !== categoryFilter) return false;

    // Location filter
    if (locationFilter !== "all") {
      const hasArea = company.service_areas?.some((area) => area.id === locationFilter);
      if (!hasArea) return false;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      const createdDate = new Date(company.created_at);
      if (dateFrom && createdDate < new Date(dateFrom)) return false;
      if (dateTo && createdDate > new Date(dateTo + "T23:59:59")) return false;
    }

    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
          <p className="text-sm text-gray-500 mt-1">Manage approved service vendors</p>
        </div>
        <Link
          href="/admin/vendors/add"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">Total Approved Vendors</div>
          <div className="text-2xl font-semibold text-green-600 mt-1">{approvedPagination.total}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">This Page</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">{approvedCompanies.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">Total Pages</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">{approvedPagination.lastPage}</div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{error.message}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 space-y-4">
          {/* Search and Primary Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            >
              <option value="all">All Locations</option>
              {uniqueServiceAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Date Range:</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              />
              <span className="text-sm text-gray-400">to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              />
            </div>
            {(dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear dates
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Vendor</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Category</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Trade License</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Service Areas</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Approved</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-sm text-gray-500">{vendor.email || "No email"}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{vendor.category?.name || "N/A"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{vendor.trade_license_number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">
                        {vendor.service_areas?.length || 0} areas
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{formatDate(vendor.updated_at)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(openMenu === vendor.id ? null : vendor.id);
                          }}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                        {openMenu === vendor.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <Link
                              href={`/admin/vendors/${vendor.id}`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4" /> View
                            </Link>
                            <button
                              onClick={() => handleSendMessage(vendor.user_id)}
                              disabled={messageLoading === vendor.user_id}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full disabled:opacity-50"
                            >
                              {messageLoading === vendor.user_id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MessageSquare className="h-4 w-4" />
                              )}
                              Message
                            </button>
                            <Link
                              href={`/admin/vendors/${vendor.id}/edit`}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="h-4 w-4" /> Edit
                            </Link>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 w-full">
                              <Trash2 className="h-4 w-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No approved vendors found</p>
          </div>
        )}

        {/* Pagination */}
        {approvedPagination.lastPage > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {approvedPagination.currentPage} of {approvedPagination.lastPage}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(fetchApprovedCompanies(approvedPagination.currentPage - 1))}
                disabled={approvedPagination.currentPage === 1 || isLoading}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => dispatch(fetchApprovedCompanies(approvedPagination.currentPage + 1))}
                disabled={approvedPagination.currentPage === approvedPagination.lastPage || isLoading}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
