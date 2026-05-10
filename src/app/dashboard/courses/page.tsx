import Link from "next/link";
import { listCourseCards } from "@/lib/platform-data";

const levelColor: Record<string, string> = {
  Beginner: "text-green-700 bg-green-50",
  Intermediate: "text-yellow-700 bg-yellow-50",
  Advanced: "text-red-700 bg-red-50",
  General: "text-slate-700 bg-slate-100",
};

export default async function CoursesPage() {
  const courses = await listCourseCards();

  if (courses.length === 0) {
    return (
      <section className="rounded-[24px] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-soft)] p-6 text-sm text-[color:var(--muted)]">
        No classroom folders are available yet.
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Classroom
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-[-0.04em]">
              Learning library
            </h1>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--muted)]">
            {courses.length} folders
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/dashboard/courses/${course.id}`}
            className="group block rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-4 shadow-[0_14px_38px_rgba(32,33,39,0.06)] transition hover:-translate-y-0.5 hover:border-[color:var(--brand)]"
          >
            <div className="rounded-[18px] bg-gradient-to-br from-[#d9e5ff] via-[#f3f6ff] to-[#fff7ea] p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold tracking-[-0.03em]">{course.title}</h2>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${levelColor[course.level] ?? levelColor.General}`}
                >
                  {course.level}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                {course.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[color:var(--muted)]">
              <span>{course.lessonCount} lessons</span>
              <span>{course.duration}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[color:var(--line)] pt-3">
              <span className="text-sm font-semibold">{course.instructor}</span>
              <span className="text-sm font-semibold text-[color:var(--brand)]">
                Open
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
