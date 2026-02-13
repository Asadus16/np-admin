"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Store, MapPin, Pencil, Mail, Phone, Globe, Building2, ExternalLink } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchVendorExclusivePlan, clearError, clearCurrentPlan } from "@/store/slices/vendorExclusivePlanSlice";
import { getCompany } from "@/lib/company";
import type { Company } from "@/lib/company";

export default function ViewVendorExclusivePlanPage() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentPlan, isLoading, error } = useAppSelector((state) => state.vendorExclusivePlan);
  const [company, setCompany] = useState<Company | null>(null);
  const [companyLoading, setCompanyLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchVendorExclusivePlan(id));
    return () => {
      dispatch(clearError());
      dispatch(clearCurrentPlan());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!currentPlan?.company_id) return;

    let cancelled = false;
    const loadingTimer = setTimeout(() => {
      if (!cancelled) setCompanyLoading(true);
    }, 0);
    getCompany(currentPlan.company_id)
      .then((res) => {
        if (!cancelled) setCompany(res.data);
      })
      .catch(() => {
        if (!cancelled) setCompany(null);
      })
      .finally(() => {
        if (!cancelled) setCompanyLoading(false);
      });
    return () => {
      cancelled = true;
      clearTimeout(loadingTimer);
    };
  }, [currentPlan?.company_id]);

  if (isLoading && !currentPlan) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error && !currentPlan) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{error.message || "Failed to load plan."}</p>
        <Link
          href="/admin/vendor-exclusive-plans"
          className="text-gray-900 font-medium hover:underline mt-2 inline-block"
        >
          Back to plans
        </Link>
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Plan not found.</p>
        <Link
          href="/admin/vendor-exclusive-plans"
          className="text-gray-900 font-medium hover:underline mt-2 inline-block"
        >
          Back to plans
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/vendor-exclusive-plans"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Vendor Exclusive Plan</h1>
            <p className="text-sm text-gray-500 mt-1">
              {currentPlan.company?.name} — {currentPlan.service_area?.name}
            </p>
          </div>
        </div>
        <Link
          href={`/admin/vendor-exclusive-plans/${id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Vendor</label>
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{currentPlan.company?.name ?? "—"}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Service Area</label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900">{currentPlan.service_area?.name ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Price</label>
              <p className="text-gray-900">
                {currentPlan.price != null && currentPlan.price > 0
                  ? `${Number(currentPlan.price).toFixed(2)} AED`
                  : "—"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Payment</label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  currentPlan.payment_status === "paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {currentPlan.payment_status === "paid" ? "Paid" : "Pending payment"}
              </span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  currentPlan.status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                }`}
              >
                {currentPlan.status ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Paid at</label>
              <p className="text-gray-900">
                {currentPlan.paid_at ? new Date(currentPlan.paid_at).toLocaleString() : "—"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
              <p className="text-gray-900">{currentPlan.starts_at ?? "—"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">End Date</label>
              <p className="text-gray-900">{currentPlan.ends_at ?? "—"}</p>
            </div>
          </div>

          {currentPlan.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
              <p className="text-gray-900 whitespace-pre-wrap">{currentPlan.notes}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
            <p>Created: {currentPlan.created_at ? new Date(currentPlan.created_at).toLocaleString() : "—"}</p>
            <p>Updated: {currentPlan.updated_at ? new Date(currentPlan.updated_at).toLocaleString() : "—"}</p>
          </div>
        </div>
      </div>

      {currentPlan.company_id && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Associated Vendor</h2>
            <Link
              href={`/admin/vendors/${currentPlan.company_id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              View vendor
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-6">
            {companyLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : company ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Building2 className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{company.name}</p>
                    {company.category && (
                      <p className="text-sm text-gray-500">{company.category.name}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {company.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      <a href={`mailto:${company.email}`} className="text-gray-700 hover:text-gray-900">
                        {company.email}
                      </a>
                    </div>
                  )}
                  {company.landline && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="text-gray-700">{company.landline}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-2 text-sm sm:col-span-2">
                      <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                      <a
                        href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-gray-900 truncate"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                  {company.trade_license_number && (
                    <div className="text-sm sm:col-span-2">
                      <span className="text-gray-500">Trade license: </span>
                      <span className="text-gray-700">{company.trade_license_number}</span>
                    </div>
                  )}
                </div>
                {company.description && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">{company.description}</p>
                  </div>
                )}
                {company.service_areas && company.service_areas.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Service areas</p>
                    <div className="flex flex-wrap gap-2">
                      {company.service_areas.map((area) => (
                        <span
                          key={area.id}
                          className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                        >
                          {area.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {typeof company.approved === "boolean" && (
                  <div className="pt-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        company.approved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {company.approved ? "Approved" : "Pending approval"}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4">Could not load vendor details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
