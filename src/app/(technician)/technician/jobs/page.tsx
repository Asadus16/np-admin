"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Filter,
  Navigation,
  Phone,
  Eye,
} from "lucide-react";

const jobs = [
  {
    id: "JOB-1234",
    orderId: "ORD-5678",
    customer: "John Smith",
    service: "Pipe Leak Repair",
    category: "Plumbing",
    address: "Villa 24, Palm Jumeirah, Dubai",
    scheduledDate: "2024-12-28",
    scheduledTime: "10:00 AM",
    status: "in_progress",
    phone: "+971 50 123 4567",
  },
  {
    id: "JOB-1235",
    orderId: "ORD-5679",
    customer: "Sarah Johnson",
    service: "Faucet Installation",
    category: "Plumbing",
    address: "Apt 1502, Marina Heights, Dubai Marina",
    scheduledDate: "2024-12-28",
    scheduledTime: "2:00 PM",
    status: "assigned",
    phone: "+971 50 234 5678",
  },
  {
    id: "JOB-1236",
    orderId: "ORD-5680",
    customer: "Mike Brown",
    service: "Water Heater Check",
    category: "Plumbing",
    address: "Villa 8, Emirates Hills, Dubai",
    scheduledDate: "2024-12-28",
    scheduledTime: "4:30 PM",
    status: "assigned",
    phone: "+971 50 345 6789",
  },
  {
    id: "JOB-1237",
    orderId: "ORD-5681",
    customer: "Emily Davis",
    service: "Drain Cleaning",
    category: "Plumbing",
    address: "Apt 804, JBR Walk, Dubai",
    scheduledDate: "2024-12-29",
    scheduledTime: "9:00 AM",
    status: "assigned",
    phone: "+971 50 456 7890",
  },
  {
    id: "JOB-1238",
    orderId: "ORD-5682",
    customer: "Robert Wilson",
    service: "Pipe Replacement",
    category: "Plumbing",
    address: "Villa 12, Arabian Ranches, Dubai",
    scheduledDate: "2024-12-29",
    scheduledTime: "11:30 AM",
    status: "assigned",
    phone: "+971 50 567 8901",
  },
  {
    id: "JOB-1233",
    orderId: "ORD-5677",
    customer: "Lisa White",
    service: "Toilet Repair",
    category: "Plumbing",
    address: "Apt 2301, Downtown Views, Dubai",
    scheduledDate: "2024-12-27",
    scheduledTime: "3:00 PM",
    status: "completed",
    phone: "+971 50 678 9012",
  },
  {
    id: "JOB-1232",
    orderId: "ORD-5676",
    customer: "Tom Green",
    service: "Sink Installation",
    category: "Plumbing",
    address: "Villa 5, Jumeirah Islands, Dubai",
    scheduledDate: "2024-12-27",
    scheduledTime: "10:00 AM",
    status: "completed",
    phone: "+971 50 789 0123",
  },
];

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;

    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = job.scheduledDate === "2024-12-28";
    } else if (dateFilter === "tomorrow") {
      matchesDate = job.scheduledDate === "2024-12-29";
    } else if (dateFilter === "past") {
      matchesDate = job.scheduledDate < "2024-12-28";
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

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

  const activeJobs = filteredJobs.filter(j => j.status !== "completed");
  const completedJobs = filteredJobs.filter(j => j.status === "completed");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Jobs</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage your assigned jobs</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              >
                <option value="all">All Status</option>
                <option value="assigned">Assigned</option>
                <option value="on_the_way">On the Way</option>
                <option value="arrived">Arrived</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Active Jobs ({activeJobs.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {activeJobs.map((job) => (
              <div key={job.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{job.customer}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(job.status)}`}>
                        {getStatusLabel(job.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{job.service}</p>
                    <p className="text-xs text-gray-500 mt-1">Order: {job.orderId}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {job.scheduledDate}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-1">
                      <Clock className="h-4 w-4" />
                      {job.scheduledTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{job.address}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/technician/jobs/${job.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Link>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Navigation className="h-4 w-4" />
                    Navigate
                  </button>
                  <a
                    href={`tel:${job.phone}`}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Completed ({completedJobs.length})</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {completedJobs.map((job) => (
              <Link
                key={job.id}
                href={`/technician/jobs/${job.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{job.customer}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(job.status)}`}>
                        {getStatusLabel(job.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{job.service}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{job.scheduledDate}</p>
                    <p>{job.scheduledTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{job.address}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {filteredJobs.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No jobs found matching your criteria</p>
        </div>
      )}
    </div>
  );
}

function ClipboardList(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
