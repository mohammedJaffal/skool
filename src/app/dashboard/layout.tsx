import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userName = session.user.name ?? session.user.email ?? "Unknown User";
  const role = session.user.role ?? "MEMBER";

  return (
    <AppShell userName={userName} role={role}>
      {children}
    </AppShell>
  );
}
