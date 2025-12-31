"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Download, Eye, CheckCircle, XCircle, Clock, AlertTriangle, MoreHorizontal } from "lucide-react";

const refunds = [
  { id: "REF-001", orderId: "ORD-1234", customer: "John Smith", vendor: "Quick Fix Plumbing", amount: 150, type: "partial", reason: "Service incomplete", status: "pending", requestedAt: "2024-12-28 10:30 AM", processedAt: null },
  { id: "REF-002", orderId: "ORD-1230", customer: "Robert Wilson", vendor: "Green Thumb Gardens", amount: 280, type: "full", reason: "Order cancelled", status: "approved", requestedAt: "2024-12-27 2:00 PM", processedAt: "2024-12-27 4:30 PM" },
  { id: "REF-003", orderId: "ORD-1225", customer: "Emma Thompson", vendor: "Spark Electric Co", amount: 75, type: "partial", reason: "Quality issue", status: "pending", requestedAt: "2024-12-27 9:00 AM", processedAt: null },
  { id: "REF-004", orderId: "ORD-1220", customer: "David Lee", vendor: "Cool Air HVAC", amount: 450, type: "full", reason: "Vendor no show", status: "processing", requestedAt: "2024-12-26 3:00 PM", processedAt: null },
  { id: "REF-005", orderId: "ORD-1218", customer: "Sarah Johnson", vendor: "Clean Pro Services", amount: 50, type: "partial", reason: "Customer request", status: "rejected", requestedAt: "2024-12-26 11:00 AM", processedAt: "2024-12-26 2:00 PM" },
  { id: "REF-006", orderId: "ORD-1215", customer: "Michael Brown", vendor: "Quick Fix Plumbing", amount: 200, type: "full", reason: "Service not rendered", status: "approved", requestedAt: "2024-12-25 10:00 AM", processedAt: "2024-12-25 12:30 PM" },
  { id: "REF-007", orderId: "ORD-1210", customer: "Lisa White", vendor: "Spark Electric Co", amount: 100, type: "partial", reason: "Overcharge", status: "approved", requestedAt: "2024-12-24 4:00 PM", processedAt: "2024-12-24 6:00 PM" },
  { id: "REF-008", orderId: "ORD-1205", customer: "James Taylor", vendor: "Green Thumb Gardens", amount: 180, type: "full", reason: "Duplicate order", status: "approved", requestedAt: "2024-12-24 9:00 AM", processedAt: "2024-12-24 10:30 AM" },
];

const stats = {
  pending: 2,
  processing: 1,
  approved: 4,
  rejected: 1,
  totalAmount: 1485,
  thisMonth: 8,
};

export default function RefundsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRefunds, setSelectedRefunds] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const filteredRefunds = refunds.filter((refund) => {
    const matchesSearch =
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || refund.status === statusFilter;
    const matchesType = typeFilter === "all" || refund.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-3 w-3" />;
      case "pending": return <Clock className="h-3 w-3" />;
      case "processing": return <Clock className="h-3 w-3" />;
      case "rejected": return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const toggleSelectAll = () => {
    if (selectedRefunds.length === filteredRefunds.length) {
      setSelectedRefunds([]);
    } else {
      setSelectedRefunds(filteredRefunds.map(r => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedRefunds.includes(id)) {
      setSelectedRefunds(selectedRefunds.filter(r => r !== id));
    } else {
      setSelectedRefunds([...selectedRefunds, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Refunds & Disputes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage refund requests and disputes</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-gray-500">Pending</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-500">Processing</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.processing}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-500">Approved</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.approved}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-gray-500">Rejected</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.rejected}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-500">Total Amount</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">${stats.totalAmount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">This Month</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.thisMonth}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search refunds..."
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
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Types</option>
            <option value="full">Full Refund</option>
            <option value="partial">Partial Refund</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRefunds.length > 0 && (
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-gray-700">{selectedRefunds.length} refund(s) selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200">
              Approve Selected
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200">
              Reject Selected
            </button>
          </div>
        </div>
      )}

      {/* Refunds Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRefunds.length === filteredRefunds.length && filteredRefunds.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Refund ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Order</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Customer</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Vendor</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Reason</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Requested</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRefunds.map((refund) => (
                <tr key={refund.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRefunds.includes(refund.id)}
                      onChange={() => toggleSelect(refund.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{refund.id}</td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/admin/orders/${refund.orderId}`} className="text-gray-600 hover:text-gray-900 hover:underline">
                      {refund.orderId}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{refund.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{refund.vendor}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">${refund.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                      refund.type === "full" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700"
                    }`}>
                      {refund.type.charAt(0).toUpperCase() + refund.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{refund.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(refund.status)}`}>
                      {getStatusIcon(refund.status)}
                      {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{refund.requestedAt}</td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === refund.id ? null : refund.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </button>
                    {showActionMenu === refund.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <Link
                          href={`/admin/refunds/${refund.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                        {refund.status === "pending" && (
                          <>
                            <button className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-50">
                              Approve
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-50">
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredRefunds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No refunds found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredRefunds.length} of {refunds.length} refunds
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
