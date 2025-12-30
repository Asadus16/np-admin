"use client";

import Link from "next/link";
import { ArrowLeft, Star, Phone, Mail, MapPin, Calendar, Briefcase } from "lucide-react";

const technician = {
  id: 1,
  name: "John Smith",
  email: "john@example.com",
  phone: "+1 555-0301",
  vendor: "Mike's Plumbing",
  vendorId: 1,
  role: "Lead Technician",
  rating: 4.9,
  totalJobs: 145,
  completedJobs: 140,
  cancelledJobs: 5,
  status: "active",
  joinedAt: "2023-03-15",
  certifications: ["Licensed Plumber", "OSHA Certified", "EPA 608"],
  specializations: ["Emergency Repairs", "Water Heaters", "Drain Cleaning"],
  recentJobs: [
    { id: 1, service: "Pipe Repair", customer: "Alice Wilson", date: "2024-03-18", rating: 5 },
    { id: 2, service: "Drain Cleaning", customer: "Bob Martin", date: "2024-03-17", rating: 5 },
    { id: 3, service: "Faucet Installation", customer: "Carol Davis", date: "2024-03-16", rating: 4 },
  ],
  reviews: [
    { id: 1, customer: "Alice Wilson", rating: 5, comment: "Excellent work, very professional!", date: "2024-03-18" },
    { id: 2, customer: "Bob Martin", rating: 5, comment: "Quick and efficient service.", date: "2024-03-17" },
  ],
};

export default function TechnicianDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/technicians"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{technician.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{technician.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-2xl font-semibold text-gray-900">{technician.rating}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Average Rating</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{technician.totalJobs}</div>
          <p className="text-sm text-gray-500 mt-1">Total Jobs</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-green-600">{technician.completedJobs}</div>
          <p className="text-sm text-gray-500 mt-1">Completed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {((technician.completedJobs / technician.totalJobs) * 100).toFixed(0)}%
          </div>
          <p className="text-sm text-gray-500 mt-1">Completion Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{technician.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">{technician.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <Link href={`/dashboard/vendors/${technician.vendorId}`} className="text-sm text-gray-900 hover:underline">
                  {technician.vendor}
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-900">Joined {technician.joinedAt}</span>
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
                    <th className="text-right text-xs font-medium text-gray-500 uppercase pb-3">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {technician.recentJobs.map((job) => (
                    <tr key={job.id}>
                      <td className="py-3 text-sm text-gray-900">{job.service}</td>
                      <td className="py-3 text-sm text-gray-500">{job.customer}</td>
                      <td className="py-3 text-sm text-gray-500">{job.date}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-900">{job.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Reviews</h2>
            <div className="space-y-4">
              {technician.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{review.customer}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-900">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
              technician.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
            }`}>
              {technician.status}
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Certifications</h2>
            <div className="space-y-2">
              {technician.certifications.map((cert, index) => (
                <div key={index} className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                  {cert}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {technician.specializations.map((spec, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
