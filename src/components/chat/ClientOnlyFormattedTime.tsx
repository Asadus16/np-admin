"use client";

import { useState, useEffect } from "react";

/**
 * Renders formatted time only after mount to avoid hydration mismatch.
 * Server and first client render show placeholder; after hydration we show the real value.
 */
export function ClientOnlyFormattedTime({
  dateString,
  formatter,
  placeholder = "\u00A0",
}: {
  dateString: string | null | undefined;
  formatter: (s: string | null | undefined) => string;
  placeholder?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!dateString) return <>{placeholder}</>;
  if (!mounted) return <>{placeholder}</>;
  return <>{formatter(dateString)}</>;
}
