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
  SocketMessage,
} from '@/lib/socket';
import { receiveSocketMessage } from '@/store/slices/chatSlice';

/**
 * Hook to manage Socket.IO connection for a specific conversation
 */
export const useSocket = (conversationId: string | null) => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const socketRef = useRef(initializeSocket());
  const currentConversationRef = useRef(conversationId);

  // Handle incoming messages
  const handleMessage = useCallback(
    (data: SocketMessage) => {
      // Only process messages for the current conversation
      if (data.conversationId === currentConversationRef.current) {
        dispatch(receiveSocketMessage(data));
      }
    },
    [dispatch]
  );

  // Initialize socket connection
  useEffect(() => {
    if (user && token) {
      connectSocket();
      onMessage(handleMessage);

      return () => {
        offMessage(handleMessage);
      };
    }
  }, [user, token, handleMessage]);

  // Join/leave conversation rooms
  useEffect(() => {
    currentConversationRef.current = conversationId;

    if (conversationId && socketRef.current.connected) {
      joinConversation(conversationId);

      return () => {
        leaveConversation(conversationId);
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
