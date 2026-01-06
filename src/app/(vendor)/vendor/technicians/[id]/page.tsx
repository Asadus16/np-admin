"use client";

import { use, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, User, Edit2, Save, X, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { getTechnician, updateTechnician } from "@/lib/technician";
import { Technician } from "@/types/technician";
import { ApiException } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function TechnicianDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  const [technician, setTechnician] = useState<Technician | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    loadTechnician();
  }, [id]);

  const loadTechnician = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Loading technician with ID:', id);
      const response = await getTechnician(id);
      console.log('Technician response:', response);
      setTechnician(response.data);
      setFormData({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        phone: response.data.phone || "",
      });
    } catch (err) {
      console.error("Error loading technician:", err);
      if (err instanceof ApiException) {
        setError(err.message || "Failed to load technician");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!technician) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    try {
      const response = await updateTechnician(technician.id, {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
      });

      setTechnician(response.data);
      setSuccess("Technician updated successfully");
      setIsEditing(false);
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.errors) {
          const errors: Record<string, string> = {};
          Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors![key][0] || "";
          });
          setFieldErrors(errors);
        } else {
          setError(err.message || "Failed to update technician");
        }
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error updating technician:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (technician) {
      setFormData({
        first_name: technician.first_name,
        last_name: technician.last_name,
        email: technician.email,
        phone: technician.phone || "",
      });
    }
    setIsEditing(false);
    setFieldErrors({});
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/vendor/technicians" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Technician Details</h1>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">Loading technician...</p>
        </div>
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/vendor/technicians" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Technician Not Found</h1>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">The technician you're looking for doesn't exist.</p>
          <Link href="/vendor/technicians">
            <Button variant="primary" className="mt-4">
              Back to Technicians
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    return `${technician.first_name[0]}${technician.last_name[0]}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/technicians" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Technician Details</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage technician information</p>
        </div>
        {!isEditing && (
          <div className="flex gap-2">
            <Link href={`/vendor/technicians/${id}/availability`}>
              <Button variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Availability
              </Button>
            </Link>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Success</p>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  error={fieldErrors.first_name}
                  required
                />
                <Input
                  label="Last Name"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  error={fieldErrors.last_name}
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={fieldErrors.email}
                required
              />

              <Input
                label="Phone Number (Optional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={fieldErrors.phone}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="primary"
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {getInitials()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {technician.first_name} {technician.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">Technician</p>
                </div>
                {technician.email_verified_at ? (
                  <span className="ml-auto px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                    Verified
                  </span>
                ) : (
                  <span className="ml-auto px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    Pending Verification
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{technician.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {technician.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Company</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{technician.company.name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Joined</label>
                  <p className="text-sm text-gray-900">
                    {new Date(technician.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
