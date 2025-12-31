"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreHorizontal, Tag, Calendar, Users, Percent, Copy, CheckCircle, XCircle } from "lucide-react";

const coupons = [
  { id: "COUP-001", code: "WELCOME20", name: "Welcome Discount", type: "percentage", value: 20, minOrder: 100, maxDiscount: 50, usageLimit: 1000, usedCount: 245, validFrom: "2024-12-01", validTo: "2024-12-31", status: "active", categories: ["All"], vendors: ["All"] },
  { id: "COUP-002", code: "FLAT50", name: "Flat 50 Off", type: "fixed", value: 50, minOrder: 200, maxDiscount: null, usageLimit: 500, usedCount: 123, validFrom: "2024-12-15", validTo: "2025-01-15", status: "active", categories: ["Plumbing", "Electrical"], vendors: ["All"] },
  { id: "COUP-003", code: "VIP25", name: "VIP Members", type: "percentage", value: 25, minOrder: 150, maxDiscount: 100, usageLimit: null, usedCount: 89, validFrom: "2024-11-01", validTo: "2025-03-31", status: "active", categories: ["All"], vendors: ["All"] },
  { id: "COUP-004", code: "SUMMER10", name: "Summer Sale", type: "percentage", value: 10, minOrder: 50, maxDiscount: 30, usageLimit: 2000, usedCount: 1847, validFrom: "2024-06-01", validTo: "2024-08-31", status: "expired", categories: ["HVAC", "Cleaning"], vendors: ["All"] },
  { id: "COUP-005", code: "QUICKFIX", name: "Quick Fix Special", type: "fixed", value: 30, minOrder: 100, maxDiscount: null, usageLimit: 300, usedCount: 0, validFrom: "2025-01-01", validTo: "2025-01-31", status: "scheduled", categories: ["Plumbing"], vendors: ["Quick Fix Plumbing"] },
  { id: "COUP-006", code: "HOLIDAY15", name: "Holiday Special", type: "percentage", value: 15, minOrder: 75, maxDiscount: 40, usageLimit: 1500, usedCount: 892, validFrom: "2024-12-20", validTo: "2024-12-26", status: "expired", categories: ["All"], vendors: ["All"] },
  { id: "COUP-007", code: "NEWUSER", name: "New User Offer", type: "percentage", value: 30, minOrder: 0, maxDiscount: 75, usageLimit: null, usedCount: 567, validFrom: "2024-01-01", validTo: "2025-12-31", status: "active", categories: ["All"], vendors: ["All"] },
  { id: "COUP-008", code: "TEST50", name: "Test Coupon", type: "fixed", value: 50, minOrder: 100, maxDiscount: null, usageLimit: 10, usedCount: 3, validFrom: "2024-12-01", validTo: "2024-12-31", status: "disabled", categories: ["All"], vendors: ["All"] },
];

const stats = {
  active: 4,
  expired: 2,
  scheduled: 1,
  totalRedemptions: 3766,
  totalSavings: 45230,
};

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || coupon.status === statusFilter;
    const matchesType = typeFilter === "all" || coupon.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "expired": return "bg-gray-100 text-gray-600";
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "disabled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-500">Scheduled</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.scheduled}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-500">Redemptions</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.totalRedemptions.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-500">Total Savings</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">${stats.totalSavings.toLocaleString()}</p>
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
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
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
              {filteredCoupons.map((coupon) => (
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
                      {coupon.type === "percentage" ? (
                        <>
                          <Percent className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{coupon.value}%</span>
                        </>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">${coupon.value}</span>
                      )}
                      {coupon.maxDiscount && (
                        <span className="text-xs text-gray-500">(max ${coupon.maxDiscount})</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {coupon.minOrder > 0 ? `$${coupon.minOrder}` : "None"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {coupon.validFrom} - {coupon.validTo}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(coupon.status)}`}>
                      {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
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
                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <Link
                          href={`/admin/coupons/${coupon.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/admin/coupons/${coupon.id}/edit`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </Link>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Duplicate
                        </button>
                        {coupon.status === "active" ? (
                          <button className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-50">
                            Disable
                          </button>
                        ) : coupon.status === "disabled" ? (
                          <button className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-50">
                            Enable
                          </button>
                        ) : null}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCoupons.length === 0 && (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No coupons found</p>
            <Link href="/admin/coupons/add" className="text-sm text-gray-900 hover:underline mt-2 inline-block">
              Create your first coupon
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredCoupons.length} of {coupons.length} coupons
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
