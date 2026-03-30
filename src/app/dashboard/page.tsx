import Link from "next/link";

const items = [
  {
    title: "Auth System",
    summary: "Configured NextAuth v5 and /api/auth routes",
    href: "/auth/signin",
  },
  {
    title: "Admin Panel",
    summary: "Starter UI + POST/DELETE admin API",
    href: "/dashboard/admin",
  },
  {
    title: "Deploy + Git",
    summary: "Vercel setup checklist and branch/review process",
    href: "/dashboard/deploy",
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          P3 Scope
        </p>
        <h1 className="text-3xl font-bold">Integration Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
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
