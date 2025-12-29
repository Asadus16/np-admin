"use client";

import { useState } from "react";
import { Search, Send, User } from "lucide-react";

const conversations = [
  { id: 1, name: "John Smith", lastMessage: "Thanks for the quick service!", time: "2m ago", unread: true, avatar: "JS" },
  { id: 2, name: "Sarah Johnson", lastMessage: "What time will you arrive?", time: "1h ago", unread: true, avatar: "SJ" },
  { id: 3, name: "Mike Brown", lastMessage: "Perfect, see you tomorrow", time: "3h ago", unread: false, avatar: "MB" },
  { id: 4, name: "Emily Davis", lastMessage: "Can you send the invoice?", time: "1d ago", unread: false, avatar: "ED" },
  { id: 5, name: "Support Team", lastMessage: "Your payout has been processed", time: "2d ago", unread: false, avatar: "ST" },
];

const messages = [
  { id: 1, sender: "customer", text: "Hi, I have a leaky faucet in my kitchen", time: "10:30 AM" },
  { id: 2, sender: "vendor", text: "Hello! I can help with that. Can you describe the issue?", time: "10:32 AM" },
  { id: 3, sender: "customer", text: "It's been dripping constantly for about a week now", time: "10:33 AM" },
  { id: 4, sender: "vendor", text: "I see. I have availability tomorrow at 2 PM. Would that work for you?", time: "10:35 AM" },
  { id: 5, sender: "customer", text: "Yes, that works perfectly!", time: "10:36 AM" },
  { id: 6, sender: "vendor", text: "Great! I've scheduled the appointment. See you then!", time: "10:37 AM" },
  { id: 7, sender: "customer", text: "Thanks for the quick service!", time: "Just now" },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (newMessage.trim()) {
      // Handle send message
      setNewMessage("");
    }
  };

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
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 ${
                  selectedConversation.id === conv.id ? "bg-gray-50" : ""
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm">{conv.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{conv.name}</span>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">{selectedConversation.avatar}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedConversation.name}</p>
              <p className="text-xs text-gray-500">Customer</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "vendor" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    msg.sender === "vendor"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === "vendor" ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
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
                className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
