export interface VendorExclusivePlanCompany {
  id: string;
  name: string;
}

export interface VendorExclusivePlanServiceArea {
  id: string;
  name: string;
}

export interface VendorExclusivePlan {
  id: string;
  company_id: string;
  service_area_id: string;
  company?: VendorExclusivePlanCompany;
  service_area?: VendorExclusivePlanServiceArea;
  status: boolean;
  starts_at: string | null;
  ends_at: string | null;
  notes: string | null;
  price: number | null;
  payment_status: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendorExclusivePlanFormData {
  company_id: string;
  service_area_id: string;
  status?: boolean;
  price?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
  notes?: string | null;
}

export interface VendorExclusivePlanListResponse {
  data: VendorExclusivePlan[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface VendorExclusivePlanResponse {
  data: VendorExclusivePlan;
}

export interface VendorExclusivePlanCreateResponse {
  message: string;
  data: VendorExclusivePlan;
}

export interface VendorExclusivePlanUpdateResponse {
  message: string;
  data: VendorExclusivePlan;
}

export interface VendorExclusivePlanDeleteResponse {
  message: string;
}
