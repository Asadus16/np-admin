"use client";

import { VendorLayout } from "@/components/layout/vendor/VendorLayout";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function VendorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["vendor"]}>
      <VendorLayout>{children}</VendorLayout>
    </RoleGuard>
  );
}
