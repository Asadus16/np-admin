"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  DollarSign,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Building2,
  Wallet,
  Eye,
  Loader2,
} from "lucide-react";
import {
  getAdminPayouts,
  getAdminPayoutStats,
  formatCurrency,
  getPayoutStatusDisplay,
  formatDate,
} from "@/lib/vendorPayout";
import { VendorPayout, AdminPayoutStats } from "@/types/vendorPayout";
import { useAuth } from "@/hooks/useAuth";

export default function AdminPayoutsPage() {
  const { token } = useAuth();
  const [payouts, setPayouts] = useState<VendorPayout[]>([]);
  const [stats, setStats] = useState<AdminPayoutStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const fetchPayouts = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await getAdminPayouts({
        page: currentPage,
        per_page: 15,
        status: statusFilter !== "all" ? (statusFilter as any) : undefined,
        search: searchQuery || undefined,
        sort: "latest",
      });
      setPayouts(response.data);
      setTotalPages(response.meta.last_page);
    } catch (err) {
      console.error("Failed to fetch payouts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, currentPage, statusFilter, searchQuery]);

  const fetchStats = useCallback(async () => {
    if (!token) return;

    try {
      const response = await getAdminPayoutStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchPayouts();
    fetchStats();
  }, [fetchPayouts, fetchStats]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage vendor payout requests</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {formatCurrency(stats.pending_amount, stats.currency)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stats.payout_counts.pending} requests</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-500">Processing</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {formatCurrency(stats.processing_amount, stats.currency)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stats.payout_counts.processing} requests</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-500">Total Paid</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {formatCurrency(stats.total_paid, stats.currency)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stats.payout_counts.paid} payouts</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-500">Total Requested</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {formatCurrency(stats.total_requested, stats.currency)}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by payout number, vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Loading payouts...</p>
          </div>
        ) : payouts.length === 0 ? (
          <div className="p-8 text-center">
            <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No payouts found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                      Payout Number
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                      Vendor
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                      Requested
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                      Approved
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                      Date
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payouts.map((payout) => {
                    const statusDisplay = getPayoutStatusDisplay(payout.status);
                    return (
                      <tr key={payout.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {payout.payout_number}
                        </td>
                        <td className="px-4 py-3">
                          {payout.company ? (
                            <Link
                              href={`/admin/vendors/${payout.company.id}`}
                              className="text-sm text-gray-900 hover:underline"
                            >
                              {payout.company.name}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatCurrency(payout.requested_amount, "AED")}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {payout.approved_amount
                            ? formatCurrency(payout.approved_amount, "AED")
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusDisplay.color}`}
                          >
                            {statusDisplay.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDate(payout.created_at)}
                        </td>
                        <td className="px-4 py-3 relative">
                          <button
                            onClick={() =>
                              setShowActionMenu(showActionMenu === payout.id ? null : payout.id)
                            }
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                          </button>
                          {showActionMenu === payout.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <Link
                                href={`/admin/payouts/${payout.id}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setShowActionMenu(null)}
                              >
                                <Eye className="h-4 w-4 inline mr-2" />
                                View Details
                              </Link>
                              {payout.company && (
                                <Link
                                  href={`/admin/vendors/${payout.company.id}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={() => setShowActionMenu(null)}
                                >
                                  <Building2 className="h-4 w-4 inline mr-2" />
                                  View Vendor
                                </Link>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
