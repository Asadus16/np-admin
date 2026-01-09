"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  CreditCard,
  Bell,
  Shield,
  Mail,
  Percent,
  Users,
  MapPin,
  Clock,
  Save,
  CheckCircle,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import {
  getFeesCommissionsSettings,
  updateFeesCommissionsSettings,
  getCategoryCommissionOverrides,
  createOrUpdateCategoryCommissionOverride,
  updateCategoryCommissionOverride,
  deleteCategoryCommissionOverride,
} from "@/lib/feesCommissions";
import { getCategories } from "@/lib/category";
import type {
  FeesCommissionsSettings,
  FeesCommissionsSettingsUpdateData,
  CategoryCommissionOverride,
  PayoutFrequency,
  PayoutDay,
} from "@/types/feesCommissions";
import type { Category } from "@/types/category";
import { ApiException } from "@/lib/auth";

type TabType = "general" | "payments" | "notifications" | "security" | "localization" | "fees";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [saved, setSaved] = useState(false);

  // Fees & Commissions state
  const [feesSettings, setFeesSettings] = useState<FeesCommissionsSettings | null>(null);
  const [feesLoading, setFeesLoading] = useState(false);
  const [feesError, setFeesError] = useState<string | null>(null);
  const [feesValidationErrors, setFeesValidationErrors] = useState<Record<string, string[]>>({});
  const [feesSaving, setFeesSaving] = useState(false);
  
  // Category overrides state
  const [categoryOverrides, setCategoryOverrides] = useState<CategoryCommissionOverride[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [overridesLoading, setOverridesLoading] = useState(false);
  const [overridesPage, setOverridesPage] = useState(1);
  const [overridesTotal, setOverridesTotal] = useState(0);
  const [showAddOverride, setShowAddOverride] = useState(false);
  const [editingOverride, setEditingOverride] = useState<string | null>(null);
  const [newOverrideCategoryId, setNewOverrideCategoryId] = useState("");
  const [newOverrideRate, setNewOverrideRate] = useState("");
  const [newOverrideActive, setNewOverrideActive] = useState(true);

  // Load fees settings when fees tab is active
  useEffect(() => {
    if (activeTab === "fees" && !feesSettings && !feesLoading) {
      loadFeesSettings();
      loadCategoryOverrides();
      loadCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadFeesSettings = async () => {
    setFeesLoading(true);
    setFeesError(null);
    try {
      const response = await getFeesCommissionsSettings();
      setFeesSettings(response.data);
    } catch (error) {
      if (error instanceof ApiException) {
        setFeesError(error.message);
      } else {
        setFeesError("Failed to load fees settings");
      }
    } finally {
      setFeesLoading(false);
    }
  };

  const loadCategoryOverrides = async () => {
    setOverridesLoading(true);
    try {
      const response = await getCategoryCommissionOverrides(overridesPage, 50);
      setCategoryOverrides(response.data);
      setOverridesTotal(response.meta.total);
    } catch (error) {
      if (error instanceof ApiException) {
        setFeesError(error.message);
      }
    } finally {
      setOverridesLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getCategories(1);
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleSaveFeesSettings = async () => {
    if (!feesSettings) return;

    setFeesSaving(true);
    setFeesError(null);
    setFeesValidationErrors({});

    const updateData: FeesCommissionsSettingsUpdateData = {
      platform_commission: {
        default_rate: feesSettings.platform_commission.default_rate,
        minimum_commission: feesSettings.platform_commission.minimum_commission,
      },
      tax_settings: {
        vat_enabled: feesSettings.tax_settings.vat_enabled,
        vat_rate: feesSettings.tax_settings.vat_rate,
        tax_registration_number: feesSettings.tax_settings.tax_registration_number || undefined,
      },
      payout_settings: {
        frequency: feesSettings.payout_settings.frequency,
        payout_day: feesSettings.payout_settings.payout_day,
        minimum_payout_amount: feesSettings.payout_settings.minimum_payout_amount,
      },
    };

    try {
      const response = await updateFeesCommissionsSettings(updateData);
      setFeesSettings(response.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      if (error instanceof ApiException) {
        setFeesError(error.message);
        if (error.errors) {
          setFeesValidationErrors(error.errors);
        }
      } else {
        setFeesError("Failed to update fees settings");
      }
    } finally {
      setFeesSaving(false);
    }
  };

  const handleSaveCategoryOverride = async () => {
    if (!newOverrideCategoryId || !newOverrideRate) {
      setFeesError("Please select a category and enter a commission rate");
      return;
    }

    const rate = parseFloat(newOverrideRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      setFeesError("Commission rate must be between 0 and 100");
      return;
    }

    try {
      await createOrUpdateCategoryCommissionOverride({
        category_id: newOverrideCategoryId,
        commission_rate: rate,
        is_active: newOverrideActive,
      });
      await loadCategoryOverrides();
      setShowAddOverride(false);
      setNewOverrideCategoryId("");
      setNewOverrideRate("");
      setNewOverrideActive(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      if (error instanceof ApiException) {
        setFeesError(error.message);
      } else {
        setFeesError("Failed to save category override");
      }
    }
  };

  const handleUpdateCategoryOverride = async (id: string, rate: number, isActive: boolean) => {
    try {
      await updateCategoryCommissionOverride(id, {
        commission_rate: rate,
        is_active: isActive,
      });
      await loadCategoryOverrides();
      setEditingOverride(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      if (error instanceof ApiException) {
        setFeesError(error.message);
      } else {
        setFeesError("Failed to update category override");
      }
    }
  };

  const handleDeleteCategoryOverride = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category override?")) {
      return;
    }

    try {
      await deleteCategoryCommissionOverride(id);
      await loadCategoryOverrides();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      if (error instanceof ApiException) {
        setFeesError(error.message);
      } else {
        setFeesError("Failed to delete category override");
      }
    }
  };

  const handleSave = () => {
    if (activeTab === "fees") {
      handleSaveFeesSettings();
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const tabs = [
    { id: "general" as const, name: "General", icon: Building2 },
    { id: "payments" as const, name: "Payments", icon: CreditCard },
    { id: "fees" as const, name: "Fees & Commissions", icon: Percent },
    { id: "notifications" as const, name: "Notifications", icon: Bell },
    { id: "security" as const, name: "Security", icon: Shield },
    { id: "localization" as const, name: "Localization", icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure platform settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={activeTab === "fees" && feesSaving}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {activeTab === "fees" && feesSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Platform Information */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Platform Information</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                      <input
                        type="text"
                        defaultValue="NoProblem"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        defaultValue="support@noproblem.ae"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                      <input
                        type="tel"
                        defaultValue="+971 4 123 4567"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                      <input
                        type="url"
                        defaultValue="https://noproblem.ae"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Business Hours</h2>
                </div>
                <div className="p-4 space-y-3">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <span className="w-24 text-sm text-gray-700">{day}</span>
                      <input
                        type="time"
                        defaultValue={day === "Friday" ? "14:00" : "09:00"}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        defaultValue={day === "Friday" ? "22:00" : "18:00"}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                      />
                      <label className="flex items-center gap-2 ml-4">
                        <input type="checkbox" className="rounded border-gray-300" defaultChecked={day !== "Sunday"} />
                        <span className="text-sm text-gray-600">Open</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Mode */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Maintenance Mode</h2>
                </div>
                <div className="p-4 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Enable Maintenance Mode</span>
                      <p className="text-xs text-gray-500">Temporarily disable the platform for maintenance</p>
                    </div>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
                    <textarea
                      rows={3}
                      defaultValue="We're currently performing scheduled maintenance. We'll be back shortly!"
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
                </div>
                <div className="p-4 space-y-4">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Credit/Debit Cards</span>
                        <p className="text-xs text-gray-500">Visa, Mastercard, American Express</p>
                      </div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Apple Pay</span>
                        <p className="text-xs text-gray-500">Mobile payments with Apple devices</p>
                      </div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                        <p className="text-xs text-gray-500">Pay when service is completed</p>
                      </div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-700">Points Redemption</span>
                        <p className="text-xs text-gray-500">Allow customers to pay with earned points</p>
                      </div>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </label>
                </div>
              </div>

              {/* Payment Gateway */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Payment Gateway</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gateway Provider</label>
                    <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                      <option>Stripe</option>
                      <option>PayTabs</option>
                      <option>Telr</option>
                      <option>Network International</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <input
                        type="password"
                        defaultValue="sk_live_xxxxxxxxxxxxx"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                      <input
                        type="password"
                        defaultValue="pk_live_xxxxxxxxxxxxx"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-700">Enable test mode</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "fees" && (
            <div className="space-y-6">
              {feesError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">{feesError}</p>
                    {Object.keys(feesValidationErrors).length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-sm text-red-700">
                        {Object.entries(feesValidationErrors).map(([field, errors]) => (
                          <li key={field}>{field}: {errors.join(", ")}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    onClick={() => setFeesError(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {feesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : feesSettings ? (
                <>
                  {/* Platform Commission */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Platform Commission</h2>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Default Commission Rate
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={feesSettings.platform_commission.default_rate}
                              onChange={(e) =>
                                setFeesSettings({
                                  ...feesSettings,
                                  platform_commission: {
                                    ...feesSettings.platform_commission,
                                    default_rate: parseFloat(e.target.value) || 0,
                                  },
                                })
                              }
                              className={`w-full px-4 py-2 pr-8 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                                feesValidationErrors["platform_commission.default_rate"]
                                  ? "border-red-300"
                                  : "border-gray-300"
                              }`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                          </div>
                          {feesValidationErrors["platform_commission.default_rate"] && (
                            <p className="text-xs text-red-600 mt-1">
                              {feesValidationErrors["platform_commission.default_rate"].join(", ")}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">Applied to all vendors by default</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Commission
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">AED</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={feesSettings.platform_commission.minimum_commission}
                              onChange={(e) =>
                                setFeesSettings({
                                  ...feesSettings,
                                  platform_commission: {
                                    ...feesSettings.platform_commission,
                                    minimum_commission: parseFloat(e.target.value) || 0,
                                  },
                                })
                              }
                              className={`w-full pl-12 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                                feesValidationErrors["platform_commission.minimum_commission"]
                                  ? "border-red-300"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>
                          {feesValidationErrors["platform_commission.minimum_commission"] && (
                            <p className="text-xs text-red-600 mt-1">
                              {feesValidationErrors["platform_commission.minimum_commission"].join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category-specific Commissions */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">Category Commissions</h2>
                        <p className="text-sm text-gray-500 mt-1">Override default commission by category</p>
                      </div>
                      <button
                        onClick={() => setShowAddOverride(true)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                      >
                        <Plus className="h-4 w-4" />
                        Add Override
                      </button>
                    </div>
                    <div className="p-4 space-y-3">
                      {overridesLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        </div>
                      ) : categoryOverrides.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-8">
                          No category overrides. Click "Add Override" to create one.
                        </p>
                      ) : (
                        categoryOverrides.map((override) => (
                          <div
                            key={override.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {override.category.name}
                                </span>
                                {!override.is_active && (
                                  <span className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-200 rounded">
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </div>
                            {editingOverride === override.id ? (
                              <div className="flex items-center gap-2">
                                <div className="relative w-24">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    defaultValue={override.commission_rate}
                                    onBlur={(e) => {
                                      const rate = parseFloat(e.target.value);
                                      if (!isNaN(rate) && rate >= 0 && rate <= 100) {
                                        handleUpdateCategoryOverride(override.id, rate, override.is_active);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        const rate = parseFloat((e.target as HTMLInputElement).value);
                                        if (!isNaN(rate) && rate >= 0 && rate <= 100) {
                                          handleUpdateCategoryOverride(override.id, rate, override.is_active);
                                        }
                                      } else if (e.key === "Escape") {
                                        setEditingOverride(null);
                                      }
                                    }}
                                    className="w-full px-3 py-1.5 pr-7 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                                    autoFocus
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                    %
                                  </span>
                                </div>
                                <button
                                  onClick={() => setEditingOverride(null)}
                                  className="p-1.5 text-gray-400 hover:text-gray-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-700 w-16 text-right">
                                  {override.commission_rate}%
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setEditingOverride(override.id)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600"
                                    title="Edit"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategoryOverride(override.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    {showAddOverride && (
                      <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                              value={newOverrideCategoryId}
                              onChange={(e) => setNewOverrideCategoryId(e.target.value)}
                              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                            >
                              <option value="">Select a category</option>
                              {categories
                                .filter(
                                  (cat) =>
                                    !categoryOverrides.some((override) => override.category.id === cat.id)
                                )
                                .map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Commission Rate (%)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  value={newOverrideRate}
                                  onChange={(e) => setNewOverrideRate(e.target.value)}
                                  className="w-full px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                              </div>
                            </div>
                            <div className="flex items-end">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newOverrideActive}
                                  onChange={(e) => setNewOverrideActive(e.target.checked)}
                                  className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                              </label>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleSaveCategoryOverride}
                              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setShowAddOverride(false);
                                setNewOverrideCategoryId("");
                                setNewOverrideRate("");
                                setNewOverrideActive(true);
                              }}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tax Settings */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Tax Settings</h2>
                    </div>
                    <div className="p-4 space-y-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={feesSettings.tax_settings.vat_enabled}
                          onChange={(e) =>
                            setFeesSettings({
                              ...feesSettings,
                              tax_settings: {
                                ...feesSettings.tax_settings,
                                vat_enabled: e.target.checked,
                              },
                            })
                          }
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Enable VAT</span>
                      </label>
                      {feesSettings.tax_settings.vat_enabled && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate</label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                value={feesSettings.tax_settings.vat_rate}
                                onChange={(e) =>
                                  setFeesSettings({
                                    ...feesSettings,
                                    tax_settings: {
                                      ...feesSettings.tax_settings,
                                      vat_rate: parseFloat(e.target.value) || 0,
                                    },
                                  })
                                }
                                className={`w-full px-4 py-2 pr-8 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                                  feesValidationErrors["tax_settings.vat_rate"]
                                    ? "border-red-300"
                                    : "border-gray-300"
                                }`}
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                            </div>
                            {feesValidationErrors["tax_settings.vat_rate"] && (
                              <p className="text-xs text-red-600 mt-1">
                                {feesValidationErrors["tax_settings.vat_rate"].join(", ")}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tax Registration Number
                            </label>
                            <input
                              type="text"
                              maxLength={50}
                              value={feesSettings.tax_settings.tax_registration_number || ""}
                              onChange={(e) =>
                                setFeesSettings({
                                  ...feesSettings,
                                  tax_settings: {
                                    ...feesSettings.tax_settings,
                                    tax_registration_number: e.target.value || null,
                                  },
                                })
                              }
                              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payout Settings */}
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Payout Settings</h2>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Payout Frequency
                          </label>
                          <select
                            value={feesSettings.payout_settings.frequency}
                            onChange={(e) =>
                              setFeesSettings({
                                ...feesSettings,
                                payout_settings: {
                                  ...feesSettings.payout_settings,
                                  frequency: e.target.value as PayoutFrequency,
                                  payout_day:
                                    e.target.value === "monthly"
                                      ? null
                                      : feesSettings.payout_settings.payout_day || "monday",
                                },
                              })
                            }
                            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                              feesValidationErrors["payout_settings.frequency"]
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="weekly">Weekly</option>
                            <option value="bi_weekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                          {feesValidationErrors["payout_settings.frequency"] && (
                            <p className="text-xs text-red-600 mt-1">
                              {feesValidationErrors["payout_settings.frequency"].join(", ")}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payout Day</label>
                          <select
                            value={feesSettings.payout_settings.payout_day || ""}
                            onChange={(e) =>
                              setFeesSettings({
                                ...feesSettings,
                                payout_settings: {
                                  ...feesSettings.payout_settings,
                                  payout_day: (e.target.value || null) as PayoutDay,
                                },
                              })
                            }
                            disabled={feesSettings.payout_settings.frequency === "monthly"}
                            className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                              feesSettings.payout_settings.frequency === "monthly"
                                ? "bg-gray-100 cursor-not-allowed"
                                : ""
                            } ${
                              feesValidationErrors["payout_settings.payout_day"]
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Select day</option>
                            <option value="monday">Monday</option>
                            <option value="tuesday">Tuesday</option>
                            <option value="wednesday">Wednesday</option>
                            <option value="thursday">Thursday</option>
                            <option value="friday">Friday</option>
                          </select>
                          {feesValidationErrors["payout_settings.payout_day"] && (
                            <p className="text-xs text-red-600 mt-1">
                              {feesValidationErrors["payout_settings.payout_day"].join(", ")}
                            </p>
                          )}
                          {feesSettings.payout_settings.frequency === "monthly" && (
                            <p className="text-xs text-gray-500 mt-1">Not applicable for monthly payouts</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Minimum Payout Amount
                        </label>
                        <div className="relative w-48">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">AED</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={feesSettings.payout_settings.minimum_payout_amount}
                            onChange={(e) =>
                              setFeesSettings({
                                ...feesSettings,
                                payout_settings: {
                                  ...feesSettings.payout_settings,
                                  minimum_payout_amount: parseFloat(e.target.value) || 0,
                                },
                              })
                            }
                            className={`w-full pl-12 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                              feesValidationErrors["payout_settings.minimum_payout_amount"]
                                ? "border-red-300"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {feesValidationErrors["payout_settings.minimum_payout_amount"] && (
                          <p className="text-xs text-red-600 mt-1">
                            {feesValidationErrors["payout_settings.minimum_payout_amount"].join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Last Updated Info */}
                  {feesSettings.updated_at && (
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date(feesSettings.updated_at).toLocaleString()}
                      {feesSettings.updated_by && ` by ${feesSettings.updated_by.name}`}
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Email Notifications</h2>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { name: "New Order", desc: "When a new order is placed", enabled: true },
                    { name: "Order Completed", desc: "When an order is marked complete", enabled: true },
                    { name: "Order Cancelled", desc: "When an order is cancelled", enabled: true },
                    { name: "Refund Request", desc: "When a refund is requested", enabled: true },
                    { name: "New Vendor Registration", desc: "When a new vendor signs up", enabled: true },
                    { name: "Vendor Approval Needed", desc: "When a vendor needs approval", enabled: true },
                    { name: "Daily Summary", desc: "Daily report of platform activity", enabled: false },
                    { name: "Weekly Summary", desc: "Weekly report of platform activity", enabled: true },
                  ].map((item) => (
                    <label key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                      <div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked={item.enabled} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Email Settings */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Email Settings</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                      <input
                        type="email"
                        defaultValue="noreply@noproblem.ae"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                      <input
                        type="text"
                        defaultValue="NoProblem"
                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notification Emails</label>
                    <input
                      type="text"
                      defaultValue="admin@noproblem.ae, support@noproblem.ae"
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated list of emails</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Authentication */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Authentication</h2>
                </div>
                <div className="p-4 space-y-4">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Require email verification</span>
                      <p className="text-xs text-gray-500">Users must verify email before accessing account</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Enable phone OTP login</span>
                      <p className="text-xs text-gray-500">Allow users to login via phone OTP</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Require 2FA for admins</span>
                      <p className="text-xs text-gray-500">Force two-factor authentication for admin accounts</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Password Policy */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Password Policy</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
                    <input
                      type="number"
                      defaultValue="8"
                      className="w-32 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Require uppercase letter</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Require number</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Require special character</span>
                  </label>
                </div>
              </div>

              {/* Session Settings */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Session Settings</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="w-32 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Allow &quot;Remember Me&quot; option</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "localization" && (
            <div className="space-y-6">
              {/* Regional Settings */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Regional Settings</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Country</label>
                      <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                        <option>United Arab Emirates</option>
                        <option>Saudi Arabia</option>
                        <option>Qatar</option>
                        <option>Kuwait</option>
                        <option>Bahrain</option>
                        <option>Oman</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
                      <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                        <option>Asia/Dubai (GMT+4)</option>
                        <option>Asia/Riyadh (GMT+3)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                        <option>AED - UAE Dirham</option>
                        <option>SAR - Saudi Riyal</option>
                        <option>USD - US Dollar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                      <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Language</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                    <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
                      <option>English</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Enable Arabic language</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-700">Enable RTL support</span>
                  </label>
                </div>
              </div>

              {/* Service Areas */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Service Areas</h2>
                  <button className="text-sm text-gray-600 hover:text-gray-900">Manage Areas</button>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"].map((city) => (
                      <span key={city} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        <MapPin className="h-3 w-3" />
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
