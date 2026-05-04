import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/mock-data";

const levelColor: Record<string, string> = {
  Beginner: "text-green-700 bg-green-50",
  Intermediate: "text-yellow-700 bg-yellow-50",
  Advanced: "text-red-700 bg-red-50",
};

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { courseId } = await params;
  const course = getCourseById(courseId);
  if (!course) notFound();

  return (
    <div>
      <Link
        href="/dashboard/courses"
        className="text-xs text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
      >
        ← Back to courses
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{course.title}</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            By {course.instructor} · {course.duration} · {course.lessons.length}{" "}
            lessons
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${levelColor[course.level]}`}
        >
          {course.level}
        </span>
      </div>
      <p className="mt-3 text-sm text-[color:var(--muted)]">
        {course.description}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="space-y-3 md:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            Curriculum
          </h2>
          {course.lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className="flex gap-4 rounded-2xl border border-[color:var(--line)] bg-white p-4 shadow-sm"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--surface-soft)] text-sm font-semibold text-[color:var(--muted)]">
                {i + 1}
              </div>
              <div>
                <p className="font-medium">{lesson.title}</p>
                <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                  {lesson.content}
                </p>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  {lesson.duration}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold">${course.price}</p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              One-time payment · Lifetime access
            </p>
            <Link
              href={`/dashboard/checkout?courseId=${course.id}`}
              className="mt-4 block rounded-xl bg-[color:var(--brand)] py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
            >
              Enroll now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
