"use client";

import { useState, useEffect } from "react";
import { Search, Download, Calendar, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { getAdjustments, getCompanies, VendorAdjustment, AdjustmentStats, Company, formatCurrency, formatDate } from "@/lib/transaction";

export default function AdjustmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [adjustments, setAdjustments] = useState<VendorAdjustment[]>([]);
  const [stats, setStats] = useState<AdjustmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState<"" | "credit" | "debit">("");
  const [statusFilter, setStatusFilter] = useState<"" | "pending" | "applied" | "reversed">("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    loadAdjustments();
  }, [currentPage, searchQuery, typeFilter, statusFilter, companyFilter]);

  const loadCompanies = async () => {
    try {
      const response = await getCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error("Failed to load companies:", error);
    }
  };

  const loadAdjustments = async () => {
    setLoading(true);
    try {
      const response = await getAdjustments({
        page: currentPage,
        per_page: 15,
        search: searchQuery || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        company_id: companyFilter || undefined,
      });
      setAdjustments(response.data);
      setStats(response.stats);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error("Failed to load adjustments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadAdjustments();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "reversed":
        return "bg-gray-50 text-gray-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getVendorName = (adjustment: VendorAdjustment) => {
    return adjustment.vendor?.company?.name ||
           `${adjustment.vendor?.first_name || ""} ${adjustment.vendor?.last_name || ""}`.trim() ||
           "Unknown Vendor";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Adjustments</h1>
        <p className="text-sm text-gray-500 mt-1">View all payment adjustments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {loading ? "-" : stats?.total_adjustments ?? 0}
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Adjustments</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-1">
            <ArrowUp className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-semibold text-green-600">
              {loading ? "-" : formatCurrency(stats?.total_credits ?? 0)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Credits</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-1">
            <ArrowDown className="h-5 w-5 text-red-500" />
            <span className="text-2xl font-semibold text-red-600">
              {loading ? "-" : formatCurrency(stats?.total_debits ?? 0)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Debits</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {loading ? "-" : formatCurrency(stats?.net_adjustment ?? 0)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Net Adjustment</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <form onSubmit={handleSearch} className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search adjustments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as "" | "credit" | "debit");
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "" | "pending" | "applied" | "reversed");
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="applied">Applied</option>
            <option value="reversed">Reversed</option>
          </select>
          <select
            value={companyFilter}
            onChange={(e) => {
              setCompanyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="">All Companies</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Adjustment ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Vendor</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Reason</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {adjustments.map((adj) => (
                    <tr key={adj.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-gray-900">{adj.adjustment_number}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">{getVendorName(adj)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{adj.reason}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          adj.type === "credit" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                        }`}>
                          {adj.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(adj.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(adj.status)}`}>
                          {adj.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-medium ${adj.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                          {adj.type === "credit" ? "+" : "-"}{formatCurrency(adj.amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {adjustments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No adjustments found</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
