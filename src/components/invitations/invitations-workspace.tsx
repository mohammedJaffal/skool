"use client";

import { useMemo, useState } from "react";

type Invitation = {
  id: string;
  status: string;
  course: { id: string; title: string };
  teacher: { name: string | null; email: string | null };
};

type JoinRequest = {
  id: string;
  courseId: string;
  status: string;
};

type CourseCard = {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
};

type InvitationsWorkspaceProps = {
  invitations: Invitation[];
  joinRequests: JoinRequest[];
  courses: CourseCard[];
  activeCourseIds: string[];
};

export function InvitationsWorkspace({
  invitations: initialInvitations,
  joinRequests: initialRequests,
  courses,
  activeCourseIds,
}: InvitationsWorkspaceProps) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [joinRequests, setJoinRequests] = useState(initialRequests);
  const [status, setStatus] = useState("");

  const requestMap = useMemo(
    () => new Map(joinRequests.map((request) => [request.courseId, request])),
    [joinRequests],
  );

  async function respondToInvitation(invitationId: string, nextStatus: string) {
    const response = await fetch(`/api/invitations/${invitationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { invitation?: Invitation; error?: string }
      | null;

    if (!response.ok || !payload?.invitation) {
      setStatus(payload?.error ?? "Could not update invitation.");
      return;
    }

    setInvitations((current) =>
      current.map((invitation) =>
        invitation.id === invitationId
          ? { ...invitation, status: payload.invitation?.status ?? nextStatus }
          : invitation,
      ),
    );
    setStatus(`Invitation ${nextStatus.toLowerCase()}.`);
  }

  async function createJoinRequest(courseId: string) {
    const response = await fetch(`/api/courses/${courseId}/join-requests`, {
      method: "POST",
    });
    const payload = (await response.json().catch(() => null)) as
      | { request?: JoinRequest; error?: string }
      | null;

    if (!response.ok || !payload?.request) {
      setStatus(payload?.error ?? "Could not send join request.");
      return;
    }

    setJoinRequests((current) => [
      payload.request as JoinRequest,
      ...current.filter((request) => request.courseId !== courseId),
    ]);
    setStatus("Join request submitted.");
  }

  return (
    <section className="space-y-6">
      {status ? (
        <div className="rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--muted)]">
          {status}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <section className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Invitation inbox
          </p>
          <h1 className="mt-1 text-2xl font-bold">Course invitations</h1>
          <div className="mt-4 space-y-3">
            {invitations.length > 0 ? (
              invitations.map((invitation) => (
                <article
                  key={invitation.id}
                  className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{invitation.course.title}</p>
                      <p className="text-sm text-[color:var(--muted)]">
                        From{" "}
                        {invitation.teacher.name ??
                          invitation.teacher.email?.split("@")[0] ??
                          "Teacher"}
                      </p>
                    </div>
                    <span className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--muted)]">
                      {invitation.status}
                    </span>
                  </div>
                  {invitation.status === "PENDING" ? (
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          respondToInvitation(invitation.id, "ACCEPTED")
                        }
                        className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          respondToInvitation(invitation.id, "REJECTED")
                        }
                        className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-[color:var(--line)] p-4 text-sm text-[color:var(--muted)]">
                No invitations yet.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Access requests
          </p>
          <h2 className="mt-1 text-2xl font-bold">Discover courses</h2>
          <div className="mt-4 space-y-3">
            {courses.map((course) => {
              const request = requestMap.get(course.id);
              const hasAccess = activeCourseIds.includes(course.id);

              return (
                <article
                  key={course.id}
                  className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                >
                  <div className="space-y-1">
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-sm text-[color:var(--muted)]">
                      {course.description}
                    </p>
                    <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                      {course.lessonCount} lessons
                    </p>
                  </div>

                  <div className="mt-4">
                    {hasAccess ? (
                      <span className="rounded-full bg-[#ebfff2] px-4 py-2 text-sm font-semibold text-[#0a7a3f]">
                        Access granted
                      </span>
                    ) : request ? (
                      <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[color:var(--muted)]">
                        Request {request.status.toLowerCase()}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => createJoinRequest(course.id)}
                        className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
                      >
                        Request access
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
