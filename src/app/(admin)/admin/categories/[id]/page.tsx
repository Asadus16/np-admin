"use client";

import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

const category = {
  id: 1,
  name: "Plumbing",
  slug: "plumbing",
  description: "All plumbing related services including repairs, installations, and maintenance.",
  icon: "/icons/plumbing.svg",
  servicesCount: 24,
  status: "active",
  createdAt: "2024-01-15",
  updatedAt: "2024-03-20",
  attributes: [
    { name: "Service Type", values: ["Repair", "Installation", "Maintenance"] },
    { name: "Urgency", values: ["Standard", "Same Day", "Emergency"] },
  ],
};

export default function CategoryDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/categories"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{category.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Category Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/categories/${category.id}/edit`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">General Information</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{category.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Slug</dt>
                <dd className="mt-1 text-sm text-gray-900">{category.slug}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    category.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {category.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Services Count</dt>
                <dd className="mt-1 text-sm text-gray-900">{category.servicesCount}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{category.description}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Attributes</h2>
            <div className="space-y-4">
              {category.attributes.map((attr, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900">{attr.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {attr.values.map((value, vIndex) => (
                      <span key={vIndex} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Icon</h2>
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-medium text-gray-600">{category.name.charAt(0)}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Timestamps</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">{category.createdAt}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">{category.updatedAt}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
