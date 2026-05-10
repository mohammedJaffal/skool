"use client";

import { useState } from "react";

type Membership = {
  learnerId: string;
  status: string;
  learner: {
    id: string;
    name: string | null;
    email: string | null;
  };
};

type Invitation = {
  id: string;
  status: string;
  learner: {
    id: string;
    name: string | null;
    email: string | null;
  };
};

type JoinRequest = {
  id: string;
  status: string;
  learner: {
    id: string;
    name: string | null;
    email: string | null;
  };
};

type LearnerOption = {
  id: string;
  name: string | null;
  email: string | null;
};

type CourseMembersManagerProps = {
  courseId: string;
  courseTitle: string;
  memberships: Membership[];
  invitations: Invitation[];
  joinRequests: JoinRequest[];
  learnerOptions: LearnerOption[];
};

export function CourseMembersManager({
  courseId,
  courseTitle,
  memberships: initialMemberships,
  invitations: initialInvitations,
  joinRequests: initialJoinRequests,
  learnerOptions,
}: CourseMembersManagerProps) {
  const [memberships, setMemberships] = useState(initialMemberships);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [joinRequests, setJoinRequests] = useState(initialJoinRequests);
  const [learnerId, setLearnerId] = useState(learnerOptions[0]?.id ?? "");
  const [status, setStatus] = useState("");

  async function sendInvitation() {
    const response = await fetch(`/api/courses/${courseId}/invitations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ learnerId }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { invitation?: Invitation; error?: string }
      | null;

    if (!response.ok || !payload?.invitation) {
      setStatus(payload?.error ?? "Could not send invitation.");
      return;
    }

    const createdInvitation = payload.invitation;
    const learner = learnerOptions.find((option) => option.id === learnerId);
    setInvitations((current) => [
      {
        id: createdInvitation.id,
        status: createdInvitation.status,
        learner: {
          id: learnerId,
          name: learner?.name ?? null,
          email: learner?.email ?? null,
        },
      },
      ...current,
    ]);
    setStatus("Invitation sent.");
  }

  async function reviewRequest(requestId: string, nextStatus: string) {
    const response = await fetch(`/api/join-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { request?: JoinRequest; error?: string }
      | null;

    if (!response.ok || !payload?.request) {
      setStatus(payload?.error ?? "Could not review join request.");
      return;
    }

    const reviewed = joinRequests.find((request) => request.id === requestId);
    setJoinRequests((current) =>
      current.map((request) =>
        request.id === requestId
          ? { ...request, status: nextStatus }
          : request,
      ),
    );

    if (nextStatus === "ACCEPTED" && reviewed) {
      setMemberships((current) => [
        {
          learnerId: reviewed.learner.id,
          status: "ACTIVE",
          learner: reviewed.learner,
        },
        ...current,
      ]);
    }

    setStatus(`Join request ${nextStatus.toLowerCase()}.`);
  }

  async function removeMember(learnerIdToRemove: string) {
    const response = await fetch(
      `/api/courses/${courseId}/members/${learnerIdToRemove}`,
      { method: "DELETE" },
    );
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      setStatus(payload?.error ?? "Could not remove learner.");
      return;
    }

    setMemberships((current) =>
      current.map((membership) =>
        membership.learnerId === learnerIdToRemove
          ? { ...membership, status: "REMOVED" }
          : membership,
      ),
    );
    setStatus("Learner removed from the course.");
  }

  return (
    <section className="space-y-6">
      {status ? (
        <div className="rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--muted)]">
          {status}
        </div>
      ) : null}

      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Course members
        </p>
        <h1 className="mt-1 text-2xl font-bold">{courseTitle}</h1>
      </div>

      <section className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Invite a learner</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <select
            value={learnerId}
            onChange={(event) => setLearnerId(event.target.value)}
            className="w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
          >
            {learnerOptions.map((learner) => (
              <option key={learner.id} value={learner.id}>
                {learner.name ?? learner.email ?? learner.id}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={sendInvitation}
            className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white"
          >
            Send invitation
          </button>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Active members</h2>
          <div className="mt-4 space-y-3">
            {memberships.length > 0 ? (
              memberships.map((membership) => (
                <article
                  key={membership.learnerId}
                  className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                >
                  <p className="font-semibold">
                    {membership.learner.name ??
                      membership.learner.email?.split("@")[0] ??
                      "Learner"}
                  </p>
                  <p className="text-sm text-[color:var(--muted)]">
                    {membership.learner.email}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                      {membership.status}
                    </span>
                    {membership.status === "ACTIVE" ? (
                      <button
                        type="button"
                        onClick={() => removeMember(membership.learnerId)}
                        className="rounded-full border border-[color:var(--line)] px-3 py-2 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-[color:var(--line)] p-4 text-sm text-[color:var(--muted)]">
                No active members yet.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Pending invitations</h2>
          <div className="mt-4 space-y-3">
            {invitations.length > 0 ? (
              invitations.map((invitation) => (
                <article
                  key={invitation.id}
                  className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                >
                  <p className="font-semibold">
                    {invitation.learner.name ??
                      invitation.learner.email?.split("@")[0] ??
                      "Learner"}
                  </p>
                  <p className="text-sm text-[color:var(--muted)]">
                    {invitation.learner.email}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                    {invitation.status}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-[color:var(--line)] p-4 text-sm text-[color:var(--muted)]">
                No invitations sent yet.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Join requests</h2>
          <div className="mt-4 space-y-3">
            {joinRequests.length > 0 ? (
              joinRequests.map((request) => (
                <article
                  key={request.id}
                  className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                >
                  <p className="font-semibold">
                    {request.learner.name ??
                      request.learner.email?.split("@")[0] ??
                      "Learner"}
                  </p>
                  <p className="text-sm text-[color:var(--muted)]">
                    {request.learner.email}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {request.status === "PENDING" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => reviewRequest(request.id, "ACCEPTED")}
                          className="rounded-full bg-[color:var(--brand)] px-3 py-2 text-xs font-semibold text-white"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => reviewRequest(request.id, "REJECTED")}
                          className="rounded-full border border-[color:var(--line)] px-3 py-2 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                        {request.status}
                      </span>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-[color:var(--line)] p-4 text-sm text-[color:var(--muted)]">
                No pending join requests.
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
