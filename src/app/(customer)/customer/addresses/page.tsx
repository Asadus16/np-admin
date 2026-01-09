"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Plus, Pencil, Trash2, Star, Home, Building, Check, Loader2, AlertCircle, X } from "lucide-react";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setAddressPrimary,
  Address,
  AddressFormData,
} from "@/lib/address";
import { getPublicServiceAreas } from "@/lib/serviceArea";
import type { ServiceArea } from "@/types/serviceArea";

const LocationPicker = dynamic(
  () => import("@/components/maps/LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    ),
  }
);

const emirates = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [serviceAreasLoading, setServiceAreasLoading] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    label: "Home",
    street_address: "",
    building: "",
    apartment: "",
    city: "",
    emirate: "Dubai",
    service_area_id: "",
    latitude: null,
    longitude: null,
    is_primary: false,
  });

  useEffect(() => {
    fetchAddresses();
    fetchServiceAreas();
  }, []);

  const fetchServiceAreas = async () => {
    try {
      setServiceAreasLoading(true);
      let allServiceAreas: ServiceArea[] = [];
      let currentPage = 1;
      let hasMorePages = true;

      // Fetch all pages of service areas
      while (hasMorePages) {
        const response = await getPublicServiceAreas(currentPage);
        if (response.data && response.data.length > 0) {
          allServiceAreas = [...allServiceAreas, ...response.data];
          
          // Check if there are more pages
          if (response.meta && currentPage < response.meta.last_page) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
      }

      setServiceAreas(allServiceAreas);
      console.log("Service areas fetched:", allServiceAreas.length);
    } catch (err) {
      console.error("Error fetching service areas:", err);
      setError("Failed to load service areas. Please refresh the page.");
    } finally {
      setServiceAreasLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAddresses();
      setAddresses(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSetDefault = async (id: string) => {
    try {
      setIsSubmitting(true);
      await setAddressPrimary(id);
      await fetchAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set primary address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      setIsSubmitting(true);
      await deleteAddress(id);
      await fetchAddresses();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (address: Address) => {
    // Ensure service areas are loaded before editing
    if (serviceAreas.length === 0 && !serviceAreasLoading) {
      await fetchServiceAreas();
    }

    // Match service area by slug since IDs are hashed and don't match
    let serviceAreaId = "";
    
    // Get the slug from the address response
    // Check multiple possible locations for the slug
    const addressServiceAreaSlug = 
      address.service_area?.slug || 
      (address as any).service_area_slug ||
      (address as any).service_area?.slug;
    
    if (addressServiceAreaSlug) {
      // Find the service area in the list by matching slug
      const matchedServiceArea = serviceAreas.find(area => area.slug === addressServiceAreaSlug);
      if (matchedServiceArea) {
        serviceAreaId = matchedServiceArea.id;
        console.log("Matched service area by slug:", addressServiceAreaSlug, "Found ID:", matchedServiceArea.id, "Name:", matchedServiceArea.name);
      } else {
        console.warn("Service area with slug not found in list:", addressServiceAreaSlug, "Available slugs:", serviceAreas.map(a => a.slug));
      }
    } else {
      console.warn("No service area slug found in address response. Address:", address);
    }

    setFormData({
      label: address.label,
      street_address: address.street_address,
      building: address.building || "",
      apartment: address.apartment || "",
      city: address.city,
      emirate: address.emirate,
      service_area_id: serviceAreaId,
      latitude: address.latitude,
      longitude: address.longitude,
      is_primary: address.is_primary,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (editingId) {
        await updateAddress(editingId, formData);
      } else {
        await createAddress(formData);
      }

      await fetchAddresses();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      label: "Home",
      street_address: "",
      building: "",
      apartment: "",
      city: "",
      emirate: "Dubai",
      service_area_id: "",
      latitude: null,
      longitude: null,
      is_primary: false,
    });
  };

  const getTypeIcon = (label: string) => {
    switch (label) {
      case "Home":
        return <Home className="h-5 w-5 text-gray-500" />;
      case "Work":
        return <Building className="h-5 w-5 text-gray-500" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Addresses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your saved addresses</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
              <select
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emirate *</label>
              <select
                name="emirate"
                value={formData.emirate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                {emirates.map((em) => (
                  <option key={em} value={em}>{em}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Area</label>
              {serviceAreasLoading ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-500">Loading service areas...</p>
                </div>
              ) : (
                <select
                  name="service_area_id"
                  value={formData.service_area_id || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Select service area</option>
                  {serviceAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
              <input
                type="text"
                name="street_address"
                placeholder="Street name and number"
                value={formData.street_address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Building/Villa Name</label>
              <input
                type="text"
                name="building"
                placeholder="Building or villa name"
                value={formData.building}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apartment/Office</label>
              <input
                type="text"
                name="apartment"
                placeholder="Apt/Office number"
                value={formData.apartment}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City/Area *</label>
              <input
                type="text"
                name="city"
                placeholder="City or area name"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Map Location Picker */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pin Location</label>
            <LocationPicker
              latitude={formData.latitude ?? null}
              longitude={formData.longitude ?? null}
              onLocationChange={handleLocationChange}
              height="200px"
              autoFetch={!editingId}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !formData.street_address || !formData.city}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      )}

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No addresses saved</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white border rounded-lg p-4 ${
                address.is_primary ? "border-gray-900" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(address.label)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{address.label}</p>
                      {address.is_primary && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-900 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.street_address}
                      {address.building && `, ${address.building}`}
                      {address.apartment && `, ${address.apartment}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {address.city}, {address.emirate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!address.is_primary && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isSubmitting}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                      title="Set as default"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    disabled={isSubmitting}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={isSubmitting}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
