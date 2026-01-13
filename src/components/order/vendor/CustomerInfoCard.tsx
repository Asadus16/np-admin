"use client";

import dynamic from "next/dynamic";
import { User, Phone, Mail, MapPin } from "lucide-react";
import { CustomerInfoCardProps } from "./types";

const StaticLeafletMap = dynamic(
  () => import("@/components/maps/StaticLeafletMap"),
  { ssr: false, loading: () => <div className="h-50 bg-gray-100 animate-pulse rounded-lg" /> }
);

export function CustomerInfoCard({ customer, address }: CustomerInfoCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Phone className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <a
              href={`tel:${customer.phone}`}
              className="text-sm font-medium text-gray-900 hover:underline"
            >
              {customer.phone}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Mail className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <a
              href={`mailto:${customer.email}`}
              className="text-sm font-medium text-gray-900 hover:underline"
            >
              {customer.email}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <MapPin className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Address</p>
            <p className="text-sm font-medium text-gray-900">
              {address.street_address}
              {address.building && `, ${address.building}`}
              {address.apartment && ` - ${address.apartment}`}
            </p>
            <p className="text-xs text-gray-500">
              {address.city}, {address.emirate}
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      {address.latitude && address.longitude && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Location</p>
          <div className="h-50 rounded-lg overflow-hidden border border-gray-200">
            <StaticLeafletMap
              latitude={address.latitude}
              longitude={address.longitude}
            />
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Get directions
          </a>
        </div>
      )}
    </div>
  );
}
