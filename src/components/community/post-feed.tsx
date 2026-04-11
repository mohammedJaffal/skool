"use client";

import { useState } from "react";
import { Post } from "@/lib/mock-data";

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
      {initials}
    </span>
  );
}

function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar initials={post.authorInitials} />
        <div>
          <p className="text-sm font-semibold">{post.authorName}</p>
          <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>

      <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
        <span className="text-xs text-gray-400">👍 {post.likes}</span>
        <button
          onClick={() => setShowComments((v) => !v)}
          className="text-xs text-gray-500 hover:text-gray-800 transition"
        >
          💬 {post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}
        </button>
      </div>

      {showComments && post.comments.length > 0 && (
        <div className="space-y-3 border-t border-gray-100 pt-3">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar initials={comment.authorInitials} />
              <div className="flex-1 rounded-xl bg-gray-50 px-4 py-2">
                <p className="text-xs font-semibold text-gray-700">{comment.authorName}</p>
                <p className="text-xs text-gray-600 mt-0.5">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

type PostFeedProps = {
  initialPosts: Post[];
  userName: string;
};

export function PostFeed({ initialPosts, userName }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, authorName: userName }),
      });

      if (!res.ok) throw new Error("Failed to post");
      const newPost = await res.json();
      setPosts((prev) => [newPost, ...prev]);
      setContent("");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const initials = userName
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  return (
    <div className="space-y-5">
      {/* Compose */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
            {initials}
          </span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something with the community…"
            rows={3}
            className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="rounded-xl bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-gray-800 disabled:opacity-40 transition"
          >
            {submitting ? "Posting…" : "Post"}
          </button>
        </div>
      </form>

      {/* Feed */}
      {posts.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-12">No posts yet. Be the first!</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
