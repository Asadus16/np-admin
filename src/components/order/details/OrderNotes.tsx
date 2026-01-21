"use client";

import { OrderNotesProps } from "./types";

export function OrderNotes({ notes, cancellationReason }: OrderNotesProps) {
  if (!notes && !cancellationReason) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Notes</h2>
      </div>
      <div className="p-4 space-y-4">
        {notes && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Your Note</p>
            <p className="text-sm text-gray-700">{notes}</p>
          </div>
        )}
        {cancellationReason && (
          <div>
            <p className="text-xs font-medium text-red-500 mb-1">Cancellation Reason</p>
            <p className="text-sm text-gray-700">{cancellationReason}</p>
          </div>
        )}
      </div>
    </div>
  );
}
