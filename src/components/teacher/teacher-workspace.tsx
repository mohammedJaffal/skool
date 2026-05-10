"use client";

import { useMemo, useState } from "react";

type LessonItem = {
  id: string;
  title: string;
  content: string;
  contentType: string;
  position: number;
};

type AnnouncementItem = {
  id: string;
  title: string;
  content: string;
  status: string;
};

type CourseItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  lessons: LessonItem[];
  announcements: AnnouncementItem[];
};

type TeacherWorkspaceProps = {
  courses: CourseItem[];
};

type IdleState = "idle" | "loading" | "error" | "success";

export function TeacherWorkspace({ courses: initialCourses }: TeacherWorkspaceProps) {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourseId, setSelectedCourseId] = useState(
    initialCourses[0]?.id ?? "",
  );
  const [status, setStatus] = useState<string>("");
  const [state, setState] = useState<IdleState>("idle");
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    type: "general",
  });
  const [newLesson, setNewLesson] = useState({
    title: "",
    content: "",
    contentType: "lesson",
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) ?? null,
    [courses, selectedCourseId],
  );

  async function createCourse() {
    setState("loading");
    setStatus("");

    const response = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          course?: {
            id: string;
            title: string;
            description: string;
            type: string;
            status: string;
          };
          error?: string;
        }
      | null;

    if (!response.ok || !payload?.course) {
      setState("error");
      setStatus(payload?.error ?? "Course creation failed.");
      return;
    }

    const createdCourse: CourseItem = {
      id: payload.course.id,
      title: payload.course.title,
      description: payload.course.description,
      type: payload.course.type,
      status: payload.course.status,
      lessons: [],
      announcements: [],
    };

    setCourses((current) => [createdCourse, ...current]);
    setSelectedCourseId(createdCourse.id);
    setNewCourse({ title: "", description: "", type: "general" });
    setState("success");
    setStatus(`Created "${createdCourse.title}".`);
  }

  async function updateCourse(courseId: string, values: Partial<CourseItem>) {
    setState("loading");
    setStatus("");

    const response = await fetch(`/api/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json().catch(() => null)) as
      | { course?: Partial<CourseItem>; error?: string }
      | null;

    if (!response.ok || !payload?.course) {
      setState("error");
      setStatus(payload?.error ?? "Course update failed.");
      return;
    }

    setCourses((current) =>
      current.map((course) =>
        course.id === courseId ? { ...course, ...values } : course,
      ),
    );
    setState("success");
    setStatus("Course updated.");
  }

  async function createLesson() {
    if (!selectedCourse) {
      return;
    }

    setState("loading");
    setStatus("");

    const response = await fetch(`/api/courses/${selectedCourse.id}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLesson),
    });
    const payload = (await response.json().catch(() => null)) as
      | { lesson?: LessonItem; error?: string }
      | null;

    if (!response.ok || !payload?.lesson) {
      setState("error");
      setStatus(payload?.error ?? "Lesson creation failed.");
      return;
    }

    const createdLesson = payload.lesson;
    setCourses((current) =>
      current.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              lessons: [...course.lessons, createdLesson].sort(
                (a, b) => a.position - b.position,
              ),
            }
          : course,
      ),
    );
    setNewLesson({ title: "", content: "", contentType: "lesson" });
    setState("success");
    setStatus("Lesson added.");
  }

  async function saveLesson(courseId: string, lesson: LessonItem) {
    setState("loading");
    setStatus("");

    const response = await fetch(`/api/lessons/${lesson.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lesson),
    });
    const payload = (await response.json().catch(() => null)) as
      | { lesson?: LessonItem; error?: string }
      | null;

    if (!response.ok || !payload?.lesson) {
      setState("error");
      setStatus(payload?.error ?? "Lesson update failed.");
      return;
    }

    const updatedLesson = payload.lesson;
    setCourses((current) =>
      current.map((course) =>
        course.id === courseId
          ? {
              ...course,
              lessons: course.lessons.map((item) =>
                item.id === lesson.id ? { ...item, ...updatedLesson } : item,
              ),
            }
          : course,
      ),
    );
    setState("success");
    setStatus("Lesson updated.");
  }

  async function createAnnouncement() {
    if (!selectedCourse) {
      return;
    }

    setState("loading");
    setStatus("");

    const response = await fetch(
      `/api/courses/${selectedCourse.id}/announcements`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      },
    );
    const payload = (await response.json().catch(() => null)) as
      | { announcement?: AnnouncementItem; error?: string }
      | null;

    if (!response.ok || !payload?.announcement) {
      setState("error");
      setStatus(payload?.error ?? "Announcement creation failed.");
      return;
    }

    const createdAnnouncement = payload.announcement;
    setCourses((current) =>
      current.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              announcements: [createdAnnouncement, ...course.announcements],
            }
          : course,
      ),
    );
    setNewAnnouncement({ title: "", content: "" });
    setState("success");
    setStatus("Announcement published.");
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4 rounded-[8px] border border-[color:var(--line)] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Create community</h1>
            <p className="text-sm text-[color:var(--muted)]">
              Set the public community basics first. Lessons and announcements
              can be added after the community exists.
            </p>
          </div>

          <div className="space-y-3 rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <h2 className="font-semibold">Community details</h2>
            <input
              value={newCourse.title}
              onChange={(event) =>
                setNewCourse((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Community name"
              className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
            />
            <textarea
              value={newCourse.description}
              onChange={(event) =>
                setNewCourse((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Short description"
              rows={4}
              className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
            />
            <input
              value={newCourse.type}
              onChange={(event) =>
                setNewCourse((current) => ({
                  ...current,
                  type: event.target.value,
                }))
              }
              placeholder="Category"
              className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={createCourse}
              className="w-full rounded-[8px] bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white"
            >
              Create community
            </button>
          </div>

          <div className="space-y-2">
            {courses.map((course) => (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelectedCourseId(course.id)}
                className={`w-full rounded-[8px] border px-4 py-3 text-left transition ${
                  course.id === selectedCourseId
                    ? "border-[color:var(--foreground)] bg-[color:var(--surface-soft)]"
                    : "border-[color:var(--line)] bg-white"
                }`}
              >
                <p className="font-semibold">{course.title}</p>
                <p className="text-sm text-[color:var(--muted)]">
                  {course.lessons.length} lessons · {course.announcements.length} announcements
                </p>
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {status ? (
            <div
              className={`border px-4 py-3 text-sm ${
                state === "error"
                  ? "rounded-[8px] border-red-200 bg-red-50 text-red-700"
                  : "rounded-[8px] border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--muted)]"
              }`}
            >
              {status}
            </div>
          ) : null}

          {selectedCourse ? (
            <>
              <section className="rounded-[8px] border border-[color:var(--line)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <input
                      value={selectedCourse.title}
                      onChange={(event) =>
                        setCourses((current) =>
                          current.map((course) =>
                            course.id === selectedCourse.id
                              ? { ...course, title: event.target.value }
                              : course,
                          ),
                        )
                      }
                      className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-xl font-bold outline-none"
                    />
                    <textarea
                      value={selectedCourse.description}
                      onChange={(event) =>
                        setCourses((current) =>
                          current.map((course) =>
                            course.id === selectedCourse.id
                              ? { ...course, description: event.target.value }
                              : course,
                          ),
                        )
                      }
                      rows={4}
                      className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateCourse(selectedCourse.id, {
                        title: selectedCourse.title,
                        description: selectedCourse.description,
                        type: selectedCourse.type,
                        status: selectedCourse.status,
                      })
                    }
                    className="rounded-[8px] border border-[color:var(--line)] px-4 py-2 text-sm font-semibold"
                  >
                    Save course
                  </button>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[8px] border border-[color:var(--line)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <h2 className="text-lg font-semibold">Lessons</h2>
                  <div className="mt-4 space-y-4">
                    {selectedCourse.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="space-y-2 rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                      >
                        <input
                          value={lesson.title}
                          onChange={(event) =>
                            setCourses((current) =>
                              current.map((course) =>
                                course.id === selectedCourse.id
                                  ? {
                                      ...course,
                                      lessons: course.lessons.map((item) =>
                                        item.id === lesson.id
                                          ? {
                                              ...item,
                                              title: event.target.value,
                                            }
                                          : item,
                                      ),
                                    }
                                  : course,
                              ),
                            )
                          }
                          className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
                        />
                        <textarea
                          value={lesson.content}
                          onChange={(event) =>
                            setCourses((current) =>
                              current.map((course) =>
                                course.id === selectedCourse.id
                                  ? {
                                      ...course,
                                      lessons: course.lessons.map((item) =>
                                        item.id === lesson.id
                                          ? {
                                              ...item,
                                              content: event.target.value,
                                            }
                                          : item,
                                      ),
                                    }
                                  : course,
                              ),
                            )
                          }
                          rows={3}
                          className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
                        />
                        <div className="flex gap-2">
                          <input
                            value={lesson.contentType}
                            onChange={(event) =>
                              setCourses((current) =>
                                current.map((course) =>
                                  course.id === selectedCourse.id
                                    ? {
                                        ...course,
                                        lessons: course.lessons.map((item) =>
                                          item.id === lesson.id
                                            ? {
                                                ...item,
                                                contentType: event.target.value,
                                              }
                                            : item,
                                        ),
                                      }
                                    : course,
                                ),
                              )
                            }
                            className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => saveLesson(selectedCourse.id, lesson)}
                            className="rounded-[8px] border border-[color:var(--line)] px-4 py-2 text-sm font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="space-y-2 rounded-[8px] border border-dashed border-[color:var(--line)] p-4">
                      <p className="font-semibold">Add lesson</p>
                      <input
                        value={newLesson.title}
                        onChange={(event) =>
                          setNewLesson((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        placeholder="Lesson title"
                        className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                      />
                      <textarea
                        value={newLesson.content}
                        onChange={(event) =>
                          setNewLesson((current) => ({
                            ...current,
                            content: event.target.value,
                          }))
                        }
                        placeholder="Lesson content"
                        rows={3}
                        className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                      />
                      <input
                        value={newLesson.contentType}
                        onChange={(event) =>
                          setNewLesson((current) => ({
                            ...current,
                            contentType: event.target.value,
                          }))
                        }
                        placeholder="Content type"
                        className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={createLesson}
                        className="rounded-[8px] bg-black px-4 py-2 text-sm font-semibold text-white"
                      >
                        Add lesson
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[8px] border border-[color:var(--line)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <h2 className="text-lg font-semibold">Announcements</h2>
                  <div className="mt-4 space-y-3">
                    {selectedCourse.announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                      >
                        <p className="font-semibold">{announcement.title}</p>
                        <p className="mt-2 text-sm text-[color:var(--muted)]">
                          {announcement.content}
                        </p>
                      </div>
                    ))}

                    <div className="space-y-2 rounded-[8px] border border-dashed border-[color:var(--line)] p-4">
                      <p className="font-semibold">Publish announcement</p>
                      <input
                        value={newAnnouncement.title}
                        onChange={(event) =>
                          setNewAnnouncement((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        placeholder="Announcement title"
                        className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                      />
                      <textarea
                        value={newAnnouncement.content}
                        onChange={(event) =>
                          setNewAnnouncement((current) => ({
                            ...current,
                            content: event.target.value,
                          }))
                        }
                        placeholder="Announcement content"
                        rows={4}
                        className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={createAnnouncement}
                        className="rounded-[8px] bg-black px-4 py-2 text-sm font-semibold text-white"
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-[8px] border border-[color:var(--line)] bg-white p-6 text-sm text-[color:var(--muted)]">
              Create your first course to start the teacher flow.
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
