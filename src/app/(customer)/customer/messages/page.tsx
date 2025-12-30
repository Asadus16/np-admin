"use client";

import { useState } from "react";
import { MessageSquare, Send, Search, Phone, MoreVertical, Check, CheckCheck } from "lucide-react";

// Static conversations data
const conversations = [
  {
    id: "c1",
    vendor: "Quick Fix Plumbing",
    vendorLogo: "QF",
    lastMessage: "The technician will arrive by 2 PM tomorrow.",
    time: "10:30 AM",
    unread: 2,
    order: "ORD-2024-002",
  },
  {
    id: "c2",
    vendor: "Green Clean Services",
    vendorLogo: "GC",
    lastMessage: "Thank you for your feedback!",
    time: "Yesterday",
    unread: 0,
    order: "ORD-2024-001",
  },
  {
    id: "c3",
    vendor: "Spark Electric Co",
    vendorLogo: "SE",
    lastMessage: "The inspection has been completed successfully.",
    time: "Dec 27",
    unread: 0,
    order: "ORD-2024-003",
  },
  {
    id: "c4",
    vendor: "Cool Air HVAC",
    vendorLogo: "CA",
    lastMessage: "We recommend scheduling the next maintenance in 3 months.",
    time: "Dec 25",
    unread: 0,
    order: "ORD-2024-004",
  },
];

// Static messages for selected conversation
const messagesData: Record<string, Array<{
  id: number;
  sender: "customer" | "vendor";
  message: string;
  time: string;
  read: boolean;
}>> = {
  c1: [
    { id: 1, sender: "customer", message: "Hi, I need to confirm my appointment for tomorrow.", time: "9:15 AM", read: true },
    { id: 2, sender: "vendor", message: "Hello! Yes, your appointment is confirmed for tomorrow at 2 PM.", time: "9:30 AM", read: true },
    { id: 3, sender: "customer", message: "Great, thank you! Will it be the same technician as last time?", time: "9:45 AM", read: true },
    { id: 4, sender: "vendor", message: "Yes, Mohammed will be handling your service again.", time: "10:00 AM", read: true },
    { id: 5, sender: "vendor", message: "The technician will arrive by 2 PM tomorrow.", time: "10:30 AM", read: false },
    { id: 6, sender: "vendor", message: "Please ensure someone is available to let him in.", time: "10:30 AM", read: false },
  ],
  c2: [
    { id: 1, sender: "vendor", message: "Your cleaning service has been completed.", time: "4:00 PM", read: true },
    { id: 2, sender: "customer", message: "The team did an excellent job! Very satisfied.", time: "5:30 PM", read: true },
    { id: 3, sender: "vendor", message: "Thank you for your feedback!", time: "5:45 PM", read: true },
  ],
};

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("c1");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedConvo = conversations.find((c) => c.id === selectedConversation);
  const messages = selectedConversation ? messagesData[selectedConversation] || [] : [];

  const filteredConversations = conversations.filter(
    (c) =>
      c.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.order.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Static - just clear the input
    setNewMessage("");
  };

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
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setSelectedConversation(convo.id)}
                  className={`w-full p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                    selectedConversation === convo.id ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">{convo.vendorLogo}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">{convo.vendor}</p>
                      <span className="text-xs text-gray-500">{convo.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{convo.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{convo.order}</p>
                  </div>
                  {convo.unread > 0 && (
                    <span className="w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                      {convo.unread}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConvo ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{selectedConvo.vendorLogo}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedConvo.vendor}</p>
                    <p className="text-xs text-gray-500">{selectedConvo.order}</p>
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
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                        msg.sender === "customer"
                          ? "bg-gray-900 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        msg.sender === "customer" ? "text-gray-400" : "text-gray-500"
                      }`}>
                        <span className="text-xs">{msg.time}</span>
                        {msg.sender === "customer" && (
                          msg.read ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-2 rounded-full ${
                      newMessage.trim()
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-100 text-gray-400"
                    }`}
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
