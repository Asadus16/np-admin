"use client";

import { Category } from "@/types/category";
import { ServiceArea } from "@/types/serviceArea";
import { VendorFormData, VendorService, SubServiceOption } from "../types";
import LocationPicker from "@/components/maps/LocationPicker";
import {
  Mail,
  Lock,
  Loader2,
  FileText,
  Plus,
  Trash2,
  ImageIcon,
  Briefcase,
  MapPin,
} from "lucide-react";

interface VendorStepsProps {
  formData: VendorFormData;
  updateFormData: (field: keyof VendorFormData, value: string | string[] | File | null | VendorService[] | number) => void;
  fieldErrors: Record<string, string>;
  categories: Category[];
  categoriesLoading: boolean;
  serviceAreas: ServiceArea[];
  serviceAreasLoading: boolean;
  // File input refs
  tradeLicenseInputRef: React.RefObject<HTMLInputElement>;
  vatCertificateInputRef: React.RefObject<HTMLInputElement>;
}

export function useVendorServiceHelpers(
  formData: VendorFormData,
  updateFormData: (field: keyof VendorFormData, value: VendorService[]) => void
) {
  const addService = () => {
    const newService: VendorService = {
      id: `service-${Date.now()}`,
      name: "",
      description: "",
      image: null,
      subServices: [
        {
          id: `sub-${Date.now()}`,
          name: "",
          price: "",
          duration: "30",
          description: "",
        },
      ],
    };
    updateFormData("services", [...formData.services, newService]);
  };

  const removeService = (serviceId: string) => {
    updateFormData(
      "services",
      formData.services.filter((s) => s.id !== serviceId)
    );
  };

  const updateService = (serviceId: string, field: keyof VendorService, value: string | File | null) => {
    updateFormData(
      "services",
      formData.services.map((s) =>
        s.id === serviceId ? { ...s, [field]: value } : s
      )
    );
  };

  const addSubService = (serviceId: string) => {
    const newSubService: SubServiceOption = {
      id: `sub-${Date.now()}`,
      name: "",
      price: "",
      duration: "30",
      description: "",
    };
    updateFormData(
      "services",
      formData.services.map((s) =>
        s.id === serviceId
          ? { ...s, subServices: [...s.subServices, newSubService] }
          : s
      )
    );
  };

  const removeSubService = (serviceId: string, subServiceId: string) => {
    updateFormData(
      "services",
      formData.services.map((s) =>
        s.id === serviceId
          ? { ...s, subServices: s.subServices.filter((sub) => sub.id !== subServiceId) }
          : s
      )
    );
  };

  const updateSubService = (
    serviceId: string,
    subServiceId: string,
    field: keyof SubServiceOption,
    value: string
  ) => {
    updateFormData(
      "services",
      formData.services.map((s) =>
        s.id === serviceId
          ? {
              ...s,
              subServices: s.subServices.map((sub) =>
                sub.id === subServiceId ? { ...sub, [field]: value } : sub
              ),
            }
          : s
      )
    );
  };

  const handleServiceImageChange = (serviceId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    updateService(serviceId, "image", file);
  };

  return {
    addService,
    removeService,
    updateService,
    addSubService,
    removeSubService,
    updateSubService,
    handleServiceImageChange,
  };
}

