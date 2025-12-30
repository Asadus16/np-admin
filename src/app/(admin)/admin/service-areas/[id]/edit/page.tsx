"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchServiceArea,
  updateServiceArea,
  clearError,
  clearCurrentServiceArea,
} from "@/store/slices/serviceAreaSlice";

interface FormErrors {
  name?: string;
  description?: string;
  image?: string;
  general?: string;
}

export default function EditServiceAreaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { currentServiceArea, isLoading, isSubmitting, error } = useAppSelector(
    (state) => state.serviceArea
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true,
    image: null as File | null,
  });

  useEffect(() => {
    dispatch(fetchServiceArea(id));

    return () => {
      dispatch(clearError());
      dispatch(clearCurrentServiceArea());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentServiceArea) {
      setFormData({
        name: currentServiceArea.name,
        description: currentServiceArea.description || "",
        status: currentServiceArea.status,
        image: null,
      });
      if (currentServiceArea.image) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const imageUrl = currentServiceArea.image.startsWith("http")
          ? currentServiceArea.image
          : `${apiUrl.replace("/api", "")}/storage/${currentServiceArea.image}`;
        setExistingImage(imageUrl);
      }
    }
  }, [currentServiceArea]);

  useEffect(() => {
    if (error) {
      if (error.errors) {
        setErrors({
          name: error.errors.name?.[0],
          description: error.errors.description?.[0],
          image: error.errors.image?.[0],
        });
      } else {
        setErrors({ general: error.message });
      }
    }
  }, [error]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image must be less than 2MB" });
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Please select a valid image file (JPEG, PNG, GIF, WebP)" });
        return;
      }

      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setExistingImage(null);
      setErrors({ ...errors, image: undefined });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    setExistingImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }

    try {
      await dispatch(
        updateServiceArea({
          id,
          data: {
            name: formData.name,
            description: formData.description,
            image: formData.image || undefined,
            status: formData.status,
          },
        })
      ).unwrap();
      router.push("/admin/service-areas");
    } catch {
      // Error is handled by Redux and useEffect
    }
  };

  if (isLoading && !currentServiceArea) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/service-areas"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Service Area</h1>
          <p className="text-sm text-gray-500 mt-1">Update service area details</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Area Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Enter service area name"
              className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              placeholder="Enter service area description"
              rows={4}
              className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            {imagePreview || existingImage ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview || existingImage || ""}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer ${
                  errors.image ? "border-red-500" : "border-gray-300"
                }`}
              >
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF or WebP (max. 2MB)</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
            {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status ? "active" : "inactive"}
              onChange={(e) => setFormData({ ...formData, status: e.target.value === "active" })}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/admin/service-areas"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Service Area"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
