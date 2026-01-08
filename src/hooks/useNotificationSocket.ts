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
    // Wait for auth to be loaded
    if (isLoading) {
      console.log('[useNotificationSocket] Auth still loading, waiting...');
      return;
    }

    if (!user || !token) {
      console.log('[useNotificationSocket] No user or token, skipping socket setup');
      return;
    }

    console.log('[useNotificationSocket] Setting up socket for user:', user.id);

    // Connect socket with token
    connectSocket(token);

    // Handler that uses ref (stable reference, never recreated)
    const notificationHandler = (data: SocketNotification) => {
      console.log('[useNotificationSocket] >>> RECEIVED NOTIFICATION:', data);
      onNotificationRef.current(data);
    };

    // Setup listener function
    const setupListener = () => {
      // Guard against duplicate registration
      if (listenerRegisteredRef.current) {
        console.log('[useNotificationSocket] Listener already registered, skipping');
        return;
      }

      if (socketRef.current?.connected) {
        console.log('[useNotificationSocket] Socket connected, registering notification listener');
        // Authenticate user to join their notification room
        authenticateUser(user.id);
        // Register notification listener directly on socket
        socketRef.current.on('notification', notificationHandler);
        listenerRegisteredRef.current = true;
        console.log('[useNotificationSocket] Notification listener registered successfully');
      } else {
        console.log('[useNotificationSocket] Socket not connected yet');
      }
    };

    // Store ref for cleanup
    setupListenerRef.current = setupListener;

    // Try to setup immediately if already connected
    if (socketRef.current?.connected) {
      setupListener();
    } else {
      // Wait for connection
      console.log('[useNotificationSocket] Waiting for socket connect event...');
      socketRef.current?.once('connect', setupListener);
    }

    // Cleanup function
    return () => {
      console.log('[useNotificationSocket] Cleanup - listenerRegistered:', listenerRegisteredRef.current);

      // Remove notification listener if it was registered
      if (listenerRegisteredRef.current && socketRef.current) {
        socketRef.current.off('notification', notificationHandler);
        listenerRegisteredRef.current = false;
        console.log('[useNotificationSocket] Notification listener removed');
      }

      // Remove connect listener if still pending
      if (setupListenerRef.current && socketRef.current) {
        socketRef.current.off('connect', setupListenerRef.current);
      }
    };
  }, [user?.id, token, isLoading]); // Minimal, stable dependencies - no callbacks!

  return socketRef.current;
};
