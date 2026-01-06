"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, Paperclip, MoreHorizontal, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchConversations,
  fetchConversation,
  sendMessage,
  fetchUnreadCount,
  clearCurrentConversation,
  startOrGetConversation,
} from "@/store/slices/chatSlice";
import type { Conversation, Message } from "@/types/chat";
import NewConversationModal from "@/components/chat/NewConversationModal";
import { useSocket } from "@/hooks/useSocket";
import { formatConversationTime, formatMessageTime } from "@/lib/timeFormat";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import TypingIndicator from "@/components/chat/TypingIndicator";

export default function MessagesPage() {
  const dispatch = useAppDispatch();
  const { conversations, currentConversation, loading, error } = useAppSelector(
    (state) => state.chat
  );
  const { user } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Socket.IO for real-time messaging
  useSocket(selectedConversationId);

  // Initialize typing indicator
  const { isTyping, typingUserName, startTyping, stopTyping } = useTypingIndicator({
    conversationId: selectedConversationId,
    userId: user?.id || '',
    userEmail: user?.email || '',
    userName: `${user?.first_name} ${user?.last_name}`,
  });

  // Fetch conversations on mount
  useEffect(() => {
    dispatch(fetchConversations(1));
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // Fetch conversation details when selected (only if not already loaded)
  useEffect(() => {
    if (selectedConversationId && currentConversation?.id !== selectedConversationId) {
      dispatch(fetchConversation(selectedConversationId));
    }
  }, [selectedConversationId, dispatch]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  // Removed frequent polling - only fetch on demand

  // Auto-select first conversation or current conversation
  useEffect(() => {
    // If there's a current conversation from startOrGetConversation, select it
    if (currentConversation && currentConversation.id !== selectedConversationId) {
      // Use setTimeout to avoid cascading renders
      const timer = setTimeout(() => {
        setSelectedConversationId(currentConversation.id);
      }, 0);
      return () => clearTimeout(timer);
    } else if (conversations.length > 0 && !selectedConversationId) {
      // Otherwise select the first conversation
      const timer = setTimeout(() => {
        setSelectedConversationId(conversations[0].id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [conversations, currentConversation, selectedConversationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

    // Stop typing indicator when sending
    stopTyping();

    try {
      await dispatch(
        sendMessage({
          conversationId: selectedConversationId,
          payload: { message: newMessage },
        })
      ).unwrap();

      setNewMessage("");
      // Refresh conversation to get updated messages
      dispatch(fetchConversation(selectedConversationId));
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Start typing indicator
    if (e.target.value.trim()) {
      startTyping();

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 2000);
    } else {
      stopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartConversation = async (userId: string) => {
    try {
      await dispatch(startOrGetConversation(userId)).unwrap();
      // Refresh conversations list
      dispatch(fetchConversations(1));
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const fullName = `${conv?.sender?.first_name ?? ''} ${conv?.sender?.last_name ?? ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const getOtherUser = (conversation: Conversation) => {
    // Use other_user field from backend, or fallback to email comparison
    if (conversation.other_user) {
      return conversation.other_user;
    }
    return conversation.sender?.email === user?.email
      ? conversation.receiver ?? conversation.sender
      : conversation.sender ?? conversation.receiver;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const isOwnMessage = (message: Message) => {
    // Compare using email instead of encrypted IDs since IDs are encrypted differently each time
    return message.sender.email === user?.email;
  };
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Inbox and message threads</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">Error loading messages: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Inbox and message threads</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
          {/* Conversations List */}
          <div className="border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(600px-73px)]">
              {loading && conversations.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Loading conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    {conversations.length === 0
                      ? "No conversations yet"
                      : "No conversations found"}
                  </p>
                  {conversations.length === 0 && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Start Conversation
                    </button>
                  )}
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const otherUser = getOtherUser(conv);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversationId(conv.id)}
                      className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 ${
                        selectedConversationId === conv.id ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">
                            {getInitials(conv?.other_user?.first_name ?? '', conv?.other_user?.last_name ?? '')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {conv?.other_user?.first_name ?? ''} {conv?.other_user?.last_name ?? ''}
                            </span>
                            <span className="text-xs text-gray-500">
                              {conv.latest_message && formatConversationTime(conv.latest_message.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {conv.latest_message?.message || "No messages yet"}
                          </p>
                        </div>
                        {conv.unread_count > 0 && (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {getInitials(
                         currentConversation?.other_user?.first_name,
                          currentConversation.other_user?.last_name
                        )}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                       { currentConversation?.other_user?.first_name,
                          currentConversation.other_user?.last_name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {currentConversation.other_user?.roles?.[0]?.name || 'User'}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentConversation.messages && currentConversation.messages.length > 0 ? (
                    currentConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${isOwnMessage(msg) ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isOwnMessage(msg)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwnMessage(msg) ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {formatMessageTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-gray-500">
                      No messages yet. Start the conversation!
                    </div>
                  )}
                  {/* Typing indicator */}
                  {isTyping && <TypingIndicator userName={typingUserName || undefined} />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={handleMessageChange}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 disabled:opacity-50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || loading}
                      className="p-2 bg-gray-900 hover:bg-gray-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>

      <NewConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectUser={handleStartConversation}
      />
    </div>
  );
}
