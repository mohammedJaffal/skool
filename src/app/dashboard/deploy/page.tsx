const releaseChecklist = [
  "Set production environment variables in Vercel",
  "Run migrations before promoting release",
  "Confirm auth, dashboard, and admin routes still load",
  "Monitor auth and admin flows after deploy",
];

const reviewChecklist = [
  "Review teammate work in their own branch first",
  "Reject incomplete work before merge",
  "Merge only validated changes into main",
  "Keep Sprint 01 checkboxes aligned with real progress",
];

const integrationChecklist = [
  "P1 can plug UI into the shared dashboard shell",
  "P2 can replace admin mock flows with real course data",
  "P3 keeps route protection, branch flow, and release checks stable",
];

export default function DeployPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          P3 Operations
        </p>
        <h1 className="text-2xl font-bold">Deploy + Git</h1>
        <p className="text-sm text-[color:var(--muted)]">
          This page keeps the release, review, and integration rules visible
          while Sprint 01 is still moving across branches.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Release check</h2>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
            {releaseChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Review gate</h2>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
            {reviewChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Integration handoff</h2>
          <ul className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
            {integrationChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
