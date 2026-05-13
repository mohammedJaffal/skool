"use client";

import { useMemo, useState } from "react";

type LearnerCourse = {
  communityId: string;
  title: string;
  totalLessons: number;
  completed: number;
  percentage: number;
  classroomItems: {
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
  communityId: string;
  title: string;
  members: {
    memberId: string;
    memberName: string;
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
  const [selectedTeacherCourseId, setSelectedTeacherCourseId] = useState(
    teacherCourses[0]?.communityId ?? "",
  );
  const [selectedLearnerId, setSelectedLearnerId] = useState(
    teacherCourses[0]?.members[0]?.memberId ?? "",
  );
  const [draftFeedback, setDraftFeedback] = useState<Record<string, string>>(
    Object.fromEntries(
      initialLearnerCourses.map((course) => [
        course.communityId,
        course.evaluation?.feedback ?? "",
      ]),
    ),
  );
  const [status, setStatus] = useState("");

  const selectedTeacherCourse =
    teacherCourses.find((course) => course.communityId === selectedTeacherCourseId) ??
    teacherCourses[0] ??
    null;

  const selectedLearner = useMemo(() => {
    if (!selectedTeacherCourse) {
      return null;
    }

    return (
      selectedTeacherCourse.members.find(
        (learner) => learner.memberId === selectedLearnerId,
      ) ??
      selectedTeacherCourse.members[0] ??
      null
    );
  }, [selectedLearnerId, selectedTeacherCourse]);

  async function toggleProgress(
    communityId: string,
    classroomItemId: string,
    completed: boolean,
  ) {
    const response = await fetch(`/api/classroom-items/${classroomItemId}/progress`, {
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
        if (course.communityId !== communityId) {
          return course;
        }

        const classroomItems = course.classroomItems.map((lesson) =>
          lesson.id === classroomItemId ? { ...lesson, completed } : lesson,
        );
        const completedCount = classroomItems.filter((lesson) => lesson.completed).length;

        return {
          ...course,
          classroomItems,
          completed: completedCount,
          percentage:
            course.totalLessons > 0
              ? Math.round((completedCount / course.totalLessons) * 100)
              : 0,
        };
      }),
    );
    setStatus("Progress updated.");
  }

  async function submitEvaluation(communityId: string, rating: number) {
    const feedback = draftFeedback[communityId] ?? "";
    const response = await fetch(`/api/communities/${communityId}/evaluations`, {
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
        course.communityId === communityId
          ? { ...course, evaluation: { rating, feedback } }
          : course,
      ),
    );
    setStatus("Evaluation saved.");
  }

  async function submitFeedback(communityId: string) {
    const course = learnerCourses.find((item) => item.communityId === communityId);

    await submitEvaluation(communityId, course?.evaluation?.rating ?? 20);
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
              Member view
            </p>
            <h1 className="mt-1 text-2xl font-bold">Your progress</h1>
          </div>
          {learnerCourses.map((course) => (
            <article
              key={course.communityId}
              className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-sm text-[color:var(--muted)]">
                    {course.completed}/{course.totalLessons} classroom items completed
                  </p>
                </div>
                <span className="rounded-full bg-[color:var(--chip)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]">
                  {course.percentage}%
                </span>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-2">
                  {course.classroomItems.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                    >
                      <p className="font-medium">{lesson.title}</p>
                      <button
                        type="button"
                        onClick={() =>
                          toggleProgress(
                            course.communityId,
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
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    Give a classroom score between 0 and 20.
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={course.evaluation?.rating ?? 20}
                    onChange={(event) =>
                      submitEvaluation(course.communityId, Number(event.target.value))
                    }
                    className="mt-4 w-full"
                  />
                  <div className="mt-2 flex items-center justify-between text-sm font-semibold">
                    <span>0</span>
                    <span>{course.evaluation?.rating ?? 20}/20</span>
                    <span>20</span>
                  </div>
                  <textarea
                    rows={4}
                    value={draftFeedback[course.communityId] ?? ""}
                    placeholder="Optional feedback"
                    className="mt-3 w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
                    onChange={(event) =>
                      setDraftFeedback((current) => ({
                        ...current,
                        [course.communityId]: event.target.value,
                      }))
                    }
                    onBlur={() => submitFeedback(course.communityId)}
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
              Owner view
            </p>
            <h2 className="mt-1 text-2xl font-bold">Consult member progress</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <article className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
              <label className="block space-y-2">
                <span className="text-sm font-semibold">Select a community</span>
                <select
                  value={selectedTeacherCourse?.communityId ?? ""}
                  onChange={(event) => {
                    const nextCourseId = event.target.value;
                    const nextCourse = teacherCourses.find(
                      (course) => course.communityId === nextCourseId,
                    );
                    setSelectedTeacherCourseId(nextCourseId);
                    setSelectedLearnerId(nextCourse?.members[0]?.memberId ?? "");
                  }}
                  className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                >
                  {teacherCourses.map((course) => (
                    <option key={course.communityId} value={course.communityId}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-4 space-y-3">
                {selectedTeacherCourse?.members.length ? (
                  selectedTeacherCourse.members.map((learner) => (
                    <button
                      key={learner.memberId}
                      type="button"
                      onClick={() => setSelectedLearnerId(learner.memberId)}
                      className={`w-full rounded-[18px] border px-4 py-3 text-left ${
                        learner.memberId === selectedLearner?.memberId
                          ? "border-[color:var(--foreground)] bg-[color:var(--surface-soft)]"
                          : "border-[color:var(--line)] bg-white"
                      }`}
                    >
                      <p className="font-medium">{learner.memberName}</p>
                      <p className="text-sm text-[color:var(--muted)]">
                        {learner.completed}/{learner.totalLessons} completed
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-dashed border-[color:var(--line)] p-4 text-sm text-[color:var(--muted)]">
                    No active members in this community yet.
                  </div>
                )}
              </div>
            </article>

            <article className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
              {selectedLearner ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-[color:var(--muted)]">
                        Selected member
                      </p>
                      <h3 className="text-xl font-semibold">
                        {selectedLearner.memberName}
                      </h3>
                    </div>
                    <span className="rounded-full bg-[color:var(--chip)] px-4 py-2 text-sm font-semibold">
                      {selectedLearner.percentage}%
                    </span>
                  </div>

                  <div className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
                    <p className="text-sm text-[color:var(--muted)]">
                      Progress details
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {selectedLearner.completed}/{selectedLearner.totalLessons}
                    </p>
                    <p className="text-sm text-[color:var(--muted)]">
                      classroom items completed in this community
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-[18px] border border-dashed border-[color:var(--line)] p-4 text-sm text-[color:var(--muted)]">
                  Select a member to inspect progress.
                </div>
              )}
            </article>
          </div>
        </section>
      ) : null}
    </section>
  );
}
