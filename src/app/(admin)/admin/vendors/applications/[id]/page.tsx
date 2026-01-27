"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  X,
  Loader2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  Globe,
  FileText,
  MapPin,
  CreditCard,
  Navigation,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCompany,
  approveCompany,
  rejectCompany,
  clearCurrentCompany,
  clearError,
} from "@/store/slices/companySlice";
import dynamic from "next/dynamic";
import RejectionReasonDialog from "@/components/admin/RejectionReasonDialog";

const StaticLocationMap = dynamic(
  () => import("@/components/maps/StaticLocationMap"),
  { ssr: false, loading: () => <div className="h-[250px] bg-gray-100 rounded-lg animate-pulse" /> }
);

export default function VendorApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentCompany, isLoading, isSubmitting, error } = useAppSelector(
    (state) => state.company
  );

  const companyId = params.id as string;
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);

  useEffect(() => {
    if (companyId) {
      dispatch(fetchCompany(companyId));
    }
    return () => {
      dispatch(clearCurrentCompany());
    };
  }, [dispatch, companyId]);

  const handleApprove = async () => {
    try {
      await dispatch(approveCompany(companyId)).unwrap();
      router.push("/admin/vendors/applications");
    } catch {
      // Error is handled by Redux state
    }
  };

  const handleReject = () => {
    setRejectionDialogOpen(true);
  };

  const handleConfirmRejection = async (rejectionReason: string) => {
    try {
      await dispatch(rejectCompany({ id: companyId, rejectionReason })).unwrap();
      setRejectionDialogOpen(false);
      router.push("/admin/vendors/applications");
    } catch {
      // Error is handled by Redux state
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!currentCompany) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Application not found</p>
        <button
          onClick={() => router.push("/admin/vendors/applications")}
          className="mt-4 text-sm text-blue-600 hover:text-blue-700"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/vendors/applications")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{currentCompany.name}</h1>
            <p className="text-sm text-gray-500">Vendor Application Details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReject}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Reject
          </button>
          <button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Approve
          </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Company Name</p>
                  <p className="text-sm font-medium text-gray-900">{currentCompany.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Trade License Number</p>
                  <p className="text-sm font-medium text-gray-900">{currentCompany.trade_license_number}</p>
                </div>
              </div>

              {currentCompany.email && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${currentCompany.email}`} className="hover:text-blue-600">
                    {currentCompany.email}
                  </a>
                </div>
              )}

              {currentCompany.landline && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{currentCompany.landline}</span>
                </div>
              )}

              {currentCompany.website && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a
                    href={currentCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 flex items-center gap-1"
                  >
                    {currentCompany.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {currentCompany.establishment && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Established: {currentCompany.establishment}</span>
                </div>
              )}

              {currentCompany.description && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700">{currentCompany.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Business Location */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Business Location
            </h2>
            {currentCompany.latitude && currentCompany.longitude ? (
              <div>
                <StaticLocationMap
                  latitude={currentCompany.latitude}
                  longitude={currentCompany.longitude}
                  height="250px"
                />
                <p className="text-xs text-gray-500 mt-3">
                  Coordinates: {currentCompany.latitude.toFixed(6)}, {currentCompany.longitude.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No location provided</p>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 border rounded-lg ${currentCompany.trade_license_document ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <p className="text-xs text-gray-500 mb-1">Trade License</p>
                {currentCompany.trade_license_document ? (
                  <a
                    href={currentCompany.trade_license_document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View Document
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">Not uploaded</span>
                )}
              </div>
              <div className={`p-4 border rounded-lg ${currentCompany.vat_certificate ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <p className="text-xs text-gray-500 mb-1">VAT Certificate</p>
                {currentCompany.vat_certificate ? (
                  <a
                    href={currentCompany.vat_certificate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View Document
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-sm text-gray-400">Not uploaded</span>
                )}
              </div>
            </div>
          </div>

          {/* Bank Details */}
          {currentCompany.bank_details && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Bank Details
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                    <p className="text-sm font-medium text-gray-900">{currentCompany.bank_details.bank_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Account Holder</p>
                    <p className="text-sm font-medium text-gray-900">{currentCompany.bank_details.account_holder_name}</p>
                  </div>
                </div>
                {currentCompany.bank_details.iban && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">IBAN</p>
                    <p className="text-sm font-medium text-gray-900 font-mono">{currentCompany.bank_details.iban}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {currentCompany.bank_details.swift_code && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">SWIFT Code</p>
                      <p className="text-sm font-medium text-gray-900">{currentCompany.bank_details.swift_code}</p>
                    </div>
                  )}
                  {currentCompany.bank_details.trn && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">TRN</p>
                      <p className="text-sm font-medium text-gray-900">{currentCompany.bank_details.trn}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Category */}
          {currentCompany.category && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Category</h2>
              <span className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-full">
                {currentCompany.category.name}
              </span>
            </div>
          )}

          {/* Service Areas */}
          {currentCompany.service_areas && currentCompany.service_areas.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Service Areas
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentCompany.service_areas.map((area) => (
                  <span
                    key={area.id}
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-full"
                  >
                    {area.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Application Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Application Info</h2>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">Submitted On</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(currentCompany.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                  Pending Review
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Reason Dialog */}
      <RejectionReasonDialog
        isOpen={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        onConfirm={handleConfirmRejection}
        isLoading={isSubmitting}
        companyName={currentCompany?.name}
      />
    </div>
  );
}
