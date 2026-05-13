import Link from "next/link";
import { auth } from "@/auth";
import { AdminCommunityManager } from "@/components/admin/admin-community-manager";
import { AdminUserManager } from "@/components/admin/admin-user-manager";

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user?.role ?? "MEMBER";
  const isAdmin = role === "ADMIN";

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Role Protected
        </p>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-[color:var(--muted)]">
          Consult users, delete users when needed, and keep community governance
          available in the same protected workspace.
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
        <div className="space-y-6">
          <AdminUserManager />
          <AdminCommunityManager />
        </div>
      )}
    </section>
  );
}
