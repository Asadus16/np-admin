"use client";

import { useState, useEffect } from "react";
import { Building2, Upload, Mail, Phone, Globe, Loader2, AlertCircle } from "lucide-react";
import { getMyCompany, updateMyCompany, Company, CompanyUpdateData } from "@/lib/company";

interface FormData {
  companyName: string;
  email: string;
  phone: string;
  website: string;
  description: string;
}

export default function CompanySettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyCompany();
      setCompany(response.data);
      setFormData({
        companyName: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.landline || "",
        website: response.data.website || "",
        description: response.data.description || "",
      });
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || "Failed to load company data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updateData: CompanyUpdateData = {
        name: formData.companyName,
        email: formData.email || undefined,
        landline: formData.phone || undefined,
        website: formData.website || undefined,
        description: formData.description || undefined,
      };

      const response = await updateMyCompany(updateData);
      setCompany(response.data);
      setSuccessMessage("Company settings saved successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Company Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your company information</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Company Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your company information</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Company Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <button type="button" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Logo
                  </button>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Tell customers about your company..."
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 resize-none"
              />
            </div>

            {/* Read-only info */}
            {company && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Business Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Trade License:</span>
                    <p className="font-medium text-gray-900">{company.trade_license_number}</p>
                  </div>
                  {company.category && (
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <p className="font-medium text-gray-900">{company.category.name}</p>
                    </div>
                  )}
                  {company.establishment && (
                    <div>
                      <span className="text-gray-500">Established:</span>
                      <p className="font-medium text-gray-900">{company.establishment}</p>
                    </div>
                  )}
                  {company.service_areas && company.service_areas.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Service Areas:</span>
                      <p className="font-medium text-gray-900">
                        {company.service_areas.map(area => area.name).join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
