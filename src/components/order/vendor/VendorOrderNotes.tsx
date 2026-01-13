"use client";

import { StickyNote, Plus } from "lucide-react";
import { VendorOrderNotesProps } from "./types";
import { formatDateTime } from "./helpers";

export function VendorOrderNotes({ notes, onAddNote }: VendorOrderNotesProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">Notes</h2>
        </div>
        <button
          onClick={onAddNote}
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </button>
      </div>
      <div className="space-y-3">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className={`rounded-lg p-3 ${
                note.is_internal
                  ? "bg-yellow-50 border border-yellow-200"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-medium ${
                    note.is_internal ? "text-yellow-700" : "text-blue-700"
                  }`}
                >
                  {note.is_internal ? "Internal" : "Customer-facing"}
                </span>
              </div>
              <p className="text-sm text-gray-700">{note.content}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span className="font-medium">{note.author.name}</span>
                <span>•</span>
                <span>{formatDateTime(note.created_at)}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
        )}
      </div>
    </div>
  );
}
