import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseById } from "@/lib/mock-data";

type CourseDetailPageProps = {
  params: Promise<{ courseId: string }>;
};

const levelColor: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-yellow-100 text-yellow-700",
  Advanced: "bg-red-100 text-red-700",
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseId } = await params;
  const course = getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard/courses"
            className="text-sm text-gray-500 hover:text-gray-800 transition"
          >
            ← Back to courses
          </Link>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-gray-500 text-sm max-w-xl">{course.description}</p>
        </div>
        <Link
          href={`/dashboard/checkout?courseId=${course.id}`}
          className="shrink-0 rounded-xl bg-black text-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-800 transition"
        >
          Enroll — ${course.price}
        </Link>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-600">
          👤 {course.instructor}
        </span>
        <span className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-600">
          ⏱ {course.duration}
        </span>
        <span className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-600">
          📚 {course.lessons.length} lessons
        </span>
        <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${levelColor[course.level] ?? "bg-gray-100 text-gray-600"}`}>
          {course.level}
        </span>
      </div>

      {/* Lesson list */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Course Content</h2>
        <div className="space-y-2">
          {course.lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-gray-400 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                  {lesson.order}
                </span>
                <span className="text-sm font-medium">{lesson.title}</span>
              </div>
              <span className="text-xs text-gray-400">{lesson.duration}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
