import Link from "next/link";
import { getDashboardRoutes } from "@/config/dashboard-nav";

interface SidebarProps {
  role: string;
}

export function Sidebar({ role }: SidebarProps) {
  const links = [
    ...getDashboardRoutes(role),
    {
      href: "/auth/signin",
      label: "Auth Entry",
      summary: "Direct entry point for authentication checks.",
      owner: "P3" as const,
      visibility: "all" as const,
    },
  ];

  return (
    <aside className="w-full rounded-2xl border border-[color:var(--line)] bg-white p-4 shadow-sm md:max-w-64">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
        Dashboard Navigation
      </p>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-xl border border-transparent px-3 py-2 transition hover:border-[color:var(--line)] hover:bg-[color:var(--surface-soft)]"
          >
            <span className="block text-sm font-medium">{link.label}</span>
            <span className="mt-1 block text-xs text-[color:var(--muted)]">
              {link.summary}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
