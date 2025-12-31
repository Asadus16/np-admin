"use client";

import { useState } from "react";
import { Search, Send, Phone, MoreVertical, User, Building2 } from "lucide-react";

const conversations = [
  {
    id: 1,
    type: "vendor",
    name: "Quick Fix Plumbing",
    avatar: null,
    lastMessage: "Great work on the last job! Keep it up.",
    time: "10:30 AM",
    unread: 0,
    messages: [
      { id: 1, sender: "vendor", text: "Hi Ahmed, you have a new job assigned for today.", time: "9:00 AM" },
      { id: 2, sender: "me", text: "Got it, I'll head there after my current job.", time: "9:15 AM" },
      { id: 3, sender: "vendor", text: "Great work on the last job! Keep it up.", time: "10:30 AM" },
    ],
  },
  {
    id: 2,
    type: "customer",
    name: "John Smith",
    orderId: "ORD-5678",
    avatar: null,
    lastMessage: "I'm waiting at the gate",
    time: "10:05 AM",
    unread: 1,
    messages: [
      { id: 1, sender: "customer", text: "Hi, are you on your way?", time: "9:45 AM" },
      { id: 2, sender: "me", text: "Yes, I'll be there in about 15 minutes.", time: "9:50 AM" },
      { id: 3, sender: "customer", text: "I'm waiting at the gate", time: "10:05 AM" },
    ],
  },
  {
    id: 3,
    type: "customer",
    name: "Sarah Johnson",
    orderId: "ORD-5679",
    avatar: null,
    lastMessage: "See you at 2 PM",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, sender: "customer", text: "Can you come at 2 PM instead of 1 PM?", time: "Yesterday 11:00 AM" },
      { id: 2, sender: "me", text: "Sure, I can adjust my schedule.", time: "Yesterday 11:15 AM" },
      { id: 3, sender: "customer", text: "See you at 2 PM", time: "Yesterday 11:20 AM" },
    ],
  },
  {
    id: 4,
    type: "admin",
    name: "Admin Support",
    avatar: null,
    lastMessage: "Your request has been approved.",
    time: "Dec 26",
    unread: 0,
    messages: [
      { id: 1, sender: "me", text: "I need to request time off on January 5th.", time: "Dec 26 9:00 AM" },
      { id: 2, sender: "admin", text: "Your request has been approved.", time: "Dec 26 2:00 PM" },
    ],
  },
];

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "vendor": return <Building2 className="h-4 w-4" />;
      case "customer": return <User className="h-4 w-4" />;
      case "admin": return <Building2 className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "vendor": return "bg-blue-100 text-blue-700";
      case "customer": return "bg-green-100 text-green-700";
      case "admin": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="h-[calc(100vh-180px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">Chat with vendors, customers, and support</p>
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
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedConversation.id === conv.id ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {getTypeIcon(conv.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 truncate">{conv.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${getTypeBadge(conv.type)}`}>
                          {conv.type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 shrink-0">{conv.time}</span>
                    </div>
                    {conv.orderId && (
                      <p className="text-xs text-gray-500">{conv.orderId}</p>
                    )}
                    <p className="text-sm text-gray-600 truncate mt-1">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {getTypeIcon(selectedConversation.type)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedConversation.name}</p>
                <p className="text-xs text-gray-500 capitalize">{selectedConversation.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedConversation.type === "customer" && (
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
            {selectedConversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === "me"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "me" ? "text-gray-400" : "text-gray-500"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              />
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
