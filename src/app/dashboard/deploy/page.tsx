const checklist = [
  "Set production environment variables in Vercel",
  "Run migrations before promoting release",
  "Use feature branches and PR reviews before merge",
  "Tag release and monitor auth/admin routes after deploy",
];

export default function DeployPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Deploy + Git</h1>
      <p className="text-sm text-[color:var(--muted)]">
        Operational checklist for P3 integration delivery.
      </p>

      <ul className="space-y-2 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--muted)]">
        {checklist.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
