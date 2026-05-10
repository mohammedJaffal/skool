import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { LessonProgressToggle } from "@/components/courses/lesson-progress-toggle";
import { getCourseDetailById, getLessonDetailById } from "@/lib/platform-data";

type LessonPageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await auth();
  const { courseId, lessonId } = await params;
  const lesson = await getLessonDetailById(courseId, lessonId);
  const course = await getCourseDetailById(courseId);

  if (!lesson || !course) {
    notFound();
  }

  const currentIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const prev = course.lessons[currentIndex - 1];
  const next = course.lessons[currentIndex + 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
        <Link
          href="/dashboard/courses"
          className="transition hover:text-[color:var(--foreground)]"
        >
          Classroom
        </Link>
        <span>/</span>
        <Link
          href={`/dashboard/courses/${courseId}`}
          className="transition hover:text-[color:var(--foreground)]"
        >
          {course.title}
        </Link>
        <span>/</span>
        <span className="font-medium text-[color:var(--foreground)] truncate">
          {lesson.title}
        </span>
      </div>

      <div className="aspect-video rounded-[24px] bg-gradient-to-br from-[#202430] via-[#2e3f72] to-[#10161f] flex items-center justify-center shadow-[0_18px_50px_rgba(23,28,41,0.18)]">
        <div className="space-y-2 text-center text-white/80">
          <div className="text-5xl">▶</div>
          <p className="text-sm uppercase tracking-[0.18em] text-white/60">
            Video placeholder
          </p>
          <p className="text-xs text-white/50">
            {lesson.title} · {lesson.duration}
          </p>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Lesson {lesson.order} of {course.lessons.length}
          </p>
          <h1 className="text-3xl font-black tracking-[-0.04em]">{lesson.title}</h1>
        </div>
        <span className="shrink-0 rounded-full bg-[color:var(--chip)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
          {lesson.duration}
        </span>
      </div>

      <section className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-6 shadow-[0_14px_38px_rgba(32,33,39,0.06)] space-y-3">
        <h2 className="font-semibold text-[color:var(--foreground)]">Lesson notes</h2>
        <div className="text-sm whitespace-pre-line leading-7 text-[color:var(--muted)]">
          {lesson.content}
        </div>
      </section>

      <LessonProgressToggle
        lessonId={lesson.id}
        signedIn={Boolean(session?.user)}
      />

      <div className="flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/dashboard/courses/${courseId}/lessons/${prev.id}`}
            className="flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 py-3 text-sm font-medium transition hover:border-[color:var(--brand)]"
          >
            ← {prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/dashboard/courses/${courseId}/lessons/${next.id}`}
            className="flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            {next.title} →
          </Link>
        ) : (
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Course complete ✓
          </Link>
        )}
      </div>
    </div>
  );
}
