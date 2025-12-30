"use client";

import { useEffect, useState } from "react";
import { Search, Check, X, Eye, Loader2, AlertCircle, Building2, Mail, Phone, Globe, FileText, MapPin, CreditCard } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPendingCompanies,
  fetchCompany,
  approveCompany,
  rejectCompany,
  clearCurrentCompany,
  clearError,
} from "@/store/slices/companySlice";
import { Company } from "@/lib/company";

export default function VendorApplicationsPage() {
  const dispatch = useAppDispatch();
  const { pendingCompanies, currentCompany, isLoading, isSubmitting, error, pagination } = useAppSelector(
    (state) => state.company
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPendingCompanies(1));
  }, [dispatch]);

  const handleViewDetails = async (company: Company) => {
    await dispatch(fetchCompany(company.id));
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    dispatch(clearCurrentCompany());
  };

  const handleApprove = async (id: string) => {
    setActionInProgress(id);
    try {
      await dispatch(approveCompany(id)).unwrap();
      if (showDetailsModal) {
        handleCloseModal();
      }
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
      if (showDetailsModal) {
        handleCloseModal();
      }
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
                  <tr key={company.id} className="hover:bg-gray-50">
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
                      <div className="flex items-center justify-end gap-1">
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

      {/* Details Modal */}
      {showDetailsModal && currentCompany && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={handleCloseModal}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{currentCompany.name}</h2>
                  <p className="text-sm text-gray-500">Application Details</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Company Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Company Name</p>
                        <p className="text-sm font-medium text-gray-900">{currentCompany.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Trade License</p>
                        <p className="text-sm font-medium text-gray-900">{currentCompany.trade_license_number}</p>
                      </div>
                    </div>
                    {currentCompany.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{currentCompany.email}</span>
                      </div>
                    )}
                    {currentCompany.landline && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{currentCompany.landline}</span>
                      </div>
                    )}
                    {currentCompany.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{currentCompany.website}</span>
                      </div>
                    )}
                    {currentCompany.description && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Description</p>
                        <p className="text-sm text-gray-700">{currentCompany.description}</p>
                      </div>
                    )}
                    {currentCompany.establishment && (
                      <div>
                        <p className="text-xs text-gray-500">Established</p>
                        <p className="text-sm font-medium text-gray-900">{currentCompany.establishment}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category */}
                {currentCompany.category && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                    <span className="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full">
                      {currentCompany.category.name}
                    </span>
                  </div>
                )}

                {/* Service Areas */}
                {currentCompany.service_areas && currentCompany.service_areas.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Service Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentCompany.service_areas.map((area) => (
                        <span
                          key={area.id}
                          className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                        >
                          {area.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 border rounded-lg ${currentCompany.trade_license_document ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <p className="text-xs text-gray-500">Trade License</p>
                      <p className="text-sm font-medium">
                        {currentCompany.trade_license_document ? (
                          <a
                            href={currentCompany.trade_license_document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Document
                          </a>
                        ) : (
                          <span className="text-gray-400">Not uploaded</span>
                        )}
                      </p>
                    </div>
                    <div className={`p-3 border rounded-lg ${currentCompany.vat_certificate ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                      <p className="text-xs text-gray-500">VAT Certificate</p>
                      <p className="text-sm font-medium">
                        {currentCompany.vat_certificate ? (
                          <a
                            href={currentCompany.vat_certificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Document
                          </a>
                        ) : (
                          <span className="text-gray-400">Not uploaded</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                {currentCompany.bank_details && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Bank Details
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Bank Name</p>
                          <p className="text-sm font-medium text-gray-900">{currentCompany.bank_details.bank_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Account Holder</p>
                          <p className="text-sm font-medium text-gray-900">{currentCompany.bank_details.account_holder_name}</p>
                        </div>
                      </div>
                      {currentCompany.bank_details.iban && (
                        <div>
                          <p className="text-xs text-gray-500">IBAN</p>
                          <p className="text-sm font-medium text-gray-900">{currentCompany.bank_details.iban}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        {currentCompany.bank_details.swift_code && (
                          <div>
                            <p className="text-xs text-gray-500">SWIFT Code</p>
                            <p className="text-sm font-medium text-gray-900">{currentCompany.bank_details.swift_code}</p>
                          </div>
                        )}
                        {currentCompany.bank_details.trn && (
                          <div>
                            <p className="text-xs text-gray-500">TRN</p>
                            <p className="text-sm font-medium text-gray-900">{currentCompany.bank_details.trn}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Application Date */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Applied on {formatDate(currentCompany.created_at)}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleReject(currentCompany.id)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && actionInProgress === currentCompany.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(currentCompany.id)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && actionInProgress === currentCompany.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
