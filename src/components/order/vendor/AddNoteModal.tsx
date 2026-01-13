"use client";

import { Loader2 } from "lucide-react";
import { AddNoteModalProps } from "./types";

export function AddNoteModal({
  isOpen,
  onClose,
  onSubmit,
  note,
  onNoteChange,
  isInternal,
  onInternalChange,
  loading,
}: AddNoteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Note</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={() => onInternalChange(true)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border ${
                isInternal
                  ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Internal
            </button>
            <button
              onClick={() => onInternalChange(false)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border ${
                !isInternal
                  ? "bg-blue-50 border-blue-300 text-blue-800"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Customer-facing
            </button>
          </div>
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Enter your note..."
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || !note.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 inline-flex items-center"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}
