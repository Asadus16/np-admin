"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchConversations,
  fetchConversation,
  sendMessage,
  fetchUnreadCount,
} from "@/store/slices/chatSlice";
import type { Conversation, Message } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "@/hooks/useSocket";

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

  // Initialize Socket.IO for real-time messaging
  useSocket(selectedConversationId);

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

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversationId) return;

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

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
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

  if (error) {
    return (
      <div className="h-[calc(100vh-180px)]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">Error loading messages: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-180px)]">
      <div className="flex h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900 mb-3">Messages</h1>
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
                    className={`w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 ${
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
                          {conv.latest_message && formatTime(conv.latest_message.created_at)}
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
                    {getOtherUser(currentConversation).roles[0]?.name || "User"}
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
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
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
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    No messages yet. Start the conversation!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    disabled={loading}
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || loading}
                    className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}
