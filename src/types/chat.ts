export interface Role {
  id: number;
  name: string;
}

export interface ChatUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  roles: Role[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: ChatUser;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LatestMessage {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  admin: ChatUser;
  user: ChatUser;
  sender?: ChatUser;
  receiver?: ChatUser;
  other_user?: ChatUser;
  latest_message?: LatestMessage;
  messages?: Message[];
  unread_count: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface ConversationsResponse {
  data: Conversation[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ConversationResponse {
  message?: string;
  data: Conversation;
}

export interface MessageResponse {
  message: string;
  data: Message;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export interface SendMessagePayload {
  message: string;
}
