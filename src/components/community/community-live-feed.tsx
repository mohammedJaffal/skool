"use client";

import { useMemo, useState } from "react";
import type { CommunityThread } from "@/lib/community-data";

type CommunityLiveFeedProps = {
  initialThreads: CommunityThread[];
  currentUserName?: string;
};

function initialsFromName(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "CD"
  );
}

export function CommunityLiveFeed({
  initialThreads,
  currentUserName,
}: CommunityLiveFeedProps) {
  const [threads, setThreads] = useState(initialThreads);
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");

  const viewerName = currentUserName?.trim() || "Campus Member";
  const viewerInitials = useMemo(() => initialsFromName(viewerName), [viewerName]);

  const submitPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!headline.trim() || !body.trim()) {
      return;
    }

    setThreads((current) => [
      {
        id: `draft-${Date.now()}`,
        authorName: viewerName,
        authorInitials: viewerInitials,
        postedAt: "just now",
        headline: headline.trim(),
        body: body.trim(),
        replies: 0,
        likes: 0,
      },
      ...current,
    ]);
    setHeadline("");
    setBody("");
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={submitPost}
        className="rounded-[8px] border border-[color:var(--line)] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--chip)] text-base font-semibold">
            {viewerInitials}
          </div>
          <div className="min-w-0 flex-1">
            <input
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              placeholder="Write something"
              className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-4 py-4 text-lg font-semibold outline-none placeholder:text-[color:var(--muted)]"
            />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Share the route, blocker, result, or question."
              rows={3}
              className="mt-3 w-full rounded-[8px] border border-[color:var(--line)] bg-white px-4 py-3 text-sm outline-none placeholder:text-[color:var(--muted)]"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-[color:var(--muted)]">
            Signed in as {viewerName}
          </span>
          <button
            type="submit"
            className="rounded-[8px] bg-[color:var(--foreground)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Post
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {threads.map((thread) => (
          <article
            key={thread.id}
            className="rounded-[8px] border border-[color:var(--line)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] text-sm font-medium">
                {thread.authorInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h2 className="text-base font-semibold">{thread.authorName}</h2>
                  <span className="text-sm text-[color:var(--muted)]">
                    {thread.postedAt}
                  </span>
                </div>
                <div className="mt-3 flex gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xl font-semibold leading-7">
                      {thread.headline}
                    </p>
                    <p className="mt-2 text-base leading-7 text-[color:var(--foreground)]">
                      {thread.body}
                    </p>
                  </div>
                  <div
                    className="hidden h-24 w-24 shrink-0 overflow-hidden rounded-[8px] bg-[#1b1f2d] bg-cover bg-center md:block"
                    style={{
                      backgroundImage: `url(https://picsum.photos/seed/${thread.id}/240/240)`,
                    }}
                  />
                </div>
                <div className="mt-4 flex gap-5 text-sm text-[color:var(--muted)]">
                  <span>{thread.likes}</span>
                  <span>{thread.replies} comments</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
