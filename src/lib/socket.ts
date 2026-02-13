import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:6001';

let socket: Socket | null = null;
let isInitialized = false; // Track if socket is initialized
let currentUserId: number | string | null = null; // Track current user for reconnection
// Store notification handlers for proper cleanup (original callback -> { wrapper, connectHandler })
const notificationHandlers = new Map<
  (data: SocketNotification) => void,
  { wrapper: (data: SocketNotification) => void; connectHandler?: () => void }
>();

export interface SocketMessage {
  conversationId: string;
  senderId: string;
  senderEmail?: string; // Added to identify sender
  message: string;
  created_at: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userEmail: string;
  userName: string;
  isTyping: boolean;
}

export interface TypingStartStopData {
  conversationId: string;
  userId: string;
  userEmail?: string;
  userName?: string;
}

export interface SocketConversation {
  id: string;
  sender?: any;
  receiver?: any;
  other_user?: any;
  latest_message?: {
    id: string;
    message: string;
    is_read: boolean;
    created_at: string;
  };
  last_message_at: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface SocketConversationData {
  id: string;
  sender?: any;
  receiver?: any;
  other_user?: any;
  messages: any[];
  latest_message?: {
    id: string;
    message: string;
    is_read: boolean;
    created_at: string;
  };
  last_message_at: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Initialize Socket.IO connection (singleton pattern)
 */
export const initializeSocket = (): Socket => {
  // Return existing socket if already initialized
  if (socket && isInitialized) {
    return socket;
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      // Auth will be set when connecting via connectSocket()
    });

    socket.on('connect', () => {
      if (currentUserId) {
        socket?.emit('auth', { userId: currentUserId });
      }
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        socket?.connect();
      }
    });

    socket.on('connect_error', () => {});

    isInitialized = true;
  }

  return socket;
};

/**
 * Get existing socket instance
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Connect to Socket.IO server with authentication
 */
export const connectSocket = (token?: string): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket && !currentSocket.connected) {
    // If token is provided, include it in auth
    if (token) {
      currentSocket.auth = { token };
    }
    currentSocket.connect();
  }
};

/**
 * Disconnect from Socket.IO server
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
  }
};

/**
 * Join a conversation room
 */
export const joinConversation = (conversationId: string): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit('join', { conversationId });
  }
};

/**
 * Leave a conversation room
 */
export const leaveConversation = (conversationId: string): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit('leave', { conversationId });
  }
};

/**
 * Send a message through Socket.IO
 */
export const sendSocketMessage = (
  conversationId: string,
  senderId: string,
  message: string,
  token: string,
  senderEmail?: string
): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit('message', {
      conversationId,
      senderId,
      senderEmail,
      message,
      token,
    });
  }
};

/**
 * Listen for incoming messages
 */
export const onMessage = (callback: (data: SocketMessage) => void): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket) {
    currentSocket.on('message', callback);
  }
};

/**
 * Remove message listener
 */
export const offMessage = (callback: (data: SocketMessage) => void): void => {
  if (socket) {
    socket.off('message', callback);
  }
};

/**
 * Emit typing indicator (current implementation - single typing event)
 */
export const emitTyping = (
  conversationId: string,
  userId: string,
  userEmail: string,
  userName: string,
  isTyping: boolean
): void => {
  // Get or initialize socket (won't create duplicate)
  const currentSocket = socket || initializeSocket();
  if (!currentSocket) return;

  if (currentSocket.connected) {
    currentSocket.emit('typing', {
      conversationId,
      userId,
      userEmail,
      userName,
      isTyping,
    });
  } else {
    const emitWhenConnected = () => {
      if (currentSocket.connected) {
        currentSocket.emit('typing', {
          conversationId,
          userId,
          userEmail,
          userName,
          isTyping,
        });
        currentSocket.off('connect', emitWhenConnected);
      }
    };
    currentSocket.once('connect', emitWhenConnected);
  }
};

/**
 * Listen for typing indicators (current implementation)
 */
export const onTyping = (callback: (data: TypingIndicator) => void): void => {
  // Get or initialize socket (won't create duplicate)
  const currentSocket = socket || initializeSocket();
  
  if (currentSocket) {
    currentSocket.on('typing', (data) => callback(data));
  }
};

/**
 * Remove typing listener (current implementation)
 */
export const offTyping = (callback: (data: TypingIndicator) => void): void => {
  if (socket) {
    socket.off('typing', callback);
  }
};

/**
 * Emit typing_start event (alternative implementation)
 * Use this if backend supports typing_start/typing_stop events
 */
export const emitTypingStart = (
  conversationId: string,
  userId: string
): void => {
  if (socket && socket.connected) {
    socket.emit('typing_start', {
      conversationId,
      userId,
    });
  }
};

/**
 * Emit typing_stop event (alternative implementation)
 * Use this if backend supports typing_start/typing_stop events
 */
export const emitTypingStop = (
  conversationId: string,
  userId: string
): void => {
  if (socket && socket.connected) {
    socket.emit('typing_stop', {
      conversationId,
      userId,
    });
  }
};

