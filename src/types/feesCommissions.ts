// Fees & Commissions Settings Types

export interface PlatformCommission {
  default_rate: number; // 0-100
  minimum_commission: number; // >= 0
  currency: string; // "AED"
}

export interface TaxSettings {
  vat_enabled: boolean;
  vat_rate: number; // 0-100
  tax_registration_number: string | null;
}

export type PayoutFrequency = "weekly" | "bi_weekly" | "monthly";
export type PayoutDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | null;

export interface PayoutSettings {
  frequency: PayoutFrequency;
  payout_day: PayoutDay;
  minimum_payout_amount: number; // >= 0
  currency: string; // "AED"
}

export interface UpdatedBy {
  id: string;
  name: string;
}

export interface FeesCommissionsSettings {
  platform_commission: PlatformCommission;
  tax_settings: TaxSettings;
  payout_settings: PayoutSettings;
  updated_at: string; // ISO 8601
  updated_by: UpdatedBy | null;
}

export interface FeesCommissionsSettingsResponse {
  status: "success" | "error";
  message?: string;
  data: FeesCommissionsSettings;
  errors?: Record<string, string[]>;
}

export interface FeesCommissionsSettingsUpdateData {
  platform_commission?: {
    default_rate?: number;
    minimum_commission?: number;
  };
  tax_settings?: {
    vat_enabled?: boolean;
    vat_rate?: number;
    tax_registration_number?: string;
  };
  payout_settings?: {
    frequency?: PayoutFrequency;
    payout_day?: PayoutDay;
    minimum_payout_amount?: number;
  };
}

// Category Commission Override Types

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryCommissionOverride {
  id: string;
  category: CategoryInfo;
  commission_rate: number; // 0-100
  is_active: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface CategoryCommissionOverrideListResponse {
  status: "success" | "error";
  data: CategoryCommissionOverride[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  errors?: Record<string, string[]>;
}

export interface CategoryCommissionOverrideResponse {
  status: "success" | "error";
  message?: string;
  data: CategoryCommissionOverride;
  errors?: Record<string, string[]>;
}

export interface CategoryCommissionOverrideCreateData {
  category_id: string;
  commission_rate: number; // 0-100
  is_active?: boolean;
}

export interface CategoryCommissionOverrideUpdateData {
  commission_rate?: number; // 0-100
  is_active?: boolean;
}

export interface CategoryCommissionOverrideDeleteResponse {
  status: "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
}

// Commission Calculation Helper
export interface CommissionCalculation {
  orderTotal: number;
  commissionRate: number;
  minimumCommission: number;
  calculatedCommission: number;
  finalCommission: number;
}
