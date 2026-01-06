import { format, formatDistanceToNow, parseISO, isToday, isYesterday } from 'date-fns';

/**
 * Format a date string to relative time (e.g., "2 minutes ago")
 */
export const formatTimeAgo = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  }
};

/**
 * Format a date string to readable time with smart formatting:
 * - Today: "2:30 PM"
 * - Yesterday: "Yesterday"
 * - This week: "Monday"
 * - Older: "Jan 15"
 */
export const formatMessageTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);

    if (isToday(date)) {
      return format(date, 'p'); // 2:30 PM
    }

    if (isYesterday(date)) {
      return 'Yesterday';
    }

    const daysDiff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 7) {
      return format(date, 'EEEE'); // Monday
    }

    return format(date, 'MMM d'); // Jan 15
  } catch {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      if (isToday(date)) {
        return format(date, 'p');
      }

      if (isYesterday(date)) {
        return 'Yesterday';
      }

      const daysDiff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff < 7) {
        return format(date, 'EEEE');
      }

      return format(date, 'MMM d');
    } catch {
      return dateString;
    }
  }
};

/**
 * Format a date string to full time for message details
 * Returns format like "Jan 15, 2024 at 2:30 PM"
 */
export const formatFullMessageTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    return format(date, 'PPp'); // Jan 15, 2024 at 2:30 PM
  } catch {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return format(date, 'PPp');
    } catch {
      return dateString;
    }
  }
};

/**
 * Format conversation list time (smart format)
 */
export const formatConversationTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    // Less than 1 minute
    if (diffInMinutes < 1) {
      return 'Just now';
    }

    // Less than 1 hour - show minutes
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }

    // Less than 24 hours - show hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }

    // Less than 7 days - show days
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }

    // Less than 4 weeks - show weeks
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    }

    // Show date
    return format(date, 'MMM d');
  } catch {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d`;

      const diffInWeeks = Math.floor(diffInDays / 7);
      if (diffInWeeks < 4) return `${diffInWeeks}w`;

      return format(date, 'MMM d');
    } catch {
      return dateString;
    }
  }
};
