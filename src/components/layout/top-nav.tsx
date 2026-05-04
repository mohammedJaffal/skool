import { signOut } from "@/auth";

interface TopNavProps {
  userName: string;
  role: string;
}

export function TopNav({ userName, role }: TopNavProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[color:var(--line)] bg-white px-5 py-4 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Signed in
        </p>
        <p className="text-base font-semibold">{userName}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
          {role}
        </span>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Sign Out
          </button>
        </form>
      </div>
    </header>
  );
}
