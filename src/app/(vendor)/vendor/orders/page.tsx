"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ClipboardList, Clock, MapPin, User, Calendar } from "lucide-react";

const orders = [
  { id: "ORD-001", customer: "John Smith", service: "Plumbing Repair", date: "2024-03-18", time: "2:00 PM", address: "123 Main St, SF", status: "new", amount: 85 },
  { id: "ORD-002", customer: "Sarah Johnson", service: "Drain Cleaning", date: "2024-03-18", time: "4:30 PM", address: "456 Oak Ave, SF", status: "new", amount: 120 },
  { id: "ORD-003", customer: "Mike Brown", service: "Water Heater Install", date: "2024-03-19", time: "10:00 AM", address: "789 Pine Rd, SF", status: "assigned", amount: 350 },
  { id: "ORD-004", customer: "Emily Davis", service: "Pipe Inspection", date: "2024-03-19", time: "2:00 PM", address: "321 Elm St, SF", status: "assigned", amount: 150 },
  { id: "ORD-005", customer: "Robert Wilson", service: "Faucet Replacement", date: "2024-03-17", time: "11:00 AM", address: "654 Maple Dr, SF", status: "completed", amount: 95 },
  { id: "ORD-006", customer: "Lisa Anderson", service: "Plumbing Repair", date: "2024-03-16", time: "3:00 PM", address: "987 Cedar Ln, SF", status: "completed", amount: 85 },
];

const tabs = [
  { id: "new", label: "New", count: orders.filter((o) => o.status === "new").length },
  { id: "assigned", label: "Assigned", count: orders.filter((o) => o.status === "assigned").length },
  { id: "completed", label: "Completed", count: orders.filter((o) => o.status === "completed").length },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("new");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders
    .filter((order) => order.status === activeTab)
    .filter((order) =>
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-blue-700";
      case "assigned":
        return "bg-yellow-50 text-yellow-700";
      case "completed":
        return "bg-green-50 text-green-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your service orders</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Link
            key={order.id}
            href={`/vendor/orders/${order.id}`}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{order.id}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{order.service}</p>
              </div>
              <span className="text-lg font-semibold text-gray-900">${order.amount}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <User className="h-4 w-4" />
                {order.customer}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                {order.date}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                {order.time}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                {order.address}
              </div>
            </div>
            {order.status === "new" && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                >
                  Accept
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Decline
                </button>
              </div>
            )}
          </Link>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
