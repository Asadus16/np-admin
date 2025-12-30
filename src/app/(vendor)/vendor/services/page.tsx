"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Plus, Package, MoreVertical, DollarSign, Clock, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { getServices, deleteService } from "@/lib/service";
import { Service } from "@/types/service";
import { ApiException } from "@/lib/auth";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getServices(page, 15);
      setServices(response.data);
      setPagination({
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
      });
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError("Failed to load services");
      }
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service? This will also delete all associated sub-services.")) {
      return;
    }

    try {
      setIsDeleting(serviceId);
      await deleteService(serviceId);
      await fetchServices();
      setOpenMenu(null);
    } catch (err) {
      if (err instanceof ApiException) {
        alert(err.message);
      } else {
        alert("Failed to delete service");
      }
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeServices = services.filter((s) => s.status).length;
  const totalSubServices = services.reduce((sum, s) => sum + (s.sub_services?.length || 0), 0);

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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">{pagination.total}</p>
          <p className="text-sm text-gray-500">Total Services</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">{activeServices}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">{totalSubServices}</p>
          <p className="text-sm text-gray-500">Sub-Services</p>
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredServices.map((service) => {
                const subServicesCount = service.sub_services?.length || 0;
                const minPrice = service.sub_services?.length
                  ? Math.min(...service.sub_services.map((ss) => parseFloat(ss.price)))
                  : null;
                const maxDuration = service.sub_services?.length
                  ? Math.max(...service.sub_services.map((ss) => ss.duration))
                  : null;

                return (
                  <div
                    key={service.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Link
                        href={`/vendor/services/${service.id}`}
                        className="flex items-center gap-3 flex-1"
                      >
                        {service.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Package className="h-5 w-5 text-gray-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              service.status
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {service.status ? "Active" : "Inactive"}
                            </span>
                          </div>
                          {service.description && (
                            <p className="text-xs text-gray-500 line-clamp-2">{service.description}</p>
                          )}
                        </div>
                      </Link>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(openMenu === service.id ? null : service.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          disabled={isDeleting === service.id}
                        >
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                        {openMenu === service.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                            <div className="absolute right-0 z-50 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                              <Link
                                href={`/vendor/services/${service.id}`}
                                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setOpenMenu(null)}
                              >
                                <Eye className="h-4 w-4 mr-2" /> View & Manage
                              </Link>
                              <Link
                                href={`/vendor/services/${service.id}/edit`}
                                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setOpenMenu(null)}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit Service
                              </Link>
                              <button
                                onClick={() => handleDelete(service.id)}
                                disabled={isDeleting === service.id}
                                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                              >
                                {isDeleting === service.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 mr-2" />
                                )}
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {service.category && (
                      <p className="text-xs text-gray-400 mb-2">Category: {service.category.name}</p>
                    )}
                    {subServicesCount > 0 && (
                      <div className="flex items-center justify-between text-sm mb-2">
                        {minPrice !== null && (
                          <span className="flex items-center gap-1 text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            From ${minPrice.toFixed(2)}
                          </span>
                        )}
                        {maxDuration !== null && (
                          <span className="flex items-center gap-1 text-gray-600">
                            <Clock className="h-4 w-4" />
                            Up to {maxDuration} min
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400">{subServicesCount} sub-service{subServicesCount !== 1 ? 's' : ''}</p>
                      <Link
                        href={`/vendor/services/${service.id}`}
                        className="text-xs text-blue-600 font-medium hover:text-blue-700"
                      >
                        Manage sub-services →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredServices.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No services found</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {pagination.current_page} of {pagination.last_page} pages
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                    disabled={page === pagination.last_page}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
