import Link from "next/link";

type FoundationPlaceholderProps = {
  eyebrow: string;
  title: string;
  summary: string;
  owner: string;
  routeId: string;
  implementationNotes: string[];
  dependencyNotes: string[];
};

export function FoundationPlaceholder({
  eyebrow,
  title,
  summary,
  owner,
  routeId,
  implementationNotes,
  dependencyNotes,
}: FoundationPlaceholderProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          {eyebrow}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">{title}</h1>
          <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Owner {owner}
          </span>
        </div>
        <p className="max-w-2xl text-sm text-[color:var(--muted)]">{summary}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Implementation notes</h2>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
            {implementationNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold">Dependency notes</h2>
            <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
              {dependencyNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[color:var(--line)] bg-white p-4 text-sm text-[color:var(--muted)]">
            <p className="font-semibold text-black">Route ID</p>
            <p>{routeId}</p>
          </div>

          <Link
            href="/dashboard"
            className="inline-block rounded-xl border border-[color:var(--line)] px-4 py-2 text-sm font-semibold transition hover:bg-white"
          >
            Back to dashboard
          </Link>
        </section>
      </div>
    </section>
  );
}
