"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Check, X, Eye, Loader2, AlertCircle, Building2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPendingCompanies,
  approveCompany,
  rejectCompany,
  clearError,
} from "@/store/slices/companySlice";
import { Company } from "@/lib/company";

export default function VendorApplicationsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { pendingCompanies, isLoading, isSubmitting, error, pagination } = useAppSelector(
    (state) => state.company
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPendingCompanies(1));
  }, [dispatch]);

  const handleViewDetails = (company: Company) => {
    router.push(`/admin/vendors/applications/${company.id}`);
  };

  const handleApprove = async (id: string) => {
    setActionInProgress(id);
    try {
      await dispatch(approveCompany(id)).unwrap();
    } catch {
      // Error is handled by Redux state
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionInProgress(id);
    try {
      await dispatch(rejectCompany(id)).unwrap();
    } catch {
      // Error is handled by Redux state
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredApplications = pendingCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (company.email && company.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Vendor Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Review and approve vendor applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">Pending Applications</div>
          <div className="text-2xl font-semibold text-yellow-600 mt-1">{pagination.total}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">This Page</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">{pendingCompanies.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">Total Pages</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">{pagination.lastPage}</div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error.message}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
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
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Company</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Category</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Trade License</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Applied</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Service Areas</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((company) => (
                  <tr
                    key={company.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewDetails(company)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-500">{company.email || "No email"}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{company.category?.name || "N/A"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{company.trade_license_number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{formatDate(company.created_at)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">
                        {company.service_areas?.length || 0} areas
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewDetails(company)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleApprove(company.id)}
                          disabled={isSubmitting && actionInProgress === company.id}
                          className="p-1.5 rounded hover:bg-green-50 text-green-600 disabled:opacity-50"
                          title="Approve"
                        >
                          {isSubmitting && actionInProgress === company.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(company.id)}
                          disabled={isSubmitting && actionInProgress === company.id}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600 disabled:opacity-50"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No pending applications found</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.lastPage > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.lastPage}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(fetchPendingCompanies(pagination.currentPage - 1))}
                disabled={pagination.currentPage === 1 || isLoading}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => dispatch(fetchPendingCompanies(pagination.currentPage + 1))}
                disabled={pagination.currentPage === pagination.lastPage || isLoading}
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
