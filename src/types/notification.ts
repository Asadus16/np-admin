export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any> | null;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface NotificationListResponse {
  status: string;
  data: Notification[];
}

export interface UnreadCountResponse {
  status: string;
  data: {
    unread_count: number;
  };
}

export interface NotificationActionResponse {
  status: string;
  message: string;
  data?: {
    count?: number;
  };
}
