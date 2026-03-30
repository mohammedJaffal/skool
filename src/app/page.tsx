import Link from "next/link";

const p3Cards = [
  {
    title: "Auth System",
    description: "NextAuth v5 config + /api/auth routes",
    href: "/auth/signin",
  },
  {
    title: "Dashboard Layout",
    description: "Sidebar + top nav that connects integration pages",
    href: "/dashboard",
  },
  {
    title: "Admin Panel",
    description: "Manage courses with POST/DELETE APIs",
    href: "/dashboard/admin",
  },
  {
    title: "Deploy + Git",
    description: "Vercel setup and branch/review workflow",
    href: "/dashboard/deploy",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          P3 Integration Workspace
        </p>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">
          Auth, Dashboard, Admin, and Deploy flow in one place.
        </h1>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {p3Cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm transition hover:border-[color:var(--brand)]"
          >
            <h2 className="text-2xl font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {card.description}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
