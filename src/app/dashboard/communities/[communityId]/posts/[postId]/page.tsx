import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AnnouncementCommentComposer } from "@/components/community/announcement-comment-composer";
import { getCommunityDetailById, getPostDetailById } from "@/lib/platform-data";

type PostPageProps = {
  params: Promise<{ communityId: string; postId: string }>;
};

function timeAgoLabel(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3_600_000);

  if (hours < 1) {
    return "just now";
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
}

export default async function PostPage({ params }: PostPageProps) {
  const session = await auth();
  const { communityId, postId } = await params;
  const community = await getCommunityDetailById(communityId);
  const post = await getPostDetailById(communityId, postId);

  if (!community || !post) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
        <Link href="/dashboard/communities" className="hover:text-[color:var(--foreground)]">
          Communities
        </Link>
        <span>/</span>
        <Link
          href={`/dashboard/communities/${community.id}`}
          className="hover:text-[color:var(--foreground)]"
        >
          {community.title}
        </Link>
        <span>/</span>
        <span>Post</span>
      </div>

      <article className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-6 shadow-[0_14px_38px_rgba(32,33,39,0.06)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Community post
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">
              {post.title}
            </h1>
          </div>
          <div className="rounded-full bg-[color:var(--chip)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
            {timeAgoLabel(post.createdAt)}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--brand)] text-sm font-semibold text-white">
            {post.authorInitials}
          </div>
          <div>
            <p className="font-semibold">{post.authorName}</p>
            <p className="text-sm text-[color:var(--muted)]">
              Posted to {community.title}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[18px] bg-[color:var(--surface-soft)] p-5 text-sm leading-7 text-[color:var(--foreground)]">
          {post.content}
        </div>
      </article>

      <section className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-6 shadow-[0_14px_38px_rgba(32,33,39,0.06)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Discussion</h2>
          <span className="rounded-full bg-[color:var(--chip)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
            {post.comments.length} comments
          </span>
        </div>

        {post.comments.length > 0 ? (
          <div className="mt-5 space-y-3">
            {post.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold">
                  {comment.authorInitials}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{comment.authorName}</p>
                    <span className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                      {timeAgoLabel(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[18px] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 text-sm text-[color:var(--muted)]">
            No comments yet on this post.
          </div>
        )}

        <AnnouncementCommentComposer
          announcementId={post.id}
          signedIn={Boolean(session?.user)}
        />
      </section>
    </section>
  );
}
