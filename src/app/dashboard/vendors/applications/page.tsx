"use client";

import { useState } from "react";
import { Search, Check, X, Eye, Clock } from "lucide-react";

const applications = [
  { id: 1, name: "John's Electric", email: "john@electric.com", phone: "+1 555-0201", category: "Electrical", appliedAt: "2024-03-15", documents: 4, status: "pending" },
  { id: 2, name: "Quick Fix Plumbing", email: "info@quickfix.com", phone: "+1 555-0202", category: "Plumbing", appliedAt: "2024-03-14", documents: 3, status: "pending" },
  { id: 3, name: "Green Lawn Care", email: "hello@greenlawn.com", phone: "+1 555-0203", category: "Landscaping", appliedAt: "2024-03-13", documents: 5, status: "under_review" },
  { id: 4, name: "Safe Lock Security", email: "support@safelock.com", phone: "+1 555-0204", category: "Security", appliedAt: "2024-03-12", documents: 4, status: "pending" },
  { id: 5, name: "Fresh Cleaning Pro", email: "book@freshclean.com", phone: "+1 555-0205", category: "Cleaning", appliedAt: "2024-03-11", documents: 3, status: "rejected" },
];

export default function VendorApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<number | null>(null);

  const filteredApplications = applications.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "under_review":
        return "bg-blue-50 text-blue-700";
      case "approved":
        return "bg-green-50 text-green-700";
      case "rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Vendor Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Review and approve vendor applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">Total Applications</div>
          <div className="text-2xl font-semibold text-gray-900 mt-1">{applications.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">Pending Review</div>
          <div className="text-2xl font-semibold text-yellow-600 mt-1">
            {applications.filter((a) => a.status === "pending").length}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">Under Review</div>
          <div className="text-2xl font-semibold text-blue-600 mt-1">
            {applications.filter((a) => a.status === "under_review").length}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-500">Rejected</div>
          <div className="text-2xl font-semibold text-red-600 mt-1">
            {applications.filter((a) => a.status === "rejected").length}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
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
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Applicant</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Category</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Applied</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Documents</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{app.name}</div>
                      <div className="text-sm text-gray-500">{app.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{app.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{app.appliedAt}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">{app.documents} files</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(app.status)}`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedApp(app.id)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {app.status === "pending" && (
                        <>
                          <button
                            className="p-1.5 rounded hover:bg-green-50 text-green-600"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600"
                            title="Mark Under Review"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1.5 rounded hover:bg-red-50 text-red-600"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
