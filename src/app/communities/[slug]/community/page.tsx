import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { CommunitySideCard } from "@/components/community/community-branding";
import { CommunityLiveFeed } from "@/components/community/community-live-feed";
import {
  getCommunityBySlug,
  getCommunityClassroomPreview,
  isCommunityMember,
} from "@/lib/community-data";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const community = await getCommunityBySlug(slug);

  if (!community) {
    notFound();
  }

  const member = await isCommunityMember(community.slug, session?.user);
  const classroom = await getCommunityClassroomPreview(community.slug);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_272px]">
      <CommunityLiveFeed
        initialThreads={community.threads}
        currentUserName={
          session?.user?.name ?? session?.user?.email ?? "Campus Member"
        }
        canPost={member}
      />

      <div className="space-y-4">
        <CommunitySideCard
          community={community}
          communityId={classroom?.id ?? null}
          signedIn={Boolean(session?.user)}
          isMember={member}
        />
        <section className="rounded-[8px] border border-[color:var(--line)] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <h2 className="text-lg font-semibold">Topics</h2>
          <div className="mt-3 space-y-3 text-sm text-[color:var(--muted)]">
            {community.topics.map((topic) => (
              <p key={topic}>{topic}</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
