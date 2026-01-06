# Socket.IO Real-Time Messaging Integration

This document describes the Socket.IO integration for real-time messaging functionality.

## Overview

The application now supports real-time messaging using Socket.IO, allowing users to send and receive messages instantly without refreshing the page.

## Architecture

### Backend (Node.js Socket.IO Server)
- **Location**: Separate Node.js server (port 6001 by default)
- **Events**:
  - `join`: Join a conversation room
  - `leave`: Leave a conversation room
  - `message`: Send/receive real-time messages
  - `typing`: Send/receive typing indicators
  - `connect`: Socket connection established
  - `disconnect`: Socket connection closed

### Frontend (Next.js/React)

#### Files Created:

1. **`src/lib/socket.ts`**: Socket.IO client utilities
   - `initializeSocket()`: Initialize socket connection
   - `connectSocket()`: Connect to server
   - `disconnectSocket()`: Disconnect from server
   - `joinConversation(conversationId)`: Join a conversation room
   - `leaveConversation(conversationId)`: Leave a conversation room
   - `sendSocketMessage()`: Send message via socket
   - `onMessage()`: Listen for incoming messages
   - `offMessage()`: Remove message listener
   - `emitTyping()`: Emit typing indicator
   - `onTyping()`: Listen for typing indicators
   - `offTyping()`: Remove typing listener

2. **`src/hooks/useSocket.ts`**: React hooks for Socket.IO
   - `useSocket(conversationId)`: Hook for conversation-specific socket connection
   - `useGlobalSocket()`: Hook for global socket connection

3. **`src/hooks/useTypingIndicator.ts`**: Hook for typing indicators
   - `useTypingIndicator()`: Manages typing state and emits/receives typing events
   - Returns: `{ isTyping, typingUserName, startTyping, stopTyping }`

4. **`src/components/chat/TypingIndicator.tsx`**: Typing indicator component
   - Animated dots showing when someone is typing
   - Optional user name display

5. **`src/lib/timeFormat.ts`**: Time formatting utilities
   - `formatConversationTime()`: Smart time format for conversation list (e.g., "2m", "3h", "2d")
   - `formatMessageTime()`: Time format for messages (e.g., "2:30 PM", "Yesterday", "Jan 15")
   - `formatTimeAgo()`: Relative time (e.g., "2 minutes ago")
   - `formatFullMessageTime()`: Full timestamp (e.g., "Jan 15, 2024 at 2:30 PM")

6. **`src/store/slices/chatSlice.ts`** (updated):
   - Added `receiveSocketMessage` action to handle real-time messages
   - Prevents duplicate messages
   - Updates conversation list and current conversation

## Configuration

### Environment Variables

Add to your `.env` file:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:6001
```

### Backend Server

The backend Socket.IO server should be running on the configured port (default: 6001).

Server events handled:
- **join**: `{ conversationId }`
- **message**: `{ conversationId, senderId, message, token }`
- **leave**: `{ conversationId }`

## Usage

### In Message Pages

Socket.IO is automatically integrated in all message pages:
- Admin: `src/app/(admin)/admin/messages/page.tsx`
- Customer: `src/app/(customer)/customer/messages/page.tsx`
- Vendor: `src/app/(vendor)/vendor/messages/page.tsx`
- Technician: `src/app/(technician)/technician/messages/page.tsx`

Usage example:
```typescript
// The hook automatically connects and manages the socket
useSocket(selectedConversationId);
```

### How It Works

1. **Connection**: When a user logs in, the socket connects to the server
2. **Join Room**: When a conversation is selected, the user joins that conversation's room
3. **Send Message**: When sending a message:
   - Message is sent via REST API (for persistence)
   - Socket broadcasts the message to all users in the room
4. **Receive Message**: When another user sends a message:
   - Socket receives the message in real-time
   - Redux store is updated via `receiveSocketMessage` action
   - UI automatically updates to show the new message
5. **Leave Room**: When switching conversations or closing the page, user leaves the room

### Message Flow

```
User A sends message
    ↓
REST API (persist to database)
    ↓
Socket.IO (broadcast to room)
    ↓
User B receives via socket
    ↓
Redux store updated
    ↓
