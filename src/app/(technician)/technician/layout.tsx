"use client";

import { TechnicianLayout } from "@/components/layout/technician/TechnicianLayout";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function TechnicianRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["technician"]}>
      <TechnicianLayout>{children}</TechnicianLayout>
    </RoleGuard>
  );
}
