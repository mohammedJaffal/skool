import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const userName = session?.user?.name ?? session?.user?.email ?? undefined;
  const role = session?.user?.role ?? "MEMBER";

  return (
    <AppShell userName={userName} role={role}>
      {children}
    </AppShell>
  );
}
