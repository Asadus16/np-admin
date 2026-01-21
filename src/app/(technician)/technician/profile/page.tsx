"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Building2,
  Shield,
  CheckCircle,
  Loader2,
  Star,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { getUserFullName } from "@/types/auth";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { updateUser, refreshUser } from "@/store/slices/authSlice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { token } = useAuth();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    emirates_id: "",
  });

  // Refresh user data to get latest rating
  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        phone: user.phone || "",
        emirates_id: user.emirates_id || "",
      });
    }
  }, [user]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = async () => {
    if (!token) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await api.put<{ data: typeof user }>(
        "/technician/profile",
        {
          phone: formData.phone || null,
          emirates_id: formData.emirates_id || null,
        },
        token
      );

      // Update user in store
      if (response.data && user) {
        dispatch(updateUser({
          phone: formData.phone || null,
          emirates_id: formData.emirates_id || null,
        }));
      }

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setSaveError(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveError(null);
    if (user) {
      setFormData({
        phone: user.phone || "",
        emirates_id: user.emirates_id || "",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-500">Unable to load profile</p>
      </div>
    );
  }

  const fullName = getUserFullName(user);

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
            <h2 className="text-lg font-semibold text-gray-900 mt-4">{fullName}</h2>
            <p className="text-sm text-gray-500">Technician</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {user.email_verified_at && (
                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            {/* Rating */}
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Your Rating</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(user.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {(user.rating || 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({user.reviews_count || 0})
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(user.created_at)}</p>
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
                onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <User className="h-4 w-4 text-gray-400" />
                    {user.first_name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <User className="h-4 w-4 text-gray-400" />
                    {user.last_name}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      {user.phone || "Not set"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {user.email}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emirates ID (Optional)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.emirates_id}
                    onChange={(e) => setFormData({ ...formData, emirates_id: e.target.value })}
                    placeholder="784-XXXX-XXXXXXX-X"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    {user.emirates_id || "Not set"}
                  </div>
                )}
              </div>
              {saveError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Profile updated successfully
                </div>
              )}
              {isEditing && (
                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Vendor Information */}
          {user.company && (
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
                    <p className="text-sm font-medium text-gray-900">{user.company.name}</p>
                    <p className="text-sm text-gray-500">Your assigned company</p>
                  </div>
                </div>
              </div>
            </div>
          )}

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
