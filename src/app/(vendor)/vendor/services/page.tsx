"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Package, MoreVertical, DollarSign, Clock, Eye, Edit, Trash2 } from "lucide-react";

const services = [
  { id: 1, name: "Plumbing Repair", description: "General plumbing repairs and fixes", price: 85, duration: 60, bookings: 45, status: "active" },
  { id: 2, name: "Drain Cleaning", description: "Professional drain and sewer cleaning", price: 120, duration: 90, bookings: 32, status: "active" },
  { id: 3, name: "Water Heater Install", description: "Installation of new water heaters", price: 350, duration: 180, bookings: 12, status: "active" },
  { id: 4, name: "Pipe Inspection", description: "Camera inspection of pipes and drains", price: 150, duration: 45, bookings: 28, status: "inactive" },
  { id: 5, name: "Faucet Replacement", description: "Replace old faucets with new ones", price: 95, duration: 45, bookings: 38, status: "active" },
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Service Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the services you offer</p>
        </div>
        <Link
          href="/vendor/services/add"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">{services.length}</p>
          <p className="text-sm text-gray-500">Total Services</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">
            {services.filter((s) => s.status === "active").length}
          </p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">
            {services.reduce((sum, s) => sum + s.bookings, 0)}
          </p>
          <p className="text-sm text-gray-500">Total Bookings</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredServices.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Package className="h-5 w-5 text-gray-600" />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === service.id ? null : service.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                  {openMenu === service.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-0 z-50 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <Eye className="h-4 w-4 mr-2" /> View
                        </button>
                        <Link
                          href={`/vendor/services/${service.id}/edit`}
                          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Link>
                        <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  service.status === "active"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {service.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{service.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  ${service.price}
                </span>
                <span className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  {service.duration} min
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{service.bookings} bookings</p>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No services found</p>
          </div>
        )}
      </div>
    </div>
  );
}
