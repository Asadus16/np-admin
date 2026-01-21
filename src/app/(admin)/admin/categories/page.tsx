"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCategories,
  deleteCategory,
  setCurrentPage,
  clearError,
} from "@/store/slices/categorySlice";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const {
    categories,
    isLoading,
    isSubmitting,
    error,
    pagination,
  } = useAppSelector((state) => state.category);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortOrder, setSortOrder] = useState<"name_asc" | "name_desc" | "newest" | "oldest">("name_asc");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    dispatch(fetchCategories(pagination.currentPage));
  }, [dispatch, pagination.currentPage]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setDeletingId(id);
    try {
      await dispatch(deleteCategory(id)).unwrap();
      setOpenMenu(null);
      setMenuPosition(null);
    } catch {
      // Error is handled by Redux
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const filteredCategories = categories
    .filter((category) => {
      // Search filter
      if (searchQuery && !category.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Status filter
      if (statusFilter === "active" && !category.status) return false;
      if (statusFilter === "inactive" && category.status) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "newest":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case "oldest":
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        default:
          return 0;
      }
    });

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return `${apiUrl.replace("/api", "")}/storage/${imagePath}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage service categories</p>
        </div>
        <Link
          href="/admin/categories/add"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-visible">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by category name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "name_asc" | "name_desc" | "newest" | "oldest")}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            >
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-visible min-h-[200px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Name
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Slug
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Description
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {category.image ? (
                            <img
                              src={getImageUrl(category.image) || ""}
                              alt={category.name}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {category.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{category.slug}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500 line-clamp-1">
                          {category.description || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            category.status
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          ref={(el) => {
                            if (el) buttonRefs.current.set(category.id, el);
                          }}
                          onClick={() => {
                            if (openMenu === category.id) {
                              setOpenMenu(null);
                              setMenuPosition(null);
                            } else {
                              const button = buttonRefs.current.get(category.id);
                              if (button) {
                                const rect = button.getBoundingClientRect();
                                setMenuPosition({
                                  top: rect.bottom + 4,
                                  left: rect.right - 144,
                                });
                              }
                              setOpenMenu(category.id);
                            }
                          }}
                          className="p-1 rounded hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fixed position dropdown menu */}
            {openMenu && menuPosition && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setOpenMenu(null);
                    setMenuPosition(null);
                  }}
                />
                <div
                  className="fixed w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                  <Link
                    href={`/admin/categories/${openMenu}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                    onClick={() => setOpenMenu(null)}
                  >
                    <Eye className="h-4 w-4" /> View
                  </Link>
                  <Link
                    href={`/admin/categories/${openMenu}/edit`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setOpenMenu(null)}
                  >
                    <Edit className="h-4 w-4" /> Edit
                  </Link>
                  <button
                    onClick={() => {
                      handleDelete(openMenu);
                      setMenuPosition(null);
                    }}
                    disabled={deletingId === openMenu || isSubmitting}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 w-full disabled:opacity-50 rounded-b-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === openMenu ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No categories found</p>
              </div>
            )}

            {pagination.lastPage > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Page {pagination.currentPage} of {pagination.lastPage}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(pagination.currentPage - 1, 1))}
                    disabled={pagination.currentPage === 1}
                    className="p-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.min(pagination.currentPage + 1, pagination.lastPage))}
                    disabled={pagination.currentPage === pagination.lastPage}
                    className="p-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
