// Audit Log Types

export interface AuditLogUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AuditLog {
  id: string;
  user_id: number | null;
  user_type: 'admin' | 'vendor' | 'technician' | 'customer' | string | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  entity_name: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at?: string;
  user?: AuditLogUser | null;
}

export interface AuditLogStats {
  total: number;
  today: number;
  this_week: number;
  this_month: number;
  by_action: Record<string, number>;
  by_user_type: Record<string, number>;
}

export interface AuditLogMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface AuditLogListResponse {
  status: string;
  data: AuditLog[];
  meta: AuditLogMeta;
}

export interface AuditLogResponse {
  status: string;
  data: AuditLog;
}

export interface AuditLogStatsResponse {
  status: string;
  data: AuditLogStats;
}

export interface AuditLogActionTypesResponse {
  status: string;
  data: string[];
}

export interface AuditLogEntityTypesResponse {
  status: string;
  data: string[];
}

export interface AuditLogFilters {
  search?: string;
  action?: string;
  user_type?: string;
  entity_type?: string;
  date_filter?: 'today' | 'week' | 'month' | '';
  from_date?: string;
  to_date?: string;
  page?: number;
  per_page?: number;
}
