import { auth } from "@/auth";
import Link from "next/link";
import { getDashboardRoutes } from "@/config/dashboard-nav";

export default async function DashboardPage() {
  const session = await auth();
  const role = session?.user?.role ?? "MEMBER";
  const items = getDashboardRoutes(role, Boolean(session?.user));

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Community home
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-[-0.04em]">
          Campus Digital workspace
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--muted)]">
          This is the community shell that mirrors Skool’s structure: public
          discovery outside, read-first classroom and community inside, then
          auth-gated actions layered on top.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.href}
            className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-4 shadow-[0_14px_38px_rgba(32,33,39,0.06)]"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{item.label}</h2>
              <span className="rounded-full bg-[color:var(--chip)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
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
