"use client";

import { useState, useEffect, useRef } from "react";
import { User, Mail, Phone, CreditCard, Shield, Save, Upload, Loader2, AlertCircle, X, CheckCircle, MapPin } from "lucide-react";
import { getProfile, updateProfile, uploadEmiratesId, ProfileUpdateData } from "@/lib/profile";

const nationalities = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Egypt",
  "Jordan",
  "Lebanon",
  "India",
  "Pakistan",
  "Philippines",
  "United Kingdom",
  "United States",
  "Other",
];

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  emiratesId: string;
}

export default function CustomerSettingsPage() {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    emiratesId: "",
  });
  const [originalData, setOriginalData] = useState<ProfileFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emiratesIdVerified, setEmiratesIdVerified] = useState(false);

  // Emirates ID upload refs
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const [uploadingEmiratesId, setUploadingEmiratesId] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getProfile();
      const user = response.data;

      const profileData: ProfileFormData = {
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        nationality: user.nationality || "",
        emiratesId: user.emirates_id || "",
      };

      setFormData(profileData);
      setOriginalData(profileData);
      setPhoneVerified(!!user.phone_verified_at);
      setEmailVerified(!!user.email_verified_at);
      setEmiratesIdVerified(!!user.emirates_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const updateData: ProfileUpdateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        nationality: formData.nationality,
        emirates_id: formData.emiratesId,
      };

      // Only include email/phone if changed
      if (originalData && formData.email !== originalData.email) {
        updateData.email = formData.email;
      }
      if (originalData && formData.phone !== originalData.phone) {
        updateData.phone = formData.phone;
      }

      const response = await updateProfile(updateData);
      const user = response.data;

      const profileData: ProfileFormData = {
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        nationality: user.nationality || "",
        emiratesId: user.emirates_id || "",
      };

      setFormData(profileData);
      setOriginalData(profileData);
      setIsEditing(false);
      setSuccess("Profile updated successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
    }
    setIsEditing(false);
    setError(null);
  };

  const handleEmiratesIdUpload = async (side: "front" | "back") => {
    const input = side === "front" ? frontInputRef.current : backInputRef.current;
    if (!input) return;

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        setUploadingEmiratesId(true);
        setError(null);

        await uploadEmiratesId(
          side === "front" ? file : undefined,
          side === "back" ? file : undefined
        );

        setSuccess(`Emirates ID ${side} uploaded successfully`);
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload Emirates ID");
      } finally {
        setUploadingEmiratesId(false);
      }
    };

    input.click();
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
      {/* Hidden file inputs */}
      <input type="file" ref={frontInputRef} accept="image/*" className="hidden" />
      <input type="file" ref={backInputRef} accept="image/*" className="hidden" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Profile Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </button>
          </div>
        )}
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

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-700">{success}</p>
          <button onClick={() => setSuccess(null)} className="ml-auto text-green-500 hover:text-green-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Profile Photo */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-medium">
              {formData.firstName[0] || "?"}{formData.lastName[0] || "?"}
            </span>
          </div>
          {isEditing && (
            <div>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </button>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-gray-400" />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="">Select nationality</option>
              {nationalities.map((nat) => (
                <option key={nat} value={nat}>{nat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Mail className="h-5 w-5 mr-2 text-gray-400" />
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
              {emailVerified && !isEditing && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {isEditing && (
              <p className="text-xs text-amber-600 mt-1">Changing email requires verification</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
              {phoneVerified && !isEditing && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {isEditing && (
              <p className="text-xs text-amber-600 mt-1">Changing phone requires OTP verification</p>
            )}
          </div>
        </div>
      </div>

      {/* Emirates ID */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-gray-400" />
          Emirates ID
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emirates ID Number</label>
            <input
              type="text"
              name="emiratesId"
              value={formData.emiratesId}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="784-XXXX-XXXXXXX-X"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Emirates ID</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEmiratesIdUpload("front")}
                  disabled={uploadingEmiratesId}
                  className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 border-dashed rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploadingEmiratesId ? (
                    <Loader2 className="h-4 w-4 mx-auto animate-spin" />
                  ) : (
                    "Front Side"
                  )}
                </button>
                <button
                  onClick={() => handleEmiratesIdUpload("back")}
                  disabled={uploadingEmiratesId}
                  className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 border-dashed rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {uploadingEmiratesId ? (
                    <Loader2 className="h-4 w-4 mx-auto animate-spin" />
                  ) : (
                    "Back Side"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        {emiratesIdVerified && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800">Emirates ID Verified</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/customer/settings/payments"
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              <CreditCard className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Payment Methods</p>
              <p className="text-xs text-gray-500">Manage your saved cards</p>
            </div>
          </div>
          <span className="text-gray-400">&rarr;</span>
        </a>
        <a
          href="/customer/settings/addresses"
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              <MapPin className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Addresses</p>
              <p className="text-xs text-gray-500">Manage your saved addresses</p>
            </div>
          </div>
          <span className="text-gray-400">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
