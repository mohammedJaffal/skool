import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { CommunityTopBar } from "@/components/community/community-branding";
import { CommunityTabs } from "@/components/community/community-tabs";
import { getCommunityBySlugOrCourse } from "@/lib/community-data";

export default async function CommunityLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const session = await auth();
  const community = await getCommunityBySlugOrCourse(slug);

  if (!community) {
    notFound();
  }

  const signedIn = Boolean(session?.user);
  const communityHref = `/communities/${community.slug}/community`;

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <CommunityTopBar
        community={community}
        signedIn={signedIn}
        communityHref={communityHref}
      />

      <div className="border-b border-[color:var(--line)] bg-[color:var(--surface-raised)]">
        <CommunityTabs slug={community.slug} />
      </div>

      <main className="mx-auto w-[90vw] max-w-[1084px] py-8">{children}</main>
    </div>
  );
}
