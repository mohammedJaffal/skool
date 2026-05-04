const steps = [
  { label: "Push to branch", status: "done", detail: "sadik → origin/sadik" },
  { label: "Open pull request", status: "done", detail: "PR #12: Frontend TypeScript migration" },
  { label: "CI checks pass", status: "pending", detail: "Waiting for build verification" },
  { label: "Merge to main", status: "pending", detail: "Requires 1 approval" },
  { label: "Deploy to Vercel", status: "pending", detail: "Auto-deploy on merge" },
];

export default function DeployPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Operations
        </p>
        <h1 className="text-2xl font-semibold">Deploy + Git</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Branch status and deployment pipeline.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            Pipeline
          </h2>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.status === "done"
                      ? "bg-green-100 text-green-700"
                      : "bg-[color:var(--surface-soft)] text-[color:var(--muted)]"
                  }`}
                >
                  {step.status === "done" ? "✓" : i + 1}
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      step.status !== "done" ? "text-[color:var(--muted)]" : ""
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-[color:var(--muted)]">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            Branch Info
          </h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Current branch", value: "sadik" },
              { label: "Base branch", value: "main" },
              { label: "Repo", value: "mohammedJaffal/skool" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-[color:var(--muted)]">{label}</span>
                <code className="rounded bg-[color:var(--surface-soft)] px-2 py-0.5 font-mono text-xs">
                  {value}
                </code>
              </div>
            ))}
            <div className="flex justify-between">
              <span className="text-[color:var(--muted)]">Status</span>
              <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                In Progress
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
