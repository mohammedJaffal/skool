import { signOut } from "@/auth";
import Link from "next/link";

type TopNavProps = {
  userName?: string;
  role?: string;
};

export function TopNav({ userName, role }: TopNavProps) {
  const signedIn = Boolean(userName);

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--line)] bg-[color:var(--surface-raised)] px-4 py-3 md:px-6">
      <Link href="/" className="text-[1.65rem] font-black tracking-[-0.08em]">
        <span className="text-[#4667d7]">s</span>
        <span className="text-[#cf7b3b]">k</span>
        <span className="text-[#dbc353]">o</span>
        <span className="text-[#4667d7]">o</span>
        <span className="text-[#c56d58]">l</span>
      </Link>

      {signedIn ? (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold">{userName}</p>
          </div>
          <span className="rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-2 py-1 text-xs font-medium text-[color:var(--muted)]">
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
              className="rounded-[10px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-4 py-2 text-sm font-medium transition hover:bg-[color:var(--surface-soft)]"
            >
              Log out
            </button>
          </form>
        </div>
      ) : (
        <Link
          href="/auth/signin"
          className="rounded-[10px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-4 py-2 text-sm font-medium transition hover:bg-[color:var(--surface-soft)]"
        >
          Log in
        </Link>
      )}
    </header>
  );
}
