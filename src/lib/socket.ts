import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:6001';

let socket: Socket | null = null;

export interface SocketMessage {
  conversationId: string;
  senderId: string;
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

/**
 * Initialize Socket.IO connection
 */
export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
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
 * Connect to Socket.IO server
 */
export const connectSocket = (): void => {
  if (socket && !socket.connected) {
    socket.connect();
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
  if (socket && socket.connected) {
    socket.emit('join', { conversationId });
  }
};

/**
 * Leave a conversation room
 */
export const leaveConversation = (conversationId: string): void => {
  if (socket && socket.connected) {
    socket.emit('leave', { conversationId });
  }
};

/**
 * Send a message through Socket.IO
 */
export const sendSocketMessage = (
  conversationId: string,
  senderId: string,
  message: string,
  token: string
): void => {
  if (socket && socket.connected) {
    socket.emit('message', {
      conversationId,
      senderId,
      message,
      token,
    });
  }
};

/**
 * Listen for incoming messages
 */
export const onMessage = (callback: (data: SocketMessage) => void): void => {
  if (socket) {
    socket.on('message', callback);
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
 * Emit typing indicator
 */
export const emitTyping = (
  conversationId: string,
  userId: string,
  userEmail: string,
  userName: string,
  isTyping: boolean
): void => {
  if (socket && socket.connected) {
    socket.emit('typing', {
      conversationId,
      userId,
      userEmail,
      userName,
      isTyping,
    });
  }
};

/**
 * Listen for typing indicators
 */
export const onTyping = (callback: (data: TypingIndicator) => void): void => {
  if (socket) {
    socket.on('typing', callback);
  }
};

/**
 * Remove typing listener
 */
export const offTyping = (callback: (data: TypingIndicator) => void): void => {
  if (socket) {
    socket.off('typing', callback);
  }
};
