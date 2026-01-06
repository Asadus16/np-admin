import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  emitTyping, 
  onTyping, 
  offTyping, 
  onTypingStart,
  offTypingStart,
  onTypingStop,
  offTypingStop,
  getSocket,
  TypingIndicator 
} from '@/lib/socket';

interface UseTypingIndicatorProps {
  conversationId: string | null;
  userId: string;
  userEmail: string;
  userName: string;
}

interface UseTypingIndicatorReturn {
  isTyping: boolean;
  typingUserName: string | null;
  startTyping: () => void;
  stopTyping: () => void;
  handleInputChange: () => void; // Helper for input change events
}

/**
 * Hook to manage typing indicators for a conversation
 */
export const useTypingIndicator = ({
  conversationId,
  userId,
  userEmail,
  userName,
}: UseTypingIndicatorProps): UseTypingIndicatorReturn => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Handle incoming typing indicators
  const handleTyping = useCallback(
    (data: TypingIndicator) => {
      console.log('handleTyping called:', { 
        data, 
        userEmail, 
        conversationId,
        isOwn: data.userEmail === userEmail,
        matchesConversation: data.conversationId === conversationId
      });
      
      // Ignore own typing indicators
      if (data.userEmail === userEmail) {
        console.log('Ignoring own typing indicator');
        return;
      }

      // Only show typing for current conversation
      if (data.conversationId === conversationId) {
        if (data.isTyping) {
          console.log('Setting typing indicator to true:', data.userName);
          setIsTyping(true);
          setTypingUserName(data.userName);

          // Auto-hide typing indicator after 3 seconds
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            console.log('Auto-hiding typing indicator after 3 seconds');
            setIsTyping(false);
            setTypingUserName(null);
          }, 3000);
        } else {
          console.log('Setting typing indicator to false');
          setIsTyping(false);
          setTypingUserName(null);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
        }
      } else {
        console.log('Typing event for different conversation:', {
          eventConversationId: data.conversationId,
          currentConversationId: conversationId
        });
      }
    },
    [conversationId, userEmail]
  );

  // Handle typing_start event (alternative format)
  const handleTypingStart = useCallback(
    (data: { conversationId: string; userId: string; userEmail?: string; userName?: string }) => {
      console.log('handleTypingStart called:', { data, userEmail, conversationId });
      
      // Ignore own typing indicators
      if (data.userEmail === userEmail) {
        console.log('Ignoring own typing_start indicator');
        return;
      }
      
      if (data.conversationId === conversationId) {
        console.log('Setting typing indicator to true (from typing_start):', data.userName);
        setIsTyping(true);
        setTypingUserName(data.userName || null);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          console.log('Auto-hiding typing indicator after 3 seconds (from typing_start)');
          setIsTyping(false);
          setTypingUserName(null);
        }, 3000);
      }
    },
    [conversationId, userEmail]
  );

  // Handle typing_stop event (alternative format)
  const handleTypingStop = useCallback(
    (data: { conversationId: string; userId: string; userEmail?: string }) => {
      console.log('handleTypingStop called:', { data, userEmail, conversationId });
      
      // Only stop if it's not our own typing stop (or if it's for this conversation)
      if (data.conversationId === conversationId && data.userEmail !== userEmail) {
        console.log('Setting typing indicator to false (from typing_stop)');
        setIsTyping(false);
        setTypingUserName(null);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },
    [conversationId, userEmail]
  );

  // Listen for typing indicators (support both unified and separate events)
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.warn('Socket not initialized, cannot set up typing listeners');
      return;
    }

    // Listen for unified typing event
    onTyping(handleTyping);
    
    // Also listen for typing_start and typing_stop events (backend supports both)
    onTypingStart(handleTypingStart);
    onTypingStop(handleTypingStop);

    return () => {
      offTyping(handleTyping);
      offTypingStart(handleTypingStart);
      offTypingStop(handleTypingStop);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [handleTyping, handleTypingStart, handleTypingStop]);

  // Start typing
  const startTyping = useCallback(() => {
    if (!conversationId) {
      console.warn('Cannot start typing - no conversationId');
      return;
    }
    
    if (isTypingRef.current) {
      console.log('Already typing, skipping emit');
      return;
    }

    isTypingRef.current = true;
    console.log('Starting typing indicator:', { conversationId, userId, userEmail, userName });
    emitTyping(conversationId, userId, userEmail, userName, true);
  }, [conversationId, userId, userEmail, userName]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!conversationId || !isTypingRef.current) return;

    isTypingRef.current = false;
    emitTyping(conversationId, userId, userEmail, userName, false);
  }, [conversationId, userId, userEmail, userName]);

  // Handle input change - automatically manages typing indicator
  // Clears existing timeout and sets new one to stop typing after 2 seconds
  const handleInputChange = useCallback(() => {
    if (!conversationId) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Start typing if not already typing
    if (!isTypingRef.current) {
      startTyping();
    }

    // Set timeout to stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [conversationId, startTyping, stopTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversationId && isTypingRef.current) {
        emitTyping(conversationId, userId, userEmail, userName, false);
      }
    };
  }, [conversationId, userId, userEmail, userName]);

  return {
    isTyping,
    typingUserName,
    startTyping,
    stopTyping,
    handleInputChange,
  };
};
