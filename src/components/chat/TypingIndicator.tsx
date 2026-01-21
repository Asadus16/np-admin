import React from 'react';

interface TypingIndicatorProps {
  userName?: string;
}

export default function TypingIndicator({ userName }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[70%] rounded-lg px-4 py-2 bg-gray-100">
        <div className="flex items-center gap-1">
          {userName && (
            <span className="text-xs text-gray-500 mr-2">{userName} is typing</span>
          )}
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
