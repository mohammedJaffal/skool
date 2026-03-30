import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/admin", label: "Admin Panel" },
  { href: "/dashboard/deploy", label: "Deploy + Git" },
  { href: "/auth/signin", label: "Auth Entry" },
];

export function Sidebar() {
  return (
    <aside className="w-full max-w-64 rounded-2xl border border-[color:var(--line)] bg-white p-4 shadow-sm">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
        P3 Navigation
      </p>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-xl border border-transparent px-3 py-2 text-sm font-medium transition hover:border-[color:var(--line)] hover:bg-[color:var(--surface-soft)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
