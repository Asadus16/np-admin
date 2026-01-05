"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  MapPin,
  Phone,
  Heart,
  ShoppingCart,
  Clock,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Vendor {
  id: string;
  name: string;
  description: string | null;
  logo: string;
  category: { id: string; name: string } | null;
  service_areas: { id: string; name: string }[];
  landline: string | null;
  is_favorite: boolean;
  rating: number;
  reviews_count: number;
  starting_price: number;
  response_time: string;
  available: boolean;
}

interface PaginatedResponse {
  data: Vendor[];
  current_page: number;
  last_page: number;
  total: number;
}

const sortOptions = [
  { value: "name", label: "Name A-Z" },
  { value: "newest", label: "Newest" },
];

export default function ExploreVendorsPage() {
  const { token } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      params.append("sort", sortBy);

      const response = await api.get<PaginatedResponse>(
        `/customer/vendors?${params.toString()}`,
        token
      );
      setVendors(response.data);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, searchQuery, sortBy]);

  useEffect(() => {
    const debounce = setTimeout(fetchVendors, 300);
    return () => clearTimeout(debounce);
  }, [fetchVendors]);

  const toggleFavorite = async (vendorId: string, isFavorite: boolean) => {
    if (!token || favoriteLoading) return;

    setFavoriteLoading(vendorId);
    try {
      if (isFavorite) {
        await api.delete(`/customer/vendors/${vendorId}/favorite`, token);
      } else {
        await api.post(`/customer/vendors/${vendorId}/favorite`, {}, token);
      }
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId ? { ...v, is_favorite: !isFavorite } : v
        )
      );
    } catch (err) {
      console.error("Failed to update favorite:", err);
    } finally {
      setFavoriteLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Explore Vendors
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Find trusted service providers in your area
          </p>
        </div>
        <Link
          href="/customer/vendors/favorites"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Heart className="h-4 w-4" />
          My Favorites
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : vendors.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No vendors found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try adjusting your search
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            {vendors.length} vendor{vendors.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {vendor.logo}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vendor.name}</p>
                      <p className="text-sm text-gray-500">
                        {vendor.category?.name || "General"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(vendor.id, vendor.is_favorite)}
                    disabled={favoriteLoading === vendor.id}
                    className={`p-2 rounded-lg transition-colors ${
                      vendor.is_favorite
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-400 hover:bg-gray-50 hover:text-red-500"
                    }`}
                  >
                    {favoriteLoading === vendor.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Heart
                        className={`h-5 w-5 ${vendor.is_favorite ? "fill-current" : ""}`}
                      />
                    )}
                  </button>
                </div>

                {vendor.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {vendor.description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-600">
                      <Star className="h-4 w-4 fill-current mr-1" />
                      <span className="font-medium">{vendor.rating}</span>
                      <span className="text-gray-400 ml-1">
                        ({vendor.reviews_count})
                      </span>
                    </div>
                    {vendor.available ? (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        Available
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        Unavailable
                      </span>
                    )}
                  </div>

                  {vendor.service_areas.length > 0 && (
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {vendor.service_areas.map((a) => a.name).join(", ")}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{vendor.response_time}</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      From AED {vendor.starting_price}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                  <button
                    disabled={!vendor.available}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg ${
                      vendor.available
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4 inline mr-1" />
                    Book Now
                  </button>
                  {vendor.landline && (
                    <a
                      href={`tel:${vendor.landline}`}
                      className="p-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Phone className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
