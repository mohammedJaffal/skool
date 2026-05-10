"use client";

import { useState } from "react";

type AnnouncementCommentComposerProps = {
  announcementId: string;
  signedIn: boolean;
};

export function AnnouncementCommentComposer({
  announcementId,
  signedIn,
}: AnnouncementCommentComposerProps) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  async function submitComment() {
    const response = await fetch(
      `/api/announcements/${announcementId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      },
    );

    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setStatus(payload?.error ?? "Could not publish comment.");
      return;
    }

    setContent("");
    setStatus("Comment published. Refresh the page to see the new thread state.");
  }

  if (!signedIn) {
    return (
      <div className="rounded-[18px] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--muted)]">
        Sign in to participate in this course discussion.
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3 rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
      <p className="font-semibold">Add a comment</p>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={4}
        placeholder="Share your update or question."
        className="w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
      />
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={submitComment}
          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
        >
          Publish comment
        </button>
        {status ? (
          <span className="text-sm text-[color:var(--muted)]">{status}</span>
        ) : null}
      </div>
    </div>
  );
}