/**
 * Listen for typing_start events (alternative implementation)
 */
export const onTypingStart = (
  callback: (data: TypingStartStopData) => void
): void => {
  // Get or initialize socket (won't create duplicate)
  const currentSocket = socket || initializeSocket();
  
  if (currentSocket) {
    currentSocket.on('typing_start', (data) => callback(data));
  }
};

/**
 * Listen for typing_stop events (alternative implementation)
 */
export const onTypingStop = (
  callback: (data: TypingStartStopData) => void
): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket) {
    currentSocket.on('typing_stop', (data) => callback(data));
  }
};

/**
 * Remove typing_start listener (alternative implementation)
 */
export const offTypingStart = (
  callback: (data: TypingStartStopData) => void
): void => {
  if (socket) {
    socket.off('typing_start', callback);
  }
};

/**
 * Remove typing_stop listener (alternative implementation)
 */
export const offTypingStop = (
  callback: (data: TypingStartStopData) => void
): void => {
  if (socket) {
    socket.off('typing_stop', callback);
  }
};

/**
 * Listen for conversations list updates
 */
export const onConversations = (
  callback: (data: { conversations: SocketConversation[] }) => void
): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket) {
    currentSocket.on('conversations', callback);
  }
};

/**
 * Remove conversations listener
 */
export const offConversations = (
  callback: (data: { conversations: SocketConversation[] }) => void
): void => {
  if (socket) {
    socket.off('conversations', callback);
  }
};

/**
 * Listen for single conversation updates
 */
export const onConversation = (
  callback: (data: SocketConversationData) => void
): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket) {
    currentSocket.on('conversation', callback);
  }
};

/**
 * Remove conversation listener
 */
export const offConversation = (
  callback: (data: SocketConversationData) => void
): void => {
  if (socket) {
    socket.off('conversation', callback);
  }
};

/**
 * Listen for conversation updates
 */
export const onConversationUpdated = (
  callback: (data: SocketConversation) => void
): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket) {
    currentSocket.on('conversation_updated', callback);
  }
};

/**
 * Remove conversation updated listener
 */
export const offConversationUpdated = (
  callback: (data: SocketConversation) => void
): void => {
  if (socket) {
    socket.off('conversation_updated', callback);
  }
};

/**
 * Request conversations from server via socket
 */
export const requestConversations = (page: number = 1): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit('get_conversations', { page });
  }
};

/**
 * Request a specific conversation from server via socket
 */
export const requestConversation = (conversationId: string): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit('get_conversation', { conversationId });
  }
};

/**
 * Request unread count from server via socket
 */
export const requestUnreadCount = (): void => {
  const currentSocket = socket || initializeSocket();
  if (currentSocket && currentSocket.connected) {
    currentSocket.emit('get_unread_count', {});
  }
};

/**
 * Authenticate user and join user-specific room for notifications
 */
export const authenticateUser = (userId: number | string): void => {
  currentUserId = userId;
  const currentSocket = socket || initializeSocket();
  if (!currentSocket) return;

  const sendAuth = () => currentSocket.emit('auth', { userId });

  if (currentSocket.connected) {
    sendAuth();
  } else {
    currentSocket.once('connect', sendAuth);
    currentSocket.connect();
  }
};

export interface SocketNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  data: Record<string, any>;
  read_at: string | null;
  created_at: string;
}

/**
 * Listen for incoming notifications
 * Uses the same pattern as useSocket hook - registers directly with connect fallback
 */
export const onNotification = (callback: (data: SocketNotification) => void): void => {
  const currentSocket = socket || initializeSocket();
  if (!currentSocket) return;

  const notificationHandler = (data: SocketNotification) => callback(data);
  const registerListener = () => currentSocket.on('notification', notificationHandler);

  if (currentSocket.connected) {
    registerListener();
    notificationHandlers.set(callback, { wrapper: notificationHandler });
  } else {
    const connectHandler = () => registerListener();
    currentSocket.once('connect', connectHandler);
    notificationHandlers.set(callback, { wrapper: notificationHandler, connectHandler });
  }
};

/**
 * Remove notification listener
 */
export const offNotification = (callback: (data: SocketNotification) => void): void => {
  const currentSocket = socket;
  if (!currentSocket) return;

  const handlers = notificationHandlers.get(callback);
  if (handlers) {
    currentSocket.off('notification', handlers.wrapper);
    if (handlers.connectHandler) currentSocket.off('connect', handlers.connectHandler);
    notificationHandlers.delete(callback);
  } else {
    currentSocket.off('notification', callback);
  }
};

// ============================================
// AUDIT LOG SOCKET FUNCTIONS
// ============================================

