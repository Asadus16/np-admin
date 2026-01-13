"use client";

import { Phone, StickyNote } from "lucide-react";
import { QuickActionsCardProps } from "./types";

export function QuickActionsCard({ customerPhone, onAddNote }: QuickActionsCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <a
          href={`tel:${customerPhone}`}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left inline-flex items-center"
        >
          <Phone className="h-4 w-4 mr-2" />
          Call Customer
        </a>
        <button
          onClick={onAddNote}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-left inline-flex items-center"
        >
          <StickyNote className="h-4 w-4 mr-2" />
          Add Note
        </button>
      </div>
    </div>
  );
}
