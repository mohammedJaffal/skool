import Link from "next/link";
import { TopNav } from "@/components/layout/top-nav";
import { getDashboardRoutes } from "@/config/dashboard-nav";

type AppShellProps = {
  children: React.ReactNode;
  userName?: string;
  role?: string;
};

export function AppShell({ children, userName, role }: AppShellProps) {
  const links = getDashboardRoutes(role ?? "MEMBER", Boolean(userName));

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 md:px-6">
      <TopNav userName={userName} role={role} />

      <div className="overflow-x-auto border-b border-[color:var(--line)] bg-[color:var(--surface-raised)]">
        <nav className="flex min-w-max items-center gap-6 px-1 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-transparent pb-2 text-sm font-medium text-[color:var(--muted)] transition hover:border-[color:var(--foreground)] hover:text-[color:var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-1 flex-col py-6">
        <main className="min-h-[70vh] rounded-[12px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
