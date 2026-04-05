import Link from "next/link";
import { auth } from "@/auth";
import { AdminCourseManager } from "@/components/admin/admin-course-manager";

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user?.role ?? "STUDENT";
  const isAdmin = role === "ADMIN";

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Role Protected
        </p>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Manage course drafts through <code>/api/admin/courses</code> and keep
          the admin flow ready while the full classroom database is still in
          progress.
        </p>
      </div>

      {!isAdmin ? (
        <div className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5 text-sm text-[color:var(--muted)]">
          <p>
            Your current role is <strong>{role}</strong>. Only admins can use
            this page.
          </p>
          <p>
            Keep the auth flow in place, then switch your seeded user role to
            <code>ADMIN</code> once the team is ready to test the real admin
            path.
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-xl border border-[color:var(--line)] px-4 py-2 font-semibold text-black transition hover:bg-white"
          >
            Back to dashboard
          </Link>
        </div>
      ) : (
        <AdminCourseManager />
      )}
    </section>
  );
}
