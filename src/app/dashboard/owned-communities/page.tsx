import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { OwnerCommunityWorkspace } from "@/components/owner/owner-community-workspace";

export default async function OwnedCommunitiesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const role = session.user.role ?? "MEMBER";

  if (role !== "OWNER" && role !== "ADMIN") {
    return (
      <section className="rounded-[8px] border border-[color:var(--line)] bg-white p-6 shadow-sm">
        <h1 className="mt-2 text-2xl font-bold">Owner access required</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          This workspace is reserved for owner or admin accounts.
        </p>
      </section>
    );
  }

  const communities = await db.community.findMany({
    where: role === "ADMIN" ? undefined : { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      documents: {
        orderBy: { createdAt: "desc" },
      },
      classroomItems: {
        orderBy: { position: "asc" },
      },
      posts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
      >
        <span>&larr;</span>
        <span>Back to workspace</span>
      </Link>
      <OwnerCommunityWorkspace
        communities={communities.map((community) => ({
          id: community.id,
          title: community.title,
          description: community.description,
          type: community.type,
          status: community.status,
          documents: community.documents,
          classroomItems: community.classroomItems.map((item) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            contentType: item.contentType,
            position: item.position,
          })),
          posts: community.posts.map((post) => ({
            id: post.id,
            title: post.title,
            content: post.content,
            status: post.status,
          })),
        }))}
      />
    </div>
  );
}
