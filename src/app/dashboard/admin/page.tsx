import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminCourseManager } from "@/components/admin/admin-course-manager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Admin
        </p>
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Manage course content and platform settings.
        </p>
      </div>
      <AdminCourseManager />
    </div>
  );
}
