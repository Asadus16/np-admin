"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Plus, Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import {
  getVendorPayouts,
  getVendorPayoutStats,
  formatCurrency,
  getPayoutStatusDisplay,
  formatDate,
} from "@/lib/vendorPayout";
import { VendorPayout, VendorPayoutStats } from "@/types/vendorPayout";
import { useAuth } from "@/hooks/useAuth";

export default function VendorPayoutsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [payouts, setPayouts] = useState<VendorPayout[]>([]);
  const [stats, setStats] = useState<VendorPayoutStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchPayouts = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await getVendorPayouts({
        page: currentPage,
        per_page: 10,
        status: statusFilter !== "all" ? (statusFilter as any) : undefined,
        sort: "latest",
      });
      setPayouts(response.data);
      setTotalPages(response.meta.last_page);
    } catch (err) {
      console.error("Failed to fetch payouts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, currentPage, statusFilter]);

  const fetchStats = useCallback(async () => {
    if (!token) return;

    try {
      const response = await getVendorPayoutStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchPayouts();
    fetchStats();
  }, [fetchPayouts, fetchStats]);

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your payout requests</p>
        </div>
        <Link
          href="/vendor/payouts/new"
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Request Payout
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Available</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(stats.available_earnings, stats.currency)}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Pending</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(stats.pending_amount, stats.currency)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stats.payout_counts.pending} requests</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Processing</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(stats.processing_amount, stats.currency)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stats.payout_counts.processing} requests</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Total Paid</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(stats.total_paid, stats.currency)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stats.payout_counts.paid} payouts</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payouts List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payout Requests</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading payouts...</div>
        ) : payouts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No payout requests found</p>
            <Link
              href="/vendor/payouts/new"
              className="mt-4 inline-block text-sm text-gray-900 hover:underline"
            >
              Create your first payout request
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {payouts.map((payout) => {
                const statusDisplay = getPayoutStatusDisplay(payout.status);
                return (
                  <div key={payout.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">
                              {payout.payout_number}
                            </p>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${statusDisplay.color}`}
                            >
                              {statusDisplay.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Requested: {formatDate(payout.created_at)}
                          </p>
                          {payout.paid_at && (
                            <p className="text-xs text-gray-500">
                              Paid: {formatDate(payout.paid_at)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(payout.requested_amount, "AED")}
                          </p>
                          {payout.approved_amount && (
                            <p className="text-xs text-gray-500">
                              Approved: {formatCurrency(payout.approved_amount, "AED")}
                            </p>
                          )}
                        </div>
                        <Link
                          href={`/vendor/payouts/${payout.id}`}
                          className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
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
