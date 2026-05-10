import Link from "next/link";

type PublicHeaderProps = {
  signedIn: boolean;
};

export function PublicHeader({ signedIn }: PublicHeaderProps) {
  return (
    <header className="border-b border-[color:var(--line)] bg-[color:var(--surface-raised)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3 whitespace-nowrap">
          <div className="flex text-[2rem] font-black">
            <span className="text-[#4667d7]">s</span>
            <span className="text-[#cf7b3b]">k</span>
            <span className="text-[#dbc353]">o</span>
            <span className="text-[#4667d7]">o</span>
            <span className="text-[#c56d58]">l</span>
          </div>
          <span className="hidden text-sm font-medium text-[color:var(--muted)] md:inline">
            Campus Digital
          </span>
        </Link>

        <Link
          href={signedIn ? "/dashboard" : "/auth/signin"}
          className="rounded-[10px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-4 py-2 text-sm font-medium text-[color:var(--foreground)] transition hover:bg-[color:var(--surface-soft)]"
        >
          {signedIn ? "Workspace" : "Log in"}
        </Link>
      </div>
    </header>
  );
}
