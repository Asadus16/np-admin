"use client";

import { AdminLayout } from "@/components/layout/admin/AdminLayout";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AdminLayout>{children}</AdminLayout>
    </RoleGuard>
  );
}
