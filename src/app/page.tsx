import { auth } from "@/auth";
import Link from "next/link";
import { listCommunityCards } from "@/lib/community-data";
import { PublicHeader } from "@/components/site/public-header";

export default async function HomePage() {
  const session = await auth();
  const communities = await listCommunityCards();
  const signedIn = Boolean(session?.user);
  const categoryChips = [
    "All",
    "Tech",
    "Automation",
    "Business",
    "Creators",
    "Growth",
    "Health",
  ];

  return (
    <div className="min-h-screen">
      <PublicHeader signedIn={signedIn} />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">
        <section className="py-6 text-center">
          <h1 className="text-5xl font-bold md:text-6xl">
            Discover communities
          </h1>
          <p className="mt-3 text-xl md:text-2xl">
            or{" "}
            <Link
              href={signedIn ? "/dashboard/teach" : "/auth/signin?callbackUrl=/dashboard/teach"}
              className="font-semibold text-[#3468ff]"
            >
              create your own
            </Link>
          </p>

          <form
            action="/dashboard/courses"
            method="GET"
            className="mx-auto mt-8 max-w-[650px] rounded-[8px] border border-[color:var(--line)] bg-white px-4 py-4 shadow-[0_3px_14px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl text-[color:var(--muted)]">⌕</span>
              <input
                name="query"
                placeholder="Search for a course"
                className="w-full bg-transparent text-xl font-medium outline-none placeholder:text-[color:var(--muted)] md:text-3xl"
              />
              <button
                type="submit"
                className="rounded-[10px] bg-[color:var(--foreground)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {categoryChips.map((chip, index) => (
              <button
                key={chip}
                type="button"
                className={`rounded-[999px] border px-5 py-3 text-lg ${
                  index === 0
                    ? "border-[#8e8b84] bg-[#8e8b84] text-white"
                    : "border-[color:var(--line)] bg-white text-[color:var(--muted)]"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        <div className="mx-auto grid w-[90vw] max-w-[1084px] gap-6 md:grid-cols-2 xl:grid-cols-3">
          {communities.map((community, index) => (
            <Link
              key={community.slug}
              href={`/communities/${community.slug}/about`}
              className="block overflow-hidden rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] transition hover:shadow-[0_3px_14px_rgba(0,0,0,0.08)]"
            >
              <div className="relative h-[176px] overflow-hidden bg-[#1a1d29]">
                <div
                  aria-label={community.name}
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${community.heroImage})` }}
                />
                <div className="absolute left-3 top-3 flex h-10 min-w-10 items-center justify-center rounded-full bg-black/45 px-3 text-base font-medium text-white">
                  #{index + 1}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold">
                    {community.name}
                  </h2>
                  <span className="shrink-0 rounded-[999px] bg-[color:var(--brand-soft)] px-3 py-1 text-sm font-medium text-[#3468ff]">
                    {community.priceLabel}
                  </span>
                </div>
                <p className="mt-4 min-h-[72px] text-base leading-6 text-[color:var(--foreground)]">
                  {community.shortDescription}
                </p>
                <div className="mt-5 border-t border-[color:var(--line)] pt-4 text-base text-[color:var(--foreground)]">
                  <p>{community.memberCount} Members</p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    {community.courseTitle} · {community.courseMeta}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
