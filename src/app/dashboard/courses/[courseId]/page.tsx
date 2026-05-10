import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  getCourseDetailById,
  listAnnouncementsByCourseId,
} from "@/lib/platform-data";

const levelColor: Record<string, string> = {
  Beginner: "text-green-700 bg-green-50",
  Intermediate: "text-yellow-700 bg-yellow-50",
  Advanced: "text-red-700 bg-red-50",
  General: "text-slate-700 bg-slate-100",
};

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const session = await auth();
  const { courseId } = await params;
  const course = await getCourseDetailById(courseId);
  if (!course) notFound();
  const announcements = await listAnnouncementsByCourseId(courseId);
  const canManageMembers =
    session?.user?.role === "ADMIN" || session?.user?.role === "TEACHER";

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/courses"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
      >
        <span>←</span>
        <span>Back to classroom</span>
      </Link>

      <section className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Course overview
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-[-0.04em]">
              {course.title}
            </h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              By {course.instructor} · {course.duration} · {course.lessons.length}{" "}
              lessons
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${levelColor[course.level] ?? levelColor.General}`}
          >
            {course.level}
          </span>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
          {course.description}
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <div className="space-y-4">
          <section className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 shadow-[0_14px_38px_rgba(32,33,39,0.06)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Curriculum</h2>
              <span className="rounded-full bg-[color:var(--chip)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
                {course.lessons.length} lessons
              </span>
            </div>

            <div className="space-y-3">
              {course.lessons.map((lesson, i) => (
                <Link
                  key={lesson.id}
                  href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
                  className="flex gap-4 rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 transition hover:border-[color:var(--brand)]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-[color:var(--muted)]">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">{lesson.title}</p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">
                      {lesson.content}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                      {lesson.duration}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 shadow-[0_14px_38px_rgba(32,33,39,0.06)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Announcements</h2>
              <span className="rounded-full bg-[color:var(--chip)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
                {announcements.length}
              </span>
            </div>

            {announcements.length > 0 ? (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <Link
                    key={announcement.id}
                    href={`/dashboard/courses/${course.id}/announcements/${announcement.id}`}
                    className="block rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 transition hover:border-[color:var(--brand)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{announcement.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                          {announcement.authorName} · {announcement.comments.length} comments
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[color:var(--brand)]">
                        Open
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                      {announcement.content}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[18px] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--muted)]">
                No announcements published yet for this course.
              </div>
            )}
          </section>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 shadow-[0_14px_38px_rgba(32,33,39,0.06)]">
            <p className="text-2xl font-bold">
              {course.price > 0 ? `$${course.price}` : "Free access request"}
            </p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              {course.price > 0
                ? "One-time payment · Lifetime access"
                : "Identity-based membership flow"}
            </p>
            <Link
              href={`/dashboard/checkout?courseId=${course.id}`}
              className="mt-4 block rounded-full bg-[color:var(--brand)] py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
            >
              {course.price > 0 ? "Join classroom" : "Request access"}
            </Link>
          </div>

          <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 shadow-[0_14px_38px_rgba(32,33,39,0.06)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Read-side state
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--muted)]">
              <li>Lessons can be opened without auth in Sprint 01.</li>
              <li>Announcements are readable inside the course flow.</li>
              <li>Joining still requires identity and redirects to sign-in.</li>
            </ul>
            {canManageMembers ? (
              <Link
                href={`/dashboard/courses/${course.id}/members`}
                className="mt-4 inline-block rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold transition hover:border-[color:var(--brand)]"
              >
                Manage members
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
