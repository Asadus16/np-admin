export type ReviewType = 'customer_to_vendor' | 'customer_to_technician' | 'technician_to_customer';

export interface Review {
  id: string;
  order_id: string;
  type: ReviewType;
  rating: number;
  comment: string | null;
  reviewer: {
    id: string;
    name: string;
  };
  reviewee?: {
    id: string;
    name: string;
  };
  company?: {
    id: string;
    name: string;
  };
  order: {
    id: string;
    order_number: string;
    service_name?: string;
  };
  created_at: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  breakdown: Record<number, number>;
  this_month_count: number;
}

export interface AdminReviewStats extends ReviewStats {
  by_type: {
    customer_to_vendor: { count: number; avg_rating: number };
    customer_to_technician: { count: number; avg_rating: number };
    technician_to_customer: { count: number; avg_rating: number };
  };
  rating_breakdown: Record<number, number>;
}

export interface CreateReviewData {
  order_id: string;
  type: ReviewType;
  rating: number;
  comment?: string;
}

export interface CanReviewResponse {
  can_review: boolean;
  reason?: string;
  available_types: ReviewType[];
}

export interface ReviewsResponse {
  data: Review[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ReviewStatsResponse {
  data: ReviewStats;
}

export interface AdminReviewStatsResponse {
  data: AdminReviewStats;
}

// Helper to get review type label
export function getReviewTypeLabel(type: ReviewType): string {
  switch (type) {
    case 'customer_to_vendor':
      return 'Service Review';
    case 'customer_to_technician':
      return 'Technician Review';
    case 'technician_to_customer':
      return 'Customer Review';
    default:
      return 'Review';
  }
}

// Helper to format rating as stars
export function formatRating(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}
