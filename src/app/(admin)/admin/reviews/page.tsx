"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Star,
  MessageSquare,
  Users,
  Building2,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
} from "lucide-react";
import { getAdminReviews, getAdminReviewStats, formatReviewDate } from "@/lib/review";
import { Review, AdminReviewStats, ReviewsResponse } from "@/types/review";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<AdminReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reviewsResponse, statsResponse] = await Promise.all([
        getAdminReviews(currentPage, 20, typeFilter, ratingFilter),
        getAdminReviewStats(),
      ]);
      setReviews(reviewsResponse.data);
      setTotalPages(reviewsResponse.meta.last_page);
      setTotal(reviewsResponse.meta.total);
      setStats(statsResponse);
    } catch (err) {
      setError("Failed to load reviews");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, typeFilter, ratingFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value === "all" ? undefined : value);
    setCurrentPage(1);
  };

  const handleRatingFilterChange = (value: string) => {
    setRatingFilter(value === "all" ? undefined : parseInt(value));
    setCurrentPage(1);
  };

  const getReviewTypeLabel = (type: string): string => {
    switch (type) {
      case "customer_to_vendor":
        return "Customer → Vendor";
      case "customer_to_technician":
        return "Customer → Technician";
      case "technician_to_customer":
        return "Technician → Customer";
      default:
        return type;
    }
  };

  const getReviewTypeBadgeColor = (type: string): string => {
    switch (type) {
      case "customer_to_vendor":
        return "bg-blue-100 text-blue-700";
      case "customer_to_technician":
        return "bg-purple-100 text-purple-700";
      case "technician_to_customer":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Monitor all reviews across the platform</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MessageSquare className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-500">Total Reviews</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{stats.total_reviews}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-gray-900">
                {stats.average_rating.toFixed(1)}
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(stats.average_rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Vendor Reviews</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.by_type?.customer_to_vendor || 0}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Wrench className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Technician Reviews</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.by_type?.customer_to_technician || 0}
            </p>
          </div>
        </div>
      )}

      {/* Rating Breakdown */}
      {stats && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full"
                    style={{
                      width: stats.total_reviews > 0
                        ? `${(stats.rating_breakdown[rating] / stats.total_reviews) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">
                  {stats.rating_breakdown[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-gray-900">All Reviews</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={typeFilter || "all"}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              >
                <option value="all">All Types</option>
                <option value="customer_to_vendor">Customer → Vendor</option>
                <option value="customer_to_technician">Customer → Technician</option>
                <option value="technician_to_customer">Technician → Customer</option>
              </select>
            </div>
            <select
              value={ratingFilter?.toString() || "all"}
              onChange={(e) => handleRatingFilterChange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Retry
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reviews found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From / To
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-900 max-w-xs truncate">
                          {review.comment || <span className="text-gray-400 italic">No comment</span>}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${getReviewTypeBadgeColor(review.type)}`}>
                          {getReviewTypeLabel(review.type)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900">{review.reviewer?.name || "Unknown"}</p>
                          <p className="text-gray-500">
                            → {review.reviewee?.name || review.company?.name || "Unknown"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {review.order ? (
                          <span className="text-sm text-gray-600">
                            #{review.order.order_number}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {formatReviewDate(review.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {reviews.length} of {total} reviews
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
