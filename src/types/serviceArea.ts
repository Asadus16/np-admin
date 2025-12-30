export interface ServiceArea {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceAreaFormData {
  name: string;
  description?: string;
  image?: File | null;
  status?: boolean;
}

export interface ServiceAreaListResponse {
  data: ServiceArea[];
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

export interface ServiceAreaResponse {
  data: ServiceArea;
}

export interface ServiceAreaCreateResponse {
  message: string;
  data: ServiceArea;
}
