"use client";

import { useState } from "react";
import { Heart, Star, MapPin, Phone, ShoppingCart, Search } from "lucide-react";

// Static favorite vendors data
const initialFavorites = [
  {
    id: "v1",
    name: "Quick Fix Plumbing",
    logo: "QF",
    category: "Plumbing",
    rating: 4.9,
    reviews: 128,
    totalOrders: 8,
    lastOrder: "Dec 28, 2024",
    location: "Dubai Marina",
    phone: "+971 50 555 1234",
    available: true,
  },
  {
    id: "v2",
    name: "Spark Electric Co",
    logo: "SE",
    category: "Electrical",
    rating: 4.8,
    reviews: 89,
    totalOrders: 5,
    lastOrder: "Dec 27, 2024",
    location: "Business Bay",
    phone: "+971 50 555 2345",
    available: true,
  },
  {
    id: "v3",
    name: "Cool Air HVAC",
    logo: "CA",
    category: "HVAC",
    rating: 4.7,
    reviews: 156,
    totalOrders: 4,
    lastOrder: "Dec 25, 2024",
    location: "JLT",
    phone: "+971 50 555 3456",
    available: true,
  },
  {
    id: "v4",
    name: "Green Clean Services",
    logo: "GC",
    category: "Cleaning",
    rating: 4.9,
    reviews: 234,
    totalOrders: 12,
    lastOrder: "Dec 24, 2024",
    location: "Downtown Dubai",
    phone: "+971 50 555 4567",
    available: true,
  },
  {
    id: "v5",
    name: "Pest Control Pro",
    logo: "PC",
    category: "Pest Control",
    rating: 4.6,
    reviews: 67,
    totalOrders: 2,
    lastOrder: "Nov 15, 2024",
    location: "Al Barsha",
    phone: "+971 50 555 5678",
    available: false,
  },
];

export default function FavoriteVendorsPage() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUnfavorite = (vendorId: string) => {
    setFavorites((prev) => prev.filter((v) => v.id !== vendorId));
  };

  const filteredFavorites = favorites.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Favorite Vendors</h1>
        <p className="text-sm text-gray-500 mt-1">Your saved vendors for quick access</p>
      </div>

      {/* Search */}
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

      {/* Favorites Grid */}
      {filteredFavorites.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery ? "No favorites match your search" : "No favorite vendors yet"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Heart vendors while browsing to save them here
          </p>
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
                    <span className="text-sm font-medium text-gray-600">{vendor.logo}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{vendor.name}</p>
                    <p className="text-sm text-gray-500">{vendor.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnfavorite(vendor.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove from favorites"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-600">
                    <Star className="h-4 w-4 fill-current mr-1" />
                    <span className="font-medium">{vendor.rating}</span>
                    <span className="text-gray-400 ml-1">({vendor.reviews})</span>
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

                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {vendor.location}
                </div>

                <div className="flex items-center text-gray-500">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  {vendor.totalOrders} orders • Last: {vendor.lastOrder}
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
                <a
                  href={`tel:${vendor.phone}`}
                  className="p-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Phone className="h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
        <p>
          <strong>Tip:</strong> Favorite vendors appear first when browsing categories, making it faster to book your trusted service providers.
        </p>
      </div>
    </div>
  );
}
