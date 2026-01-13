"use client";

import { useState, useEffect } from "react";
import { Search, Download, Calendar, Loader2 } from "lucide-react";
import { getTransactionFees, getCompanies, TransactionFee, FeeStats, Company, formatCurrency, formatDate, getFeeTypeLabel } from "@/lib/transaction";

export default function FeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fees, setFees] = useState<TransactionFee[]>([]);
  const [stats, setStats] = useState<FeeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feeTypeFilter, setFeeTypeFilter] = useState<string>("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    loadFees();
  }, [currentPage, searchQuery, feeTypeFilter, companyFilter]);

  const loadCompanies = async () => {
    try {
      const response = await getCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error("Failed to load companies:", error);
    }
  };

  const loadFees = async () => {
    setLoading(true);
    try {
      const response = await getTransactionFees({
        page: currentPage,
        per_page: 15,
        search: searchQuery || undefined,
        fee_type: feeTypeFilter || undefined,
        company_id: companyFilter || undefined,
      });
      setFees(response.data);
      setStats(response.stats);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error("Failed to load fees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadFees();
  };

  const getFeeTypeBadgeClass = (feeType: string) => {
    switch (feeType) {
      case "platform_commission":
        return "bg-blue-50 text-blue-700";
      case "payment_processing":
        return "bg-purple-50 text-purple-700";
      case "service_fee":
        return "bg-green-50 text-green-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getVendorName = (fee: TransactionFee) => {
    return fee.vendor?.company?.name ||
           `${fee.vendor?.first_name || ""} ${fee.vendor?.last_name || ""}`.trim() ||
           "Unknown Vendor";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Transaction Fees</h1>
        <p className="text-sm text-gray-500 mt-1">View all collected fees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {loading ? "-" : formatCurrency(stats?.total_fees ?? 0)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Fees</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {loading ? "-" : formatCurrency(stats?.platform_fees ?? 0)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Platform Commissions</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {loading ? "-" : formatCurrency(stats?.processing_fees ?? 0)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Processing Fees</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {loading ? "-" : stats?.total_transactions ?? 0}
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Transactions</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <form onSubmit={handleSearch} className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search fees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <select
            value={feeTypeFilter}
            onChange={(e) => {
              setFeeTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="">All Types</option>
            <option value="platform_commission">Platform Commission</option>
            <option value="payment_processing">Payment Processing</option>
            <option value="service_fee">Service Fee</option>
            <option value="other">Other</option>
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
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Transaction ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Vendor</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Type</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Rate</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Order Amount</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Fee Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono text-gray-900">{fee.transaction_number}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">{getVendorName(fee)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getFeeTypeBadgeClass(fee.fee_type)}`}>
                          {getFeeTypeLabel(fee.fee_type)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{fee.fee_rate}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{formatCurrency(fee.order_amount)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          {formatDate(fee.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(fee.fee_amount)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {fees.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No fees found</p>
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
