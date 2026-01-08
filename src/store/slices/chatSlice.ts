import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getConversations as apiGetConversations,
  getConversation as apiGetConversation,
  startOrGetConversation as apiStartOrGetConversation,
  sendMessage as apiSendMessage,
  markMessagesAsRead as apiMarkMessagesAsRead,
  getUnreadCount as apiGetUnreadCount,
} from "@/lib/chatApi";
import type {
  Conversation,
  Message,
  SendMessagePayload,
  ChatUser,
} from "@/types/chat";
import type { SocketMessage, SocketConversation, SocketConversationData } from "@/lib/socket";

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
  } | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (page: number = 1) => {
    const response = await apiGetConversations(page);
    return response;
  }
);

export const fetchConversation = createAsyncThunk(
  "chat/fetchConversation",
  async (conversationId: string) => {
    const response = await apiGetConversation(conversationId);
    return response.data;
  }
);

export const startOrGetConversation = createAsyncThunk(
  "chat/startOrGetConversation",
  async (userId: string) => {
    const response = await apiStartOrGetConversation(userId);
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({
    conversationId,
    payload,
  }: {
    conversationId: string;
    payload: SendMessagePayload;
  }, { getState, dispatch }) => {
    // Get current state to access user and token
    const state = getState() as { auth: { user: ChatUser | null; token: string | null } };
    const { user, token } = state.auth;

    if (!user) throw new Error('User not authenticated');

    // Create optimistic message with correct sender info
    const optimisticMessage: Message = {
      id: `optimistic-${Date.now()}-${Math.random()}`,
      conversation_id: conversationId,
      message: payload.message,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_read: false,
      read_at: null,
      sender: user,
    };

    // Add optimistic message immediately with correct sender info
    dispatch(addOptimisticMessage({ conversationId, message: optimisticMessage }));

    // Import socket utilities
    const { sendSocketMessage, getSocket } = await import('@/lib/socket');
    const socket = getSocket();

    // Emit message via socket immediately for instant delivery
    if (socket && socket.connected && user) {
      sendSocketMessage(
        conversationId,
        user.id,
        payload.message,
        token || '',
        user.email // Include sender email for proper message alignment
      );
    }

    // Also send via API for persistence
    const response = await apiSendMessage(conversationId, payload);
    return response.data;
  }
);

export const markMessagesAsRead = createAsyncThunk(
  "chat/markMessagesAsRead",
  async (conversationId: string) => {
    await apiMarkMessagesAsRead(conversationId);
    return conversationId;
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "chat/fetchUnreadCount",
  async () => {
    const response = await apiGetUnreadCount();
    return response.unread_count;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Optimistic update for sending message
    addOptimisticMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>
    ) => {
      if (
        state.currentConversation?.id === action.payload.conversationId
      ) {
        // Initialize messages array if it doesn't exist
        if (!state.currentConversation.messages) {
          state.currentConversation.messages = [];
        }
        
        // Add optimistic message with correct sender info
        state.currentConversation.messages.push(action.payload.message);
        state.currentConversation.last_message_at = action.payload.message.created_at;
      }
      
      // Also update conversation in list
      const conversation = state.conversations.find(
        (c) => c.id === action.payload.conversationId
      );
      if (conversation) {
        conversation.latest_message = {
          id: action.payload.message.id,
          message: action.payload.message.message,
          is_read: action.payload.message.is_read,
          created_at: action.payload.message.created_at,
        };
        conversation.last_message_at = action.payload.message.created_at;
        
        // Move conversation to top of list
        state.conversations = [
          conversation,
          ...state.conversations.filter(
            (c) => c.id !== action.payload.conversationId
          ),
        ];
      }
    },
    // Handle real-time socket messages
    receiveSocketMessage: (state, action: PayloadAction<SocketMessage & { currentUserEmail?: string }>) => {
      const { conversationId, message, created_at, senderId, senderEmail, currentUserEmail } = action.payload;

      // Add message to current conversation if it matches by ID
      const currentMatches = state.currentConversation?.id === conversationId;
      
      if (currentMatches && state.currentConversation) {
        if (!state.currentConversation.messages) {
          state.currentConversation.messages = [];
        }
        
        // Check if message already exists (avoid duplicates)
        // Check by message content and timestamp (within 2 seconds to handle duplicates)
        const messageExists = state.currentConversation.messages.some(
          (msg) => {
            const timeDiff = Math.abs(
              new Date(msg.created_at).getTime() - new Date(created_at).getTime()
            );
            return msg.message === message && timeDiff < 2000;
          }
        );

        // Only check for optimistic message if this is from the current user
        // (to prevent duplicate when sender receives their own message back)
        // If currentUserEmail is not provided, allow the message (receiver case)
        const isOwnOptimisticMessage = currentUserEmail && senderEmail === currentUserEmail && 
          state.currentConversation.messages.some(
            (msg) => String(msg.id).startsWith('optimistic-') && msg.message === message
          );
        
        // Add message if it doesn't exist and it's not our own optimistic message
        if (!messageExists && !isOwnOptimisticMessage) {
          // Create a temporary message object
          // Note: Full message details will come from the API response
          const tempMessage: Partial<Message> = {
            id: `temp-${Date.now()}-${Math.random()}`,
            conversation_id: state.currentConversation.id, // Use current conversation ID
            message,
            created_at,
            is_read: false,
            read_at: null,
            updated_at: created_at,
            // Include sender email so isOwnMessage works correctly
            sender: {
              id: senderId || '',
              first_name: '',
              last_name: '',
              email: senderEmail || '', // Use senderEmail from socket message
              roles: [],
            } as ChatUser,
          };

          state.currentConversation.messages.push(tempMessage as Message);
          state.currentConversation.last_message_at = created_at;
          
          // Also update latest_message
          state.currentConversation.latest_message = {
            id: tempMessage.id as string,
            message: tempMessage.message as string,
            is_read: false,
            created_at: tempMessage.created_at as string,
          };
        }
      }

      // Always update conversation in list (even if not viewing it)
      const conversation = state.conversations.find((c) => c.id === conversationId);
      
      if (conversation) {
        conversation.latest_message = {
          id: `temp-${Date.now()}`,
          message,
          is_read: false,
          created_at,
        };
        conversation.last_message_at = created_at;

        // Move conversation to top of list
        const otherConversations = state.conversations.filter((c) => c.id !== conversationId);
        state.conversations = [conversation, ...otherConversations];
      }
      
      // If message is for a conversation we're not viewing, add it to that conversation's messages
      // This ensures receivers see messages even if they switch to that conversation later
      // Note: We don't load full conversation here, just update the list
      // The full conversation will be loaded when user selects it
    },
    // Handle socket conversations list
    receiveSocketConversations: (state, action: PayloadAction<{ conversations: SocketConversation[] }>) => {
      const incomingConversations = action.payload.conversations as Conversation[];
      
      // Deduplicate conversations by ID
      const uniqueConversations = new Map<string, Conversation>();
      
      incomingConversations.forEach((conv) => {
        // Use ID as primary key
        if (!uniqueConversations.has(conv.id)) {
          uniqueConversations.set(conv.id, conv);
        } else {
          // If duplicate ID found, prefer the one with more recent last_message_at
          const existing = uniqueConversations.get(conv.id)!;
          if (conv.last_message_at > existing.last_message_at) {
            uniqueConversations.set(conv.id, conv);
          }
        }
      });
      
      state.conversations = Array.from(uniqueConversations.values());
      state.loading = false;
    },
    // Handle socket conversation data
    receiveSocketConversation: (state, action: PayloadAction<SocketConversationData>) => {
      const conversationData = action.payload as Conversation;
      state.currentConversation = conversationData;
      
      // Update conversation in list if it exists
      const index = state.conversations.findIndex((c) => c.id === conversationData.id);
      if (index !== -1) {
        state.conversations[index] = conversationData;
      } else {
        // Add to list if not present
        state.conversations.unshift(conversationData);
      }
      
      state.loading = false;
    },
    // Handle conversation updates
    receiveConversationUpdated: (state, action: PayloadAction<SocketConversation>) => {
      const updatedConversation = action.payload as Conversation;
      const index = state.conversations.findIndex((c) => c.id === updatedConversation.id);
      
      if (index !== -1) {
        state.conversations[index] = updatedConversation;
      } else {
        state.conversations.unshift(updatedConversation);
      }
      
      // Update current conversation if it matches
      if (state.currentConversation?.id === updatedConversation.id) {
        state.currentConversation = {
          ...state.currentConversation,
          ...updatedConversation,
        };
      }
    },
    // Handle unread count update
    receiveUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        
        // Deduplicate conversations by ID
        const uniqueConversations = new Map<string, Conversation>();
        
        action.payload.data.forEach((conv) => {
          // Use ID as primary key
          if (!uniqueConversations.has(conv.id)) {
            uniqueConversations.set(conv.id, conv);
          } else {
            // If duplicate ID found, prefer the one with more recent last_message_at
            const existing = uniqueConversations.get(conv.id)!;
            if (conv.last_message_at > existing.last_message_at) {
              uniqueConversations.set(conv.id, conv);
            }
          }
        });
        
        state.conversations = Array.from(uniqueConversations.values());
        state.pagination = {
          currentPage: action.payload.meta.current_page,
          lastPage: action.payload.meta.last_page,
          total: action.payload.meta.total,
          perPage: action.payload.meta.per_page,
        };
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch conversations";
      })

      // Fetch single conversation
      .addCase(fetchConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
        // Update conversation in list if it exists
        const index = state.conversations.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.conversations[index] = action.payload;
        }
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch conversation";
      })

      // Start or get conversation
      .addCase(startOrGetConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startOrGetConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentConversation = action.payload;
        // Add to conversations list if not already present
        const exists = state.conversations.find(
          (c) => c.id === action.payload.id
        );
        if (!exists) {
          state.conversations.unshift(action.payload);
        }
      })
      .addCase(startOrGetConversation.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to start/get conversation";
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Replace optimistic message with real message from API
        if (
          state.currentConversation &&
          state.currentConversation.messages &&
          action.payload.conversation_id === state.currentConversation.id
        ) {
          // Find and replace optimistic message
          const optimisticIndex = state.currentConversation.messages.findIndex(
            (msg) => String(msg.id).startsWith('optimistic-')
          );
          
          if (optimisticIndex !== -1) {
            // Replace optimistic message with real one
            state.currentConversation.messages[optimisticIndex] = action.payload;
          } else {
            // If no optimistic message found, just add it
            state.currentConversation.messages.push(action.payload);
          }
          
          state.currentConversation.last_message_at = action.payload.created_at;
        }

        // Update conversation in list
        const conversation = state.conversations.find(
          (c) => c.id === action.payload.conversation_id
        );
        if (conversation) {
          conversation.latest_message = {
            id: action.payload.id,
            message: action.payload.message,
            is_read: action.payload.is_read,
            created_at: action.payload.created_at,
          };
          conversation.last_message_at = action.payload.created_at;

          // Move conversation to top of list
          state.conversations = [
            conversation,
            ...state.conversations.filter(
              (c) => c.id !== action.payload.conversation_id
            ),
          ];
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.error.message || "Failed to send message";
      })

      // Mark messages as read
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const conversationId = action.payload;

        // Update current conversation
        if (
          state.currentConversation?.id === conversationId &&
          state.currentConversation.messages
        ) {
          state.currentConversation.messages = state.currentConversation.messages.map(
            (msg) =>
              msg.is_read
                ? msg
                : { ...msg, is_read: true, read_at: new Date().toISOString() }
          );
          state.currentConversation.unread_count = 0;
        }

        // Update conversation in list
        const conversation = state.conversations.find(
          (c) => c.id === conversationId
        );
        if (conversation) {
          conversation.unread_count = 0;
        }
      })

      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const {
  clearCurrentConversation,
  clearError,
  addOptimisticMessage,
  receiveSocketMessage,
  receiveSocketConversations,
  receiveSocketConversation,
  receiveConversationUpdated,
  receiveUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;
