"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Search, Phone, MoreVertical } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchConversations,
  fetchConversation,
  sendMessage,
  fetchUnreadCount,
} from "@/store/slices/chatSlice";
import type { Conversation, Message } from "@/types/chat";
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

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
    dispatch(fetchConversations());
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  // Fetch conversation details when selected
  useEffect(() => {
    if (selectedConversationId) {
      dispatch(fetchConversation(selectedConversationId));
    }
  }, [selectedConversationId, dispatch]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedConversationId) {
        dispatch(fetchConversation(selectedConversationId));
      }
      dispatch(fetchConversations());
      dispatch(fetchUnreadCount());
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedConversationId, dispatch]);

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

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
      dispatch(fetchConversation(selectedConversationId));
      dispatch(fetchConversations());
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

  const getOtherUser = (conversation: Conversation) => {
    // Use other_user field from backend, or fallback to email comparison
    if (conversation.other_user) {
      return conversation.other_user;
    }
    return conversation.admin?.email === user?.email ? conversation.user : conversation.admin;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };


  const isOwnMessage = (message: Message) => {
    // Compare using email instead of encrypted IDs since IDs are encrypted differently each time
    return message.sender.email === user?.email;
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = getOtherUser(conv);
    const fullName = `${otherUser.first_name} ${otherUser.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const selectedConvo = conversations.find((c) => c.id === selectedConversationId);

  if (error) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Chat with your service providers</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">Error loading messages: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">Chat with your service providers</p>
      </div>

      <div className="flex-1 flex bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading && conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((convo) => {
                const otherUser = getOtherUser(convo);
                return (
                  <button
                    key={convo.id}
                    onClick={() => setSelectedConversationId(convo.id)}
                    className={`w-full p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                      selectedConversationId === convo.id ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {getInitials(otherUser.first_name, otherUser.last_name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {otherUser.first_name} {otherUser.last_name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {convo.latest_message && formatConversationTime(convo.latest_message.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {convo.latest_message?.message || "No messages yet"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {otherUser.roles[0]?.name || "User"}
                      </p>
                    </div>
                    {convo.unread_count > 0 && (
                      <span className="w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                        {convo.unread_count}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConvo && currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {getInitials(
                        getOtherUser(selectedConvo).first_name,
                        getOtherUser(selectedConvo).last_name
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getOtherUser(selectedConvo).first_name}{" "}
                      {getOtherUser(selectedConvo).last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getOtherUser(selectedConvo).roles[0]?.name || "User"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Phone className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="h-5 w-5" />
                  </button>
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
                {/* Typing indicator */}
                {isTyping && <TypingIndicator userName={typingUserName || undefined} />}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleMessageChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || loading}
                    className={`p-2 rounded-full ${
                      newMessage.trim()
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-100 text-gray-400"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
