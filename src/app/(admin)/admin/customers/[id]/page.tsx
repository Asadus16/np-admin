"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  CreditCard,
  CheckCircle,
  XCircle,
  Ban,
  UserCheck,
  Loader2,
  Star,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const MapComponent = dynamic(() => import("@/components/maps/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-lg">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
    </div>
  ),
});

interface Address {
  id: number;
  label: string;
  street_address: string;
  building: string | null;
  apartment: string | null;
  city: string | null;
  emirate: string | null;
  latitude: number | null;
  longitude: number | null;
  is_primary: boolean;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  nationality: string | null;
  emirates_id: string | null;
  emirates_id_front: string | null;
  emirates_id_back: string | null;
  status: "active" | "suspended";
  email_verified_at: string | null;
  phone_verified_at: string | null;
  created_at: string;
  addresses: Address[];
  addresses_count: number;
  payment_methods_count: number;
  orders_count: number;
  total_spent: string;
  rating: number;
  reviews_count: number;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const { token } = useAuth();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const customerId = params.id as string;

  const fetchCustomer = async () => {
    if (!token || !customerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: Customer }>(
        `/admin/customers/${customerId}`,
        token
      );
      setCustomer(response.data);
    } catch (err) {
      console.error("Failed to fetch customer:", err);
      setError("Failed to load customer details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [token, customerId]);

  const handleSuspend = async () => {
    if (!token || !customer) return;

    setActionLoading(true);
    try {
      await api.post(`/admin/customers/${customer.id}/suspend`, {}, token);
      setCustomer((prev) => (prev ? { ...prev, status: "suspended" } : null));
    } catch (err) {
      console.error("Failed to suspend customer:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    if (!token || !customer) return;

    setActionLoading(true);
    try {
      await api.post(`/admin/customers/${customer.id}/unsuspend`, {}, token);
      setCustomer((prev) => (prev ? { ...prev, status: "active" } : null));
    } catch (err) {
      console.error("Failed to unsuspend customer:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const primaryAddress =
    customer?.addresses?.find((a) => a.is_primary) || customer?.addresses?.[0];
  const hasLocation = primaryAddress?.latitude && primaryAddress?.longitude;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/customers"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Customers
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
          {error || "Customer not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/customers"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
            <p className="text-sm text-gray-500">Customer since {customer.created_at}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
              customer.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
          </span>
          {customer.status === "active" ? (
            <button
              onClick={handleSuspend}
              disabled={actionLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Ban className="h-4 w-4 mr-2" />
              )}
              Suspend
            </button>
          ) : (
            <button
              onClick={handleUnsuspend}
              disabled={actionLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <UserCheck className="h-4 w-4 mr-2" />
              )}
              Unsuspend
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{customer.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {customer.email_verified_at ? (
                      <span className="inline-flex items-center text-xs text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-gray-400">
                        <XCircle className="h-3 w-3 mr-1" /> Not verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{customer.phone || "-"}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {customer.phone_verified_at ? (
                      <span className="inline-flex items-center text-xs text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-gray-400">
                        <XCircle className="h-3 w-3 mr-1" /> Not verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="text-sm font-medium text-gray-900">
                    {customer.nationality || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="text-sm font-medium text-gray-900">{customer.created_at}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emirates ID */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Emirates ID</h2>
            <div className="flex items-start gap-3 mb-4">
              <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">ID Number</p>
                <p className="text-sm font-medium text-gray-900">
                  {customer.emirates_id || "Not provided"}
                </p>
              </div>
            </div>
            {(customer.emirates_id_front || customer.emirates_id_back) && (
              <div className="grid grid-cols-2 gap-4">
                {customer.emirates_id_front && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Front</p>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={customer.emirates_id_front}
                        alt="Emirates ID Front"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                {customer.emirates_id_back && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Back</p>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={customer.emirates_id_back}
                        alt="Emirates ID Back"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Addresses */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Addresses</h2>
            {customer.addresses && customer.addresses.length > 0 ? (
              <div className="space-y-4">
                {customer.addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-4 border rounded-lg ${
                      address.is_primary ? "border-green-200 bg-green-50" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {address.label || "Address"}
                          </p>
                          {address.is_primary && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {[address.street_address, address.building, address.apartment]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {(address.city || address.emirate) && (
                          <p className="text-sm text-gray-500">
                            {[address.city, address.emirate].filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No addresses saved</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Location Map */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
            <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
              {hasLocation ? (
                <MapComponent
                  center={[Number(primaryAddress!.latitude), Number(primaryAddress!.longitude)]}
                  markerPosition={[Number(primaryAddress!.latitude), Number(primaryAddress!.longitude)]}
                  onLocationChange={() => {}}
                  triggerPan={0}
                />
              ) : (
                <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                  <p className="text-sm text-gray-500">No location data</p>
                </div>
              )}
            </div>
            {hasLocation && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                {Number(primaryAddress!.latitude).toFixed(6)}, {Number(primaryAddress!.longitude).toFixed(6)}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Orders</span>
                <span className="text-sm font-medium text-gray-900">{customer.orders_count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Spent</span>
                <span className="text-sm font-medium text-gray-900">{customer.total_spent}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Rating</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= Math.round(customer.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {(customer.rating || 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({customer.reviews_count || 0})
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Saved Addresses</span>
                <span className="text-sm font-medium text-gray-900">
                  {customer.addresses_count}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Payment Methods</span>
                <span className="text-sm font-medium text-gray-900">
                  {customer.payment_methods_count}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Verification</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email</span>
                {customer.email_verified_at ? (
                  <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    <XCircle className="h-3 w-3 mr-1" /> Pending
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phone</span>
                {customer.phone_verified_at ? (
                  <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    <XCircle className="h-3 w-3 mr-1" /> Pending
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Emirates ID</span>
                {customer.emirates_id ? (
                  <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    <CheckCircle className="h-3 w-3 mr-1" /> Provided
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    <XCircle className="h-3 w-3 mr-1" /> Not provided
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
