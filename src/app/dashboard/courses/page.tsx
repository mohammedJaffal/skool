import Link from "next/link";
import { COURSES } from "@/lib/mock-data";

const levelColor: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

export default function CoursesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Courses</h1>
        <p className="text-sm text-gray-500 mt-1">{COURSES.length} courses available</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COURSES.map((course) => (
          <Link
            key={course.id}
            href={`/dashboard/courses/${course.id}`}
            className="block rounded-2xl border border-gray-200 bg-white p-5 hover:border-gray-400 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-base font-semibold leading-snug">{course.title}</h2>
              <span className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold ${levelColor[course.level] ?? "bg-gray-100 text-gray-600"}`}>
                {course.level}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>👤 {course.instructor}</span>
              <span>📚 {course.lessons.length} lessons · ⏱ {course.duration}</span>
            </div>
            <div className="mt-3 border-t border-gray-100 pt-3 flex items-center justify-between">
              <span className="text-sm font-bold">${course.price}</span>
              <span className="text-xs text-gray-500 hover:text-black transition">View course →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
