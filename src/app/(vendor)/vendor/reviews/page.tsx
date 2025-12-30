"use client";

import { useState } from "react";
import { Star, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react";

const reviews = [
  { id: 1, customer: "John Smith", rating: 5, comment: "Excellent service! Mike was very professional and fixed the issue quickly. Highly recommend!", date: "Mar 15, 2024", service: "Plumbing Repair", responded: true },
  { id: 2, customer: "Sarah Johnson", rating: 4, comment: "Good work overall. Arrived on time and got the job done. A bit pricey but worth it.", date: "Mar 14, 2024", service: "Drain Cleaning", responded: false },
  { id: 3, customer: "Mike Brown", rating: 5, comment: "Fantastic experience! Very knowledgeable and explained everything clearly.", date: "Mar 12, 2024", service: "Pipe Inspection", responded: true },
  { id: 4, customer: "Emily Davis", rating: 3, comment: "Job was completed but took longer than expected. Could improve on time estimates.", date: "Mar 10, 2024", service: "Faucet Replacement", responded: true },
  { id: 5, customer: "Robert Wilson", rating: 5, comment: "Best plumber I've ever hired! Will definitely use again.", date: "Mar 8, 2024", service: "Water Heater Install", responded: false },
];

const stats = {
  average: 4.4,
  total: 156,
  breakdown: { 5: 89, 4: 42, 3: 18, 2: 5, 1: 2 },
};

export default function ReviewsPage() {
  const [filter, setFilter] = useState("all");

  const filteredReviews = filter === "all"
    ? reviews
    : filter === "responded"
    ? reviews.filter((r) => r.responded)
    : reviews.filter((r) => !r.responded);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">View and respond to customer reviews (read-only in M1)</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:col-span-2">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-900">{stats.average}</p>
              <div className="flex items-center gap-1 mt-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(stats.average) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{stats.total} reviews</p>
            </div>
            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3">{rating}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${(stats.breakdown[rating as keyof typeof stats.breakdown] / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-6">{stats.breakdown[rating as keyof typeof stats.breakdown]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <ThumbsUp className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Response Rate</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">78%</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">This Month</span>
          </div>
          <p className="text-2xl font-semibold text-gray-900">+12</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">All Reviews</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
          >
            <option value="all">All Reviews</option>
            <option value="responded">Responded</option>
            <option value="pending">Pending Response</option>
          </select>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReviews.map((review) => (
            <div key={review.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{review.customer}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{review.service} - {review.date}</p>
                </div>
                {review.responded ? (
                  <span className="px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded-full">
                    Responded
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs bg-yellow-50 text-yellow-700 rounded-full">
                    Pending
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{review.comment}</p>
              {!review.responded && (
                <button className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900" disabled>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Respond (Coming Soon)
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
