export interface Plan {
  id: string;
  name: string;
  description: string | null;
  monthly_price: number | null;
  yearly_price: number | null;
  status: boolean;
  discount: number | null;
  commission: number | null;
  created_at: string;
  updated_at: string;
}

export interface PlanFormData {
  name: string;
  description?: string | null;
  monthly_price?: number | null;
  yearly_price?: number | null;
  status?: boolean;
  discount?: number | null;
  commission?: number | null;
}

export interface PlanListResponse {
  data: Plan[];
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

export interface PlanResponse {
  data: Plan;
}

export interface PlanCreateResponse {
  message: string;
  data: Plan;
}

export interface PlanUpdateResponse {
  message: string;
  data: Plan;
}

export interface PlanDeleteResponse {
  message: string;
}
