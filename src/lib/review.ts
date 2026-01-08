import {
  Review,
  ReviewStats,
  AdminReviewStats,
  CreateReviewData,
  CanReviewResponse,
  ReviewsResponse,
  ReviewStatsResponse,
  AdminReviewStatsResponse,
} from "@/types/review";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const TOKEN_STORAGE_KEY = 'np_admin_token';

async function getAuthToken(): Promise<string | null> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// ============ Customer Review Functions ============

/**
 * Create a new review (customer or technician)
 */
export async function createReview(data: CreateReviewData): Promise<Review> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  // Determine the endpoint based on context (customer or technician)
  // The backend will validate based on the review type
  const endpoint = data.type === 'technician_to_customer'
    ? `${API_BASE_URL}/technician/reviews`
    : `${API_BASE_URL}/customer/reviews`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse<{ data: Review; message: string }>(response);
  return result.data;
}

/**
 * Check if user can review an order
 */
export async function canReviewOrder(orderId: string): Promise<CanReviewResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/customer/orders/${orderId}/can-review`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<CanReviewResponse>(response);
}

/**
 * Get reviews for a specific order
 */
export async function getOrderReviews(orderId: string): Promise<Review[]> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/customer/orders/${orderId}/reviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await handleResponse<{ data: Review[] }>(response);
  return result.data;
}

/**
 * Get reviews written by the current user (customer)
 */
export async function getMyReviews(page: number = 1, limit: number = 20): Promise<ReviewsResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/customer/reviews?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<ReviewsResponse>(response);
}

/**
 * Get reviews received by the current user (from technicians)
 */
export async function getReceivedReviews(page: number = 1, limit: number = 20): Promise<ReviewsResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/customer/reviews/received?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<ReviewsResponse>(response);
}

// ============ Vendor Review Functions ============

/**
 * Get reviews for the vendor's company
 */
export async function getVendorReviews(
  page: number = 1,
  limit: number = 20,
  rating?: number
): Promise<ReviewsResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  if (rating) params.append('rating', String(rating));

  const response = await fetch(`${API_BASE_URL}/vendor/reviews?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<ReviewsResponse>(response);
}

/**
 * Get vendor review statistics
 */
export async function getVendorReviewStats(): Promise<ReviewStats> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/vendor/reviews/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await handleResponse<ReviewStatsResponse>(response);
  return result.data;
}

// ============ Technician Review Functions ============

/**
 * Get reviews written by the technician
 */
export async function getTechnicianMyReviews(page: number = 1, limit: number = 20): Promise<ReviewsResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/technician/reviews?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<ReviewsResponse>(response);
}

/**
 * Get reviews received by the technician (from customers)
 */
export async function getTechnicianReceivedReviews(page: number = 1, limit: number = 20): Promise<ReviewsResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/technician/reviews/received?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<ReviewsResponse>(response);
}

/**
 * Create a review as technician (for customer)
 */
export async function createTechnicianReview(data: CreateReviewData): Promise<Review> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/technician/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await handleResponse<{ data: Review; message: string }>(response);
  return result.data;
}

// ============ Admin Review Functions ============

/**
 * Get all reviews (admin only)
 */
export async function getAdminReviews(
  page: number = 1,
  limit: number = 20,
  type?: string,
  rating?: number
): Promise<ReviewsResponse> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  if (type) params.append('type', type);
  if (rating) params.append('rating', String(rating));

  const response = await fetch(`${API_BASE_URL}/admin/reviews?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<ReviewsResponse>(response);
}

/**
 * Get admin review statistics
 */
export async function getAdminReviewStats(): Promise<AdminReviewStats> {
  const token = await getAuthToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/admin/reviews/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await handleResponse<AdminReviewStatsResponse>(response);
  return result.data;
}

// ============ Helper Functions ============

/**
 * Format date for display
 */
export function formatReviewDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
