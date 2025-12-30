"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Loader2, AlertCircle, Check } from "lucide-react";
import {
  getVendorServiceAreas,
  updateVendorServiceAreas,
  ServiceAreaWithStatus,
} from "@/lib/company";

export default function ServiceAreasSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serviceAreas, setServiceAreas] = useState<ServiceAreaWithStatus[]>([]);

  useEffect(() => {
    fetchServiceAreas();
  }, []);

  const fetchServiceAreas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getVendorServiceAreas();
      setServiceAreas(response.data);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || "Failed to load service areas");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArea = (id: string) => {
    setServiceAreas(
      serviceAreas.map((area) =>
        area.id === id ? { ...area, selected: !area.selected } : area
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const selectedIds = serviceAreas
        .filter((area) => area.selected)
        .map((area) => area.id);

      await updateVendorServiceAreas({ service_area_ids: selectedIds });
      setSuccessMessage("Service areas updated successfully!");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCount = serviceAreas.filter((area) => area.selected).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/vendor/settings"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Service Areas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Select the areas where you provide services
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Selection Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{selectedCount}</span>{" "}
            {selectedCount === 1 ? "area" : "areas"} selected
          </p>
        </div>

        {/* List */}
        {serviceAreas.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No service areas available</p>
            <p className="text-sm text-gray-400 mt-1">
              Contact admin to add service areas
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
            {serviceAreas.map((area) => (
              <div
                key={area.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleArea(area.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      area.selected ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <MapPin
                      className={`h-5 w-5 ${
                        area.selected ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {area.name}
                    </p>
                    {area.description && (
                      <p className="text-xs text-gray-500">{area.description}</p>
                    )}
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    area.selected
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {area.selected && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save Button */}
        {serviceAreas.length > 0 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
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
        )}
      </div>
    </div>
  );
}
