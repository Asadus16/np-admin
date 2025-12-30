"use client";

import { VendorLayout } from "@/components/layout/vendor/VendorLayout";

export default function VendorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VendorLayout>{children}</VendorLayout>;
}
