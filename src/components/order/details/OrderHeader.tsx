"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OrderHeaderProps } from "./types";
import { getStatusConfig, formatDateTime } from "./helpers/orderFormatters";

export function OrderHeader({ orderNumber, status, createdAt, backHref }: OrderHeaderProps) {
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex items-center gap-4">
      <Link
        href={backHref}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeft className="h-5 w-5 text-gray-600" />
      </Link>
      <div className="flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{orderNumber}</h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.className}`}>
            <StatusIcon className="h-4 w-4 mr-1.5" />
            {statusConfig.label}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Placed on {formatDateTime(createdAt)}
        </p>
      </div>
    </div>
  );
}
