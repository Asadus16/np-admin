"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Award } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchVendorExclusivePlan,
  updateVendorExclusivePlan,
  clearError,
  clearCurrentPlan,
} from "@/store/slices/vendorExclusivePlanSlice";
import { VendorExclusivePlanFormData } from "@/types/vendorExclusivePlan";

export default function EditVendorExclusivePlanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentPlan, isLoading, isSubmitting, error } = useAppSelector(
    (state) => state.vendorExclusivePlan
  );

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
    dispatch(fetchVendorExclusivePlan(id));
    return () => {
      dispatch(clearError());
      dispatch(clearCurrentPlan());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPlan) {
      setFormData({
        company_id: currentPlan.company_id,
        service_area_id: currentPlan.service_area_id,
        status: currentPlan.status,
        price: currentPlan.price ?? null,
        starts_at: currentPlan.starts_at,
        ends_at: currentPlan.ends_at,
        notes: currentPlan.notes,
      });
    }
  }, [currentPlan]);

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

    try {
      await dispatch(
        updateVendorExclusivePlan({
          id,
          data: {
            status: formData.status,
            price: formData.price ?? null,
            starts_at: formData.starts_at || null,
            ends_at: formData.ends_at || null,
            notes: formData.notes || null,
          },
        })
      ).unwrap();
      router.push("/admin/vendor-exclusive-plans");
    } catch {
      // Error handled by Redux + useEffect
    }
  };

  if (isLoading && !currentPlan) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Plan not found.</p>
        <Link href="/admin/vendor-exclusive-plans" className="text-gray-900 font-medium hover:underline mt-2 inline-block">
          Back to plans
        </Link>
      </div>
    );
  }

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
          <h1 className="text-2xl font-semibold text-gray-900">Edit Vendor Exclusive Plan</h1>
          <p className="text-sm text-gray-500 mt-1">
            {currentPlan.company?.name} — {currentPlan.service_area?.name}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {currentPlan.company?.name ?? "—"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
              <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                {currentPlan.service_area?.name ?? "—"}
              </p>
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
            />
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
              disabled={isSubmitting}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  Update Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
