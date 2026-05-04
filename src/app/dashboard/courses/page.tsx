import Link from "next/link";
import { COURSES } from "@/lib/mock-data";

const levelColor: Record<string, string> = {
  Beginner: "text-green-700 bg-green-50",
  Intermediate: "text-yellow-700 bg-yellow-50",
  Advanced: "text-red-700 bg-red-50",
};

export default function CoursesPage() {
  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Library
          </p>
          <h1 className="text-2xl font-semibold">Courses</h1>
        </div>
        <span className="text-sm text-[color:var(--muted)]">
          {COURSES.length} courses
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {COURSES.map((course) => (
          <Link
            key={course.id}
            href={`/dashboard/courses/${course.id}`}
            className="block rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm transition hover:border-[color:var(--brand)] hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold">{course.title}</h2>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${levelColor[course.level]}`}
              >
                {course.level}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-[color:var(--muted)]">
              {course.description}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-[color:var(--muted)]">
              <span>By {course.instructor}</span>
              <span>
                {course.lessons.length} lessons · {course.duration}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold">${course.price}</span>
              <span className="text-xs font-medium text-[color:var(--brand)]">
                View course →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
