import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

type AppShellProps = {
  children: React.ReactNode;
  userName: string;
  role: string;
};

export function AppShell({ children, userName, role }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-6 md:px-8">
      <TopNav userName={userName} role={role} />
      <div className="flex flex-1 flex-col gap-4 md:flex-row">
        <Sidebar role={role} />
        <main className="min-h-[70vh] flex-1 rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
