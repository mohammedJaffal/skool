import Link from "next/link";

const cards = [
  {
    label: "Auth System",
    href: "/auth/signin",
    summary: "Sign in, sign out, and session management.",
    owner: "P3",
  },
  {
    label: "Dashboard Layout",
    href: "/dashboard",
    summary: "Sidebar, top nav, and app shell wired up.",
    owner: "P3",
  },
  {
    label: "Admin Panel",
    href: "/dashboard/admin",
    summary: "Role-protected course management.",
    owner: "P3",
  },
  {
    label: "Deploy + Git",
    href: "/dashboard/deploy",
    summary: "Branch status and deployment pipeline.",
    owner: "P3",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          P3 Integration Workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          Auth, Dashboard, Admin, and Deploy flow in one place.
        </h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm transition hover:border-[color:var(--brand)]"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-semibold">{c.label}</h2>
                <span className="text-xs text-[color:var(--muted)]">{c.owner}</span>
              </div>
              <p className="mt-1 text-sm text-[color:var(--muted)]">{c.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
