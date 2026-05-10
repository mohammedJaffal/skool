import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  CommunityCover,
  CommunitySideCard,
} from "@/components/community/community-branding";
import {
  getCommunityBySlugOrCourse,
  getCommunityClassroomPreview,
  isCommunityMember,
} from "@/lib/community-data";

export default async function CommunityAboutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const community = await getCommunityBySlugOrCourse(slug);

  if (!community) {
    notFound();
  }

  const member = await isCommunityMember(community.slug, session?.user);
  const classroom = await getCommunityClassroomPreview(community.slug);
  const actionHref = member
    ? `/communities/${community.slug}/feed`
    : session?.user
      ? `/dashboard/checkout?community=${community.slug}`
      : `/auth/signin?callbackUrl=/communities/${community.slug}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_272px]">
      <section className="rounded-[8px] border border-[color:var(--line)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <h1 className="text-2xl font-semibold">{community.name}</h1>
        <CommunityCover community={community} className="mt-6 min-h-[396px]" />

        <div className="mt-6 space-y-6 text-base leading-7">
          <section>
            <h2 className="text-xl font-semibold">About</h2>
            <p className="mt-3">{community.description}</p>
            <p className="mt-3 text-[color:var(--muted)]">
              {community.offerSummary}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">What members get</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {community.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-3 text-sm leading-6"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </section>

          {classroom ? (
            <section>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Classroom preview</h2>
                <Link
                  href={member ? "/dashboard/courses" : actionHref}
                  className="text-sm font-semibold text-[#3468ff]"
                >
                  {member ? "Open classroom" : "Join to access"}
                </Link>
              </div>
              <div className="mt-3 grid gap-3">
                {classroom.lessons.slice(0, 4).map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between rounded-[8px] border border-[color:var(--line)] bg-white px-4 py-3"
                  >
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-[color:var(--muted)]">
                      {lesson.duration}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <CommunitySideCard
        community={community}
        member={member}
        actionHref={actionHref}
        signedIn={Boolean(session?.user)}
      />
    </div>
  );
}
