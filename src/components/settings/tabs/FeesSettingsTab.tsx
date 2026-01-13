"use client";

import { useState, useEffect, MutableRefObject } from "react";
import { AlertCircle, Loader2, Plus, Edit2, Trash2, X } from "lucide-react";
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

export interface FeesSettingsTabProps {
  onSaved: () => void;
  onSavingChange: (saving: boolean) => void;
  triggerSaveRef: MutableRefObject<(() => void) | null>;
}

export function FeesSettingsTab({ onSaved, onSavingChange, triggerSaveRef }: FeesSettingsTabProps) {
  const [feesSettings, setFeesSettings] = useState<FeesCommissionsSettings | null>(null);
  const [feesLoading, setFeesLoading] = useState(true);
  const [feesError, setFeesError] = useState<string | null>(null);
  const [feesValidationErrors, setFeesValidationErrors] = useState<Record<string, string[]>>({});

  // Category overrides state
  const [categoryOverrides, setCategoryOverrides] = useState<CategoryCommissionOverride[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [overridesLoading, setOverridesLoading] = useState(false);
  const [showAddOverride, setShowAddOverride] = useState(false);
  const [editingOverride, setEditingOverride] = useState<string | null>(null);
  const [newOverrideCategoryId, setNewOverrideCategoryId] = useState("");
  const [newOverrideRate, setNewOverrideRate] = useState("");
  const [newOverrideActive, setNewOverrideActive] = useState(true);

  useEffect(() => {
    loadFeesSettings();
    loadCategoryOverrides();
    loadCategories();
  }, []);

  // Expose save function to parent via ref
  useEffect(() => {
    triggerSaveRef.current = handleSaveFeesSettings;
    return () => {
      triggerSaveRef.current = null;
    };
  }, [feesSettings]);

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
      const response = await getCategoryCommissionOverrides(1, 50);
      setCategoryOverrides(response.data);
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

    onSavingChange(true);
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
      onSaved();
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
      onSavingChange(false);
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
      onSaved();
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
      onSaved();
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
      onSaved();
    } catch (error) {
      if (error instanceof ApiException) {
        setFeesError(error.message);
      } else {
        setFeesError("Failed to delete category override");
      }
    }
  };

  if (feesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!feesSettings) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">Failed to load fees settings</p>
      </div>
    );
  }

  return (
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
          <button onClick={() => setFeesError(null)} className="text-red-600 hover:text-red-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Platform Commission */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Platform Commission</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Commission Rate</label>
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
                    feesValidationErrors["platform_commission.default_rate"] ? "border-red-300" : "border-gray-300"
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Applied to all vendors by default</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Commission</label>
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
                  className="w-full pl-12 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                />
              </div>
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
              No category overrides. Click &quot;Add Override&quot; to create one.
            </p>
          ) : (
            categoryOverrides.map((override) => (
              <div key={override.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{override.category.name}</span>
                    {!override.is_active && (
                      <span className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-200 rounded">Inactive</span>
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
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                    </div>
                    <button onClick={() => setEditingOverride(null)} className="p-1.5 text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 w-16 text-right">{override.commission_rate}%</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingOverride(override.id)} className="p-1.5 text-gray-400 hover:text-gray-600" title="Edit">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteCategoryOverride(override.id)} className="p-1.5 text-gray-400 hover:text-red-600" title="Delete">
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
                    .filter((cat) => !categoryOverrides.some((override) => override.category.id === cat.id))
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
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
                <button onClick={handleSaveCategoryOverride} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
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
                  tax_settings: { ...feesSettings.tax_settings, vat_enabled: e.target.checked },
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
                        tax_settings: { ...feesSettings.tax_settings, vat_rate: parseFloat(e.target.value) || 0 },
                      })
                    }
                    className="w-full px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Registration Number</label>
                <input
                  type="text"
                  maxLength={50}
                  value={feesSettings.tax_settings.tax_registration_number || ""}
                  onChange={(e) =>
                    setFeesSettings({
                      ...feesSettings,
                      tax_settings: { ...feesSettings.tax_settings, tax_registration_number: e.target.value || null },
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Payout Frequency</label>
              <select
                value={feesSettings.payout_settings.frequency}
                onChange={(e) =>
                  setFeesSettings({
                    ...feesSettings,
                    payout_settings: {
                      ...feesSettings.payout_settings,
                      frequency: e.target.value as PayoutFrequency,
                      payout_day: e.target.value === "monthly" ? null : feesSettings.payout_settings.payout_day || "monday",
                    },
                  })
                }
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              >
                <option value="weekly">Weekly</option>
                <option value="bi_weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payout Day</label>
              <select
                value={feesSettings.payout_settings.payout_day || ""}
                onChange={(e) =>
                  setFeesSettings({
                    ...feesSettings,
                    payout_settings: { ...feesSettings.payout_settings, payout_day: (e.target.value || null) as PayoutDay },
                  })
                }
                disabled={feesSettings.payout_settings.frequency === "monthly"}
                className={`w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 ${
                  feesSettings.payout_settings.frequency === "monthly" ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Select day</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
              </select>
              {feesSettings.payout_settings.frequency === "monthly" && (
                <p className="text-xs text-gray-500 mt-1">Not applicable for monthly payouts</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Payout Amount</label>
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
                    payout_settings: { ...feesSettings.payout_settings, minimum_payout_amount: parseFloat(e.target.value) || 0 },
                  })
                }
                className="w-full pl-12 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              />
            </div>
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
    </div>
  );
}