export interface SocketAuditLog {
  id: string;
  user_id: number | null;
  user_type: string | null;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  entity_name: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  metadata: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

// Store audit log handlers for proper cleanup
const auditLogHandlers = new Map<
  (data: SocketAuditLog) => void,
  { wrapper: (data: SocketAuditLog) => void; connectHandler?: () => void }
>();

// Store the join room handler for cleanup
let auditLogsRoomJoinHandler: (() => void) | null = null;

// Debug: enable verbose socket logging
let debugEnabled = false;

export const enableSocketDebug = (): void => {
  if (debugEnabled) return;
  debugEnabled = true;
  const currentSocket = socket;
  if (currentSocket) {
    currentSocket.onAny(() => {});
  }
};

export const debugSocketState = (): void => {};

/**
 * Join the admin audit logs room for real-time updates
 */
export const joinAuditLogsRoom = (): void => {
  const currentSocket = socket || initializeSocket();
  if (!currentSocket) return;

  const emitJoin = () => currentSocket.emit('join_audit_logs');
  if (currentSocket.connected) emitJoin();

  if (auditLogsRoomJoinHandler) {
    currentSocket.off('connect', auditLogsRoomJoinHandler);
  }
  auditLogsRoomJoinHandler = () => currentSocket.emit('join_audit_logs');
  currentSocket.on('connect', auditLogsRoomJoinHandler);

  if (!currentSocket.connected) currentSocket.connect();
};

/**
 * Leave the admin audit logs room
 */
export const leaveAuditLogsRoom = (): void => {
  const currentSocket = socket;
  if (!currentSocket) return;

  if (auditLogsRoomJoinHandler) {
    currentSocket.off('connect', auditLogsRoomJoinHandler);
    auditLogsRoomJoinHandler = null;
  }
  if (currentSocket.connected) currentSocket.emit('leave_audit_logs');
};

/**
 * Listen for incoming audit logs
 */
export const onAuditLog = (callback: (data: SocketAuditLog) => void): void => {
  const currentSocket = socket || initializeSocket();
  if (!currentSocket) return;

  const auditLogHandler = (data: SocketAuditLog) => {
    try {
      callback(data);
    } catch {
      // ignore callback errors
    }
  };
  currentSocket.on('audit_log', auditLogHandler);
  auditLogHandlers.set(callback, { wrapper: auditLogHandler });
};

/**
 * Remove audit log listener
 */
export const offAuditLog = (callback: (data: SocketAuditLog) => void): void => {
  const currentSocket = socket;
  if (!currentSocket) return;

  const handlers = auditLogHandlers.get(callback);
  if (handlers) {
    currentSocket.off('audit_log', handlers.wrapper);
    auditLogHandlers.delete(callback);
  }
};

// ============================================
// DISPUTE SOCKET FUNCTIONS
// ============================================

export interface SocketDispute {
  id: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  reason: string;
  reason_label: string;
  reason_details: string | null;
  order_total: number;
  approved_amount: number | null;
  refund_percentage: number | null;
  vendor_response: string | null;
  created_at: string;
}

export interface SocketDisputeEvent {
  event_type: 'created' | 'updated' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  dispute: SocketDispute;
}

// Store dispute handlers for proper cleanup
const disputeHandlers = new Map<
  (data: SocketDisputeEvent) => void,
  { wrapper: (data: SocketDisputeEvent) => void; connectHandler?: () => void }
>();

/**
 * Listen for incoming dispute events
 */
export const onDispute = (callback: (data: SocketDisputeEvent) => void): void => {
  const currentSocket = socket || initializeSocket();
  if (!currentSocket) return;

  const disputeHandler = (data: SocketDisputeEvent) => {
    try {
      callback(data);
    } catch {
      // ignore callback errors
    }
  };
  currentSocket.on('dispute', disputeHandler);
  disputeHandlers.set(callback, { wrapper: disputeHandler });
};

/**
 * Remove dispute listener
 */
export const offDispute = (callback: (data: SocketDisputeEvent) => void): void => {
  const currentSocket = socket;
  if (!currentSocket) return;

  const handlers = disputeHandlers.get(callback);
  if (handlers) {
    currentSocket.off('dispute', handlers.wrapper);
    disputeHandlers.delete(callback);
  }
};

// ============================================
// ADMIN DISPUTE SOCKET FUNCTIONS
// ============================================

// Store the admin disputes room join handler for cleanup
let adminDisputesRoomJoinHandler: (() => void) | null = null;

/**
 * Join the admin disputes room for real-time updates
 */
export const joinAdminDisputesRoom = (): void => {
  const currentSocket = socket || initializeSocket();
  if (!currentSocket) return;

  const emitJoin = () => currentSocket.emit('join_admin_disputes');
  if (currentSocket.connected) emitJoin();

  if (adminDisputesRoomJoinHandler) {
    currentSocket.off('connect', adminDisputesRoomJoinHandler);
  }
  adminDisputesRoomJoinHandler = () => currentSocket.emit('join_admin_disputes');
  currentSocket.on('connect', adminDisputesRoomJoinHandler);

  if (!currentSocket.connected) currentSocket.connect();
};

/**
 * Leave the admin disputes room
 */
export const leaveAdminDisputesRoom = (): void => {
  const currentSocket = socket;
  if (!currentSocket) return;

  if (adminDisputesRoomJoinHandler) {
    currentSocket.off('connect', adminDisputesRoomJoinHandler);
    adminDisputesRoomJoinHandler = null;
  }
  if (currentSocket.connected) currentSocket.emit('leave_admin_disputes');
};
