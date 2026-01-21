import {
  Notification,
  NotificationListResponse,
  UnreadCountResponse,
  NotificationActionResponse,
} from "@/types/notification";

import { API_BASE_URL } from '@/config';
const TOKEN_STORAGE_KEY = 'np_admin_token';

async function getAuthToken(): Promise<string | null> {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * Get unread notifications
 */
export async function getUnreadNotifications(limit: number = 10): Promise<Notification[]> {
  const token = await getAuthToken();
  if (!token) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/notifications?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await handleResponse<NotificationListResponse>(response);
  return data.data;
}

/**
 * Get all notifications
 */
export async function getAllNotifications(limit: number = 50): Promise<Notification[]> {
  const token = await getAuthToken();
  if (!token) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/notifications/all?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await handleResponse<NotificationListResponse>(response);
  return data.data;
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  const token = await getAuthToken();
  if (!token) {
    return 0;
  }

  const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await handleResponse<UnreadCountResponse>(response);
  return data.data.unread_count;
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const token = await getAuthToken();
  if (!token) {
    return;
  }

  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  await handleResponse<NotificationActionResponse>(response);
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<number> {
  const token = await getAuthToken();
  if (!token) {
    return 0;
  }

  const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await handleResponse<NotificationActionResponse>(response);
  return data.data?.count || 0;
}
