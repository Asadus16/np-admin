"use client";

import { useState } from 'react';
import { usePointsHistory } from '@/hooks/usePointsHistory';
import { format } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Clock, RefreshCw, AlertCircle } from 'lucide-react';

export default function PointsHistory() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const { history, loading, error } = usePointsHistory({
    page,
    perPage: 20,
    type: typeFilter || undefined,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!history || history.data.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No transaction history found</p>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <ArrowUpCircle className="h-5 w-5 text-green-600" />;
      case 'redeemed':
        return <ArrowDownCircle className="h-5 w-5 text-red-600" />;
      case 'expired':
        return <Clock className="h-5 w-5 text-gray-600" />;
      case 'adjusted':
        return <RefreshCw className="h-5 w-5 text-blue-600" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
        return 'text-green-600';
      case 'redeemed':
        return 'text-red-600';
      case 'expired':
        return 'text-gray-600';
      case 'adjusted':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
        >
          <option value="">All Types</option>
          <option value="earned">Earned</option>
          <option value="redeemed">Redeemed</option>
          <option value="expired">Expired</option>
          <option value="adjusted">Adjusted</option>
        </select>
      </div>

      {/* History List */}
      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
        {history.data.map((transaction) => (
          <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">{getTransactionIcon(transaction.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                {transaction.order_number && (
                  <p className="text-xs text-gray-500 mt-1">Order: {transaction.order_number}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className={`text-sm font-semibold ${getTransactionColor(transaction.type)}`}>
                  {transaction.points > 0 ? '+' : ''}{transaction.points}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Balance: {transaction.balance_after}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {history.meta.last_page > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Showing {history.meta.from} to {history.meta.to} of {history.meta.total} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {history.meta.current_page} of {history.meta.last_page}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === history.meta.last_page}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
