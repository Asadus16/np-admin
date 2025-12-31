"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, MapPin, ShoppingCart, CreditCard, Star, Gift, Clock, Ban, UserCheck, Edit, Plus, Minus } from "lucide-react";

const customer = {
  id: "CUS-001",
  name: "John Smith",
  email: "john.smith@email.com",
  phone: "+971 50 123 4567",
  nationality: "United Arab Emirates",
  emiratesId: "784-1990-1234567-1",
  emiratesIdCopy: true,
  createdAt: "2024-10-15",
  status: "active",
};

const addresses = [
  { id: 1, label: "Home", street: "123 Main Street", building: "Tower A", apartment: "Apt 501", city: "Dubai", emirate: "Dubai", lat: 25.2048, lng: 55.2708, isDefault: true },
  { id: 2, label: "Office", street: "456 Business Bay", building: "Bay Square", apartment: "Floor 12", city: "Dubai", emirate: "Dubai", lat: 25.1850, lng: 55.2650, isDefault: false },
];

const orders = [
  { id: "ORD-1234", vendor: "Quick Fix Plumbing", amount: "$350", paymentMethod: "Card", date: "2024-12-28", status: "completed" },
  { id: "ORD-1220", vendor: "Spark Electric Co", amount: "$180", paymentMethod: "Cash", date: "2024-12-20", status: "completed" },
  { id: "ORD-1215", vendor: "Cool Air HVAC", amount: "$450", paymentMethod: "Points", date: "2024-12-15", status: "completed" },
  { id: "ORD-1200", vendor: "Green Thumb Gardens", amount: "$120", paymentMethod: "Card", date: "2024-12-10", status: "cancelled" },
];

const subscriptions = [
  { id: "SUB-001", vendor: "Clean Pro Services", service: "Weekly Home Cleaning", amount: "$150/week", frequency: "Every Monday, 10 AM", status: "active" },
  { id: "SUB-002", vendor: "Cool Air HVAC", service: "AC Maintenance", amount: "$80/month", frequency: "Monthly, 1st week", status: "paused" },
];

const pointsLedger = [
  { id: 1, orderId: "ORD-1234", type: "earned", points: 35, date: "2024-12-28" },
  { id: 2, orderId: "ORD-1220", type: "earned", points: 18, date: "2024-12-20" },
  { id: 3, orderId: "ORD-1215", type: "redeemed", points: -100, date: "2024-12-15" },
  { id: 4, orderId: "ORD-1200", type: "earned", points: 12, date: "2024-12-10" },
];

const pointsBalance = { current: 485, totalEarned: 620, totalRedeemed: 135 };

export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState<"orders" | "subscriptions" | "points" | "addresses">("orders");
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "deduct">("add");
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">Customer Profile</h1>
          <p className="text-sm text-gray-500 mt-1">{customer.id}</p>
        </div>
        <div className="flex items-center gap-2">
          {customer.status === "active" ? (
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50">
              <Ban className="h-4 w-4 mr-2" />
              Suspend
            </button>
          ) : (
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-white border border-green-200 rounded-lg hover:bg-green-50">
              <UserCheck className="h-4 w-4 mr-2" />
              Unsuspend
            </button>
          )}
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">Personal Details</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Full Name</p>
              <p className="text-sm text-gray-900 mt-1">{customer.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
              <p className="text-sm text-gray-900 mt-1">{customer.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
              <p className="text-sm text-gray-900 mt-1">{customer.phone}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Nationality</p>
              <p className="text-sm text-gray-900 mt-1">{customer.nationality}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Emirates ID</p>
              <p className="text-sm text-gray-900 mt-1">{customer.emiratesId}</p>
              {customer.emiratesIdCopy && (
                <button className="text-xs text-gray-600 hover:text-gray-900 mt-1">View Copy</button>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded mt-1 ${
                customer.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Member Since</p>
              <p className="text-sm text-gray-900 mt-1">{customer.createdAt}</p>
            </div>
          </div>
        </div>

        {/* Points Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Points</h2>
            </div>
            <button
              onClick={() => setShowAdjustModal(true)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Adjust Points
            </button>
          </div>
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-gray-900">{pointsBalance.current}</p>
            <p className="text-sm text-gray-500">Current Balance</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xl font-semibold text-gray-900">{pointsBalance.totalEarned}</p>
              <p className="text-xs text-gray-500">Total Earned</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xl font-semibold text-gray-900">{pointsBalance.totalRedeemed}</p>
              <p className="text-xs text-gray-500">Total Redeemed</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">Activity</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Orders</span>
              <span className="text-sm font-medium text-gray-900">{orders.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Spent</span>
              <span className="text-sm font-medium text-gray-900">$2,450</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Subscriptions</span>
              <span className="text-sm font-medium text-gray-900">{subscriptions.filter(s => s.status === "active").length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Saved Addresses</span>
              <span className="text-sm font-medium text-gray-900">{addresses.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex">
            {(["orders", "subscriptions", "points", "addresses"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === "orders" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Order ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Vendor</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Amount</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Payment</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Date</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.vendor}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.amount}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.paymentMethod}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{order.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                          order.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="text-sm text-gray-600 hover:text-gray-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "subscriptions" && (
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sub.service}</p>
                      <p className="text-xs text-gray-500 mt-1">{sub.vendor}</p>
                      <p className="text-sm text-gray-600 mt-2">{sub.amount} - {sub.frequency}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                        sub.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                      <button className="text-sm text-gray-600 hover:text-gray-900">Manage</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "points" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Transaction ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Order ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Type</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Points</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pointsLedger.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">TXN-{entry.id.toString().padStart(4, '0')}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{entry.orderId}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded capitalize ${
                          entry.type === "earned" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium ${entry.points > 0 ? "text-green-600" : "text-gray-600"}`}>
                        {entry.points > 0 ? "+" : ""}{entry.points}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{entry.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">Default</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{addr.street}</p>
                  <p className="text-sm text-gray-600">{addr.building}, {addr.apartment}</p>
                  <p className="text-sm text-gray-600">{addr.city}, {addr.emirate}</p>
                  <p className="text-xs text-gray-400 mt-2">Lat: {addr.lat}, Lng: {addr.lng}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Adjust Points Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Adjust Points</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setAdjustmentType("add")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                    adjustmentType === "add"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Add Points
                </button>
                <button
                  onClick={() => setAdjustmentType("deduct")}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                    adjustmentType === "deduct"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Minus className="h-4 w-4 inline mr-1" />
                  Deduct Points
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  placeholder="Enter points amount"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="Reason for adjustment..."
                  rows={3}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAdjustModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
