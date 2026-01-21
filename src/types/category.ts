export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  status: boolean;
  services_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  image?: File | null;
  status?: boolean;
}

export interface CategoryListResponse {
  data: Category[];
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

export interface CategoryResponse {
  data: Category;
}

export interface CategoryCreateResponse {
  message: string;
  data: Category;
}
