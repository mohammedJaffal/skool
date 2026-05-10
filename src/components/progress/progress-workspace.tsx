"use client";

import { useState } from "react";

type LearnerCourse = {
  courseId: string;
  title: string;
  totalLessons: number;
  completed: number;
  percentage: number;
  lessons: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  evaluation?: {
    rating: number;
    feedback: string | null;
  } | null;
};

type TeacherCourse = {
  courseId: string;
  title: string;
  learners: {
    learnerId: string;
    learnerName: string;
    completed: number;
    totalLessons: number;
    percentage: number;
  }[];
};

type ProgressWorkspaceProps = {
  learnerCourses: LearnerCourse[];
  teacherCourses: TeacherCourse[];
};

export function ProgressWorkspace({
  learnerCourses: initialLearnerCourses,
  teacherCourses,
}: ProgressWorkspaceProps) {
  const [learnerCourses, setLearnerCourses] = useState(initialLearnerCourses);
  const [status, setStatus] = useState("");

  async function toggleProgress(courseId: string, lessonId: string, completed: boolean) {
    const response = await fetch(`/api/lessons/${lessonId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setStatus(payload?.error ?? "Could not update lesson progress.");
      return;
    }

    setLearnerCourses((current) =>
      current.map((course) => {
        if (course.courseId !== courseId) {
          return course;
        }

        const lessons = course.lessons.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, completed } : lesson,
        );
        const completedCount = lessons.filter((lesson) => lesson.completed).length;

        return {
          ...course,
          lessons,
          completed: completedCount,
          percentage: Math.round((completedCount / course.totalLessons) * 100),
        };
      }),
    );
    setStatus("Progress updated.");
  }

  async function submitEvaluation(courseId: string, rating: number, feedback: string) {
    const response = await fetch(`/api/courses/${courseId}/evaluations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, feedback }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setStatus(payload?.error ?? "Could not submit evaluation.");
      return;
    }

    setLearnerCourses((current) =>
      current.map((course) =>
        course.courseId === courseId
          ? { ...course, evaluation: { rating, feedback } }
          : course,
      ),
    );
    setStatus("Evaluation saved.");
  }

  return (
    <section className="space-y-6">
      {status ? (
        <div className="rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--muted)]">
          {status}
        </div>
      ) : null}

      {learnerCourses.length > 0 ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Learner view
            </p>
            <h1 className="mt-1 text-2xl font-bold">Your progress</h1>
          </div>
          {learnerCourses.map((course) => (
            <article
              key={course.courseId}
              className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-sm text-[color:var(--muted)]">
                    {course.completed}/{course.totalLessons} lessons completed
                  </p>
                </div>
                <span className="rounded-full bg-[color:var(--chip)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]">
                  {course.percentage}%
                </span>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-2">
                  {course.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                    >
                      <p className="font-medium">{lesson.title}</p>
                      <button
                        type="button"
                        onClick={() =>
                          toggleProgress(
                            course.courseId,
                            lesson.id,
                            !lesson.completed,
                          )
                        }
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          lesson.completed
                            ? "bg-[#ebfff2] text-[#0a7a3f]"
                            : "border border-[color:var(--line)] bg-white"
                        }`}
                      >
                        {lesson.completed ? "Completed" : "Mark complete"}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
                  <p className="font-semibold">Course evaluation</p>
                  <div className="mt-3 flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() =>
                          submitEvaluation(
                            course.courseId,
                            rating,
                            course.evaluation?.feedback ?? "Updated from progress workspace.",
                          )
                        }
                        className={`h-10 w-10 rounded-full text-sm font-semibold ${
                          course.evaluation?.rating === rating
                            ? "bg-[color:var(--brand)] text-white"
                            : "border border-[color:var(--line)] bg-white"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={4}
                    defaultValue={course.evaluation?.feedback ?? ""}
                    placeholder="Optional feedback"
                    className="mt-3 w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
                    onBlur={(event) =>
                      submitEvaluation(
                        course.courseId,
                        course.evaluation?.rating ?? 5,
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {teacherCourses.length > 0 ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Teacher view
            </p>
            <h2 className="mt-1 text-2xl font-bold">Learner progress overview</h2>
          </div>
          {teacherCourses.map((course) => (
            <article
              key={course.courseId}
              className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <div className="mt-4 space-y-2">
                {course.learners.length > 0 ? (
                  course.learners.map((learner) => (
                    <div
                      key={learner.learnerId}
                      className="flex items-center justify-between rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3"
                    >
                      <div>
                        <p className="font-medium">{learner.learnerName}</p>
                        <p className="text-sm text-[color:var(--muted)]">
                          {learner.completed}/{learner.totalLessons} completed
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold">
                        {learner.percentage}%
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-dashed border-[color:var(--line)] p-4 text-sm text-[color:var(--muted)]">
                    No active learners in this course yet.
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </section>
  );
}
