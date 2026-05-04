import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getDashboardRoutes } from "@/config/dashboard-nav";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const role = session.user.role ?? "MEMBER";
  const routes = getDashboardRoutes(role);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Sprint 01 Foundation
        </p>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Shared dashboard routes are ready for incoming P1 and P2 work.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => (
          <div
            key={route.href}
            className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5"
          >
            <div className="mb-1 flex items-baseline justify-between">
              <h2 className="font-semibold">{route.label}</h2>
              <span className="text-xs text-[color:var(--muted)]">
                {route.owner}
              </span>
            </div>
            <p className="text-sm text-[color:var(--muted)]">{route.summary}</p>
            <Link
              href={route.href}
              className="mt-4 inline-block text-xs font-medium text-[color:var(--brand)] hover:underline"
            >
              Open →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
