"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Building2,
  Calendar,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

const payouts = [
  { id: "PAY-001", vendor: "Quick Fix Plumbing", vendorId: "VND-001", amount: 4250, orders: 18, period: "Dec 16-22, 2024", status: "pending", scheduledDate: "2024-12-29", paymentMethod: "Bank Transfer" },
  { id: "PAY-002", vendor: "Spark Electric Co", vendorId: "VND-002", amount: 3120, orders: 14, period: "Dec 16-22, 2024", status: "pending", scheduledDate: "2024-12-29", paymentMethod: "Bank Transfer" },
  { id: "PAY-003", vendor: "Cool Air HVAC", vendorId: "VND-003", amount: 5890, orders: 12, period: "Dec 16-22, 2024", status: "processing", scheduledDate: "2024-12-29", paymentMethod: "Bank Transfer" },
  { id: "PAY-004", vendor: "Clean Pro Services", vendorId: "VND-004", amount: 2180, orders: 22, period: "Dec 16-22, 2024", status: "pending", scheduledDate: "2024-12-29", paymentMethod: "Bank Transfer" },
  { id: "PAY-005", vendor: "Green Thumb Gardens", vendorId: "VND-005", amount: 1850, orders: 8, period: "Dec 16-22, 2024", status: "pending", scheduledDate: "2024-12-29", paymentMethod: "Bank Transfer" },
  { id: "PAY-006", vendor: "Quick Fix Plumbing", vendorId: "VND-001", amount: 3980, orders: 16, period: "Dec 9-15, 2024", status: "completed", scheduledDate: "2024-12-22", paymentMethod: "Bank Transfer", paidAt: "2024-12-22" },
  { id: "PAY-007", vendor: "Spark Electric Co", vendorId: "VND-002", amount: 2750, orders: 12, period: "Dec 9-15, 2024", status: "completed", scheduledDate: "2024-12-22", paymentMethod: "Bank Transfer", paidAt: "2024-12-22" },
  { id: "PAY-008", vendor: "Cool Air HVAC", vendorId: "VND-003", amount: 4520, orders: 10, period: "Dec 9-15, 2024", status: "completed", scheduledDate: "2024-12-22", paymentMethod: "Bank Transfer", paidAt: "2024-12-22" },
  { id: "PAY-009", vendor: "Home Care Plus", vendorId: "VND-006", amount: 1200, orders: 6, period: "Dec 16-22, 2024", status: "failed", scheduledDate: "2024-12-29", paymentMethod: "Bank Transfer", failureReason: "Invalid bank details" },
];

const stats = {
  pending: 17290,
  processing: 5890,
  completedThisMonth: 45670,
  totalVendors: 42,
  avgPayout: 3250,
  nextPayoutDate: "Dec 29, 2024",
};

export default function PayoutsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("current");
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
      payout.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-3 w-3" />;
      case "pending": return <Clock className="h-3 w-3" />;
      case "processing": return <Clock className="h-3 w-3" />;
      case "failed": return <AlertTriangle className="h-3 w-3" />;
      default: return null;
    }
  };

  const toggleSelectAll = () => {
    const pendingPayouts = filteredPayouts.filter(p => p.status === "pending");
    if (selectedPayouts.length === pendingPayouts.length) {
      setSelectedPayouts([]);
    } else {
      setSelectedPayouts(pendingPayouts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedPayouts.includes(id)) {
      setSelectedPayouts(selectedPayouts.filter(p => p !== id));
    } else {
      setSelectedPayouts([...selectedPayouts, id]);
    }
  };

  const pendingPayouts = filteredPayouts.filter(p => p.status === "pending");
  const totalSelected = selectedPayouts.reduce((sum, id) => {
    const payout = payouts.find(p => p.id === id);
    return sum + (payout?.amount || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payouts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage vendor payouts and disbursements</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
            <DollarSign className="h-4 w-4 mr-2" />
            Process Payouts
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-gray-500">Pending</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">${stats.pending.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-500">Processing</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">${stats.processing.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-500">Paid (Month)</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">${stats.completedThisMonth.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-500">Vendors</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{stats.totalVendors}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-500">Avg Payout</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900 mt-2">${stats.avgPayout.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-500">Next Payout</span>
          </div>
          <p className="text-lg font-semibold text-gray-900 mt-2">{stats.nextPayoutDate}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search payouts..."
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
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="current">Current Period</option>
            <option value="last">Last Period</option>
            <option value="all">All Periods</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPayouts.length > 0 && (
        <div className="bg-gray-900 text-white rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm">{selectedPayouts.length} payout(s) selected</span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm">Total: <span className="font-semibold">${totalSelected.toLocaleString()}</span></span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium bg-white text-gray-900 rounded-lg hover:bg-gray-100">
              Process Selected
            </button>
            <button
              onClick={() => setSelectedPayouts([])}
              className="px-4 py-2 text-sm font-medium text-white border border-white/30 rounded-lg hover:bg-white/10"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Payouts Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPayouts.length === pendingPayouts.length && pendingPayouts.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Payout ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Vendor</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Period</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Orders</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Method</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {payout.status === "pending" && (
                      <input
                        type="checkbox"
                        checked={selectedPayouts.includes(payout.id)}
                        onChange={() => toggleSelect(payout.id)}
                        className="rounded border-gray-300"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{payout.id}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/vendors/${payout.vendorId}`} className="text-sm text-gray-900 hover:underline">
                      {payout.vendor}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{payout.period}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{payout.orders}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">${payout.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{payout.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(payout.status)}`}>
                      {getStatusIcon(payout.status)}
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {payout.status === "completed" ? payout.paidAt : payout.scheduledDate}
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === payout.id ? null : payout.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </button>
                    {showActionMenu === payout.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <Link
                          href={`/admin/payouts/${payout.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/admin/vendors/${payout.vendorId}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          View Vendor
                        </Link>
                        {payout.status === "pending" && (
                          <button className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-gray-50">
                            Process Now
                          </button>
                        )}
                        {payout.status === "failed" && (
                          <button className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-gray-50">
                            Retry
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayouts.length === 0 && (
          <div className="text-center py-12">
            <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No payouts found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredPayouts.length} of {payouts.length} payouts
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
