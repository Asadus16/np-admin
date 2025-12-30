"use client";

import { useState } from "react";
import { User, Mail, Phone, CreditCard, Shield, Save, Upload } from "lucide-react";

// Static user data
const userData = {
  firstName: "Ahmed",
  lastName: "Al Maktoum",
  email: "ahmed.maktoum@email.com",
  phone: "+971 50 123 4567",
  nationality: "United Arab Emirates",
  emiratesId: "784-1990-1234567-1",
  avatar: null,
};

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

export default function CustomerSettingsPage() {
  const [formData, setFormData] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Static - just toggle editing off
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
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
              onClick={() => {
                setFormData(userData);
                setIsEditing(false);
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Profile Photo */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-medium">
              {formData.firstName[0]}{formData.lastName[0]}
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
              {isEditing && (
                <p className="text-xs text-amber-600 mt-1">Changing email requires verification</p>
              )}
            </div>
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
              {isEditing && (
                <p className="text-xs text-amber-600 mt-1">Changing phone requires OTP verification</p>
              )}
            </div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Emirates ID</label>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 border-dashed rounded-lg hover:bg-gray-50">
                  Front Side
                </button>
                <button className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 border-dashed rounded-lg hover:bg-gray-50">
                  Back Side
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm text-green-800">Emirates ID Verified</span>
          </div>
        </div>
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
          href="/customer/settings/billing"
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              <Mail className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Billing Information</p>
              <p className="text-xs text-gray-500">Manage billing address & invoices</p>
            </div>
          </div>
          <span className="text-gray-400">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
