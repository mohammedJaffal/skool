import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseById, getLessonById } from "@/lib/mock-data";

type LessonPageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params;
  const lesson = getLessonById(courseId, lessonId);
  const course = getCourseById(courseId);

  if (!lesson || !course) {
    notFound();
  }

  const currentIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const prev = course.lessons[currentIndex - 1];
  const next = course.lessons[currentIndex + 1];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/courses" className="hover:text-gray-800 transition">
          Courses
        </Link>
        <span>/</span>
        <Link href={`/dashboard/courses/${courseId}`} className="hover:text-gray-800 transition">
          {course.title}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate">{lesson.title}</span>
      </div>

      {/* Video area */}
      <div className="rounded-2xl bg-gray-900 aspect-video flex items-center justify-center">
        <div className="text-center text-gray-400 space-y-2">
          <div className="text-5xl">▶</div>
          <p className="text-sm">Video coming in Sprint 02</p>
          <p className="text-xs text-gray-600">{lesson.title} · {lesson.duration}</p>
        </div>
      </div>

      {/* Lesson header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Lesson {lesson.order} of {course.lessons.length}
          </p>
          <h1 className="text-xl font-bold">{lesson.title}</h1>
        </div>
        <span className="shrink-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-500">
          ⏱ {lesson.duration}
        </span>
      </div>

      {/* Content */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
        <h2 className="font-semibold text-gray-800">Lesson Notes</h2>
        <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
          {lesson.content}
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/dashboard/courses/${courseId}/lessons/${prev.id}`}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium hover:border-gray-400 hover:shadow-sm transition"
          >
            ← {prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/dashboard/courses/${courseId}/lessons/${next.id}`}
            className="flex items-center gap-2 rounded-xl bg-black text-white px-4 py-2.5 text-sm font-medium hover:bg-gray-800 transition"
          >
            {next.title} →
          </Link>
        ) : (
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="flex items-center gap-2 rounded-xl bg-green-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-green-700 transition"
          >
            Course complete ✓
          </Link>
        )}
      </div>
    </div>
  );
}
