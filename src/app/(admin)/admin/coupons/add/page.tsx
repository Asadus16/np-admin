"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag, Calendar, Percent, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { createCoupon } from "@/lib/coupon";
import { CouponFormData } from "@/types/coupon";
import { ApiException } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AddCouponPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));
  };

  const formatValidityDate = (dateString: string): string => {
    if (!dateString) return "";
    // Convert YYYY-MM-DD to YYYY-MM-DD HH:mm:ss format
    return `${dateString} 23:59:59`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
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

      await createCoupon(couponData);
      router.push("/admin/coupons");
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.errors) {
          const errors: Record<string, string> = {};
          Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors![key][0] || "";
          });
          setFieldErrors(errors);
        } else {
          setError(err.message || "Failed to create coupon");
        }
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error creating coupon:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/coupons"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Create Coupon</h1>
          <p className="text-sm text-gray-500 mt-1">Add a new discount code</p>
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
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="e.g., SUMMER20"
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 uppercase"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={generateCode}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">This code will be used by customers at checkout</p>
                </div>
                <Input
                  label="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Summer Sale Discount"
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
                        placeholder="20"
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
                    <p className="text-xs text-gray-500 mt-1">Enter percentage (0-100)</p>
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
                        placeholder="100"
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
                    <p className="text-xs text-gray-500 mt-1">Leave empty for no limit</p>
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
                      placeholder="0"
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
                  <p className="text-xs text-gray-500 mt-1">Minimum order amount required to use this coupon</p>
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
                    placeholder="Unlimited"
                    min="1"
                    className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                      fieldErrors.max_usage ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {fieldErrors.max_usage && (
                    <p className="mt-1.5 text-sm text-red-500">{fieldErrors.max_usage}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited usage</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Used Count</label>
                  <input
                    type="number"
                    name="used"
                    value={formData.used}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                      fieldErrors.used ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {fieldErrors.used && (
                    <p className="mt-1.5 text-sm text-red-500">{fieldErrors.used}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Number of times this coupon has already been used</p>
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
                  <p className="text-xs text-gray-500 mt-1">Leave empty for no expiry date</p>
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
                <p className="text-xs text-gray-500 mt-2">Only active coupons can be used by customers</p>
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
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Coupon"}
          </Button>
        </div>
      </form>
    </div>
  );
}
