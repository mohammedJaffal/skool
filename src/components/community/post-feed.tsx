"use client";

import { useState } from "react";
import type { Post } from "@/lib/mock-data";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  const base =
    size === "sm"
      ? "h-7 w-7 text-xs border border-[color:var(--line)]"
      : "h-9 w-9 text-sm";
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-[color:var(--brand)] font-semibold text-white ${base}`}
    >
      {initials}
    </div>
  );
}

interface PostFeedProps {
  posts: Post[];
  currentUserName: string;
}

export function PostFeed({ posts: initialPosts, currentUserName }: PostFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});

  const initials = currentUserName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase() || "U";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsPosting(true);
    setError("");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, authorName: currentUserName }),
      });
      if (!res.ok) throw new Error();
      const newPost = (await res.json()) as Post;
      setPosts([newPost, ...posts]);
      setContent("");
    } catch {
      setError("Failed to post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const toggleComments = (postId: string) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="space-y-4">
      {/* Compose */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[color:var(--line)] bg-white p-4 shadow-sm"
      >
        <div className="flex gap-3">
          <Avatar initials={initials} />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share something with the group..."
              className="w-full resize-none rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-3 text-sm outline-none transition focus:border-[color:var(--brand)]"
              rows={3}
              maxLength={500}
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-[color:var(--muted)]">
                {content.length}/500
              </span>
              {error && <span className="text-xs text-red-500">{error}</span>}
              <button
                type="submit"
                disabled={!content.trim() || isPosting}
                className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
              >
                {isPosting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Feed */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="rounded-2xl border border-[color:var(--line)] bg-white p-4 shadow-sm"
        >
          <div className="flex gap-3">
            <Avatar initials={post.authorInitials} />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold">{post.authorName}</span>
                <span className="text-xs text-[color:var(--muted)]">
                  {timeAgo(post.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm">{post.content}</p>
              <div className="mt-3 flex gap-4 text-xs text-[color:var(--muted)]">
                <span>👍 {post.likes}</span>
                <button
                  type="button"
                  onClick={() => toggleComments(post.id)}
                  className="transition hover:text-[color:var(--foreground)]"
                >
                  💬 {post.comments.length}{" "}
                  {post.comments.length === 1 ? "comment" : "comments"}
                </button>
              </div>

              {openComments[post.id] && post.comments.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-[color:var(--line)] pt-3">
                  {post.comments.map((c) => (
                    <div key={c.id} className="flex gap-2">
                      <Avatar initials={c.authorInitials} size="sm" />
                      <div className="flex-1 rounded-xl bg-[color:var(--surface-soft)] px-3 py-2">
                        <span className="text-xs font-semibold">
                          {c.authorName}
                        </span>
                        <span className="ml-2 text-xs text-[color:var(--muted)]">
                          {timeAgo(c.createdAt)}
                        </span>
                        <p className="mt-0.5 text-xs">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
