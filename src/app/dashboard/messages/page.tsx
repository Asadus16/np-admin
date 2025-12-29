"use client";

import { useState } from "react";
import { Search, Send, Paperclip, MoreHorizontal } from "lucide-react";

const conversations = [
  { id: 1, name: "Mike's Plumbing", lastMessage: "Thanks for the quick response!", time: "10:30 AM", unread: 2, avatar: "M" },
  { id: 2, name: "ElectriCare Solutions", lastMessage: "When can we schedule the inspection?", time: "9:15 AM", unread: 0, avatar: "E" },
  { id: 3, name: "Cool Air HVAC", lastMessage: "The documentation has been submitted", time: "Yesterday", unread: 1, avatar: "C" },
  { id: 4, name: "Sparkle Cleaning Co", lastMessage: "Perfect, thank you!", time: "Yesterday", unread: 0, avatar: "S" },
  { id: 5, name: "ProPaint Services", lastMessage: "I have a question about the contract", time: "Mar 15", unread: 0, avatar: "P" },
];

const messages = [
  { id: 1, sender: "vendor", text: "Hello, I have a question about my payout schedule.", time: "10:15 AM" },
  { id: 2, sender: "admin", text: "Hi! Of course, I'd be happy to help. What would you like to know?", time: "10:18 AM" },
  { id: 3, sender: "vendor", text: "When is the next payout run scheduled?", time: "10:20 AM" },
  { id: 4, sender: "admin", text: "The next payout run is scheduled for March 22nd. You should receive your payment within 2-3 business days after that.", time: "10:25 AM" },
  { id: 5, sender: "vendor", text: "Thanks for the quick response!", time: "10:30 AM" },
];

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">Inbox and message threads</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
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
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 ${
                    selectedConversation.id === conv.id ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">{conv.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 truncate">{conv.name}</span>
                        <span className="text-xs text-gray-500">{conv.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{selectedConversation.avatar}</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{selectedConversation.name}</h3>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      msg.sender === "admin"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "admin" ? "text-gray-400" : "text-gray-500"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
                <button className="p-2 bg-gray-900 hover:bg-gray-800 rounded-lg text-white">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
