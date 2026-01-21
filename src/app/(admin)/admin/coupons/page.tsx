"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, MoreHorizontal, Tag, Calendar, Users, Percent, Copy, CheckCircle, XCircle, AlertCircle, Trash2, Edit2 } from "lucide-react";
import { getCoupons, deleteCoupon, patchCoupon } from "@/lib/coupon";
import { Coupon } from "@/types/coupon";
import { ApiException } from "@/lib/auth";
import { Button } from "@/components/ui/Button";

export default function CouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCoupons();
  }, [currentPage]);

  const loadCoupons = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCoupons(currentPage);
      setCoupons(response.data);
      setPaginationMeta(response.meta);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || "Failed to load coupons");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error loading coupons:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) {
      return;
    }

    setDeletingId(couponId);
    setError(null);
    try {
      await deleteCoupon(couponId);
      await loadCoupons();
      setShowActionMenu(null);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || "Failed to delete coupon");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error deleting coupon:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    setError(null);
    try {
      await patchCoupon(coupon.id, { status: !coupon.status });
      await loadCoupons();
      setShowActionMenu(null);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || "Failed to update coupon status");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error updating coupon:", err);
    }
  };

  const getCouponStatus = (coupon: Coupon): string => {
    if (!coupon.status) return "disabled";
    if (!coupon.validity) return "active";
    
    const validityDate = new Date(coupon.validity);
    const now = new Date();
    
    if (validityDate < now) return "expired";
    if (coupon.max_usage && coupon.used >= coupon.max_usage) return "expired";
    return "active";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "expired": return "bg-gray-100 text-gray-600";
      case "disabled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No expiry";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const couponStatus = getCouponStatus(coupon);
    const matchesStatus = statusFilter === "all" || couponStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: coupons.filter(c => getCouponStatus(c) === "active").length,
    expired: coupons.filter(c => getCouponStatus(c) === "expired").length,
    disabled: coupons.filter(c => getCouponStatus(c) === "disabled").length,
    totalRedemptions: coupons.reduce((sum, c) => sum + c.used, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">Manage discount codes and promotions</p>
        </div>
        <Link
          href="/admin/coupons/add"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.active}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Expired</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.expired}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm text-gray-500">Disabled</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.disabled}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-500">Redemptions</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.totalRedemptions.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="scheduled">Scheduled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Code</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Discount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Min Order</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Usage</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Validity</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                    Loading coupons...
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">No coupons found</p>
                    {!searchQuery && (
                      <Link href="/admin/coupons/add" className="text-sm text-gray-900 hover:underline mt-2 inline-block">
                        Create your first coupon
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const couponStatus = getCouponStatus(coupon);
                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-900">{coupon.code}</code>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Copy code"
                          >
                            {copiedCode === coupon.code ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{coupon.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Percent className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{coupon.discount}%</span>
                          {coupon.cap && (
                            <span className="text-xs text-gray-500">(max ${coupon.cap})</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {coupon.min_order ? `$${coupon.min_order}` : "None"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {coupon.used}{coupon.max_usage ? `/${coupon.max_usage}` : ""}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(coupon.validity)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(couponStatus)}`}>
                          {couponStatus.charAt(0).toUpperCase() + couponStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === coupon.id ? null : coupon.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                        {showActionMenu === coupon.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowActionMenu(null)} />
                            <div className="absolute right-0 z-50 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                              <Link
                                href={`/admin/coupons/${coupon.id}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setShowActionMenu(null)}
                              >
                                View Details
                              </Link>
                              <Link
                                href={`/admin/coupons/${coupon.id}/edit`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setShowActionMenu(null)}
                              >
                                <Edit2 className="h-3 w-3 inline mr-2" />
                                Edit
                              </Link>
                              {couponStatus === "active" ? (
                                <button
                                  onClick={() => handleToggleStatus(coupon)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-50"
                                >
                                  Disable
                                </button>
                              ) : couponStatus === "disabled" ? (
                                <button
                                  onClick={() => handleToggleStatus(coupon)}
                                  className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-50"
                                >
                                  Enable
                                </button>
                              ) : null}
                              <button
                                onClick={() => handleDelete(coupon.id)}
                                disabled={deletingId === coupon.id}
                                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-50 disabled:opacity-50 inline-flex items-center"
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                {deletingId === coupon.id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {paginationMeta && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {paginationMeta.from || 0} to {paginationMeta.to || 0} of {paginationMeta.total} coupons
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= paginationMeta.last_page || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