UI updates automatically
```

## Key Features

✅ **Real-time messaging**: Messages appear instantly without page refresh
✅ **Automatic reconnection**: Socket reconnects if connection is lost
✅ **Duplicate prevention**: Messages are deduplicated to avoid showing twice
✅ **Room-based**: Only users in the same conversation receive messages
✅ **Fallback to API**: If socket fails, messages are still persisted via API

## Troubleshooting

### Messages not appearing in real-time
1. Check that Socket.IO server is running on port 6001
2. Verify `NEXT_PUBLIC_SOCKET_URL` in `.env` file
3. Check browser console for connection errors
4. Ensure CORS is properly configured on the backend

### Duplicate messages
- The system automatically prevents duplicates by checking message content and timestamp
- If you still see duplicates, check that you're not calling `dispatch(fetchConversation())` unnecessarily

### Connection issues
- Socket connection requires valid authentication token
- Check that the user is logged in before connecting
- Verify network connectivity to the Socket.IO server

## Backend Socket.IO Server

The backend server code should look like this:

```javascript
import http from 'http';
import { Server } from 'socket.io';
import fetch from 'node-fetch';

const PORT = process.env.SOCKET_PORT || 6001;
const LARAVEL_API_BASE = process.env.LARAVEL_API_BASE || 'http://localhost:8000';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.on('join', ({ conversationId }) => {
    if (!conversationId) return;
    socket.join(`conversation:${conversationId}`);
  });

  socket.on('message', async ({ conversationId, senderId, message, token }) => {
    if (!conversationId || !senderId || !message) return;

    // Broadcast to room
    io.to(`conversation:${conversationId}`).emit('message', {
      conversationId,
      senderId,
      message,
      created_at: new Date().toISOString(),
    });

    // Persist to backend
    try {
      const url = `${LARAVEL_API_BASE}/api/conversations/${conversationId}/messages`;
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, sender_id: senderId }),
      });
    } catch (err) {
      console.error('Failed to persist message to API', err.message);
    }
  });

  socket.on('typing', ({ conversationId, userId, userEmail, userName, isTyping }) => {
    if (!conversationId) return;

    // Broadcast typing indicator to room
    socket.to(`conversation:${conversationId}`).emit('typing', {
      conversationId,
      userId,
      userEmail,
      userName,
      isTyping,
    });
  });

  socket.on('leave', ({ conversationId }) => {
    socket.leave(`conversation:${conversationId}`);
  });
});

server.listen(PORT, () => {
  console.log(`Socket server listening on port ${PORT}`);
});
```

## New Features Added

### ✨ Typing Indicators
- Real-time typing indicators show when someone is typing
- Automatically stops after 2 seconds of inactivity or when message is sent
- Shows user name who is typing
- Animated dots for better UX

### ⏰ Improved Time Formatting
- **Conversation List**: Smart compact format (e.g., "2m", "3h", "2d", "Jan 15")
- **Message Time**: Context-aware format (e.g., "2:30 PM", "Yesterday", "Monday")
- **Proper Timezone Handling**: Correctly parses ISO timestamps from backend
- **Relative Time**: Shows "Just now" for recent messages

### 🔧 Bug Fixes
- Fixed encrypted ID comparison issues (now using email comparison)
- Fixed `isOwnMessage` always returning false
- Fixed `getOtherUser` runtime errors
- Added missing Conversation type fields (`sender`, `receiver`, `other_user`)

## Testing

### Real-Time Messaging
1. Start the Socket.IO backend server
2. Start the Next.js development server
3. Open two browser windows/tabs
4. Log in as different users in each window
5. Start a conversation between the two users
6. Send a message from one window
7. Verify the message appears instantly in the other window

### Typing Indicators
1. With two users in a conversation
2. Start typing in one window
3. Verify typing indicator appears in the other window
4. Stop typing and verify indicator disappears after 2 seconds
5. Send a message and verify indicator stops immediately

## Additional Notes

- Messages are still persisted via the REST API for reliability
- Socket.IO is used for real-time delivery only
- The system gracefully degrades if WebSocket is unavailable
- All encrypted ID comparison issues have been fixed (using email comparison instead)
- Time formatting now handles different timezone formats correctly
- Typing indicators use email comparison to avoid encrypted ID issues
