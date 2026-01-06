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
  ConversationsResponse,
  SendMessagePayload,
  ChatUser,
} from "@/types/chat";
import type { SocketMessage } from "@/lib/socket";

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
  }) => {
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
        state.currentConversation?.id === action.payload.conversationId &&
        state.currentConversation.messages
      ) {
        state.currentConversation.messages.push(action.payload.message);
      }
    },
    // Handle real-time socket messages
    receiveSocketMessage: (state, action: PayloadAction<SocketMessage>) => {
      const { conversationId, message, created_at } = action.payload;

      // Add message to current conversation if it matches
      if (state.currentConversation?.id === conversationId) {
        if (state.currentConversation.messages) {
          // Check if message already exists (avoid duplicates)
          const messageExists = state.currentConversation.messages.some(
            (msg) => msg.message === message && msg.created_at === created_at
          );

          if (!messageExists) {
            // Create a temporary message object
            // Note: Full message details will come from the API response
            const tempMessage: Partial<Message> = {
              id: `temp-${Date.now()}`,
              conversation_id: conversationId,
              message,
              created_at,
              is_read: false,
              read_at: null,
              updated_at: created_at,
              // Sender will be populated from API response
            };

            state.currentConversation.messages.push(tempMessage as Message);
            state.currentConversation.last_message_at = created_at;
          }
        }
      }

      // Update conversation in list
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
        state.conversations = [
          conversation,
          ...state.conversations.filter((c) => c.id !== conversationId),
        ];
      }
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
        state.conversations = action.payload.data;
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
        // Add message to current conversation
        if (
          state.currentConversation &&
          state.currentConversation.messages &&
          action.payload.conversation_id === state.currentConversation.id
        ) {
          state.currentConversation.messages.push(action.payload);
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

export const { clearCurrentConversation, clearError, addOptimisticMessage, receiveSocketMessage } =
  chatSlice.actions;

export default chatSlice.reducer;
