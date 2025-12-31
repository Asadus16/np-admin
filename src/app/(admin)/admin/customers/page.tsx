"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, MoreVertical, Eye, Ban, UserCheck, Download } from "lucide-react";

const customers = [
  { id: "CUS-001", name: "John Smith", email: "john.smith@email.com", phone: "+971 50 123 4567", createdAt: "2024-10-15", status: "active", orders: 12, spent: "$2,450" },
  { id: "CUS-002", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+971 55 234 5678", createdAt: "2024-10-20", status: "active", orders: 8, spent: "$1,820" },
  { id: "CUS-003", name: "Mike Brown", email: "mike.brown@email.com", phone: "+971 50 345 6789", createdAt: "2024-11-01", status: "active", orders: 5, spent: "$980" },
  { id: "CUS-004", name: "Emily Davis", email: "emily.d@email.com", phone: "+971 56 456 7890", createdAt: "2024-11-10", status: "suspended", orders: 3, spent: "$450" },
  { id: "CUS-005", name: "Robert Wilson", email: "r.wilson@email.com", phone: "+971 50 567 8901", createdAt: "2024-11-15", status: "active", orders: 15, spent: "$3,200" },
  { id: "CUS-006", name: "Lisa White", email: "lisa.white@email.com", phone: "+971 55 678 9012", createdAt: "2024-11-20", status: "active", orders: 7, spent: "$1,150" },
  { id: "CUS-007", name: "Tom Green", email: "tom.g@email.com", phone: "+971 50 789 0123", createdAt: "2024-12-01", status: "active", orders: 2, spent: "$320" },
  { id: "CUS-008", name: "Anna Martinez", email: "anna.m@email.com", phone: "+971 56 890 1234", createdAt: "2024-12-10", status: "active", orders: 4, spent: "$680" },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer accounts and profiles</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
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
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Customer ID</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Name</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Email</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Phone</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Created</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Orders</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Total Spent</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{customer.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{customer.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.createdAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{customer.orders}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.spent}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${
                      customer.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === customer.id ? null : customer.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                      {openDropdown === customer.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                          {customer.status === "active" ? (
                            <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend
                            </button>
                          ) : (
                            <button className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-50">
                              <UserCheck className="h-4 w-4 mr-2" />
                              Unsuspend
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">No customers found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredCustomers.length} of {customers.length} customers
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
