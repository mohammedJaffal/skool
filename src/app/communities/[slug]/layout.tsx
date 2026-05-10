import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { CommunityTopBar } from "@/components/community/community-branding";
import {
  getCommunityBySlugOrCourse,
  isCommunityMember,
} from "@/lib/community-data";

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
  const member = await isCommunityMember(community.slug, session?.user);
  const communityHref = member
    ? `/communities/${community.slug}/feed`
    : `/communities/${community.slug}/about`;
  const tabs = [
    { href: communityHref, label: "Community", active: member },
    { href: "/dashboard/courses", label: "Classroom", active: false },
    { href: `/dashboard/courses`, label: "Members", active: false },
    { href: `/communities/${community.slug}/about`, label: "About", active: !member },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <CommunityTopBar
        community={community}
        signedIn={signedIn}
        communityHref={communityHref}
      />

      <div className="border-b border-[color:var(--line)] bg-[color:var(--surface-raised)]">
        <nav className="mx-auto flex w-[90vw] max-w-[1084px] gap-8 text-base">
          {tabs.map((tab) => (
            <Link
              key={`${tab.href}-${tab.label}`}
              href={tab.href}
              className={`border-b-[4px] px-1 py-4 font-medium ${
                tab.active
                  ? "border-[color:var(--foreground)] text-[color:var(--foreground)]"
                  : "border-transparent text-[color:var(--muted)]"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      <main className="mx-auto w-[90vw] max-w-[1084px] py-8">{children}</main>
    </div>
  );
}
