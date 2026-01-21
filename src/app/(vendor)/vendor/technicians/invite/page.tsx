"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, User, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { inviteTechnician } from "@/lib/technician";
import { ApiException } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function InviteTechnicianPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    invitation_message: "You've been invited to join our team on NoProblem. Click the link below to create your account and get started.",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      await inviteTechnician({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        invitation_message: formData.invitation_message.trim() || undefined,
      });
      
      router.push("/vendor/technicians");
    } catch (err) {
      if (err instanceof ApiException) {
        if (err.errors) {
          // Convert API errors to field errors
          const errors: Record<string, string> = {};
          Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors![key][0] || "";
          });
          setFieldErrors(errors);
        } else {
          setError(err.message || "Failed to invite technician");
        }
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error inviting technician:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/technicians" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Invite Technician</h1>
          <p className="text-sm text-gray-500 mt-1">Send an invitation to join your team</p>
        </div>
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

      <div className="max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="John"
                error={fieldErrors.first_name}
                required
              />
              <Input
                label="Last Name"
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Doe"
                error={fieldErrors.last_name}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="technician@email.com"
              error={fieldErrors.email}
              required
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              error={fieldErrors.phone}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invitation Message (Optional)
              </label>
              <textarea
                rows={4}
                value={formData.invitation_message}
                onChange={(e) => setFormData({ ...formData, invitation_message: e.target.value })}
                placeholder="You've been invited to join our team on NoProblem. Click the link below to create your account and get started."
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 ${
                  fieldErrors.invitation_message
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-300"
                }`}
              />
              {fieldErrors.invitation_message && (
                <p className="mt-1.5 text-sm text-red-500">{fieldErrors.invitation_message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Link href="/vendor/technicians">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} variant="primary">
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
