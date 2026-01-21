// Coupon Types

export interface Coupon {
  id: string;
  name: string;
  code: string;
  discount: number; // Percentage (0-100)
  min_order: number | null;
  cap: number | null; // Maximum discount amount
  max_usage: number | null;
  used: number;
  validity: string | null; // Date/time string
  status: boolean; // true = active, false = inactive
  created_at: string;
  updated_at: string;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
}

export interface CouponListResponse {
  data: Coupon[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface CouponResponse {
  data: Coupon;
}

export interface CouponCreateResponse {
  message: string;
  data: Coupon;
}

export interface CouponUpdateResponse {
  message: string;
  data: Coupon;
}

export interface DeleteResponse {
  message: string;
}

// Request types
export interface CouponFormData {
  name: string;
  code: string;
  discount: number;
  min_order?: number | null;
  cap?: number | null;
  max_usage?: number | null;
  used?: number;
  validity?: string | null; // Format: Y-m-d H:i:s or Y-m-d
  status?: boolean;
}
