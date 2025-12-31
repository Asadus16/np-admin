"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Tag, Calendar, Percent, DollarSign, Info } from "lucide-react";

const categories = [
  { id: "all", name: "All Categories" },
  { id: "plumbing", name: "Plumbing" },
  { id: "electrical", name: "Electrical" },
  { id: "hvac", name: "HVAC" },
  { id: "cleaning", name: "Cleaning" },
  { id: "landscaping", name: "Landscaping" },
];

const vendors = [
  { id: "all", name: "All Vendors" },
  { id: "vnd-001", name: "Quick Fix Plumbing" },
  { id: "vnd-002", name: "Spark Electric Co" },
  { id: "vnd-003", name: "Cool Air HVAC" },
  { id: "vnd-004", name: "Clean Pro Services" },
  { id: "vnd-005", name: "Green Thumb Gardens" },
];

export default function AddCouponPage() {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    perUserLimit: "1",
    validFrom: "",
    validTo: "",
    categories: ["all"],
    vendors: ["all"],
    firstOrderOnly: false,
    autoApply: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const toggleCategory = (categoryId: string) => {
    if (categoryId === "all") {
      setFormData(prev => ({ ...prev, categories: ["all"] }));
    } else {
      setFormData(prev => {
        const newCategories = prev.categories.includes(categoryId)
          ? prev.categories.filter(c => c !== categoryId)
          : [...prev.categories.filter(c => c !== "all"), categoryId];
        return { ...prev, categories: newCategories.length === 0 ? ["all"] : newCategories };
      });
    }
  };

  const toggleVendor = (vendorId: string) => {
    if (vendorId === "all") {
      setFormData(prev => ({ ...prev, vendors: ["all"] }));
    } else {
      setFormData(prev => {
        const newVendors = prev.vendors.includes(vendorId)
          ? prev.vendors.filter(v => v !== vendorId)
          : [...prev.vendors.filter(v => v !== "all"), vendorId];
        return { ...prev, vendors: newVendors.length === 0 ? ["all"] : newVendors };
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

      <form className="space-y-6">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Summer Sale Discount"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Internal notes about this coupon..."
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Discount Details */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Discount Details</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="percentage"
                        checked={formData.type === "percentage"}
                        onChange={handleChange}
                        className="text-gray-900"
                      />
                      <Percent className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Percentage</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="fixed"
                        checked={formData.type === "fixed"}
                        onChange={handleChange}
                        className="text-gray-900"
                      />
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Fixed Amount</span>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.type === "percentage" ? "Discount Percentage" : "Discount Amount"}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {formData.type === "percentage" ? "%" : "$"}
                      </span>
                      <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        placeholder={formData.type === "percentage" ? "20" : "50"}
                        className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                  {formData.type === "percentage" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          name="maxDiscount"
                          value={formData.maxDiscount}
                          onChange={handleChange}
                          placeholder="100"
                          className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Leave empty for no limit</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="minOrder"
                      value={formData.minOrder}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Usage Limits</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Usage Limit</label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      placeholder="Unlimited"
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Per User Limit</label>
                    <input
                      type="number"
                      name="perUserLimit"
                      value={formData.perUserLimit}
                      onChange={handleChange}
                      placeholder="1"
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="firstOrderOnly"
                    checked={formData.firstOrderOnly}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm text-gray-700">First order only</label>
                </div>
              </div>
            </div>

            {/* Validity Period */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Validity Period</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        name="validFrom"
                        value={formData.validFrom}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        name="validTo"
                        value={formData.validTo}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Applicable Categories */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Categories</h2>
              </div>
              <div className="p-4 space-y-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Applicable Vendors */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Vendors</h2>
              </div>
              <div className="p-4 space-y-2">
                {vendors.map((vendor) => (
                  <label key={vendor.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.vendors.includes(vendor.id)}
                      onChange={() => toggleVendor(vendor.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{vendor.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Options</h2>
              </div>
              <div className="p-4 space-y-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="autoApply"
                    checked={formData.autoApply}
                    onChange={handleChange}
                    className="rounded border-gray-300 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Auto-apply</span>
                    <p className="text-xs text-gray-500">Automatically apply at checkout if eligible</p>
                  </div>
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
                  {formData.type === "percentage" ? (
                    <>
                      {formData.value || "X"}% off
                      {formData.maxDiscount && ` (max $${formData.maxDiscount})`}
                    </>
                  ) : (
                    <>
                      ${formData.value || "X"} off
                    </>
                  )}
                </p>
                {formData.minOrder && (
                  <p className="text-xs text-gray-400">Min order: ${formData.minOrder}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Link
            href="/admin/coupons"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            Create Coupon
          </button>
        </div>
      </form>
    </div>
  );
}
