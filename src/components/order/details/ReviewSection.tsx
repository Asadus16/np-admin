"use client";

import { Star } from "lucide-react";
import { ReviewSectionProps } from "./types";
import { getReviewTypeLabel } from "./helpers/orderFormatters";

export function ReviewSection({
  existingReviews,
  availableReviewTypes,
  onOpenReviewModal,
}: ReviewSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Reviews</h2>
      </div>
      <div className="p-4 space-y-4">
        {/* Existing Reviews */}
        {existingReviews.length > 0 && (
          <div className="space-y-3">
            {existingReviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
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
                  <span className="text-xs text-gray-500">
                    {review.type === "customer_to_vendor" && "Service Review"}
                    {review.type === "customer_to_technician" && "Technician Review"}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Review Buttons */}
        {availableReviewTypes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableReviewTypes.map((type) => (
              <button
                key={type}
                onClick={() => onOpenReviewModal(type)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Star className="h-4 w-4 mr-2" />
                {getReviewTypeLabel(type)}
              </button>
            ))}
          </div>
        )}

        {/* No reviews and can't add more */}
        {existingReviews.length === 0 && availableReviewTypes.length === 0 && (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
