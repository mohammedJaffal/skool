import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { CommunityJoinButton } from "@/components/community/community-join-button";
import { db } from "@/lib/db";
import {
  getCommunityDetailById,
  listPostsByCommunityId,
} from "@/lib/platform-data";

const levelColor: Record<string, string> = {
  Beginner: "text-green-700 bg-green-50",
  Intermediate: "text-yellow-700 bg-yellow-50",
  Advanced: "text-red-700 bg-red-50",
  General: "text-slate-700 bg-slate-100",
};

interface Props {
  params: Promise<{ communityId: string }>;
}

export default async function CommunityDetailPage({ params }: Props) {
  const session = await auth();
  const { communityId } = await params;
  const community = await getCommunityDetailById(communityId);
  if (!community) notFound();
  const posts = await listPostsByCommunityId(communityId);
  const canManageMembers =
    session?.user?.role === "ADMIN" || session?.user?.role === "OWNER";
  const managedCommunity = await db.community.findUnique({
    where: { id: communityId },
    select: { ownerId: true },
  });
  const hasMembership = session?.user?.id
    ? Boolean(
        await db.communityMembership.findUnique({
          where: {
            communityId_memberId: {
              communityId,
              memberId: session.user.id,
            },
          },
          select: { id: true, status: true },
        }).then((membership) => membership?.status === "ACTIVE"),
      )
    : false;
  const isOwner = Boolean(
    session?.user?.id && managedCommunity?.ownerId === session.user.id,
  );

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/communities"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
      >
        <span>←</span>
        <span>Back to communities</span>
      </Link>

      <section className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Community overview
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-[-0.04em]">
              {community.title}
            </h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              By {community.ownerName} · {community.duration} ·{" "}
              {community.classroomItems.length} classroom items
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${levelColor[community.level] ?? levelColor.General}`}
          >
            {community.level}
          </span>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-[color:var(--muted)]">
          {community.description}
        </p>
        {community.documents.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {community.documents.map((document) => (
              <a
                key={document.id}
                href={document.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold transition hover:border-[color:var(--brand)]"
              >
                {document.label}
              </a>
            ))}
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <div className="space-y-4">
          <section className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 shadow-[0_14px_38px_rgba(32,33,39,0.06)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Classroom</h2>
              <span className="rounded-full bg-[color:var(--chip)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
                {community.classroomItems.length} items
              </span>
            </div>

            <div className="space-y-3">
              {community.classroomItems.map((item, i) => (
                <Link
                  key={item.id}
                  href={`/dashboard/communities/${community.id}/classroom/${item.id}`}
                  className="flex gap-4 rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 transition hover:border-[color:var(--brand)]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-[color:var(--muted)]">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">
                      {item.content}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                      {item.duration}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 shadow-[0_14px_38px_rgba(32,33,39,0.06)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Owner posts</h2>
              <span className="rounded-full bg-[color:var(--chip)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
                {posts.length}
              </span>
            </div>

            {posts.length > 0 ? (
              <div className="space-y-3">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/dashboard/communities/${community.id}/posts/${post.id}`}
                    className="block rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 transition hover:border-[color:var(--brand)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{post.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                          {post.authorName} · {post.comments.length} comments
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[color:var(--brand)]">
                        Open
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                      {post.content}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[18px] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--muted)]">
                No owner posts published yet for this community.
              </div>
            )}
          </section>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 shadow-[0_14px_38px_rgba(32,33,39,0.06)]">
            <p className="text-2xl font-bold">Community access</p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              Free communities should be joined directly, not sent to an access-request flow.
            </p>
            <div className="mt-4">
              <CommunityJoinButton
                communityId={community.id}
                slug={community.slug ?? community.id}
                signedIn={Boolean(session?.user)}
                isMember={hasMembership || session?.user?.role === "ADMIN" || isOwner}
                isFree
                className="block w-full rounded-full bg-[color:var(--brand)] py-3 text-center text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 shadow-[0_14px_38px_rgba(32,33,39,0.06)]">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Read-side state
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[color:var(--muted)]">
              <li>Classroom items can be opened without auth in Sprint 01.</li>
              <li>Posts are readable inside the protected community flow.</li>
              <li>Anonymous users are redirected to sign-in before joining.</li>
            </ul>
            {canManageMembers ? (
              <Link
                href={`/dashboard/communities/${community.id}/members`}
                className="mt-4 inline-block rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold transition hover:border-[color:var(--brand)]"
              >
                Manage members
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
