"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchServiceArea,
  clearError,
  clearCurrentServiceArea,
} from "@/store/slices/serviceAreaSlice";

export default function ViewServiceAreaPage() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentServiceArea: serviceArea, isLoading, error } = useAppSelector(
    (state) => state.serviceArea
  );

  useEffect(() => {
    dispatch(fetchServiceArea(id));

    return () => {
      dispatch(clearError());
      dispatch(clearCurrentServiceArea());
    };
  }, [dispatch, id]);

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${apiUrl.replace("/api", "")}/storage/${imagePath}`;
  };

  if (isLoading && !serviceArea) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/service-areas"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Service Area</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!serviceArea) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/service-areas"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{serviceArea.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Service area details</p>
          </div>
        </div>
        <Link
          href={`/admin/service-areas/${id}/edit`}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {serviceArea.image && (
              <div className="flex-shrink-0">
                <img
                  src={getImageUrl(serviceArea.image) || ""}
                  alt={serviceArea.name}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                <p className="text-base text-gray-900">{serviceArea.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Slug</label>
                <p className="text-base text-gray-900">{serviceArea.slug}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    serviceArea.status
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {serviceArea.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {serviceArea.description && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
              <p className="text-base text-gray-900 whitespace-pre-wrap">
                {serviceArea.description}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Created: {new Date(serviceArea.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Updated: {new Date(serviceArea.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
