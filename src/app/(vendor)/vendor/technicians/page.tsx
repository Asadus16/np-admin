"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Users, Phone, Mail, MoreVertical, Star, History, Eye, Edit2, Trash2 } from "lucide-react";

const initialTechnicians = [
  { id: 1, name: "Mike Johnson", email: "mike@company.com", phone: "+1 555-111-2222", role: "Lead Technician", jobs: 156, rating: 4.9, status: "active" },
  { id: 2, name: "Sarah Smith", email: "sarah@company.com", phone: "+1 555-333-4444", role: "Technician", jobs: 89, rating: 4.7, status: "active" },
  { id: 3, name: "John Davis", email: "john@company.com", phone: "+1 555-555-6666", role: "Technician", jobs: 45, rating: 4.5, status: "active" },
  { id: 4, name: "Emily Brown", email: "emily@company.com", phone: "+1 555-777-8888", role: "Apprentice", jobs: 12, rating: 4.8, status: "inactive" },
];

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState(initialTechnicians);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const toggleStatus = (id: number) => {
    setTechnicians(technicians.map(tech =>
      tech.id === id
        ? { ...tech, status: tech.status === "active" ? "inactive" : "active" }
        : tech
    ));
  };

  const filteredTechnicians = technicians.filter((tech) => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tech.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Technicians</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your team of technicians</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/vendor/technicians/activity"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <History className="h-4 w-4 mr-2" />
            Activity Logs
          </Link>
          <Link
            href="/vendor/technicians/invite"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Invite Technician
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">{technicians.length}</p>
          <p className="text-sm text-gray-500">Total Team</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">
            {technicians.filter((t) => t.status === "active").length}
          </p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">
            {technicians.reduce((sum, t) => sum + t.jobs, 0)}
          </p>
          <p className="text-sm text-gray-500">Total Jobs</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-2xl font-semibold text-gray-900">
            {(technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length).toFixed(1)}
          </p>
          <p className="text-sm text-gray-500">Avg Rating</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search technicians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                statusFilter === "all" ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                statusFilter === "active" ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                statusFilter === "inactive" ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-200">
          {filteredTechnicians.map((tech) => (
            <div key={tech.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {tech.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{tech.name}</p>
                  </div>
                  <p className="text-xs text-gray-500">{tech.role}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Mail className="h-3 w-3" />
                      {tech.email}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="h-3 w-3" />
                      {tech.phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{tech.jobs}</p>
                  <p className="text-xs text-gray-500">Jobs</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">{tech.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                {/* Enable/Disable Toggle */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => toggleStatus(tech.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      tech.status === "active" ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        tech.status === "active" ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    {tech.status === "active" ? "Active" : "Disabled"}
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === tech.id ? null : tech.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                  {openMenu === tech.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-0 z-50 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 inline-flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 inline-flex items-center">
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                        <Link
                          href={`/vendor/technicians/activity?user=${tech.id}`}
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 inline-flex items-center"
                        >
                          <History className="h-4 w-4 mr-2" />
                          View Activity
                        </Link>
                        <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 inline-flex items-center">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTechnicians.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No technicians found</p>
          </div>
        )}
      </div>
    </div>
  );
}
