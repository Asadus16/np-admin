"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, MapPin, Phone, Mail, Calendar, Building2, Globe, FileText, Loader2, AlertCircle, CheckCircle, Clock, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCompany, deleteCompany, clearCurrentCompany, clearError } from "@/store/slices/companySlice";

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentCompany: vendor, isLoading, isSubmitting, error } = useAppSelector((state) => state.company);

  const id = params.id as string;

  useEffect(() => {
    if (id) {
      dispatch(fetchCompany(id));
    }
    return () => {
      dispatch(clearCurrentCompany());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (!vendor) return;
    if (!confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) return;

    try {
      await dispatch(deleteCompany(vendor.id)).unwrap();
      router.push("/admin/vendors");
    } catch {
      // Error handled by Redux
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/vendors" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Vendor Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700">{error.message}</p>
          <button onClick={() => dispatch(clearError())} className="ml-auto text-red-500 hover:text-red-700 text-sm">
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-500">Vendor not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/vendors"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{vendor.name}</h1>
              {vendor.approved ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
                  <CheckCircle className="h-3 w-3" /> Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700">
                  <Clock className="h-3 w-3" /> Pending
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{vendor.category?.name || "No category"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/vendors/${vendor.id}/edit`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{vendor.service_areas?.length || 0}</div>
          <p className="text-sm text-gray-500 mt-1">Service Areas</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{vendor.trade_license_number}</div>
          <p className="text-sm text-gray-500 mt-1">Trade License</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{formatDate(vendor.establishment)}</div>
          <p className="text-sm text-gray-500 mt-1">Established</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{formatDate(vendor.created_at)}</div>
          <p className="text-sm text-gray-500 mt-1">Joined</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{vendor.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{vendor.landline || "No phone"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {vendor.website ? (
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {vendor.website}
                    </a>
                  ) : "No website"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">Joined {formatDate(vendor.created_at)}</span>
              </div>
            </div>
          </div>

          {vendor.description && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{vendor.description}</p>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Trade License</p>
                    {vendor.trade_license_document ? (
                      <a
                        href={vendor.trade_license_document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    ) : (
                      <p className="text-xs text-gray-500">Not uploaded</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">VAT Certificate</p>
                    {vendor.vat_certificate ? (
                      <a
                        href={vendor.vat_certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    ) : (
                      <p className="text-xs text-gray-500">Not uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {vendor.bank_details && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Bank Name</p>
                  <p className="text-sm text-gray-900">{vendor.bank_details.bank_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Account Holder</p>
                  <p className="text-sm text-gray-900">{vendor.bank_details.account_holder_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">IBAN</p>
                  <p className="text-sm text-gray-900">{vendor.bank_details.iban || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">SWIFT Code</p>
                  <p className="text-sm text-gray-900">{vendor.bank_details.swift_code || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">TRN</p>
                  <p className="text-sm text-gray-900">{vendor.bank_details.trn || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
            {vendor.approved ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Verified & Approved</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Pending Approval</span>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Category</h2>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-900">{vendor.category?.name || "No category assigned"}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Service Areas</h2>
            {vendor.service_areas && vendor.service_areas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {vendor.service_areas.map((area) => (
                  <span
                    key={area.id}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                  >
                    <MapPin className="h-3 w-3" />
                    {area.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No service areas assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
