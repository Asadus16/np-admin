"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Building2,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getDisputes,
  getDisputeStats,
  getDisputeStatsByCompany
} from "@/lib/adminDispute";
import {
  AdminDispute,
  DisputeStats,
  CompanyDisputeStats,
  RefundStatus
} from "@/types/refund";
import { formatPrice } from "@/lib/customerVendor";
import { useAppSelector } from "@/store/hooks";

export default function RefundsPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [stats, setStats] = useState<DisputeStats | null>(null);
  const [companyStats, setCompanyStats] = useState<CompanyDisputeStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  // Selection
  const [selectedRefunds, setSelectedRefunds] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const [disputesRes, statsRes, companyStatsRes] = await Promise.all([
        getDisputes({
          status: statusFilter !== "all" ? statusFilter : undefined,
          company_id: companyFilter !== "all" ? companyFilter : undefined,
          search: searchQuery || undefined,
          page: currentPage,
          per_page: perPage,
        }, token),
        getDisputeStats(token),
        getDisputeStatsByCompany(token),
      ]);

      setDisputes(disputesRes.data);
      setTotalPages(disputesRes.meta.last_page);
      setTotal(disputesRes.meta.total);
      setStats(statsRes.data);
      setCompanyStats(companyStatsRes.data);
    } catch (err) {
      setError("Failed to load disputes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, companyFilter, searchQuery, currentPage, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, companyFilter, searchQuery]);

  const getStatusColor = (status: RefundStatus) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "completed": return "bg-blue-100 text-blue-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "cancelled": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: RefundStatus) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-3 w-3" />;
      case "pending": return <Clock className="h-3 w-3" />;
      case "completed": return <CheckCircle className="h-3 w-3" />;
      case "rejected": return <XCircle className="h-3 w-3" />;
      case "cancelled": return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const toggleSelectAll = () => {
    if (selectedRefunds.length === disputes.length) {
      setSelectedRefunds([]);
    } else {
      setSelectedRefunds(disputes.map(d => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedRefunds.includes(id)) {
      setSelectedRefunds(selectedRefunds.filter(r => r !== id));
    } else {
      setSelectedRefunds([...selectedRefunds, id]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get unique companies from disputes for filter
  const companies = companyStats.filter(c => c.company).map(c => c.company!);

  if (loading && disputes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Refunds & Disputes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage refund requests from all vendors</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-500">Approved</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.approved}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-500">Completed</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.completed}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-gray-500">Rejected</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.rejected}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-500">Approved Amount</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">
              {formatPrice(stats.total_approved_amount)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.total}</p>
          </div>
        </div>
      )}

      {/* Company Stats (Optional: Can be toggled) */}
      {companyStats.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-900">Disputes by Company</h2>
          </div>
          <div className="p-4">
            <div className="flex flex-wrap gap-3">
              {companyStats.slice(0, 5).map((item, index) => (
                <div
                  key={item.company?.id || index}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                >
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {item.company?.name || "Unknown"}
                  </span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                    {item.pending} pending
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, customer..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Companies</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRefunds.length > 0 && (
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-gray-700">{selectedRefunds.length} dispute(s) selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200">
              Approve Selected
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200">
              Reject Selected
            </button>
          </div>
        </div>
      )}

      {/* Disputes Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRefunds.length === disputes.length && disputes.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Order</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Customer</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Company</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Reason</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Requested</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {disputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRefunds.includes(dispute.id)}
                      onChange={() => toggleSelect(dispute.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/orders/${dispute.order_id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {dispute.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dispute.customer.name}</p>
                      <p className="text-xs text-gray-500">{dispute.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{dispute.company.name}</p>
                        {dispute.company.category && (
                          <p className="text-xs text-gray-500">{dispute.company.category.name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(dispute.order_total)}
                      </p>
                      {dispute.approved_amount && (
                        <p className="text-xs text-green-600">
                          Approved: {formatPrice(dispute.approved_amount)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{dispute.reason_label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(dispute.status)}`}>
                      {getStatusIcon(dispute.status)}
                      {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(dispute.created_at)}
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === dispute.id ? null : dispute.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </button>
                    {showActionMenu === dispute.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <Link
                          href={`/admin/refunds/${dispute.id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Link>
                        {dispute.status === "pending" && (
                          <>
                            <Link
                              href={`/admin/refunds/${dispute.id}?action=approve`}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Link>
                            <Link
                              href={`/admin/refunds/${dispute.id}?action=reject`}
                              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-50"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Link>
                          </>
                        )}
                        {dispute.status === "approved" && (
                          <Link
                            href={`/admin/refunds/${dispute.id}?action=complete`}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-gray-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Mark Complete
                          </Link>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {disputes.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No disputes found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {disputes.length} of {total} disputes
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
