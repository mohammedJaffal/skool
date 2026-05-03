"use client";

import { useState } from "react";

type Course = {
  id: string;
  title: string;
  instructor: string;
  price: number;
  duration: string;
  level: string;
  lessonCount: number;
};

type EnrollFormProps = {
  course: Course;
};

type EnrollResult = {
  success: boolean;
  enrollmentId: string;
  enrolledAt: string;
};

export function EnrollForm({ course }: EnrollFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<EnrollResult | null>(null);

  async function handleEnroll() {
    setStatus("loading");
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && result) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center space-y-3">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-bold text-green-800">You&apos;re enrolled!</h2>
        <p className="text-sm text-green-700">
          Welcome to <span className="font-semibold">{course.title}</span>.
        </p>
        <p className="text-xs text-green-600">
          Enrollment ID: {result.enrollmentId}
        </p>
        <a
          href={`/dashboard/courses/${course.id}`}
          className="inline-block mt-4 rounded-xl bg-green-700 text-white px-6 py-2.5 text-sm font-semibold hover:bg-green-800 transition"
        >
          Start learning →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Order summary */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="font-semibold text-gray-800">Order Summary</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Course</span>
            <span className="font-medium text-gray-900">{course.title}</span>
          </div>
          <div className="flex justify-between">
            <span>Instructor</span>
            <span>{course.instructor}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration</span>
            <span>{course.duration}</span>
          </div>
          <div className="flex justify-between">
            <span>Lessons</span>
            <span>{course.lessonCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Level</span>
            <span>{course.level}</span>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold">
          <span>Total</span>
          <span>${course.price}.00</span>
        </div>
      </section>

      {/* Fake card form */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="font-semibold text-gray-800">Payment (Demo)</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Card number</label>
            <input
              type="text"
              defaultValue="4242 4242 4242 4242"
              readOnly
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Expiry</label>
              <input
                type="text"
                defaultValue="12/28"
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">CVC</label>
              <input
                type="text"
                defaultValue="***"
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          This is a demo checkout — no real payment is processed.
        </p>
      </section>

      {status === "error" && (
        <p className="text-sm text-red-500 text-center">Something went wrong. Please try again.</p>
      )}

      <button
        onClick={handleEnroll}
        disabled={status === "loading"}
        className="w-full rounded-xl bg-black text-white py-3 text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
      >
        {status === "loading" ? "Processing…" : `Enroll for $${course.price}`}
      </button>
    </div>
  );
}
