"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  Calendar,
  Navigation,
  MessageSquare,
  Camera,
  CheckCircle,
  PlayCircle,
  FileText,
  CreditCard,
  User,
  Building2,
  AlertCircle,
} from "lucide-react";

const jobData = {
  id: "JOB-1234",
  orderId: "ORD-5678",
  txnId: "TXN-9012",
  status: "in_progress",
  customer: {
    name: "John Smith",
    phone: "+971 50 123 4567",
    address: "Villa 24, Palm Jumeirah, Dubai",
    location: { lat: 25.1124, lng: 55.1390 },
  },
  vendor: {
    name: "Quick Fix Plumbing",
    phone: "+971 50 987 6543",
  },
  scheduledDate: "2024-12-28",
  scheduledTime: "10:00 AM",
  services: [
    {
      category: "Plumbing",
      name: "Pipe Leak Repair",
      description: "Repair leaking pipe under kitchen sink",
      duration: "1-2 hours",
    },
    {
      category: "Plumbing",
      name: "Faucet Check",
      description: "Inspect and tighten kitchen faucet",
      duration: "30 mins",
    },
  ],
  payment: {
    method: "Card",
    total: 350,
    status: "paid",
  },
  notes: "Customer mentioned the leak has been going on for 2 days. Please check the adjoining pipes as well.",
  images: [],
  timeline: [
    { status: "Assigned", time: "2024-12-28 08:30 AM", completed: true },
    { status: "On the Way", time: "2024-12-28 09:45 AM", completed: true },
    { status: "Arrived", time: "2024-12-28 10:05 AM", completed: true },
    { status: "Started", time: "2024-12-28 10:10 AM", completed: true },
    { status: "Completed", time: null, completed: false },
  ],
};

export default function JobDetailPage() {
  const params = useParams();
  const [currentStatus, setCurrentStatus] = useState(jobData.status);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [jobNotes, setJobNotes] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress": return "bg-blue-100 text-blue-700";
      case "assigned": return "bg-yellow-100 text-yellow-700";
      case "on_the_way": return "bg-orange-100 text-orange-700";
      case "arrived": return "bg-gray-900 text-white";
      case "completed": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress": return "In Progress";
      case "assigned": return "Assigned";
      case "on_the_way": return "On the Way";
      case "arrived": return "Arrived";
      case "completed": return "Completed";
      default: return status;
    }
  };

  const getNextAction = () => {
    switch (currentStatus) {
      case "assigned":
        return { label: "Start Navigation", action: () => setCurrentStatus("on_the_way"), icon: Navigation };
      case "on_the_way":
        return { label: "Mark Arrived", action: () => setCurrentStatus("arrived"), icon: MapPin };
      case "arrived":
        return { label: "Start Job", action: () => setCurrentStatus("in_progress"), icon: PlayCircle };
      case "in_progress":
        return { label: "Complete Job", action: () => setShowCompleteModal(true), icon: CheckCircle };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/technician/jobs"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{params.id}</h1>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(currentStatus)}`}>
                {getStatusLabel(currentStatus)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Order: {jobData.orderId}</p>
          </div>
        </div>
      </div>

      {/* Main Action Button */}
      {nextAction && currentStatus !== "completed" && (
        <button
          onClick={nextAction.action}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 text-lg font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <nextAction.icon className="h-6 w-6" />
          {nextAction.label}
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Location */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Customer Details</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{jobData.customer.name}</p>
                  <a href={`tel:${jobData.customer.phone}`} className="text-sm text-blue-600 hover:underline">
                    {jobData.customer.phone}
                  </a>
                </div>
                <div className="ml-auto flex gap-2">
                  <a
                    href={`tel:${jobData.customer.phone}`}
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Phone className="h-5 w-5 text-gray-600" />
                  </a>
                  <Link
                    href="/technician/messages"
                    className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">{jobData.customer.address}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Coordinates: {jobData.customer.location.lat}, {jobData.customer.location.lng}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Map View</p>
                    <button
                      className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                    >
                      <Navigation className="h-4 w-4" />
                      Open in Maps
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Services</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {jobData.services.map((service, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{service.category}</span>
                      <p className="text-sm font-medium text-gray-900 mt-1">{service.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {service.duration}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {jobData.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Special Instructions</p>
                  <p className="text-sm text-yellow-700 mt-1">{jobData.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900">{jobData.payment.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">AED {jobData.payment.total}</p>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                    {jobData.payment.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Scheduled For</h3>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>{jobData.scheduledDate}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 mt-2">
              <Clock className="h-5 w-5" />
              <span>{jobData.scheduledTime}</span>
            </div>
          </div>

          {/* Vendor */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Vendor</h3>
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-900">{jobData.vendor.name}</p>
                <p className="text-xs text-gray-500">{jobData.vendor.phone}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Job Timeline</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {jobData.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      item.completed ? "bg-green-100" : "bg-gray-100"
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${item.completed ? "text-gray-900" : "text-gray-400"}`}>
                        {item.status}
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

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <button
              onClick={() => setShowNotesModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <FileText className="h-4 w-4" />
              Add Job Notes
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Camera className="h-4 w-4" />
              Upload Photos
            </button>
            <Link
              href="/technician/messages"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <MessageSquare className="h-4 w-4" />
              Contact Vendor
            </Link>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Job Notes</h3>
            <textarea
              rows={4}
              value={jobNotes}
              onChange={(e) => setJobNotes(e.target.value)}
              placeholder="Enter notes about this job..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Job Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Job</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to mark this job as complete? Please ensure all services have been performed.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completion Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Any notes about the completed work..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
                />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">I have uploaded before/after photos</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">All services have been completed</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCurrentStatus("completed");
                  setShowCompleteModal(false);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
