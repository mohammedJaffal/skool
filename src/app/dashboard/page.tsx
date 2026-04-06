import { auth } from "@/auth";
import Link from "next/link";
import { getDashboardRoutes } from "@/config/dashboard-nav";

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user?.role ?? "MEMBER";
  const items = getDashboardRoutes(role);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Sprint 01 Foundation
        </p>
        <h1 className="text-3xl font-bold">Integration Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--muted)]">
          Shared dashboard routes are ready for incoming P1 and P2 work. Route
          structure should stay stable while feature UI and APIs are added in
          their own branches.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.href}
            className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{item.label}</h2>
              <span className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
                {item.owner}
              </span>
            </div>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {item.summary}
            </p>
            <Link
              href={item.href}
              className="mt-4 inline-block text-sm font-semibold text-[color:var(--brand)]"
            >
              Open
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
