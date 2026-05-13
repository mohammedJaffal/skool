import Link from "next/link";
import { listCommunityCards } from "@/lib/platform-data";

const levelColor: Record<string, string> = {
  Beginner: "text-green-700 bg-green-50",
  Intermediate: "text-yellow-700 bg-yellow-50",
  Advanced: "text-red-700 bg-red-50",
  General: "text-slate-700 bg-slate-100",
};

type CommunitiesPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function CommunitiesPage({
  searchParams,
}: CommunitiesPageProps) {
  const query = ((await searchParams)?.q ?? "").trim();
  const normalizedQuery = query.toLowerCase();
  const allCommunities = await listCommunityCards();
  const communities = normalizedQuery
    ? allCommunities.filter((community) =>
        [
          community.title,
          community.description,
          community.ownerName,
          community.level,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : allCommunities;

  if (communities.length === 0) {
    return (
      <section className="rounded-[24px] border border-dashed border-[color:var(--line)] bg-white p-10 text-center text-sm text-[color:var(--muted)]">
        {query
          ? `No community matched "${query}".`
          : "No communities are available yet."}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Discovery
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em]">
            Communities
          </h1>
        </div>
        <p className="text-sm text-[color:var(--muted)]">
          {communities.length} spaces
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {communities.map((community) => (
          <Link
            key={community.id}
            href={`/dashboard/communities/${community.id}`}
            className="rounded-[24px] border border-[color:var(--line)] bg-white p-5 shadow-[0_14px_38px_rgba(32,33,39,0.06)] transition hover:-translate-y-0.5 hover:border-[color:var(--brand)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold tracking-[-0.03em]">
                  {community.title}
                </h2>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {community.description}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${levelColor[community.level] ?? levelColor.General}`}
              >
                {community.level}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
              <span>{community.classroomItemCount} classroom items</span>
              <span>{community.duration}</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-semibold">{community.ownerName}</span>
              <span className="text-sm font-semibold text-[color:var(--brand)]">
                Open
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
