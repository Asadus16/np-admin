"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Edit, MapPin, Phone, Mail, Calendar, Building2, Globe, FileText, Loader2, AlertCircle, CheckCircle, Clock, Trash2, Wrench, Navigation, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCompany, deleteCompany, clearCurrentCompany, clearError } from "@/store/slices/companySlice";

const StaticLocationMap = dynamic(
  () => import("@/components/maps/StaticLocationMap"),
  { ssr: false, loading: () => <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse" /> }
);

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

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Services</p>
          <p className="text-lg font-semibold text-gray-900 mt-0.5">{vendor.services?.length || 0}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Areas</p>
          <p className="text-lg font-semibold text-gray-900 mt-0.5">{vendor.service_areas?.length || 0}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Trade License</p>
          <p className="text-sm font-medium text-gray-900 mt-0.5 truncate" title={vendor.trade_license_number}>{vendor.trade_license_number || "N/A"}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Established</p>
          <p className="text-sm font-medium text-gray-900 mt-0.5">{formatDate(vendor.establishment)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Joined</p>
          <p className="text-sm font-medium text-gray-900 mt-0.5">{formatDate(vendor.created_at)}</p>
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

          {/* Business Location */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-gray-400" />
              Business Location
            </h2>
            {vendor.latitude && vendor.longitude ? (
              <div>
                <StaticLocationMap
                  latitude={vendor.latitude}
                  longitude={vendor.longitude}
                  height="200px"
                />
                <p className="text-xs text-gray-500 mt-3">
                  Coordinates: {vendor.latitude.toFixed(6)}, {vendor.longitude.toFixed(6)}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No location provided</p>
              </div>
            )}
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">Rating</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(vendor.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {(vendor.rating || 0).toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Based on {vendor.reviews_count || 0} review{(vendor.reviews_count || 0) !== 1 ? "s" : ""}
            </p>
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

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Active Services</h2>
            {vendor.services && vendor.services.length > 0 ? (
              <div className="space-y-4">
                {vendor.services.map((service) => (
                  <div
                    key={service.id}
                    className="border border-gray-100 rounded-lg overflow-hidden"
                  >
                    <div className="flex items-start gap-3 p-3">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Wrench className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{service.name}</p>
                        {service.category && (
                          <p className="text-xs text-gray-500">{service.category.name}</p>
                        )}
                      </div>
                    </div>
                    {service.sub_services && service.sub_services.length > 0 && (
                      <div className="bg-gray-50 px-3 py-2 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-500 mb-2">Sub-services:</p>
                        <div className="space-y-1.5">
                          {service.sub_services.map((subService) => (
                            <div key={subService.id} className="flex items-center justify-between text-xs">
                              <span className="text-gray-700">{subService.name}</span>
                              <div className="flex items-center gap-2 text-gray-500">
                                <span>AED {subService.price}</span>
                                <span>•</span>
                                <span>{subService.duration} min</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No active services</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
