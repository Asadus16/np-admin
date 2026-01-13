"use client";

import { Phone } from "lucide-react";
import { VendorInfoCardProps } from "./types";

export function VendorInfoCard({ vendor }: VendorInfoCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-lg font-medium text-gray-600">{vendor.logo}</span>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">{vendor.name}</p>
            <p className="text-sm text-gray-500">Vendor</p>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <Phone className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
