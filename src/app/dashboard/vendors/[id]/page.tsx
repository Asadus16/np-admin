"use client";

import Link from "next/link";
import { ArrowLeft, Edit, Star, MapPin, Phone, Mail, Calendar } from "lucide-react";

const vendor = {
  id: 1,
  name: "Mike's Plumbing",
  email: "mike@plumbing.com",
  phone: "+1 555-0101",
  category: "Plumbing",
  rating: 4.8,
  totalJobs: 156,
  completedJobs: 148,
  cancelledJobs: 8,
  address: "123 Main Street, Suite 100",
  city: "San Francisco",
  state: "CA",
  zip: "94102",
  status: "active",
  joinedAt: "2023-06-15",
  technicians: [
    { id: 1, name: "John Smith", role: "Lead Technician", jobs: 45 },
    { id: 2, name: "Sarah Johnson", role: "Technician", jobs: 38 },
    { id: 3, name: "Mike Brown", role: "Apprentice", jobs: 12 },
  ],
  recentJobs: [
    { id: 1, service: "Pipe Repair", customer: "Alice Wilson", date: "2024-03-18", amount: 250, status: "completed" },
    { id: 2, service: "Drain Cleaning", customer: "Bob Martin", date: "2024-03-17", amount: 150, status: "completed" },
    { id: 3, service: "Water Heater Install", customer: "Carol Davis", date: "2024-03-16", amount: 800, status: "completed" },
  ],
};

export default function VendorDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/vendors"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{vendor.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{vendor.category}</p>
          </div>
        </div>
        <Link
          href={`/dashboard/vendors/${vendor.id}/edit`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-2xl font-semibold text-gray-900">{vendor.rating}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Average Rating</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{vendor.totalJobs}</div>
          <p className="text-sm text-gray-500 mt-1">Total Jobs</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-green-600">{vendor.completedJobs}</div>
          <p className="text-sm text-gray-500 mt-1">Completed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-red-600">{vendor.cancelledJobs}</div>
          <p className="text-sm text-gray-500 mt-1">Cancelled</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{vendor.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{vendor.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">
                  {vendor.address}, {vendor.city}, {vendor.state} {vendor.zip}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">Joined {vendor.joinedAt}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Jobs</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Service</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Customer</th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Date</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase pb-3">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vendor.recentJobs.map((job) => (
                    <tr key={job.id}>
                      <td className="py-3 text-sm text-gray-900">{job.service}</td>
                      <td className="py-3 text-sm text-gray-500">{job.customer}</td>
                      <td className="py-3 text-sm text-gray-500">{job.date}</td>
                      <td className="py-3 text-sm text-gray-900 text-right">${job.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
              vendor.status === "active" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {vendor.status}
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Technicians</h2>
              <Link href="/dashboard/technicians" className="text-sm text-gray-500 hover:text-gray-900">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {vendor.technicians.map((tech) => (
                <Link
                  key={tech.id}
                  href={`/dashboard/technicians/${tech.id}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="text-sm font-medium text-gray-900">{tech.name}</div>
                  <div className="text-xs text-gray-500">{tech.role} - {tech.jobs} jobs</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
