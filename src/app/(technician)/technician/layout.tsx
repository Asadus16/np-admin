import { TechnicianLayout } from "@/components/layout/technician/TechnicianLayout";

export default function TechnicianRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TechnicianLayout>{children}</TechnicianLayout>;
}
