"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Clock, Package, MessageSquare, CheckCircle } from "lucide-react";

const order = {
  id: "ORD-001",
  status: "assigned",
  customer: {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
  },
  service: {
    name: "Plumbing Repair",
    price: 85,
    duration: 60,
    addons: [
      { name: "Emergency Service", price: 50 },
    ],
  },
  address: "123 Main Street, San Francisco, CA 94102",
  scheduledDate: "2024-03-18",
  scheduledTime: "2:00 PM",
  notes: "Leaky faucet in the kitchen. Has been dripping for about a week.",
  assignedTo: "Mike Johnson",
  timeline: [
    { id: 1, event: "Order created", time: "Mar 17, 2024 10:30 AM", completed: true },
    { id: 2, event: "Order accepted", time: "Mar 17, 2024 11:00 AM", completed: true },
    { id: 3, event: "Technician assigned", time: "Mar 17, 2024 11:15 AM", completed: true },
    { id: 4, event: "En route to customer", time: "", completed: false },
    { id: 5, event: "Job started", time: "", completed: false },
    { id: 6, event: "Job completed", time: "", completed: false },
  ],
};

export default function OrderDetailPage() {
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const totalAmount = order.service.price + order.service.addons.reduce((sum, a) => sum + a.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/orders" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{order.id}</h1>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700">
              {order.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{order.service.name}</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Message
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{order.customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{order.customer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">{order.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule & Notes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Schedule & Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-medium text-gray-900">{order.scheduledDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium text-gray-900">{order.scheduledTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Assigned To</p>
                  <p className="text-sm font-medium text-gray-900">{order.assignedTo}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Customer Notes</p>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{order.notes}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              {order.timeline.map((item, index) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    item.completed ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    {item.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${item.completed ? "text-gray-900" : "text-gray-400"}`}>
                      {item.event}
                    </p>
                    {item.time && (
                      <p className="text-xs text-gray-500">{item.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.service.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">${order.service.price}</span>
              </div>
              {order.service.addons.map((addon, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 pl-6">{addon.name}</span>
                  <span className="text-sm text-gray-600">${addon.price}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Total</span>
                <span className="text-lg font-semibold text-gray-900">${totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                Reassign Technician
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                Reschedule
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded-lg hover:bg-red-50 text-left">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
