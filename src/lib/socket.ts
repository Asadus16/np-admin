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

  // Create new socket only if it doesn't exist
  if (!socket) {
    console.log('Initializing new socket connection...');
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      // Auth will be set when connecting via connectSocket()
    });

    // Set up event listeners only once
    socket.on('connect', () => {
      console.log('[SOCKET] Socket connected, id:', socket?.id);
      // If we have a stored userId, re-authenticate to rejoin the user room
      // This handles both initial connection and reconnection scenarios
      if (currentUserId) {
        console.log('[SOCKET] Auto-authenticating user on connect:', currentUserId);
        socket?.emit('auth', { userId: currentUserId });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('[SOCKET] Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, reconnect manually
        socket?.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    isInitialized = true;
    console.log('Socket initialized successfully');
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
    console.log('Connecting socket with auth:', { hasToken: !!token, connected: currentSocket.connected });
  } else if (currentSocket && currentSocket.connected) {
    console.log('Socket already connected');
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
  
  if (!currentSocket) {
    console.warn('Cannot emit typing - socket not initialized');
    return;
  }
  
  // If socket is connected, emit immediately
  if (currentSocket.connected) {
    currentSocket.emit('typing', {
      conversationId,
      userId,
      userEmail,
      userName,
      isTyping,
    });
    console.log('Emitted typing event:', { conversationId, userId, userEmail, userName, isTyping, connected: true });
  } else {
    // If not connected, wait for connection then emit
    console.warn('Socket not connected, waiting for connection before emitting typing...');
    const emitWhenConnected = () => {
      if (currentSocket.connected) {
        currentSocket.emit('typing', {
          conversationId,
          userId,
          userEmail,
          userName,
          isTyping,
        });
        console.log('Emitted typing event after connection:', { conversationId, userId, userEmail, userName, isTyping });
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
    currentSocket.on('typing', (data) => {
      console.log('Received typing event:', data);
      callback(data);
    });
    console.log('Typing listener registered');
  } else {
    console.error('Cannot register typing listener - socket not initialized');
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
    currentSocket.on('typing_start', (data) => {
      console.log('Received typing_start event:', data);
      callback(data);
    });
    console.log('Typing_start listener registered');
  } else {
    console.error('Cannot register typing_start listener - socket not initialized');
  }
};

/**
 * Listen for typing_stop events (alternative implementation)
 */
export const onTypingStop = (
  callback: (data: TypingStartStopData) => void
): void => {
  // Get or initialize socket (won't create duplicate)
  const currentSocket = socket || initializeSocket();
  
  if (currentSocket) {
    currentSocket.on('typing_stop', (data) => {
      console.log('Received typing_stop event:', data);
      callback(data);
    });
    console.log('Typing_stop listener registered');
  } else {
    console.error('Cannot register typing_stop listener - socket not initialized');
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
  console.log('[SOCKET] authenticateUser called with userId:', userId);

  // Store userId for reconnection scenarios
  currentUserId = userId;

  const currentSocket = socket || initializeSocket();
  if (currentSocket) {
    console.log('[SOCKET] Socket exists, connected:', currentSocket.connected, 'id:', currentSocket.id);

    const sendAuth = () => {
      currentSocket.emit('auth', { userId });
      console.log('[SOCKET] Sent auth event with userId:', userId, 'socket id:', currentSocket.id);
    };

    if (currentSocket.connected) {
      sendAuth();
    } else {
      // Wait for connection then authenticate
      currentSocket.once('connect', () => {
        sendAuth();
      });
      // Connect the socket if not already connected
      currentSocket.connect();
      console.log('[SOCKET] Connecting socket for user authentication...');
    }
  } else {
    console.error('[SOCKET] Failed to get socket instance');
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
  console.log('[SOCKET] onNotification called');
  const currentSocket = socket || initializeSocket();

  if (!currentSocket) {
    console.error('[SOCKET] Cannot register notification listener - no socket');
    return;
  }

  // Create the handler function
  const notificationHandler = (data: SocketNotification) => {
    console.log('[SOCKET] >>> RECEIVED NOTIFICATION:', data);
    callback(data);
  };

  // Function to register the listener
  const registerListener = () => {
    console.log('[SOCKET] Registering notification listener, socket id:', currentSocket.id, 'connected:', currentSocket.connected);
    currentSocket.on('notification', notificationHandler);
    console.log('[SOCKET] Notification listener registered successfully');
  };

  // If socket is connected, register immediately
  if (currentSocket.connected) {
    console.log('[SOCKET] Socket already connected, registering notification listener immediately');
    registerListener();
    // Store the mapping for cleanup (no connect handler needed)
    notificationHandlers.set(callback, { wrapper: notificationHandler });
  } else {
    // Socket not connected yet - wait for connection
    console.log('[SOCKET] Socket not connected, waiting for connect event');
    const connectHandler = () => {
      registerListener();
    };
    currentSocket.once('connect', connectHandler);
    // Store both the wrapper and connect handler for cleanup
    notificationHandlers.set(callback, { wrapper: notificationHandler, connectHandler });
  }
};

/**
 * Remove notification listener
 */
export const offNotification = (callback: (data: SocketNotification) => void): void => {
  console.log('[SOCKET] offNotification called');
  const currentSocket = socket;

  if (currentSocket) {
    // Get the stored handlers
    const handlers = notificationHandlers.get(callback);
    if (handlers) {
      // Remove the notification listener
      currentSocket.off('notification', handlers.wrapper);
      // Also remove the connect handler if it exists (in case connection hasn't happened yet)
      if (handlers.connectHandler) {
        currentSocket.off('connect', handlers.connectHandler);
      }
      notificationHandlers.delete(callback);
      console.log('[SOCKET] Notification listener removed successfully');
    } else {
      // Fallback: try to remove the callback directly (legacy behavior)
      currentSocket.off('notification', callback);
      console.log('[SOCKET] Notification listener removed (fallback)');
    }
  }
};
