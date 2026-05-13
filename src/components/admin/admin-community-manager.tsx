"use client";

import { useEffect, useState } from "react";

type CommunityItem = {
  id: string;
  title: string;
  description: string;
};

export function AdminCommunityManager() {
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadCommunities() {
      const response = await fetch("/api/admin/communities");
      const payload = (await response.json().catch(() => null)) as
        | { communities?: CommunityItem[]; error?: string }
        | null;

      if (ignore) {
        return;
      }

      if (!response.ok) {
        setStatus(payload?.error ?? "Could not load admin communities.");
        setIsLoading(false);
        return;
      }

      setCommunities(payload?.communities ?? []);
      setIsLoading(false);
    }

    void loadCommunities();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const response = await fetch("/api/admin/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          error?: string;
          community?: CommunityItem;
        }
      | null;
    const community = payload?.community;

    if (!response.ok || !community) {
      setStatus(payload?.error ?? "Community creation failed.");
      setIsSubmitting(false);
      return;
    }

    setCommunities((current) => [community, ...current]);
    setTitle("");
    setDescription("");
    setStatus(`Created "${community.title}".`);
    setIsSubmitting(false);
  }

  async function handleDelete(communityId: string) {
    setDeletingId(communityId);
    setStatus(null);

    const response = await fetch("/api/admin/communities", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ communityId }),
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          error?: string;
        }
      | null;

    if (!response.ok) {
      setStatus(payload?.error ?? "Community deletion failed.");
      setDeletingId(null);
      return;
    }

    setCommunities((current) =>
      current.filter((community) => community.id !== communityId),
    );
    setStatus("Community removed from the admin list.");
    setDeletingId(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Create Community
          </p>
          <h2 className="text-xl font-semibold">Admin community flow</h2>
          <p className="text-sm text-[color:var(--muted)]">
            This creates and removes real community drafts through the admin API.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleCreate}>
          <label className="block space-y-2">
            <span className="text-sm font-medium">Community title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Creator Flywheel"
              className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[color:var(--brand)]"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Short description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what the community offers."
              rows={4}
              className="w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[color:var(--brand)]"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create community"}
          </button>
        </form>

        {status ? (
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--muted)]">
            {status}
          </div>
        ) : null}
      </section>

      <section className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5 shadow-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Draft Communities
          </p>
          <h2 className="text-xl font-semibold">Current admin list</h2>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="rounded-2xl border border-[color:var(--line)] bg-white p-4 text-sm text-[color:var(--muted)]">
              Loading community drafts...
            </div>
          ) : null}
          {communities.map((community) => (
            <article
              key={community.id}
              className="rounded-2xl border border-[color:var(--line)] bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-semibold">{community.title}</h3>
                  <p className="text-sm text-[color:var(--muted)]">
                    {community.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(community.id)}
                  disabled={deletingId === community.id}
                  className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)] transition hover:bg-[color:var(--surface-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === community.id ? "Removing..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
