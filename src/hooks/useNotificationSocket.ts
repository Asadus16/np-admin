import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
  initializeSocket,
  connectSocket,
  authenticateUser,
  type SocketNotification
} from '@/lib/socket';

/**
 * Hook for managing notification socket connection
 * Uses the same pattern as useSocket (chat) which works correctly
 *
 * Key differences from previous implementation:
 * 1. Uses refs to track state (survives React Strict Mode)
 * 2. Callback stored in ref (not in effect dependencies)
 * 3. Minimal dependencies (only user.id and token)
 */
export const useNotificationSocket = (
  onNotification: (notification: SocketNotification) => void
) => {
  const { user, token, isLoading } = useAppSelector((state) => state.auth);
  const socketRef = useRef(initializeSocket());
  const listenerRegisteredRef = useRef(false);
  const onNotificationRef = useRef(onNotification);
  const setupListenerRef = useRef<(() => void) | null>(null);

  // Keep the callback ref updated (doesn't cause re-render)
  onNotificationRef.current = onNotification;

  useEffect(() => {
    if (isLoading) return;
    if (!user || !token) return;

    connectSocket(token);

    const notificationHandler = (data: SocketNotification) => {
      onNotificationRef.current(data);
    };

    const setupListener = () => {
      if (listenerRegisteredRef.current) return;

      if (socketRef.current?.connected) {
        authenticateUser(user.id);
        socketRef.current.on('notification', notificationHandler);
        listenerRegisteredRef.current = true;
      }
    };

    setupListenerRef.current = setupListener;

    if (socketRef.current?.connected) {
      setupListener();
    } else {
      socketRef.current?.once('connect', setupListener);
    }

    return () => {
      if (listenerRegisteredRef.current && socketRef.current) {
        socketRef.current.off('notification', notificationHandler);
        listenerRegisteredRef.current = false;
      }

      // Remove connect listener if still pending
      if (setupListenerRef.current && socketRef.current) {
        socketRef.current.off('connect', setupListenerRef.current);
      }
    };
  }, [user?.id, token, isLoading]); // Minimal, stable dependencies - no callbacks!

  return socketRef.current;
};
