import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  initializeSocket,
  connectSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  onMessage,
  offMessage,
  onConversations,
  offConversations,
  onConversation,
  offConversation,
  onConversationUpdated,
  offConversationUpdated,
  requestConversations,
  requestConversation,
  requestUnreadCount,
  SocketMessage,
} from '@/lib/socket';
import {
  receiveSocketMessage,
  receiveSocketConversations,
  receiveSocketConversation,
  receiveConversationUpdated,
  receiveUnreadCount,
} from '@/store/slices/chatSlice';

/**
 * Hook to manage Socket.IO connection for a specific conversation
 */
export const useSocket = (conversationId: string | null) => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { conversations } = useAppSelector((state) => state.chat);
  const socketRef = useRef(initializeSocket());
  const currentConversationRef = useRef(conversationId);
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  // Handle incoming messages - process ALL messages to update conversation list
  const handleMessage = useCallback(
    (data: SocketMessage) => {
      // Always process messages to update conversation list
      // This ensures receivers get messages even if they're viewing a different conversation
      // Include current user email to help identify own messages
      dispatch(receiveSocketMessage({
        ...data,
        currentUserEmail: user?.email || undefined,
      }));
    },
    [dispatch, user?.email]
  );

  // Handle conversations list
  const handleConversations = useCallback(
    (data: { conversations: any[] }) => {
      dispatch(receiveSocketConversations(data));
    },
    [dispatch]
  );

  // Handle single conversation
  const handleConversation = useCallback(
    (data: any) => {
      dispatch(receiveSocketConversation(data));
    },
    [dispatch]
  );

  // Handle conversation updates
  const handleConversationUpdated = useCallback(
    (data: any) => {
      dispatch(receiveConversationUpdated(data));
    },
    [dispatch]
  );

  // Handle unread count
  const handleUnreadCount = useCallback(
    (data: { unread_count: number }) => {
      dispatch(receiveUnreadCount(data.unread_count));
    },
    [dispatch]
  );

  // Initialize socket connection and listen for real-time updates
  useEffect(() => {
    if (user && token) {
      // Connect with authentication token
      connectSocket(token);
      
      // Wait for connection before setting up listeners
      const setupListeners = () => {
        if (socketRef.current?.connected) {
          console.log('Socket connected, setting up listeners');
          
          // Set up message listener
          onMessage(handleMessage);
          
          // Set up conversation listeners for real-time updates
          onConversations(handleConversations);
          onConversation(handleConversation);
          onConversationUpdated(handleConversationUpdated);
          
          // Listen for unread count updates
          socketRef.current?.on('unread_count', handleUnreadCount);
        } else {
          // Wait for connection
          socketRef.current?.once('connect', setupListeners);
        }
      };
      
      setupListeners();

      return () => {
        offMessage(handleMessage);
        offConversations(handleConversations);
        offConversation(handleConversation);
        offConversationUpdated(handleConversationUpdated);
        socketRef.current?.off('unread_count', handleUnreadCount);
        socketRef.current?.off('connect', setupListeners);
      };
    }
  }, [user, token, handleMessage, handleConversations, handleConversation, handleConversationUpdated, handleUnreadCount]);

  // Join all conversation rooms to receive messages for any conversation
  useEffect(() => {
    const joinAllRooms = () => {
      if (socketRef.current?.connected && conversations.length > 0) {
        conversations.forEach((conv) => {
          if (!joinedRoomsRef.current.has(conv.id)) {
            console.log('Joining conversation room:', conv.id);
            joinConversation(conv.id);
            joinedRoomsRef.current.add(conv.id);
          }
        });
      }
    };
    
    if (socketRef.current?.connected) {
      joinAllRooms();
    } else {
      socketRef.current?.once('connect', joinAllRooms);
    }
  }, [conversations]);

  // Join/leave conversation rooms for the selected conversation
  useEffect(() => {
    currentConversationRef.current = conversationId;

    if (conversationId) {
      // Wait for socket to connect before joining
      const joinRoom = () => {
        if (socketRef.current.connected) {
          if (!joinedRoomsRef.current.has(conversationId)) {
            joinConversation(conversationId);
            joinedRoomsRef.current.add(conversationId);
          }
        }
      };

      // Try to join immediately if already connected
      if (socketRef.current.connected) {
        joinRoom();
      } else {
        // Wait for connection
        socketRef.current.once('connect', joinRoom);
      }

      return () => {
        socketRef.current.off('connect', joinRoom);
        // Don't leave room on conversation change - stay in all rooms to receive messages
      };
    }
  }, [conversationId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentConversationRef.current) {
        leaveConversation(currentConversationRef.current);
      }
    };
  }, []);

  return socketRef.current;
};

/**
 * Hook to manage global Socket.IO connection
 */
export const useGlobalSocket = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const socketRef = useRef(initializeSocket());

  useEffect(() => {
    if (user && token) {
      connectSocket();

      return () => {
        disconnectSocket();
      };
    }
  }, [user, token]);

  return socketRef.current;
};
