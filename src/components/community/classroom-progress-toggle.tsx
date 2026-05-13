"use client";

import { useState } from "react";

type ClassroomProgressToggleProps = {
  itemId: string;
  signedIn: boolean;
};

export function ClassroomProgressToggle({
  itemId,
  signedIn,
}: ClassroomProgressToggleProps) {
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState("");

  async function toggle() {
    const nextCompleted = !completed;
    const response = await fetch(`/api/classroom-items/${itemId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: nextCompleted }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setStatus(payload?.error ?? "Could not update progress.");
      return;
    }

    setCompleted(nextCompleted);
    setStatus(nextCompleted ? "Marked complete." : "Marked incomplete.");
  }

  if (!signedIn) {
    return null;
  }

  return (
    <div className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">Classroom progress</p>
          <p className="text-sm text-[color:var(--muted)]">
            Track your completion in the database-backed member progress flow.
          </p>
        </div>
        <button
          type="button"
          onClick={toggle}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            completed
              ? "bg-[#ebfff2] text-[#0a7a3f]"
              : "bg-[color:var(--brand)] text-white"
          }`}
        >
          {completed ? "Completed" : "Mark complete"}
        </button>
      </div>
      {status ? (
        <p className="mt-3 text-sm text-[color:var(--muted)]">{status}</p>
      ) : null}
    </div>
  );
}
