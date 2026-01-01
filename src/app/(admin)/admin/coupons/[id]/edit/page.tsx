"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag, Calendar, Percent, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { getCoupon, updateCoupon } from "@/lib/coupon";
import { Coupon, CouponFormData } from "@/types/coupon";
import { ApiException } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id as string;

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    discount: "",
    min_order: "",
    cap: "",
    max_usage: "",
    used: "0",
    validity: "",
    status: true,
  });

  useEffect(() => {
    loadCoupon();
  }, [couponId]);

  const loadCoupon = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCoupon(couponId);
      const couponData = response.data;
      setCoupon(couponData);
      
      // Extract date from validity datetime string
      const validityDate = couponData.validity 
        ? new Date(couponData.validity).toISOString().split('T')[0]
        : "";

      setFormData({
        code: couponData.code,
        name: couponData.name,
        discount: couponData.discount.toString(),
        min_order: couponData.min_order?.toString() || "",
        cap: couponData.cap?.toString() || "",
        max_usage: couponData.max_usage?.toString() || "",
        used: couponData.used.toString(),
        validity: validityDate,
        status: couponData.status,
      });
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || "Failed to load coupon");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error loading coupon:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const formatValidityDate = (dateString: string): string => {
    if (!dateString) return "";
    return `${dateString} 23:59:59`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    try {
      const couponData: CouponFormData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        discount: parseFloat(formData.discount),
        min_order: formData.min_order ? parseFloat(formData.min_order) : null,
        cap: formData.cap ? parseFloat(formData.cap) : null,
        max_usage: formData.max_usage ? parseInt(formData.max_usage) : null,
        used: parseInt(formData.used) || 0,
        validity: formData.validity ? formatValidityDate(formData.validity) : null,
        status: formData.status,
      };

      await updateCoupon(couponId, couponData);
      setSuccess("Coupon updated successfully");
      setTimeout(() => {
        router.push("/admin/coupons");
      }, 1500);
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.errors) {
          const errors: Record<string, string> = {};
          Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors![key][0] || "";
          });
          setFieldErrors(errors);
        } else {
          setError(err.message || "Failed to update coupon");
        }
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error updating coupon:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/coupons" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Coupon</h1>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">Loading coupon...</p>
        </div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/coupons" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Coupon Not Found</h1>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">The coupon you're looking for doesn't exist.</p>
          <Link href="/admin/coupons">
            <Button variant="primary" className="mt-4">
              Back to Coupons
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/coupons" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Coupon</h1>
          <p className="text-sm text-gray-500 mt-1">Update coupon details</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Success</p>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 uppercase ${
                        fieldErrors.code ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                  </div>
                  {fieldErrors.code && (
                    <p className="mt-1.5 text-sm text-red-500">{fieldErrors.code}</p>
                  )}
                </div>
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={fieldErrors.name}
                  required
                />
              </div>
            </div>

            {/* Discount Details */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Discount Details</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                          fieldErrors.discount ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                    </div>
                    {fieldErrors.discount && (
                      <p className="mt-1.5 text-sm text-red-500">{fieldErrors.discount}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount Cap (Optional)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="cap"
                        value={formData.cap}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className={`w-full pl-8 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                          fieldErrors.cap ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {fieldErrors.cap && (
                      <p className="mt-1.5 text-sm text-red-500">{fieldErrors.cap}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="min_order"
                      value={formData.min_order}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full pl-8 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                        fieldErrors.min_order ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {fieldErrors.min_order && (
                    <p className="mt-1.5 text-sm text-red-500">{fieldErrors.min_order}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Usage Limits</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Usage Limit (Optional)</label>
                  <input
                    type="number"
                    name="max_usage"
                    value={formData.max_usage}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                      fieldErrors.max_usage ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {fieldErrors.max_usage && (
                    <p className="mt-1.5 text-sm text-red-500">{fieldErrors.max_usage}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Used Count</label>
                  <input
                    type="number"
                    name="used"
                    value={formData.used}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                      fieldErrors.used ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {fieldErrors.used && (
                    <p className="mt-1.5 text-sm text-red-500">{fieldErrors.used}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Validity Period</h2>
              </div>
              <div className="p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="validity"
                      value={formData.validity}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                        fieldErrors.validity ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {fieldErrors.validity && (
                    <p className="mt-1.5 text-sm text-red-500">{fieldErrors.validity}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Status</h2>
              </div>
              <div className="p-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-900 rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4" />
                <span className="text-sm font-medium">Preview</span>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <code className="text-lg font-mono">{formData.code || "CODE"}</code>
                <p className="text-sm text-gray-400 mt-2">
                  {formData.discount || "X"}% off
                  {formData.cap && ` (max $${formData.cap})`}
                </p>
                {formData.min_order && (
                  <p className="text-xs text-gray-400">Min order: ${formData.min_order}</p>
                )}
                {formData.validity && (
                  <p className="text-xs text-gray-400 mt-1">Expires: {new Date(formData.validity).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Link href="/admin/coupons">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
