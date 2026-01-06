"use client";

import MessagesInbox from "@/components/chat/MessagesInbox";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Inbox and message threads</p>
        </div>
      </div>
      <MessagesInbox showNewConversation={true} />
    </div>
  );
}
