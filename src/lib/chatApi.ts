import {
  ConversationsResponse,
  ConversationResponse,
  MessageResponse,
  UnreadCountResponse,
  SendMessagePayload,
} from '@/types/chat';
import { getAuthFromStorage, ApiException } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getAuthToken(): Promise<string> {
  const auth = getAuthFromStorage();
  if (!auth?.token) {
    throw new ApiException('Not authenticated', 401);
  }
  return auth.token;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiException(
      data.message || 'An error occurred',
      response.status,
      data.errors
    );
  }

  return data as T;
}

/**
 * Get all conversations for the authenticated user
 * @param page - Page number for pagination (default: 1)
 * @returns Paginated list of conversations
 */
export async function getConversations(page: number = 1): Promise<ConversationsResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/chat/conversations?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<ConversationsResponse>(response);
}

/**
 * Start a new conversation or get existing one with a user
 * @param userId - Encrypted user ID to start conversation with
 * @returns Conversation with messages
 */
export async function startOrGetConversation(userId: string): Promise<ConversationResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/chat/conversations/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<ConversationResponse>(response);
}

/**
 * Get a specific conversation with all messages
 * Automatically marks unread messages as read
 * @param conversationId - Encrypted conversation ID
 * @returns Conversation with all messages
 */
export async function getConversation(conversationId: string): Promise<ConversationResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/chat/conversations/${conversationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<ConversationResponse>(response);
}

/**
 * Send a message in a conversation
 * @param conversationId - Encrypted conversation ID
 * @param payload - Message content
 * @returns The sent message
 */
export async function sendMessage(
  conversationId: string,
  payload: SendMessagePayload
): Promise<MessageResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<MessageResponse>(response);
}

/**
 * Mark all unread messages in a conversation as read
 * @param conversationId - Encrypted conversation ID
 * @returns Success message
 */
export async function markMessagesAsRead(conversationId: string): Promise<{ message: string }> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/chat/conversations/${conversationId}/mark-read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Get total unread message count across all conversations
 * @returns Unread count
 */
export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const token = await getAuthToken();

  const response = await fetch(`${API_URL}/chat/unread-count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<UnreadCountResponse>(response);
}

/**
 * Search for users to start a conversation with
 * Returns only users the authenticated user is allowed to chat with
 * @param query - Search query string
 * @returns List of users matching the search
 */
export async function searchUsers(query: string = ''): Promise<{
  data: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}> {
  const token = await getAuthToken();

  const params = new URLSearchParams();
  if (query) params.append('search', query);

  const response = await fetch(`${API_URL}/chat/users/search?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse<{ data: Array<{ id: string; name: string; email: string; role: string }> }>(response);
}
