"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Loader2,
  DollarSign,
  Clock,
  Image as ImageIcon,
  X,
  Upload,
} from "lucide-react";
import { getService, deleteService } from "@/lib/service";
import {
  getSubServices,
  createSubService,
  updateSubService,
  deleteSubService,
} from "@/lib/service";
import { Service, SubService, SubServiceFormData } from "@/types/service";
import { ApiException } from "@/lib/auth";

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SubServiceFormData>({
    name: "",
    price: 0,
    duration: 60,
    status: true,
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchService();
    fetchSubServices();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getService(serviceId);
      setService(response.data);
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message);
      } else {
        setError("Failed to load service");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubServices = async () => {
    try {
      const response = await getSubServices(serviceId, 1, 100);
      setSubServices(response.data);
    } catch (err) {
      console.error("Error fetching sub-services:", err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData({ ...formData, images: files });
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Sub-service name is required");
      return;
    }

    if (formData.price < 0) {
      setError("Price must be at least 0");
      return;
    }

    if (formData.duration < 1) {
      setError("Duration must be at least 1 minute");
      return;
    }

    try {
      if (editingId) {
        await updateSubService(serviceId, editingId, formData);
      } else {
        await createSubService(serviceId, formData);
      }
      await fetchSubServices();
      resetForm();
    } catch (err) {
      if (err instanceof ApiException) {
        setError(err.message || "Failed to save sub-service");
        if (err.errors) {
          const errorMessages = Object.values(err.errors).flat().join(", ");
          setError(errorMessages);
        }
      } else {
        setError("Failed to save sub-service");
      }
    }
  };

  const handleEdit = (subService: SubService) => {
    setEditingId(subService.id);
    setFormData({
      name: subService.name,
      price: parseFloat(subService.price),
      duration: subService.duration,
      status: subService.status,
      images: [],
    });
    setImagePreviews(subService.images || []);
    setShowAddForm(true);
  };

  const handleDelete = async (subServiceId: string) => {
    if (!confirm("Are you sure you want to delete this sub-service?")) {
      return;
    }

    try {
      setIsDeleting(subServiceId);
      await deleteSubService(serviceId, subServiceId);
      await fetchSubServices();
    } catch (err) {
      if (err instanceof ApiException) {
        alert(err.message);
      } else {
        alert("Failed to delete sub-service");
      }
    } finally {
      setIsDeleting(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      duration: 60,
      status: true,
      images: [],
    });
    setImagePreviews([]);
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleDeleteService = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this service? This will also delete all associated sub-services. This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting("service");
      await deleteService(serviceId);
      router.push("/vendor/services");
    } catch (err) {
      if (err instanceof ApiException) {
        alert(err.message);
      } else {
        alert("Failed to delete service");
      }
      setIsDeleting(null);
    }
  };

  if (isLoading && !service) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/vendor/services"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Service Details</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/vendor/services"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{service.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {service.category?.name || "No category"} • {subServices.length} sub-service
              {subServices.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/vendor/services/${serviceId}/edit`}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Edit Service
          </Link>
          <button
            onClick={handleDeleteService}
            disabled={isDeleting === "service"}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting === "service" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Service
              </>
            )}
          </button>
        </div>
      </div>

      {/* Service Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {service.image && (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-sm text-gray-900 mt-1">
                {service.description || "No description provided"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                  service.status
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {service.status ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Services Section */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Sub-Services</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage pricing and details for individual service offerings
            </p>
          </div>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Sub-Service
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (AED) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    required
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })
                    }
                    required
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                <div className="space-y-3">
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload images</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 2MB each</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                >
                  {editingId ? "Update Sub-Service" : "Create Sub-Service"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sub-Services List */}
        <div className="p-6">
          {subServices.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500">No sub-services yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Add your first sub-service to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subServices.map((subService) => (
                <div
                  key={subService.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {subService.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          {parseFloat(subService.price).toFixed(2)} AED
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {subService.duration} min
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        subService.status
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {subService.status ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {subService.images && subService.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {subService.images.slice(0, 3).map((image, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={index}
                          src={image}
                          alt={`${subService.name} ${index + 1}`}
                          className="w-full h-16 object-cover rounded border border-gray-200"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(subService)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(subService.id)}
                      disabled={isDeleting === subService.id}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      {isDeleting === subService.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

