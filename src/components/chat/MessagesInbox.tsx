"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchConversations,
  fetchConversation,
  sendMessage,
  fetchUnreadCount,
  startOrGetConversation,
} from "@/store/slices/chatSlice";
import type { Conversation, Message } from "@/types/chat";
import { useSocket } from "@/hooks/useSocket";
import { formatConversationTime, formatMessageTime } from "@/lib/timeFormat";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import TypingIndicator from "@/components/chat/TypingIndicator";
import NewConversationModal from "@/components/chat/NewConversationModal";

interface MessagesInboxProps {
  /**
   * Whether to show the "New Conversation" button (typically for admin)
   */
  showNewConversation?: boolean;
  /**
   * Custom header title (optional)
   */
  headerTitle?: string;
  /**
   * Custom header description (optional)
   */
  headerDescription?: string;
  /**
   * Custom conversation list width (default: 320px)
   */
  conversationListWidth?: string;
  /**
   * Custom styling classes
   */
  className?: string;
}

export default function MessagesInbox({
  showNewConversation = false,
  headerTitle,
  headerDescription,
  conversationListWidth = "w-80",
  className = "",
}: MessagesInboxProps) {
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
  const lastFetchedConversationIdRef = useRef<string | null>(null);

  // Initialize Socket.IO for real-time messaging
  useSocket(selectedConversationId);

  // Initialize typing indicator
  const { isTyping, typingUserName, handleInputChange, stopTyping } = useTypingIndicator({
    conversationId: selectedConversationId,
    userId: user?.id || '',
    userEmail: user?.email || '',
    userName: `${user?.first_name} ${user?.last_name}`,
  });

  // Fetch conversations and unread count only once on mount (page refresh)
  useEffect(() => {
    dispatch(fetchConversations(1));
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // Fetch conversation details when selected (only once, not on every render)
  useEffect(() => {
    // Only fetch if we have a selected conversation ID and haven't fetched it yet
    if (selectedConversationId && lastFetchedConversationIdRef.current !== selectedConversationId) {
      lastFetchedConversationIdRef.current = selectedConversationId;
      dispatch(fetchConversation(selectedConversationId));
    }
    
    // Reset ref when selectedConversationId changes to null (conversation deselected)
    if (!selectedConversationId) {
      lastFetchedConversationIdRef.current = null;
    }
  }, [selectedConversationId, dispatch]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  // Auto-select first conversation or current conversation
  useEffect(() => {
    // If there's a current conversation from startOrGetConversation, select it
    // But only if we don't already have a selected conversation
    if (currentConversation && !selectedConversationId) {
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
      // Messages are updated via Socket.io automatically
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    handleInputChange(); // Automatically manages typing indicator
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherUser = (conversation: Conversation) => {
    // Use other_user field from backend, or fallback to email comparison
    if (conversation.other_user) {
      return conversation.other_user;
    }
    // Fallback: check sender/receiver or admin/user structure
    if (conversation.sender && conversation.receiver) {
      return conversation.sender.email === user?.email 
        ? conversation.receiver 
        : conversation.sender;
    }
    if (conversation.admin && conversation.user) {
      return conversation.admin.email === user?.email 
        ? conversation.user 
        : conversation.admin;
    }
    // Last resort: return sender or receiver if available
    return conversation.sender || conversation.receiver || conversation.admin || conversation.user;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const isOwnMessage = (message: Message) => {
    return message.sender.email === user?.email;
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = getOtherUser(conv);
    const fullName = `${otherUser.first_name} ${otherUser.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleNewConversation = async (userId: string) => {
    try {
      const result = await dispatch(startOrGetConversation(userId)).unwrap();
      if (result) {
        setSelectedConversationId(result.id);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  if (error) {
    return (
      <div className={`h-[calc(100vh-180px)] ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">Error loading messages: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[calc(100vh-180px)] ${className}`}>
      <div className="flex h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Conversations List */}
        <div className={`${conversationListWidth} border-r border-gray-200 flex flex-col`}>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-semibold text-gray-900">
                {headerTitle || "Messages"}
              </h1>
              {showNewConversation && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="New Conversation"
                >
                  <Plus className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>
            {headerDescription && (
              <p className="text-sm text-gray-500 mb-3">{headerDescription}</p>
            )}
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
          <div className="flex-1 overflow-y-auto">
            {loading && conversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const otherUser = getOtherUser(conv);
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedConversationId === conv.id ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">
                        {getInitials(otherUser.first_name, otherUser.last_name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {otherUser.first_name} {otherUser.last_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {conv.latest_message &&
                            formatConversationTime(conv.latest_message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.latest_message?.message || "No messages yet"}
                      </p>
                    </div>
                    {conv.unread_count > 0 && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {getInitials(
                      getOtherUser(currentConversation).first_name,
                      getOtherUser(currentConversation).last_name
                    )}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getOtherUser(currentConversation).first_name}{" "}
                    {getOtherUser(currentConversation).last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getOtherUser(currentConversation).roles?.[0]?.name || "User"}
                  </p>
                </div>
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
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isOwnMessage(msg)
                            ? "bg-gray-900 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 ${
                            isOwnMessage(msg) ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">{formatMessageTime(msg.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                )}
                {/* Typing indicator - show at bottom of messages */}
                {isTyping && typingUserName && (
                  <div className="flex justify-start">
                    <TypingIndicator userName={typingUserName} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
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
                    className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

      {/* New Conversation Modal */}
      {showNewConversation && (
        <NewConversationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectUser={handleNewConversation}
        />
      )}
    </div>
  );
}
