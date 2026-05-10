import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { TeacherWorkspace } from "@/components/teacher/teacher-workspace";

export default async function TeachPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const role = session.user.role ?? "LEARNER";

  if (role !== "TEACHER" && role !== "ADMIN") {
    return (
      <section className="rounded-[8px] border border-[color:var(--line)] bg-white p-6 shadow-sm">
        <h1 className="mt-2 text-2xl font-bold">Teacher access required</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          This workspace is reserved for teacher or admin accounts.
        </p>
      </section>
    );
  }

  const courses = await db.course.findMany({
    where: role === "ADMIN" ? undefined : { teacherId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      lessons: {
        orderBy: { position: "asc" },
      },
      announcements: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
      >
        <span>&larr;</span>
        <span>Back to workspace</span>
      </Link>
      <TeacherWorkspace courses={courses} />
    </div>
  );
}