export default function VendorSteps({
  formData,
  updateFormData,
  fieldErrors,
  categories,
  categoriesLoading,
  serviceAreas,
  serviceAreasLoading,
  tradeLicenseInputRef,
  vatCertificateInputRef,
}: VendorStepsProps) {
  const {
    addService,
    removeService,
    updateService,
    addSubService,
    removeSubService,
    updateSubService,
    handleServiceImageChange,
  } = useVendorServiceHelpers(formData, updateFormData as (field: keyof VendorFormData, value: VendorService[]) => void);

  const toggleServiceArea = (areaId: string) => {
    const current = formData.selectedServiceAreas;
    if (current.includes(areaId)) {
      updateFormData("selectedServiceAreas", current.filter((id) => id !== areaId));
    } else {
      updateFormData("selectedServiceAreas", [...current, areaId]);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "tradeLicenseFile" | "vatCertificateFile"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData(field, file);
    }
  };

  // Step 0 - Account
  const renderStep0 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Create Your Account</h3>
        <p className="text-sm text-gray-500">Let&apos;s start with your login credentials.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
            placeholder="John"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.firstName
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {fieldErrors.firstName && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            placeholder="Doe"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.lastName
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {fieldErrors.lastName && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="john@company.com"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.email
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
        </div>
        {fieldErrors.email && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            placeholder="Create a strong password"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.password
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
        </div>
        {fieldErrors.password && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="password"
            value={formData.passwordConfirmation}
            onChange={(e) => updateFormData("passwordConfirmation", e.target.value)}
            placeholder="Confirm your password"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.passwordConfirmation
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
        </div>
        {fieldErrors.passwordConfirmation && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.passwordConfirmation}</p>
        )}
      </div>
    </div>
  );

  // Step 1 - Company Profile
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Company Profile</h3>
        <p className="text-sm text-gray-500">Tell us about your business entity.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => updateFormData("companyName", e.target.value)}
            placeholder="Sparkle Cleaners LLC"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.companyName
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {fieldErrors.companyName && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.companyName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Email</label>
          <input
            type="email"
            value={formData.companyEmail}
            onChange={(e) => updateFormData("companyEmail", e.target.value)}
            placeholder="info@sparkle.ae"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Trade License Number</label>
        <input
          type="text"
          value={formData.tradeLicenseNumber}
          onChange={(e) => updateFormData("tradeLicenseNumber", e.target.value)}
          placeholder="DXB-12345"
          className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
            fieldErrors.tradeLicenseNumber
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
        />
        {fieldErrors.tradeLicenseNumber && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.tradeLicenseNumber}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData("description", e.target.value)}
          placeholder="We provide professional home services..."
          rows={2}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Landline</label>
          <input
            type="tel"
            value={formData.businessLandline}
            onChange={(e) => updateFormData("businessLandline", e.target.value)}
            placeholder="+971 4 000 0000"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => updateFormData("website", e.target.value)}
            placeholder="www.example.com"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Establishment Date</label>
        <input
          type="date"
          value={formData.establishmentDate}
          onChange={(e) => updateFormData("establishmentDate", e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {/* Map for company location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          <MapPin className="inline-block w-4 h-4 mr-1 -mt-0.5" />
          Business Location
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Pin your business location on the map
        </p>
        <LocationPicker
          latitude={formData.latitude}
          longitude={formData.longitude}
          onLocationChange={(lat, lng) => {
            updateFormData("latitude", lat);
            updateFormData("longitude", lng);
          }}
          height="180px"
          autoFetch
        />
        {(formData.latitude && formData.longitude) && (
          <p className="text-xs text-blue-600 mt-1">
            Location set: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
          </p>
        )}
      </div>
    </div>
  );

  // Step 2 - Primary Contact
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Primary Contact</h3>
        <p className="text-sm text-gray-500">Who is the main point of contact?</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
          <input
            type="text"
            value={formData.contactFirstName}
            onChange={(e) => updateFormData("contactFirstName", e.target.value)}
            placeholder="John"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.contactFirstName
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {fieldErrors.contactFirstName && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.contactFirstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
          <input
            type="text"
            value={formData.contactLastName}
            onChange={(e) => updateFormData("contactLastName", e.target.value)}
            placeholder="Doe"
            className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.contactLastName
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
          {fieldErrors.contactLastName && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.contactLastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation</label>
        <input
          type="text"
          value={formData.designation}
          onChange={(e) => updateFormData("designation", e.target.value)}
          placeholder="Operations Manager"
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => updateFormData("contactEmail", e.target.value)}
            placeholder="john@company.com"
            className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
              fieldErrors.contactEmail
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />
        </div>
        {fieldErrors.contactEmail && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.contactEmail}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
        <input
          type="tel"
          value={formData.mobileNumber}
          onChange={(e) => updateFormData("mobileNumber", e.target.value)}
          placeholder="+971 50 000 0000"
          className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
            fieldErrors.mobileNumber
              ? "border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
          }`}
        />
        {fieldErrors.mobileNumber && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.mobileNumber}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Emirates ID</label>
        <input
          type="text"
          value={formData.emiratesId}
          onChange={(e) => updateFormData("emiratesId", e.target.value)}
          placeholder="784-XXXX-XXXXXXX-X"
          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>
    </div>
  );

  // Step 3 - Services
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Services & Offerings</h3>
        <p className="text-sm text-gray-500">Define the specific services you offer.</p>
      </div>

      {/* 1. Select Primary Category */}
      <div className="border-b border-gray-200 pb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">1. Select Primary Category</h4>
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No categories available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  if (formData.selectedCategories.includes(category.id)) {
                    updateFormData("selectedCategories", []);
                  } else {
                    updateFormData("selectedCategories", [category.id]);
                  }
                }}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  formData.selectedCategories.includes(category.id)
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
        {fieldErrors.selectedCategories && (
          <p className="text-xs text-red-500 mt-2">{fieldErrors.selectedCategories}</p>
        )}
      </div>

      {/* 2. Build Your Services */}
      {formData.selectedCategories.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900">2. Build Your Services</h4>
            <button
              type="button"
              onClick={addService}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Service
            </button>
          </div>

          {formData.services.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Briefcase className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No services added yet</p>
              <button
                type="button"
                onClick={addService}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add your first service
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {formData.services.map((service, serviceIndex) => (
                <div
                  key={service.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Service {serviceIndex + 1}
                    </span>
                    {formData.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(service.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Name (e.g. Sofa Cleaning)
                      </label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(service.id, "name", e.target.value)}
                        placeholder="Enter service name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id, "description", e.target.value)}
                        placeholder="Describe what this service includes..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="block w-full">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                          <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <span className="text-sm text-gray-600">
                            {service.image ? service.image.name : "Upload Service Image"}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleServiceImageChange(service.id, e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="border-l-2 border-gray-300 pl-4 mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Sub-Services / Options
                        </span>
                        <button
                          type="button"
                          onClick={() => addSubService(service.id)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Option
                        </button>
                      </div>

                      <div className="space-y-3">
                        {service.subServices.map((subService) => (
                          <div
                            key={subService.id}
                            className="bg-white border border-gray-200 rounded-lg p-3"
                          >
                            <div className="grid grid-cols-12 gap-2 items-start">
                              <div className="col-span-5">
                                <label className="block text-xs text-gray-500 mb-1">Option Name</label>
                                <input
                                  type="text"
                                  value={subService.name}
                                  onChange={(e) =>
                                    updateSubService(service.id, subService.id, "name", e.target.value)
                                  }
                                  placeholder="e.g. 3-Seater"
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              <div className="col-span-3">
                                <label className="block text-xs text-gray-500 mb-1">Price (AED)</label>
                                <input
                                  type="number"
                                  value={subService.price}
                                  onChange={(e) =>
                                    updateSubService(service.id, subService.id, "price", e.target.value)
                                  }
                                  placeholder="0.00"
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              <div className="col-span-3">
                                <label className="block text-xs text-gray-500 mb-1">Duration (Min)</label>
                                <input
                                  type="number"
                                  value={subService.duration}
                                  onChange={(e) =>
                                    updateSubService(service.id, subService.id, "duration", e.target.value)
                                  }
                                  placeholder="30"
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              <div className="col-span-1 flex items-end justify-center pb-1">
                                {service.subServices.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeSubService(service.id, subService.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="mt-2">
                              <input
                                type="text"
                                value={subService.description}
                                onChange={(e) =>
                                  updateSubService(service.id, subService.id, "description", e.target.value)
                                }
                                placeholder="Short description for this option (optional)"
                                className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Step 4 - Service Areas
  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Service Areas</h3>
        <p className="text-sm text-gray-500">Which neighborhoods do you cover?</p>
      </div>

      {serviceAreasLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-gray-500">Loading service areas...</span>
        </div>
      ) : serviceAreas.length === 0 ? (
        <p className="text-sm text-gray-500 py-4">No service areas available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {serviceAreas.map((area) => (
            <label key={area.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.selectedServiceAreas.includes(area.id)}
                onChange={() => toggleServiceArea(area.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{area.name}</span>
            </label>
          ))}
        </div>
      )}
      {fieldErrors.selectedServiceAreas && (
        <p className="text-xs text-red-500 mt-2">{fieldErrors.selectedServiceAreas}</p>
      )}
    </div>
  );

  // Step 5 - Legal & Bank
  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Legal & Financial</h3>
        <p className="text-sm text-gray-500">Verify your business and set up payouts.</p>
      </div>

      {/* Documents Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Documents</h4>
        <div className="grid grid-cols-2 gap-3">
          {/* Trade License */}
          <div
            className={`border-2 border-dashed rounded-lg p-3 text-center ${
              fieldErrors.tradeLicenseFile ? "border-red-400" : "border-gray-300"
            }`}
          >
            <FileText className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-900">Trade License</p>
            <p className="text-[10px] text-gray-500 mb-1">PDF/JPG (Required)</p>
            {formData.tradeLicenseFile ? (
              <p className="text-xs text-green-600 truncate">{formData.tradeLicenseFile.name}</p>
            ) : (
              <button
                type="button"
                onClick={() => tradeLicenseInputRef.current?.click()}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Upload
              </button>
            )}
            <input
              ref={tradeLicenseInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, "tradeLicenseFile")}
              className="hidden"
            />
          </div>

          {/* VAT Certificate */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
            <FileText className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-900">VAT Certificate</p>
            <p className="text-[10px] text-gray-500 mb-1">PDF/JPG (Optional)</p>
            {formData.vatCertificateFile ? (
              <p className="text-xs text-green-600 truncate">{formData.vatCertificateFile.name}</p>
            ) : (
              <button
                type="button"
                onClick={() => vatCertificateInputRef.current?.click()}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Upload
              </button>
            )}
            <input
              ref={vatCertificateInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, "vatCertificateFile")}
              className="hidden"
            />
          </div>
        </div>
        {fieldErrors.tradeLicenseFile && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.tradeLicenseFile}</p>
        )}
      </div>

      {/* Bank Details Section */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Bank Account (for payouts)</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => updateFormData("bankName", e.target.value)}
                placeholder="Emirates NBD"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.bankName
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              />
              {fieldErrors.bankName && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.bankName}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Account Holder</label>
              <input
                type="text"
                value={formData.accountHolderName}
                onChange={(e) => updateFormData("accountHolderName", e.target.value)}
                placeholder="Company Name LLC"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                  fieldErrors.accountHolderName
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              />
              {fieldErrors.accountHolderName && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.accountHolderName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">IBAN</label>
            <input
              type="text"
              value={formData.iban}
              onChange={(e) => updateFormData("iban", e.target.value)}
              placeholder="AE00 0000 0000 0000 0000 000"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                fieldErrors.iban
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
            {fieldErrors.iban && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.iban}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">SWIFT Code</label>
              <input
                type="text"
                value={formData.swiftCode}
                onChange={(e) => updateFormData("swiftCode", e.target.value)}
                placeholder="EABORXX"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">TRN (Tax Reg. No.)</label>
              <input
                type="text"
                value={formData.trn}
                onChange={(e) => updateFormData("trn", e.target.value)}
                placeholder="100000000000000"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return {
    renderStep0,
    renderStep1,
    renderStep2,
    renderStep3,
    renderStep4,
    renderStep5,
  };
}
