"use client";

import { CustomerLayout } from "@/components/layout/customer/CustomerLayout";
// RoleGuard disabled temporarily - no backend for customer yet
// import { RoleGuard } from "@/components/auth/RoleGuard";

export default function CustomerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Re-enable RoleGuard when customer backend is ready
  // return (
  //   <RoleGuard allowedRoles={["customer"]}>
  //     <CustomerLayout>{children}</CustomerLayout>
  //   </RoleGuard>
  // );
  return <CustomerLayout>{children}</CustomerLayout>;
}
