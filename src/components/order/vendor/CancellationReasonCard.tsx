"use client";

import { XCircle } from "lucide-react";

interface CancellationReasonCardProps {
  reason: string;
}

export function CancellationReasonCard({ reason }: CancellationReasonCardProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <XCircle className="h-5 w-5 text-red-500" />
        <h2 className="text-lg font-medium text-red-900">Cancellation Reason</h2>
      </div>
      <p className="text-sm text-red-700">{reason}</p>
    </div>
  );
}
