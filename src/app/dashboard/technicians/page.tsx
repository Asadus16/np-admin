"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye, Star, Phone, Mail } from "lucide-react";

const technicians = [
  { id: 1, name: "John Smith", email: "john@example.com", phone: "+1 555-0301", vendor: "Mike's Plumbing", vendorId: 1, role: "Lead Technician", rating: 4.9, jobs: 145, status: "active" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", phone: "+1 555-0302", vendor: "Mike's Plumbing", vendorId: 1, role: "Technician", rating: 4.7, jobs: 98, status: "active" },
  { id: 3, name: "Mike Brown", email: "mike@example.com", phone: "+1 555-0303", vendor: "ElectriCare Solutions", vendorId: 2, role: "Senior Technician", rating: 4.8, jobs: 212, status: "active" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", phone: "+1 555-0304", vendor: "Cool Air HVAC", vendorId: 3, role: "Technician", rating: 4.5, jobs: 67, status: "active" },
  { id: 5, name: "James Wilson", email: "james@example.com", phone: "+1 555-0305", vendor: "Sparkle Cleaning Co", vendorId: 4, role: "Team Lead", rating: 4.6, jobs: 189, status: "inactive" },
];

export default function TechniciansPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTechnicians = technicians.filter((tech) =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Technicians</h1>
        <p className="text-sm text-gray-500 mt-1">Directory of all technicians</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">{technicians.length}</div>
          <p className="text-sm text-gray-500 mt-1">Total Technicians</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-green-600">
            {technicians.filter((t) => t.status === "active").length}
          </div>
          <p className="text-sm text-gray-500 mt-1">Active</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-semibold text-gray-900">
            {technicians.reduce((sum, t) => sum + t.jobs, 0)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Total Jobs</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-2xl font-semibold text-gray-900">
              {(technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length).toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Avg Rating</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search technicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Technician</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Vendor</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Role</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Rating</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Jobs</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTechnicians.map((tech) => (
                <tr key={tech.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{tech.name}</div>
                      <div className="text-sm text-gray-500">{tech.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/vendors/${tech.vendorId}`} className="text-sm text-gray-900 hover:underline">
                      {tech.vendor}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{tech.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-900">{tech.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{tech.jobs}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      tech.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {tech.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/technicians/${tech.id}`}
                      className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTechnicians.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No technicians found</p>
          </div>
        )}
      </div>
    </div>
  );
}
