import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // DEV BYPASS — remove before pushing your branch
  const userName = "Test User";
  const role = "MEMBER";

  // const session = await auth();
  // if (!session?.user) { redirect("/auth/signin"); }
  // const userName = session.user.name ?? session.user.email ?? "Unknown User";
  // const role = session.user.role ?? "MEMBER";

  return (
    <AppShell userName={userName} role={role}>
      {children}
    </AppShell>
  );
}
