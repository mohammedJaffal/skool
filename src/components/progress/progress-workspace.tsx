"use client";

import { useMemo, useState } from "react";

type MemberCommunity = {
  communityId: string;
  title: string;
  totalClassroomItems: number;
  completed: number;
  percentage: number;
  classroomItems: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  evaluation?: {
    rating: number;
    feedback: string | null;
  } | null;
};

type OwnerCommunity = {
  communityId: string;
  title: string;
  members: {
    memberId: string;
    memberName: string;
    completed: number;
    totalClassroomItems: number;
    percentage: number;
  }[];
};

type ProgressWorkspaceProps = {
  memberCommunities: MemberCommunity[];
  ownerCommunities: OwnerCommunity[];
};

export function ProgressWorkspace({
  memberCommunities: initialMemberCommunities,
  ownerCommunities,
}: ProgressWorkspaceProps) {
  const [memberCommunities, setMemberCommunities] = useState(initialMemberCommunities);
  const [selectedOwnerCommunityId, setSelectedOwnerCommunityId] = useState(
    ownerCommunities[0]?.communityId ?? "",
  );
  const [selectedMemberId, setSelectedMemberId] = useState(
    ownerCommunities[0]?.members[0]?.memberId ?? "",
  );
  const [draftFeedback, setDraftFeedback] = useState<Record<string, string>>(
    Object.fromEntries(
      initialMemberCommunities.map((communityProgress) => [
        communityProgress.communityId,
        communityProgress.evaluation?.feedback ?? "",
      ]),
    ),
  );
  const [status, setStatus] = useState("");

  const selectedOwnerCommunity =
    ownerCommunities.find((communityProgress) => communityProgress.communityId === selectedOwnerCommunityId) ??
    ownerCommunities[0] ??
    null;

  const selectedMember = useMemo(() => {
    if (!selectedOwnerCommunity) {
      return null;
    }

    return (
      selectedOwnerCommunity.members.find(
        (member) => member.memberId === selectedMemberId,
      ) ??
      selectedOwnerCommunity.members[0] ??
      null
    );
  }, [selectedMemberId, selectedOwnerCommunity]);

  async function toggleProgress(
    communityId: string,
    classroomItemId: string,
    completed: boolean,
  ) {
    const response = await fetch(`/api/classroom-items/${classroomItemId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setStatus(payload?.error ?? "Could not update classroom progress.");
      return;
    }

    setMemberCommunities((current) =>
      current.map((communityProgress) => {
        if (communityProgress.communityId !== communityId) {
          return communityProgress;
        }

        const classroomItems = communityProgress.classroomItems.map((classroomItem) =>
          classroomItem.id === classroomItemId ? { ...classroomItem, completed } : classroomItem,
        );
        const completedCount = classroomItems.filter((classroomItem) => classroomItem.completed).length;

        return {
          ...communityProgress,
          classroomItems,
          completed: completedCount,
          percentage:
            communityProgress.totalClassroomItems > 0
              ? Math.round((completedCount / communityProgress.totalClassroomItems) * 100)
              : 0,
        };
      }),
    );
    setStatus("Progress updated.");
  }

  async function submitEvaluation(communityId: string, rating: number) {
    const feedback = draftFeedback[communityId] ?? "";
    const response = await fetch(`/api/communities/${communityId}/evaluations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, feedback }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;
      setStatus(payload?.error ?? "Could not submit evaluation.");
      return;
    }

    setMemberCommunities((current) =>
      current.map((communityProgress) =>
        communityProgress.communityId === communityId
          ? { ...communityProgress, evaluation: { rating, feedback } }
          : communityProgress,
      ),
    );
    setStatus("Evaluation saved.");
  }

  async function submitFeedback(communityId: string) {
    const communityProgress = memberCommunities.find((item) => item.communityId === communityId);

    await submitEvaluation(communityId, communityProgress?.evaluation?.rating ?? 20);
  }

  return (
    <section className="space-y-6">
      {status ? (
        <div className="rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--muted)]">
          {status}
        </div>
      ) : null}

      {memberCommunities.length > 0 ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Member view
            </p>
            <h1 className="mt-1 text-2xl font-bold">Your progress</h1>
          </div>
          {memberCommunities.map((communityProgress) => (
            <article
              key={communityProgress.communityId}
              className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{communityProgress.title}</h2>
                  <p className="text-sm text-[color:var(--muted)]">
                    {communityProgress.completed}/{communityProgress.totalClassroomItems} classroom items completed
                  </p>
                </div>
                <span className="rounded-full bg-[color:var(--chip)] px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]">
                  {communityProgress.percentage}%
                </span>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-2">
                  {communityProgress.classroomItems.map((classroomItem) => (
                    <div
                      key={classroomItem.id}
                      className="flex items-center justify-between rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                    >
                      <p className="font-medium">{classroomItem.title}</p>
                      <button
                        type="button"
                        onClick={() =>
                          toggleProgress(
                            communityProgress.communityId,
                            classroomItem.id,
                            !classroomItem.completed,
                          )
                        }
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${
                          classroomItem.completed
                            ? "bg-[#ebfff2] text-[#0a7a3f]"
                            : "border border-[color:var(--line)] bg-white"
                        }`}
                      >
                        {classroomItem.completed ? "Completed" : "Mark complete"}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
                  <p className="font-semibold">Community evaluation</p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    Give a classroom score between 0 and 20.
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={communityProgress.evaluation?.rating ?? 20}
                    onChange={(event) =>
                      submitEvaluation(communityProgress.communityId, Number(event.target.value))
                    }
                    className="mt-4 w-full"
                  />
                  <div className="mt-2 flex items-center justify-between text-sm font-semibold">
                    <span>0</span>
                    <span>{communityProgress.evaluation?.rating ?? 20}/20</span>
                    <span>20</span>
                  </div>
                  <textarea
                    rows={4}
                    value={draftFeedback[communityProgress.communityId] ?? ""}
                    placeholder="Optional feedback"
                    className="mt-3 w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-sm outline-none"
                    onChange={(event) =>
                      setDraftFeedback((current) => ({
                        ...current,
                        [communityProgress.communityId]: event.target.value,
                      }))
                    }
                    onBlur={() => submitFeedback(communityProgress.communityId)}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {ownerCommunities.length > 0 ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Owner view
            </p>
            <h2 className="mt-1 text-2xl font-bold">Consult member progress</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <article className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
              <label className="block space-y-2">
                <span className="text-sm font-semibold">Select a community</span>
                <select
                  value={selectedOwnerCommunity?.communityId ?? ""}
                  onChange={(event) => {
                    const nextCourseId = event.target.value;
                    const nextCourse = ownerCommunities.find(
                      (communityProgress) => communityProgress.communityId === nextCourseId,
                    );
                    setSelectedOwnerCommunityId(nextCourseId);
                    setSelectedMemberId(nextCourse?.members[0]?.memberId ?? "");
                  }}
                  className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
                >
                  {ownerCommunities.map((communityProgress) => (
                    <option key={communityProgress.communityId} value={communityProgress.communityId}>
                      {communityProgress.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-4 space-y-3">
                {selectedOwnerCommunity?.members.length ? (
                  selectedOwnerCommunity.members.map((member) => (
                    <button
                      key={member.memberId}
                      type="button"
                      onClick={() => setSelectedMemberId(member.memberId)}
                      className={`w-full rounded-[18px] border px-4 py-3 text-left ${
                        member.memberId === selectedMember?.memberId
                          ? "border-[color:var(--foreground)] bg-[color:var(--surface-soft)]"
                          : "border-[color:var(--line)] bg-white"
                      }`}
                    >
                      <p className="font-medium">{member.memberName}</p>
                      <p className="text-sm text-[color:var(--muted)]">
                        {member.completed}/{member.totalClassroomItems} completed
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-dashed border-[color:var(--line)] p-4 text-sm text-[color:var(--muted)]">
                    No active members in this community yet.
                  </div>
                )}
              </div>
            </article>

            <article className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
              {selectedMember ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-[color:var(--muted)]">
                        Selected member
                      </p>
                      <h3 className="text-xl font-semibold">
                        {selectedMember.memberName}
                      </h3>
                    </div>
                    <span className="rounded-full bg-[color:var(--chip)] px-4 py-2 text-sm font-semibold">
                      {selectedMember.percentage}%
                    </span>
                  </div>

                  <div className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
                    <p className="text-sm text-[color:var(--muted)]">
                      Progress details
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {selectedMember.completed}/{selectedMember.totalClassroomItems}
                    </p>
                    <p className="text-sm text-[color:var(--muted)]">
                      classroom items completed in this community
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-[18px] border border-dashed border-[color:var(--line)] p-4 text-sm text-[color:var(--muted)]">
                  Select a member to inspect progress.
                </div>
              )}
            </article>
          </div>
        </section>
      ) : null}
    </section>
  );
}
