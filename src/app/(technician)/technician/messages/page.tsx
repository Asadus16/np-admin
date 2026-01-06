"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Send, Phone, MoreVertical, User, Building2 } from "lucide-react";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
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

  const handleSendMessage = async () => {
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

  const getUserType = (otherUser: any) => {
    return otherUser.roles[0]?.name || "user";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vendor":
        return <Building2 className="h-4 w-4" />;
      case "customer":
        return <User className="h-4 w-4" />;
      case "admin":
        return <Building2 className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "vendor":
        return "bg-blue-100 text-blue-700";
      case "customer":
        return "bg-green-100 text-green-700";
      case "admin":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = getOtherUser(conv);
    const fullName = `${otherUser.first_name} ${otherUser.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const selectedConvo = conversations.find((c) => c.id === selectedConversationId);

  if (error) {
    return (
      <div className="h-[calc(100vh-180px)]">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Chat with vendors, customers, and support
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">Error loading messages: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-180px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Chat with vendors, customers, and support
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg h-[calc(100%-60px)] flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
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
                const userType = getUserType(otherUser);
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedConversationId === conv.id ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {getTypeIcon(userType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {otherUser.first_name} {otherUser.last_name}
                            </span>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded ${getTypeBadge(
                                userType
                              )}`}
                            >
                              {userType}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 shrink-0">
                            {conv.latest_message && formatTime(conv.latest_message.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conv.latest_message?.message || "No messages yet"}
                        </p>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
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
        <div className="flex-1 flex flex-col">
          {selectedConvo && currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {getTypeIcon(getUserType(getOtherUser(selectedConvo)))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getOtherUser(selectedConvo).first_name}{" "}
                      {getOtherUser(selectedConvo).last_name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {getUserType(getOtherUser(selectedConvo))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getUserType(getOtherUser(selectedConvo)) === "customer" && (
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
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
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
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

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type a message..."
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || loading}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
