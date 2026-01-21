// Admin Points Settings Types
export interface PointsSettings {
  aed_per_point: number; // X: Spend X AED to earn 1 point
  discount_per_point: number; // Y: 1 point = Y AED discount
  min_points_to_redeem: number; // Minimum points required to redeem
}

export interface PointsSettingsResponse {
  data: PointsSettings;
  message?: string;
}

export interface PointsSettingsUpdateData {
  aed_per_point: number;
  discount_per_point: number;
  min_points_to_redeem: number;
}

// Customer Points Types
export interface PointsBalance {
  points: number;
  available_points: number;
  pending_points: number;
  expiring_soon: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
}

export interface PointsBalanceResponse {
  data: PointsBalance;
  message: string;
}

export interface PointsTransaction {
  id: number;
  type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  points: number; // Positive for earned, negative for redeemed
  balance_after: number;
  order_id: number | null;
  order_number: string | null;
  description: string;
  created_at: string;
}

export interface PointsHistoryResponse {
  data: PointsTransaction[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export interface PointsCalculationResponse {
  data: {
    order_id: number;
    order_total: number;
    points_earned: number;
    aed_per_point: number;
    formula: string;
  };
  message: string;
}

export interface RedemptionCalculationResponse {
  data: {
    points_to_redeem: number;
    discount_amount: number;
    discount_per_point: number;
    order_total_after_discount: number;
    can_redeem: boolean;
    available_points: number;
    min_points_required: number;
  };
  message: string;
}

export interface RedeemPointsResponse {
  data: {
    order_id: number;
    points_redeemed: number;
    discount_amount: number;
    new_balance: number;
    transaction_id: number;
    order_total_before: number;
    order_total_after: number;
  };
  message: string;
}

export interface CancelRedemptionResponse {
  data: {
    order_id: number;
    points_returned: number;
    new_balance: number;
    transaction_id: number;
  };
  message: string;
}
