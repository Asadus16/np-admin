"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Star, MessageSquare, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getMyReviews, getReceivedReviews, formatReviewDate } from "@/lib/review";
import { Review, ReviewsResponse } from "@/types/review";

type TabType = "given" | "received";

export default function CustomerReviewsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("given");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response: ReviewsResponse;
      if (activeTab === "given") {
        response = await getMyReviews(currentPage);
      } else {
        response = await getReceivedReviews(currentPage);
      }
      setReviews(response.data);
      setTotalPages(response.meta.last_page);
      setTotal(response.meta.total);
    } catch (err) {
      setError("Failed to load reviews");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getReviewTypeLabel = (type: string): string => {
    switch (type) {
      case "customer_to_vendor":
        return "Service Review";
      case "customer_to_technician":
        return "Technician Review";
      case "technician_to_customer":
        return "From Technician";
      default:
        return "Review";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">My Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">View reviews you've given and received</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => handleTabChange("given")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "given"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Reviews I Gave
          </button>
          <button
            onClick={() => handleTabChange("received")}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "received"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Reviews I Received
          </button>
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadReviews}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {activeTab === "given"
              ? "You haven't left any reviews yet."
              : "You haven't received any reviews yet."}
          </p>
          {activeTab === "given" && (
            <Link
              href="/customer/orders"
              className="inline-block mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
            >
              View your completed orders
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="text-sm text-gray-500">{total} review{total !== 1 ? "s" : ""}</p>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
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
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {getReviewTypeLabel(review.type)}
                      </span>
                    </div>
                    {activeTab === "given" ? (
                      <p className="text-sm text-gray-600">
                        {review.company?.name || review.reviewee?.name || "Unknown"}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        From: {review.reviewer?.name || "Unknown"}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatReviewDate(review.created_at)}
                  </span>
                </div>

                {review.comment && (
                  <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
                )}

                {review.order && (
                  <div className="pt-3 border-t border-gray-100">
                    <Link
                      href={`/customer/orders/${review.order.id}`}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Order #{review.order.order_number}
                      {review.order.service_name && ` • ${review.order.service_name}`}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
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
          )}
        </>
      )}
    </div>
  );
}
