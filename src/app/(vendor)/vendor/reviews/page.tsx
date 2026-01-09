"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, TrendingUp, ChevronLeft, ChevronRight, Loader2, MessageSquare } from "lucide-react";
import { getVendorReviews, getVendorReviewStats, formatReviewDate } from "@/lib/review";
import { Review, ReviewStats, ReviewsResponse } from "@/types/review";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reviewsResponse, statsResponse] = await Promise.all([
        getVendorReviews(currentPage, 20, ratingFilter),
        getVendorReviewStats(),
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
  }, [currentPage, ratingFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (value: string) => {
    setRatingFilter(value === "all" ? undefined : parseInt(value));
    setCurrentPage(1);
  };

  const getReviewTypeLabel = (type: string): string => {
    switch (type) {
      case "customer_to_vendor":
        return "Service Review";
      case "customer_to_technician":
        return "Technician Review";
      default:
        return "Review";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">View customer reviews for your services</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:col-span-2">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">
                  {stats.average_rating.toFixed(1)}
                </p>
                <div className="flex items-center gap-1 mt-1 justify-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i <= Math.round(stats.average_rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">{stats.total_reviews} reviews</p>
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3">{rating}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: stats.total_reviews > 0
                            ? `${((stats.breakdown[rating] || 0) / stats.total_reviews) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6">
                      {stats.breakdown[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-500">5 Star Reviews</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.breakdown[5] || 0}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total Reviews</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{stats.total_reviews}</p>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">All Reviews</h2>
          <select
            value={ratingFilter?.toString() || "all"}
            onChange={(e) => handleFilterChange(e.target.value)}
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
            <p className="text-gray-500">
              {ratingFilter
                ? `No ${ratingFilter}-star reviews yet`
                : "No reviews yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {review.reviewer?.name || "Anonymous"}
                        </span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {review.order?.service_name || "Service"} - {formatReviewDate(review.created_at)}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {getReviewTypeLabel(review.type)}
                    </span>
                  </div>
                  {review.comment ? (
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No comment provided</p>
                  )}
                  {review.order && (
                    <p className="text-xs text-gray-400 mt-2">
                      Order #{review.order.order_number}
                    </p>
                  )}
                </div>
              ))}
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
