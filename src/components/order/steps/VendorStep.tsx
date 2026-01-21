"use client";

import { Star } from "lucide-react";
import { formatDistance } from "@/lib/customerVendor";
import { VendorStepProps } from "../types";

export function VendorStep({
  vendors,
  selectedVendor,
  onSelectVendor,
  formatCurrency,
}: VendorStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a Vendor</h2>
      <p className="text-sm text-gray-500 mb-4">Sorted by distance (nearest first)</p>
      {vendors.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No vendors available for this category</p>
      ) : (
        <div className="space-y-3">
          {vendors.map((vendor) => (
            <button
              key={vendor.id}
              onClick={() => {
                if (vendor.available) {
                  onSelectVendor(vendor.id);
                }
              }}
              disabled={!vendor.available}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                selectedVendor === vendor.id
                  ? "border-gray-900 bg-gray-50"
                  : vendor.available
                  ? "border-gray-200 hover:border-gray-300"
                  : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">{vendor.logo}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{vendor.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                        <span>{vendor.rating}</span>
                      </div>
                      <span>({vendor.reviews_count} reviews)</span>
                      {vendor.starting_price && (
                        <>
                          <span className="hidden sm:inline">|</span>
                          <span className="hidden sm:inline">From {formatCurrency(vendor.starting_price)}</span>
                        </>
                      )}
                    </div>
                    {vendor.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{vendor.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  {vendor.available ? (
                    <>
                      <span className="text-xs text-green-600 font-medium">Available</span>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatDistance(vendor.distance_km)}
                      </p>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">Unavailable</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
