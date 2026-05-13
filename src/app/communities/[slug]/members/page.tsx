import { notFound } from "next/navigation";
import {
  getCommunityBySlug,
  getCommunityMembersPreview,
} from "@/lib/community-data";

export default async function CommunityMembersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);

  if (!community) {
    notFound();
  }

  const members = await getCommunityMembersPreview(community.slug);

  return (
    <div className="space-y-6">
      <section className="rounded-[8px] border border-[color:var(--line)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <h1 className="text-2xl font-semibold">Members</h1>
        <p className="mt-3 text-base text-[color:var(--muted)]">
          People active in this group, including hosts, owners, and members.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {members.map((member) => (
          <article
            key={`${member.name}-${member.role}`}
            className="rounded-[8px] border border-[color:var(--line)] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{member.name}</h2>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {member.role}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[color:var(--foreground)]">
              {member.note}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
