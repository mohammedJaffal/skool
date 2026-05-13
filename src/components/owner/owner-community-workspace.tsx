"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ClassroomItem = {
  id: string;
  title: string;
  content: string;
  contentType: string;
  position: number;
};

type PostItem = {
  id: string;
  title: string;
  content: string;
  status: string;
};

type CommunityDocumentItem = {
  id: string;
  label: string;
  url: string;
};

type CommunityItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  documents: CommunityDocumentItem[];
  classroomItems: ClassroomItem[];
  posts: PostItem[];
};

type OwnerCommunityWorkspaceProps = {
  communities: CommunityItem[];
};

type IdleState = "idle" | "loading" | "error" | "success";

export function OwnerCommunityWorkspace({
  communities: initialCommunities,
}: OwnerCommunityWorkspaceProps) {
  const [communities, setCommunities] = useState(initialCommunities);
  const [selectedCommunityId, setSelectedCommunityId] = useState(
    initialCommunities[0]?.id ?? "",
  );
  const [status, setStatus] = useState("");
  const [state, setState] = useState<IdleState>("idle");
  const [newCommunity, setNewCommunity] = useState({
    title: "",
    description: "",
    type: "general",
    documents: [{ label: "", url: "" }],
  });
  const [newClassroomItem, setNewClassroomItem] = useState({
    title: "",
    content: "",
    contentType: "video",
  });
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
  });

  const selectedCommunity = useMemo(
    () => communities.find((community) => community.id === selectedCommunityId) ?? null,
    [communities, selectedCommunityId],
  );

  function setSuccess(message: string) {
    setState("success");
    setStatus(message);
  }

  function setError(message: string) {
    setState("error");
    setStatus(message);
  }

  async function createCommunity() {
    setState("loading");
    setStatus("");

    const response = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCommunity),
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          community?: {
            id: string;
            title: string;
            description: string;
            type: string;
            status: string;
            documents?: CommunityDocumentItem[];
          };
          error?: string;
        }
      | null;

    if (!response.ok || !payload?.community) {
      setError(payload?.error ?? "Community creation failed.");
      return;
    }

    const createdCommunity: CommunityItem = {
      id: payload.community.id,
      title: payload.community.title,
      description: payload.community.description,
      type: payload.community.type,
      status: payload.community.status,
      documents: payload.community.documents ?? [],
      classroomItems: [],
      posts: [],
    };

    setCommunities((current) => [createdCommunity, ...current]);
    setSelectedCommunityId(createdCommunity.id);
    setNewCommunity({
      title: "",
      description: "",
      type: "general",
      documents: [{ label: "", url: "" }],
    });
    setSuccess(`Community "${createdCommunity.title}" created.`);
  }

  async function updateCommunity(
    communityId: string,
    values: Partial<CommunityItem>,
  ) {
    setState("loading");
    setStatus("");

    const response = await fetch(`/api/communities/${communityId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json().catch(() => null)) as
      | { community?: Partial<CommunityItem>; error?: string }
      | null;

    if (!response.ok || !payload?.community) {
      setError(payload?.error ?? "Community update failed.");
      return;
    }

    setCommunities((current) =>
      current.map((community) =>
        community.id === communityId
          ? { ...community, ...values, ...payload.community }
          : community,
      ),
    );
    setSuccess("Community updated.");
  }

  async function deleteCommunity(communityId: string) {
    const community = communities.find((item) => item.id === communityId);

    if (!community || !window.confirm(`Delete "${community.title}"?`)) {
      return;
    }

    setState("loading");
    setStatus("");

    const response = await fetch(`/api/communities/${communityId}`, {
      method: "DELETE",
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setError(payload?.error ?? "Community deletion failed.");
      return;
    }

    const remaining = communities.filter((item) => item.id !== communityId);
    setCommunities(remaining);
    setSelectedCommunityId(remaining[0]?.id ?? "");
    setSuccess("Community deleted.");
  }

  async function createClassroomItem() {
    if (!selectedCommunity) {
      return;
    }

    setState("loading");
    setStatus("");

    const response = await fetch(
      `/api/communities/${selectedCommunity.id}/classroom-items`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClassroomItem),
      },
    );
    const payload = (await response.json().catch(() => null)) as
      | { classroomItem?: ClassroomItem; error?: string }
      | null;

    if (!response.ok || !payload?.classroomItem) {
      setError(payload?.error ?? "Classroom item creation failed.");
      return;
    }

    const createdClassroomItem = payload.classroomItem;

    setCommunities((current) =>
      current.map((community) =>
        community.id === selectedCommunity.id
          ? {
              ...community,
              classroomItems: [...community.classroomItems, createdClassroomItem].sort(
                (a, b) => a.position - b.position,
              ),
            }
          : community,
      ),
    );
    setNewClassroomItem({ title: "", content: "", contentType: "video" });
    setSuccess("Classroom item added.");
  }

  async function saveClassroomItem(
    communityId: string,
    classroomItem: ClassroomItem,
  ) {
    setState("loading");
    setStatus("");

    const response = await fetch(`/api/classroom-items/${classroomItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(classroomItem),
    });
    const payload = (await response.json().catch(() => null)) as
      | { classroomItem?: ClassroomItem; error?: string }
      | null;

    if (!response.ok || !payload?.classroomItem) {
      setError(payload?.error ?? "Classroom item update failed.");
      return;
    }

    setCommunities((current) =>
      current.map((community) =>
        community.id === communityId
          ? {
              ...community,
              classroomItems: community.classroomItems.map((item) =>
                item.id === classroomItem.id ? { ...item, ...payload.classroomItem } : item,
              ),
            }
          : community,
      ),
    );
    setSuccess("Classroom item updated.");
  }

  async function createPost() {
    if (!selectedCommunity) {
      return;
    }

    setState("loading");
    setStatus("");

    const response = await fetch(`/api/communities/${selectedCommunity.id}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    const payload = (await response.json().catch(() => null)) as
      | { post?: PostItem; error?: string }
      | null;

    if (!response.ok || !payload?.post) {
      setError(payload?.error ?? "Post creation failed.");
      return;
    }

    const createdPost = payload.post;

    setCommunities((current) =>
      current.map((community) =>
        community.id === selectedCommunity.id
          ? {
              ...community,
              posts: [createdPost, ...community.posts],
            }
          : community,
      ),
    );
    setNewPost({ title: "", content: "" });
    setSuccess("Post published.");
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4 rounded-[8px] border border-[color:var(--line)] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Create community</h1>
            <p className="text-sm text-[color:var(--muted)]">
              Set the community details first, then add classroom resources,
              videos, and owner posts.
            </p>
          </div>

          <div className="space-y-3 rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
            <h2 className="font-semibold">Community details</h2>
            <input
              value={newCommunity.title}
              onChange={(event) =>
                setNewCommunity((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Community title"
              className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
            />
            <textarea
              value={newCommunity.description}
              onChange={(event) =>
                setNewCommunity((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Community description"
              rows={4}
              className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
            />
            <input
              value={newCommunity.type}
              onChange={(event) =>
                setNewCommunity((current) => ({
                  ...current,
                  type: event.target.value,
                }))
              }
              placeholder="Community category"
              className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
            />
            <div className="space-y-2 rounded-[8px] border border-[color:var(--line)] bg-white p-3">
              <p className="text-sm font-medium">Community documents</p>
              {newCommunity.documents.map((document, index) => (
                <div key={`new-doc-${index}`} className="grid gap-2 md:grid-cols-2">
                  <input
                    value={document.label}
                    onChange={(event) =>
                      setNewCommunity((current) => ({
                        ...current,
                        documents: current.documents.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, label: event.target.value }
                            : item,
                        ),
                      }))
                    }
                    placeholder="Document label"
                    className="rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                  />
                  <input
                    value={document.url}
                    onChange={(event) =>
                      setNewCommunity((current) => ({
                        ...current,
                        documents: current.documents.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, url: event.target.value }
                            : item,
                        ),
                      }))
                    }
                    placeholder="https://document-url"
                    className="rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setNewCommunity((current) => ({
                    ...current,
                    documents: [...current.documents, { label: "", url: "" }],
                  }))
                }
                className="rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm font-semibold"
              >
                Add document
              </button>
            </div>
            <button
              type="button"
              onClick={createCommunity}
              className="w-full rounded-[8px] bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white"
            >
              Create community
            </button>
          </div>

          <div className="space-y-2">
            {communities.map((community) => (
              <button
                key={community.id}
                type="button"
                onClick={() => setSelectedCommunityId(community.id)}
                className={`w-full rounded-[8px] border px-4 py-3 text-left transition ${
                  community.id === selectedCommunityId
                    ? "border-[color:var(--foreground)] bg-[color:var(--surface-soft)]"
                    : "border-[color:var(--line)] bg-white"
                }`}
              >
                <p className="font-semibold">{community.title}</p>
                <p className="text-sm text-[color:var(--muted)]">
                  {community.classroomItems.length} classroom items · {community.posts.length} posts
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

          {selectedCommunity ? (
            <>
              <section className="rounded-[8px] border border-[color:var(--line)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <input
                      value={selectedCommunity.title}
                      onChange={(event) =>
                        setCommunities((current) =>
                          current.map((community) =>
                            community.id === selectedCommunity.id
                              ? { ...community, title: event.target.value }
                              : community,
                          ),
                        )
                      }
                      className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-xl font-bold outline-none"
                    />
                    <textarea
                      value={selectedCommunity.description}
                      onChange={(event) =>
                        setCommunities((current) =>
                          current.map((community) =>
                            community.id === selectedCommunity.id
                              ? { ...community, description: event.target.value }
                              : community,
                          ),
                        )
                      }
                      rows={4}
                      className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                    />
                    <div className="space-y-2 rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-3">
                      <p className="text-sm font-semibold">Community documents</p>
                      {selectedCommunity.documents.map((document, index) => (
                        <div
                          key={document.id || `doc-${index}`}
                          className="grid gap-2 md:grid-cols-2"
                        >
                          <input
                            value={document.label}
                            onChange={(event) =>
                              setCommunities((current) =>
                                current.map((community) =>
                                  community.id === selectedCommunity.id
                                    ? {
                                        ...community,
                                        documents: community.documents.map((item, itemIndex) =>
                                          itemIndex === index
                                            ? { ...item, label: event.target.value }
                                            : item,
                                        ),
                                      }
                                    : community,
                                ),
                              )
                            }
                            className="rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
                          />
                          <input
                            value={document.url}
                            onChange={(event) =>
                              setCommunities((current) =>
                                current.map((community) =>
                                  community.id === selectedCommunity.id
                                    ? {
                                        ...community,
                                        documents: community.documents.map((item, itemIndex) =>
                                          itemIndex === index
                                            ? { ...item, url: event.target.value }
                                            : item,
                                        ),
                                      }
                                    : community,
                                ),
                              )
                            }
                            className="rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setCommunities((current) =>
                            current.map((community) =>
                              community.id === selectedCommunity.id
                                ? {
                                    ...community,
                                    documents: [
                                      ...community.documents,
                                      {
                                        id: `draft-${Date.now()}`,
                                        label: "",
                                        url: "",
                                      },
                                    ],
                                  }
                                : community,
                            ),
                          )
                        }
                        className="rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm font-semibold"
                      >
                        Add document
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/communities/${selectedCommunity.id}/members`}
                      className="rounded-[8px] border border-[color:var(--line)] px-4 py-2 text-sm font-semibold"
                    >
                      Manage members
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        updateCommunity(selectedCommunity.id, {
                          title: selectedCommunity.title,
                          description: selectedCommunity.description,
                          type: selectedCommunity.type,
                          status: selectedCommunity.status,
                          documents: selectedCommunity.documents,
                        })
                      }
                      className="rounded-[8px] border border-[color:var(--line)] px-4 py-2 text-sm font-semibold"
                    >
                      Save community
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCommunity(selectedCommunity.id)}
                      className="rounded-[8px] border border-red-200 px-4 py-2 text-sm font-semibold text-red-700"
                    >
                      Delete community
                    </button>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[8px] border border-[color:var(--line)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <h2 className="text-lg font-semibold">Classroom</h2>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    Use the content type field to mark a classroom item as video,
                    lesson text, or workshop material.
                  </p>
                  <div className="mt-4 space-y-4">
                    {selectedCommunity.classroomItems.map((classroomItem) => (
                      <div
                        key={classroomItem.id}
                        className="space-y-2 rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                      >
                        <input
                          value={classroomItem.title}
                          onChange={(event) =>
                            setCommunities((current) =>
                              current.map((community) =>
                                community.id === selectedCommunity.id
                                  ? {
                                      ...community,
                                      classroomItems: community.classroomItems.map((item) =>
                                        item.id === classroomItem.id
                                          ? { ...item, title: event.target.value }
                                          : item,
                                      ),
                                    }
                                  : community,
                              ),
                            )
                          }
                          className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
                        />
                        <textarea
                          value={classroomItem.content}
                          onChange={(event) =>
                            setCommunities((current) =>
                              current.map((community) =>
                                community.id === selectedCommunity.id
                                  ? {
                                      ...community,
                                      classroomItems: community.classroomItems.map((item) =>
                                        item.id === classroomItem.id
                                          ? { ...item, content: event.target.value }
                                          : item,
                                      ),
                                    }
                                  : community,
                              ),
                            )
                          }
                          rows={3}
                          className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
                        />
                        <div className="flex gap-2">
                          <select
                            value={classroomItem.contentType}
                            onChange={(event) =>
                              setCommunities((current) =>
                                current.map((community) =>
                                  community.id === selectedCommunity.id
                                    ? {
                                        ...community,
                                        classroomItems: community.classroomItems.map((item) =>
                                          item.id === classroomItem.id
                                            ? {
                                                ...item,
                                                contentType: event.target.value,
                                              }
                                            : item,
                                        ),
                                      }
                                    : community,
                                ),
                              )
                            }
                            className="w-full rounded-[8px] border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
                          >
                            <option value="video">Video</option>
                            <option value="lesson">Lesson</option>
                            <option value="workshop">Workshop</option>
                          </select>
                          <button
                            type="button"
                            onClick={() =>
                              saveClassroomItem(selectedCommunity.id, classroomItem)
                            }
                            className="rounded-[8px] border border-[color:var(--line)] px-4 py-2 text-sm font-semibold"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="space-y-2 rounded-[8px] border border-dashed border-[color:var(--line)] p-4">
                      <p className="font-semibold">Add classroom item</p>
                      <input
                        value={newClassroomItem.title}
                        onChange={(event) =>
                          setNewClassroomItem((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        placeholder="Classroom item title"
                        className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                      />
                      <textarea
                        value={newClassroomItem.content}
                        onChange={(event) =>
                          setNewClassroomItem((current) => ({
                            ...current,
                            content: event.target.value,
                          }))
                        }
                        placeholder="Classroom item content or video summary"
                        rows={3}
                        className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                      />
                      <select
                        value={newClassroomItem.contentType}
                        onChange={(event) =>
                          setNewClassroomItem((current) => ({
                            ...current,
                            contentType: event.target.value,
                          }))
                        }
                        className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                      >
                        <option value="video">Video</option>
                        <option value="lesson">Lesson</option>
                        <option value="workshop">Workshop</option>
                      </select>
                      <button
                        type="button"
                        onClick={createClassroomItem}
                        className="rounded-[8px] bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Add classroom item
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-[8px] border border-[color:var(--line)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <h2 className="text-lg font-semibold">Community posts</h2>
                  <div className="mt-4 space-y-4">
                    <div className="space-y-2 rounded-[8px] border border-dashed border-[color:var(--line)] p-4">
                      <p className="font-semibold">Publish owner post</p>
                      <input
                        value={newPost.title}
                        onChange={(event) =>
                          setNewPost((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        placeholder="Post title"
                        className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                      />
                      <textarea
                        value={newPost.content}
                        onChange={(event) =>
                          setNewPost((current) => ({
                            ...current,
                            content: event.target.value,
                          }))
                        }
                        placeholder="Post details"
                        rows={4}
                        className="w-full rounded-[8px] border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={createPost}
                        className="rounded-[8px] bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Publish post
                      </button>
                    </div>

                    {selectedCommunity.posts.map((post) => (
                      <div
                        key={post.id}
                        className="rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                      >
                        <p className="font-semibold">{post.title}</p>
                        <p className="mt-2 text-sm text-[color:var(--muted)]">
                          {post.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="rounded-[8px] border border-dashed border-[color:var(--line)] bg-white p-5 text-sm text-[color:var(--muted)]">
              Create or select a community to start managing classroom
              resources, video content, posts, members, and progress.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
