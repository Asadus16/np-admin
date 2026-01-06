"use client";

import MessagesInbox from "@/components/chat/MessagesInbox";

export default function MessagesPage() {
  return (
    <div className="h-[calc(100vh-180px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Chat with vendors, customers, and support
        </p>
      </div>
      <MessagesInbox 
        headerTitle="Messages"
        headerDescription="Chat with vendors, customers, and support"
      />
    </div>
  );
}
