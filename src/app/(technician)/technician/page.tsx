"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  DollarSign,
  Calendar,
  MapPin,
  ArrowRight,
  Navigation,
  PlayCircle,
  Phone,
} from "lucide-react";

const todaysJobs = [
  {
    id: "JOB-1234",
    orderId: "ORD-5678",
    customer: "John Smith",
    service: "Pipe Leak Repair",
    address: "Villa 24, Palm Jumeirah, Dubai",
    scheduledTime: "10:00 AM",
    status: "in_progress",
    phone: "+971 50 123 4567",
  },
  {
    id: "JOB-1235",
    orderId: "ORD-5679",
    customer: "Sarah Johnson",
    service: "Faucet Installation",
    address: "Apt 1502, Marina Heights, Dubai Marina",
    scheduledTime: "2:00 PM",
    status: "assigned",
    phone: "+971 50 234 5678",
  },
  {
    id: "JOB-1236",
    orderId: "ORD-5680",
    customer: "Mike Brown",
    service: "Water Heater Check",
    address: "Villa 8, Emirates Hills, Dubai",
    scheduledTime: "4:30 PM",
    status: "assigned",
    phone: "+971 50 345 6789",
  },
];

const upcomingJobs = [
  { id: "JOB-1237", customer: "Emily Davis", service: "Drain Cleaning", date: "Tomorrow, 9:00 AM" },
  { id: "JOB-1238", customer: "Robert Wilson", service: "Pipe Replacement", date: "Tomorrow, 11:30 AM" },
  { id: "JOB-1239", customer: "Lisa White", service: "Toilet Repair", date: "Dec 30, 10:00 AM" },
];

const stats = {
  todaysJobs: 3,
  upcomingJobs: 5,
  completedToday: 2,
  weeklyEarnings: 1850,
};

export default function TechnicianDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);

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

  return (
    <div className="space-y-6">
      {/* Header with Availability Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Good Morning, Ahmed</h1>
          <p className="text-sm text-gray-500 mt-1">Here&apos;s your schedule for today</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Status:</span>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative inline-flex h-8 w-40 items-center rounded-full transition-colors ${
              isAvailable ? "bg-green-100" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-flex items-center justify-center h-7 w-20 rounded-full text-xs font-medium transition-all ${
                isAvailable
                  ? "translate-x-[76px] bg-green-600 text-white"
                  : "translate-x-0.5 bg-gray-500 text-white"
              }`}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </span>
            <span
              className={`absolute text-xs font-medium ${
                isAvailable ? "left-3 text-green-700" : "right-3 text-gray-600"
              }`}
            >
              {isAvailable ? "On Duty" : "Off Duty"}
            </span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Today&apos;s Jobs</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats.todaysJobs}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Upcoming</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats.upcomingJobs}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Completed Today</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats.completedToday}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">This Week</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">AED {stats.weeklyEarnings}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/technician/scheduling"
          className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Calendar className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">View Calendar</span>
        </Link>
        <Link
          href="/technician/jobs"
          className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ClipboardList className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">All Jobs</span>
        </Link>
        <Link
          href="/technician/history"
          className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <CheckCircle className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Job History</span>
        </Link>
        <Link
          href="/technician/messages"
          className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Phone className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Messages</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Jobs */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Today&apos;s Jobs</h2>
            <Link href="/technician/jobs" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {todaysJobs.map((job) => (
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
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{job.scheduledTime}</p>
                    <p className="text-xs text-gray-500">{job.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{job.address}</span>
                </div>
                <div className="flex gap-2">
                  {job.status === "assigned" && (
                    <Link
                      href={`/technician/jobs/${job.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Start Job
                    </Link>
                  )}
                  {job.status === "in_progress" && (
                    <Link
                      href={`/technician/jobs/${job.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Continue
                    </Link>
                  )}
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

        {/* Upcoming Jobs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Jobs</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingJobs.map((job) => (
              <Link
                key={job.id}
                href={`/technician/jobs/${job.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{job.customer}</span>
                  <span className="text-xs text-gray-500">{job.id}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{job.service}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {job.date}
                </div>
              </Link>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/technician/scheduling"
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1"
            >
              View Full Schedule <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
