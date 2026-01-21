"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertCircle, Check } from "lucide-react";
import { createCompany, CreateCompanyData } from "@/lib/company";
import { ApiException } from "@/lib/auth";

interface Category {
  id: string;
  name: string;
}

interface ServiceArea {
  id: string;
  name: string;
}

const API_URL = '/api';

export default function AddVendorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<CreateCompanyData>({
    name: "",
    email: "",
    trade_license_number: "",
    description: "",
    landline: "",
    website: "",
    establishment: "",
    category_id: "",
    service_area_ids: [],
    bank_name: "",
    account_holder_name: "",
    iban: "",
    swift_code: "",
    trn: "",
    approved: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, saRes] = await Promise.all([
          fetch(`${API_URL}/public/categories`),
          fetch(`${API_URL}/public/service-areas`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.data || []);
        }

        if (saRes.ok) {
          const saData = await saRes.json();
          setServiceAreas(saData.data || []);
        }
      } catch {
        console.error("Failed to load data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleServiceAreaToggle = (areaId: string) => {
    const current = formData.service_area_ids || [];
    if (current.includes(areaId)) {
      setFormData({ ...formData, service_area_ids: current.filter(id => id !== areaId) });
    } else {
      setFormData({ ...formData, service_area_ids: [...current, areaId] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const dataToSend = { ...formData };
      // Remove empty optional fields
      if (!dataToSend.email) delete dataToSend.email;
      if (!dataToSend.description) delete dataToSend.description;
      if (!dataToSend.landline) delete dataToSend.landline;
      if (!dataToSend.website) delete dataToSend.website;
      if (!dataToSend.establishment) delete dataToSend.establishment;
      if (!dataToSend.category_id) delete dataToSend.category_id;
      if (!dataToSend.service_area_ids?.length) delete dataToSend.service_area_ids;
      if (!dataToSend.bank_name) delete dataToSend.bank_name;
      if (!dataToSend.account_holder_name) delete dataToSend.account_holder_name;
      if (!dataToSend.iban) delete dataToSend.iban;
      if (!dataToSend.swift_code) delete dataToSend.swift_code;
      if (!dataToSend.trn) delete dataToSend.trn;

      const result = await createCompany(dataToSend);
      setSuccessMessage("Vendor created successfully!");
      setTimeout(() => {
        router.push(`/admin/vendors/${result.data.id}`);
      }, 1500);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError("Failed to create vendor");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vendors"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add Vendor</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new vendor account</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700 text-xs"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Business Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter business name"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trade License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.trade_license_number}
                  onChange={(e) => setFormData({ ...formData, trade_license_number: e.target.value })}
                  placeholder="Enter trade license number"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Establishment Date</label>
                <input
                  type="date"
                  value={formData.establishment}
                  onChange={(e) => setFormData({ ...formData, establishment: e.target.value })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="vendor@example.com"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone / Landline</label>
                <input
                  type="text"
                  value={formData.landline}
                  onChange={(e) => setFormData({ ...formData, landline: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Describe the business..."
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 resize-none"
            />
          </div>

          {/* Service Areas */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Service Areas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {serviceAreas.map((area) => {
                const isSelected = formData.service_area_ids?.includes(area.id);
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => handleServiceAreaToggle(area.id)}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      isSelected
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {area.name}
                  </button>
                );
              })}
            </div>
            {serviceAreas.length === 0 && (
              <p className="text-sm text-gray-500">No service areas available</p>
            )}
          </div>

          {/* Bank Details */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Bank Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  placeholder="Enter bank name"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  value={formData.account_holder_name}
                  onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                  placeholder="Enter account holder name"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IBAN</label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                  placeholder="Enter IBAN"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT Code</label>
                <input
                  type="text"
                  value={formData.swift_code}
                  onChange={(e) => setFormData({ ...formData, swift_code: e.target.value })}
                  placeholder="Enter SWIFT code"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TRN</label>
                <input
                  type="text"
                  value={formData.trn}
                  onChange={(e) => setFormData({ ...formData, trn: e.target.value })}
                  placeholder="Enter TRN"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Approval Status */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Approval Status</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.approved}
                onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700">Approve vendor immediately</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              If unchecked, the vendor will be added as pending and will need manual approval.
            </p>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/admin/vendors"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Creating..." : "Create Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
