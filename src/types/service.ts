export interface Category {
  id: string;
  name: string;
}

export interface SubService {
  id: string;
  name: string;
  price: string;
  duration: number;
  images: string[];
  service_id: string;
  service?: {
    id: string;
    name: string;
  };
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  category_id: string | null;
  category?: Category;
  status: boolean;
  sub_services?: SubService[];
  created_at: string;
  updated_at: string;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  category_id: string;
  image?: File | null;
  status?: boolean;
}

export interface SubServiceFormData {
  name: string;
  price: number;
  duration: number;
  images?: File[];
  status?: boolean;
  replace_images?: boolean;
}

export interface ServiceListResponse {
  data: Service[];
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

export interface ServiceResponse {
  data: Service;
}

export interface ServiceCreateResponse {
  message: string;
  data: Service;
}

export interface SubServiceListResponse {
  data: SubService[];
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

export interface SubServiceResponse {
  data: SubService;
}

export interface SubServiceCreateResponse {
  message: string;
  data: SubService;
}

export interface DeleteResponse {
  message: string;
}

