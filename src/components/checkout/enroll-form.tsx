"use client";

import { useState } from "react";
import Link from "next/link";
import type { Course } from "@/lib/mock-data";

type Status = "idle" | "loading" | "success" | "error";

interface EnrollFormProps {
  course: Course;
}

export function EnrollForm({ course }: EnrollFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleEnroll = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { enrollmentId: string };
      setEnrollmentId(data.enrollmentId);
      setStatus("success");
    } catch {
      setErrorMsg("Enrollment failed. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-3xl">🎉</p>
        <h2 className="mt-2 text-lg font-semibold text-green-800">
          You&apos;re enrolled!
        </h2>
        <p className="mt-1 text-sm text-green-700">
          Enrollment ID:{" "}
          <span className="font-mono font-semibold">{enrollmentId}</span>
        </p>
        <Link
          href="/dashboard/courses"
          className="mt-4 inline-block rounded-xl bg-[color:var(--brand)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Start learning →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Order summary */}
      <div className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[color:var(--muted)]">
          Order Summary
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">{course.title}</span>
            <span className="font-semibold">${course.price}</span>
          </div>
          {[
            { label: "Instructor", value: course.instructor },
            { label: "Duration", value: course.duration },
            { label: "Level", value: course.level },
            { label: "Lessons", value: String(course.lessons.length) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-[color:var(--muted)]">
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-[color:var(--line)] pt-2 font-semibold">
            <span>Total</span>
            <span>${course.price}</span>
          </div>
        </div>
      </div>

      {/* Demo payment */}
      <div className="rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-widest text-[color:var(--muted)]">
          Payment
        </h2>
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-600">
          This is a demo checkout — no real payment is processed.
        </p>
        <div className="space-y-3">
          <input
            readOnly
            value="4242 4242 4242 4242"
            className="w-full cursor-not-allowed rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--muted)]"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              readOnly
              value="12/28"
              className="cursor-not-allowed rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--muted)]"
            />
            <input
              readOnly
              value="123"
              className="cursor-not-allowed rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-2 text-sm text-[color:var(--muted)]"
            />
          </div>
        </div>
      </div>

      {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

      <button
        type="button"
        onClick={handleEnroll}
        disabled={status === "loading"}
        className="w-full rounded-xl bg-[color:var(--brand)] py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
      >
        {status === "loading" ? "Enrolling..." : `Enroll — $${course.price}`}
      </button>
    </div>
  );
}
