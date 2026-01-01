"use client";

import { CustomerLayout } from "@/components/layout/customer/CustomerLayout";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function CustomerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["customer", "user"]}>
      <CustomerLayout>{children}</CustomerLayout>
    </RoleGuard>
  );
}
