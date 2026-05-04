"use client";

import { useState } from "react";

interface AdminCourse {
  id: string;
  title: string;
  description: string;
}

const INITIAL: AdminCourse[] = [
  {
    id: "draft-1",
    title: "Community Setup",
    description: "Onboarding and community guidelines for new members.",
  },
  {
    id: "draft-2",
    title: "Course Outline",
    description: "Classroom structure and curriculum planning template.",
  },
];

export function AdminCourseManager() {
  const [courses, setCourses] = useState<AdminCourse[]>(INITIAL);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setStatus("");
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error();
      const newCourse = (await res.json()) as AdminCourse;
      setCourses((prev) => [...prev, newCourse]);
      setTitle("");
      setDescription("");
      setStatus("Course created successfully.");
    } catch {
      setStatus("Failed to create course.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/courses?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setStatus("Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Create form */}
      <div className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[color:var(--muted)]">
          New Course
        </h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course title"
            required
            className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm outline-none transition focus:border-[color:var(--brand)]"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Course description"
            required
            rows={3}
            className="w-full resize-none rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm outline-none transition focus:border-[color:var(--brand)]"
          />
          {status && (
            <p
              className={`text-xs ${status.includes("Failed") ? "text-red-500" : "text-green-600"}`}
            >
              {status}
            </p>
          )}
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
          >
            {isCreating ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>

      {/* Drafts */}
      <div className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[color:var(--muted)]">
          Drafts ({courses.length})
        </h2>
        <div className="space-y-3">
          {courses.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-[color:var(--line)] p-3"
            >
              <div>
                <p className="text-sm font-medium">{c.title}</p>
                <p className="mt-0.5 text-xs text-[color:var(--muted)]">
                  {c.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                disabled={deletingId === c.id}
                className="shrink-0 rounded-lg border border-red-200 px-2 py-1 text-xs text-red-500 transition hover:bg-red-50 disabled:opacity-40"
              >
                {deletingId === c.id ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="text-sm text-[color:var(--muted)]">No draft courses.</p>
          )}
        </div>
      </div>
    </div>
  );
}
