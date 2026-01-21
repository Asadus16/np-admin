"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Phone, Mail, Calendar, Briefcase, Loader2, Ban, UserCheck, ClipboardList, MessageSquare, Award, Wrench, CreditCard } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Technician {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  emirates_id: string | null;
  status: "active" | "suspended";
  vendor: {
    id: string;
    name: string;
  } | null;
  jobs_count: number;
  rating: number;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  created_at: string;
}

export default function TechnicianDetailPage() {
  const params = useParams();
  const { token } = useAuth();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTechnician = async () => {
    if (!token || !params.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: Technician }>(
        `/admin/technicians/${params.id}`,
        token
      );
      setTechnician(response.data);
    } catch (err) {
      console.error("Failed to fetch technician:", err);
      setError("Failed to load technician details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnician();
  }, [token, params.id]);

  const handleSuspend = async () => {
    if (!token || !technician) return;

    setActionLoading(true);
    try {
      await api.post(`/admin/technicians/${technician.id}/suspend`, {}, token);
      setTechnician((prev) => (prev ? { ...prev, status: "suspended" } : null));
    } catch (err) {
      console.error("Failed to suspend technician:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    if (!token || !technician) return;

    setActionLoading(true);
    try {
      await api.post(`/admin/technicians/${technician.id}/unsuspend`, {}, token);
      setTechnician((prev) => (prev ? { ...prev, status: "active" } : null));
    } catch (err) {
      console.error("Failed to unsuspend technician:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Loading technician details...</p>
        </div>
      </div>
    );
  }

  if (error || !technician) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/technicians"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Technician Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
          {error || "Technician not found"}
          <button onClick={fetchTechnician} className="ml-2 underline hover:no-underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/technicians"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{technician.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Technician</p>
          </div>
        </div>
        <div>
          {technician.status === "active" ? (
            <button
              onClick={handleSuspend}
              disabled={actionLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Ban className="h-4 w-4 mr-2" />
              )}
              Suspend Technician
            </button>
          ) : (
            <button
              onClick={handleUnsuspend}
              disabled={actionLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="h-4 w-4 mr-2" />
              )}
              Unsuspend Technician
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards - Placeholders for future data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-gray-300" />
            <span className="text-2xl font-semibold text-gray-300">-</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Average Rating</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-300">-</div>
          <p className="text-sm text-gray-500 mt-1">Total Jobs</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-300">-</div>
          <p className="text-sm text-gray-500 mt-1">Completed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-300">-</div>
          <p className="text-sm text-gray-500 mt-1">Completion Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information - Dynamic */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{technician.email}</span>
                {technician.email_verified_at && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{technician.phone || "-"}</span>
                {technician.phone_verified_at && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{technician.emirates_id || "-"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-gray-400" />
                {technician.vendor ? (
                  <Link href={`/admin/vendors/${technician.vendor.id}`} className="text-sm text-gray-900 hover:underline">
                    {technician.vendor.name}
                  </Link>
                ) : (
                  <span className="text-sm text-gray-400">No vendor assigned</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">Joined {technician.created_at}</span>
              </div>
            </div>
          </div>

          {/* Recent Jobs - Placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Jobs</h2>
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <ClipboardList className="h-12 w-12 mb-3" />
              <p className="text-sm">No jobs data available yet</p>
              <p className="text-xs text-gray-400 mt-1">Jobs will appear here once the feature is implemented</p>
            </div>
          </div>

          {/* Recent Reviews - Placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Reviews</h2>
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <MessageSquare className="h-12 w-12 mb-3" />
              <p className="text-sm">No reviews available yet</p>
              <p className="text-xs text-gray-400 mt-1">Reviews will appear here once the feature is implemented</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status - Dynamic */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
              technician.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {technician.status.charAt(0).toUpperCase() + technician.status.slice(1)}
            </span>
          </div>

          {/* Certifications - Placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Certifications</h2>
            <div className="flex flex-col items-center justify-center py-6 text-gray-400">
              <Award className="h-10 w-10 mb-2" />
              <p className="text-sm">No certifications added</p>
            </div>
          </div>

          {/* Specializations - Placeholder */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Specializations</h2>
            <div className="flex flex-col items-center justify-center py-6 text-gray-400">
              <Wrench className="h-10 w-10 mb-2" />
              <p className="text-sm">No specializations added</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
