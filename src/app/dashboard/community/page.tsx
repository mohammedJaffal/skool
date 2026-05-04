import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { POSTS } from "@/lib/mock-data";
import { PostFeed } from "@/components/community/post-feed";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const name = session.user.name ?? session.user.email ?? "Member";

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Discussion
        </p>
        <h1 className="text-2xl font-semibold">Community</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          Share questions, tips, and wins with the group.
        </p>
      </div>
      <PostFeed posts={[...POSTS].reverse()} currentUserName={name} />
    </div>
  );
}
