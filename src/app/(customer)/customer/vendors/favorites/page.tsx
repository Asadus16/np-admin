"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Star, MapPin, Phone, ShoppingCart, Search, Loader2, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Vendor {
  id: string;
  name: string;
  description: string | null;
  logo: string;
  category: { id: string; name: string } | null;
  service_areas: { id: string; name: string }[];
  landline: string | null;
  rating: number;
  reviews_count: number;
  starting_price: number;
  response_time: string;
  available: boolean;
}

interface PaginatedResponse {
  data: Vendor[];
}

export default function FavoriteVendorsPage() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchFavorites = async () => {
      try {
        const response = await api.get<PaginatedResponse>(
          "/customer/vendors/favorites",
          token
        );
        setFavorites(response.data);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  const handleUnfavorite = async (vendorId: string) => {
    if (!token || removingId) return;

    setRemovingId(vendorId);
    try {
      await api.delete(`/customer/vendors/${vendorId}/favorite`, token);
      setFavorites((prev) => prev.filter((v) => v.id !== vendorId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    } finally {
      setRemovingId(null);
    }
  };

  const filteredFavorites = favorites.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/customer/vendors"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Favorite Vendors
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Your saved vendors for quick access
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search favorites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery ? "No favorites match your search" : "No favorite vendors yet"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Heart vendors while browsing to save them here
          </p>
          {!searchQuery && (
            <Link
              href="/customer/vendors"
              className="inline-block mt-4 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              Explore Vendors
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFavorites.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
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
                  onClick={() => handleUnfavorite(vendor.id)}
                  disabled={removingId === vendor.id}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  {removingId === vendor.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Heart className="h-5 w-5 fill-current" />
                  )}
                </button>
              </div>

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
                    <MapPin className="h-4 w-4 mr-1" />
                    {vendor.service_areas.map((a) => a.name).join(", ")}
                  </div>
                )}

                <div className="flex items-center text-gray-500">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  From AED {vendor.starting_price}
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
      )}
    </div>
  );
}
