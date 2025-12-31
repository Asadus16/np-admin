"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Download, Eye, Calendar } from "lucide-react";

const orders = [
  { id: "ORD-1234", txnId: "TXN-5678", customer: "John Smith", vendor: "Quick Fix Plumbing", category: "Plumbing", scheduledDate: "2024-12-28 2:00 PM", amount: "$350", paymentMethod: "Card", status: "completed" },
  { id: "ORD-1233", txnId: "TXN-5677", customer: "Sarah Johnson", vendor: "Spark Electric Co", category: "Electrical", scheduledDate: "2024-12-28 10:00 AM", amount: "$180", paymentMethod: "Cash", status: "in_progress" },
  { id: "ORD-1232", txnId: "TXN-5676", customer: "Mike Brown", vendor: "Cool Air HVAC", category: "HVAC", scheduledDate: "2024-12-27 3:00 PM", amount: "$450", paymentMethod: "Card", status: "completed" },
  { id: "ORD-1231", txnId: "TXN-5675", customer: "Emily Davis", vendor: "Clean Pro Services", category: "Cleaning", scheduledDate: "2024-12-27 9:00 AM", amount: "$120", paymentMethod: "Points", status: "completed" },
  { id: "ORD-1230", txnId: "TXN-5674", customer: "Robert Wilson", vendor: "Green Thumb Gardens", category: "Landscaping", scheduledDate: "2024-12-26 11:00 AM", amount: "$280", paymentMethod: "Card", status: "cancelled" },
  { id: "ORD-1229", txnId: "TXN-5673", customer: "Lisa White", vendor: "Quick Fix Plumbing", category: "Plumbing", scheduledDate: "2024-12-26 2:00 PM", amount: "$200", paymentMethod: "Cash", status: "completed" },
  { id: "ORD-1228", txnId: "TXN-5672", customer: "Tom Green", vendor: "Spark Electric Co", category: "Electrical", scheduledDate: "2024-12-25 10:00 AM", amount: "$150", paymentMethod: "Card", status: "pending" },
  { id: "ORD-1227", txnId: "TXN-5671", customer: "Anna Martinez", vendor: "Cool Air HVAC", category: "HVAC", scheduledDate: "2024-12-25 3:00 PM", amount: "$380", paymentMethod: "Card", status: "confirmed" },
];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter;
    const matchesCategory = categoryFilter === "all" || order.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPayment && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "confirmed": return "bg-gray-900 text-white";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all orders</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
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
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Payments</option>
            <option value="Card">Card</option>
            <option value="Cash">Cash</option>
            <option value="Points">Points</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="HVAC">HVAC</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Landscaping">Landscaping</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Order ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Transaction</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Customer</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Vendor</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Category</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Scheduled</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Payment</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.txnId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{order.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.vendor}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {order.scheduledDate}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.amount}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                      {order.status.replace("_", " ").charAt(0).toUpperCase() + order.status.replace("_", " ").slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders
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
