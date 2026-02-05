"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Award } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createVendorExclusivePlan, clearError } from "@/store/slices/vendorExclusivePlanSlice";
import { fetchServiceAreas } from "@/store/slices/serviceAreaSlice";
import { getApprovedCompanies } from "@/lib/company";
import { VendorExclusivePlanFormData } from "@/types/vendorExclusivePlan";

interface CompanyOption {
  id: string;
  name: string;
}

interface ServiceAreaOption {
  id: string;
  name: string;
}

export default function AddVendorExclusivePlanPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSubmitting, error } = useAppSelector((state) => state.vendorExclusivePlan);

  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceAreaOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<VendorExclusivePlanFormData>({
    company_id: "",
    service_area_id: "",
    status: true,
    price: null,
    starts_at: null,
    ends_at: null,
    notes: null,
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [companiesRes, areasRes] = await Promise.all([
          getApprovedCompanies(1),
          dispatch(fetchServiceAreas(1)).unwrap(),
        ]);
        setCompanies(companiesRes.data ?? []);
        setServiceAreas(areasRes?.data ?? []);
      } catch {
        setCompanies([]);
        setServiceAreas([]);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      if (error.errors) {
        setFormErrors(
          Object.fromEntries(
            Object.entries(error.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : String(v)])
          )
        );
      } else {
        setFormErrors({ general: error.message });
      }
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (!formData.company_id || !formData.service_area_id) {
      setFormErrors({
        company_id: !formData.company_id ? "Please select a vendor." : undefined,
        service_area_id: !formData.service_area_id ? "Please select a service area." : undefined,
      } as Record<string, string>);
      return;
    }

    try {
      await dispatch(
        createVendorExclusivePlan({
          company_id: formData.company_id,
          service_area_id: formData.service_area_id,
          status: formData.status,
          price: formData.price ?? null,
          starts_at: formData.starts_at || null,
          ends_at: formData.ends_at || null,
          notes: formData.notes || null,
        })
      ).unwrap();
      router.push("/admin/vendor-exclusive-plans");
    } catch {
      // Error handled by Redux + useEffect
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vendor-exclusive-plans"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Vendor Exclusive Plan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Make a vendor exclusive in a specific service area
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formErrors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {formErrors.general}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="company_id" className="block text-sm font-medium text-gray-700 mb-1">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                id="company_id"
                required
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                disabled={loadingOptions}
              >
                <option value="">Select vendor</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {formErrors.company_id && (
                <p className="mt-1 text-sm text-red-600">{formErrors.company_id}</p>
              )}
            </div>

            <div>
              <label htmlFor="service_area_id" className="block text-sm font-medium text-gray-700 mb-1">
                Service Area <span className="text-red-500">*</span>
              </label>
              <select
                id="service_area_id"
                required
                value={formData.service_area_id}
                onChange={(e) => setFormData({ ...formData, service_area_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                disabled={loadingOptions}
              >
                <option value="">Select service area</option>
                {serviceAreas.map((sa) => (
                  <option key={sa.id} value={sa.id}>
                    {sa.name}
                  </option>
                ))}
              </select>
              {formErrors.service_area_id && (
                <p className="mt-1 text-sm text-red-600">{formErrors.service_area_id}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (AED)
            </label>
            <input
              type="number"
              id="price"
              min="0"
              step="0.01"
              value={formData.price ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : null })
              }
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Vendor pays this amount to activate (0 = free, assign immediately)"
            />
            <p className="mt-1 text-xs text-gray-500">
              Set a price for the vendor to pay; leave 0 to assign without payment.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="starts_at" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="starts_at"
                value={formData.starts_at ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, starts_at: e.target.value || null })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="ends_at" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="ends_at"
                value={formData.ends_at ?? ""}
                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes ?? ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value || null })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Optional notes"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="status"
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/admin/vendor-exclusive-plans"
              className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || loadingOptions}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  Create Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
