"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Building2,
  MapPin,
  Shield,
  Star,
  CheckCircle,
} from "lucide-react";

const technicianData = {
  name: "Ahmed Hassan",
  email: "ahmed.hassan@email.com",
  phone: "+971 50 123 4567",
  emiratesId: "784-1990-1234567-1",
  role: "Senior Technician",
  vendor: {
    name: "Quick Fix Plumbing",
    phone: "+971 50 987 6543",
  },
  joinedDate: "March 2023",
  rating: 4.8,
  totalJobs: 456,
  status: "verified",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: technicianData.name,
    phone: technicianData.phone,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your profile information</p>
        </div>
        <Link
          href="/technician/profile/security"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Shield className="h-4 w-4 inline mr-2" />
          Security Settings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mt-4">{technicianData.name}</h2>
            <p className="text-sm text-gray-500">{technicianData.role}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {technicianData.status === "verified" && (
                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="text-sm font-medium text-gray-900">{technicianData.rating} / 5.0</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Jobs Completed</p>
                <p className="text-sm font-medium text-gray-900">{technicianData.totalJobs}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-sm font-medium text-gray-900">{technicianData.joinedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <User className="h-4 w-4 text-gray-400" />
                      {technicianData.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {technicianData.phone}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {technicianData.email}
                  <span className="text-xs text-gray-500">(Contact admin to change)</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emirates ID</label>
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  {technicianData.emiratesId}
                </div>
              </div>
              {isEditing && (
                <div className="pt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Vendor Information */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Vendor Information</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{technicianData.vendor.name}</p>
                  <p className="text-sm text-gray-500">{technicianData.vendor.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-sm font-medium text-gray-900">{technicianData.role}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/technician/profile/security"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Change Password
              </Link>
              <Link
                href="/technician/messages"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Contact Vendor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
