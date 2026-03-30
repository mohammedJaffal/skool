export default function AdminPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="text-sm text-[color:var(--muted)]">
        Manage courses through <code>/api/admin/courses</code> using{" "}
        <code>POST</code> and <code>DELETE</code>.
      </p>

      <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--muted)]">
        This page is the integration point for admin actions and role-based
        access controls.
      </div>
    </section>
  );
}
