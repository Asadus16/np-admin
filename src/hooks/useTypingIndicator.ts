import { useState, useEffect, useCallback, useRef } from 'react';
import { emitTyping, onTyping, offTyping, TypingIndicator } from '@/lib/socket';

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
      // Ignore own typing indicators
      if (data.userEmail === userEmail) return;

      // Only show typing for current conversation
      if (data.conversationId === conversationId) {
        if (data.isTyping) {
          setIsTyping(true);
          setTypingUserName(data.userName);

          // Auto-hide typing indicator after 3 seconds
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            setTypingUserName(null);
          }, 3000);
        } else {
          setIsTyping(false);
          setTypingUserName(null);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
        }
      }
    },
    [conversationId, userEmail]
  );

  // Listen for typing indicators
  useEffect(() => {
    onTyping(handleTyping);

    return () => {
      offTyping(handleTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [handleTyping]);

  // Start typing
  const startTyping = useCallback(() => {
    if (!conversationId || isTypingRef.current) return;

    isTypingRef.current = true;
    emitTyping(conversationId, userId, userEmail, userName, true);
  }, [conversationId, userId, userEmail, userName]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!conversationId || !isTypingRef.current) return;

    isTypingRef.current = false;
    emitTyping(conversationId, userId, userEmail, userName, false);
  }, [conversationId, userId, userEmail, userName]);

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
  };
};
