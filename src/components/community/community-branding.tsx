import Link from "next/link";
import type { CommunityData } from "@/lib/community-data";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CommunityLogo({
  community,
  size = "md",
}: {
  community: CommunityData;
  size?: "sm" | "md" | "lg";
}) {
  const sizes =
    size === "sm"
      ? "h-10 w-10 text-lg"
      : size === "lg"
        ? "h-20 w-20 text-3xl"
        : "h-14 w-14 text-2xl";

  return (
    <div
      className={`flex items-center justify-center rounded-[8px] bg-[#151826] font-black text-white ${sizes}`}
    >
      {initials(community.name)}
    </div>
  );
}

export function CommunityCover({
  community,
  className = "",
}: {
  community: CommunityData;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[8px] border border-[color:var(--line)] bg-[#171922] ${className}`}
    >
      <div
        aria-label={community.name}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${community.heroImage})` }}
      />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative flex h-full min-h-[220px] flex-col justify-between p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <CommunityLogo community={community} size="sm" />
          <span className="rounded-[999px] bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
            {community.priceLabel}
          </span>
        </div>
        <div>
          <p className="max-w-[12ch] text-4xl font-black uppercase text-white/95">
            {community.name}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
            {community.offerSummary}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CommunitySideCard({
  community,
  member,
  actionHref,
  signedIn,
}: {
  community: CommunityData;
  member: boolean;
  actionHref: string;
  signedIn: boolean;
}) {
  return (
    <aside className="rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <CommunityCover community={community} className="min-h-[148px]" />

      <div className="mt-4">
        <h2 className="text-xl font-semibold">
          {community.name}
        </h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          skool.com/{community.slug}
        </p>
        <p className="mt-4 text-sm leading-7">{community.shortDescription}</p>
      </div>

      <div className="mt-4 space-y-2 text-sm text-[color:var(--muted)]">
        {community.highlights.slice(0, 3).map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 border-y border-[color:var(--line)] py-4 text-center">
        <div>
          <p className="text-xl font-semibold text-[color:var(--foreground)]">
            {community.memberCount}
          </p>
          <p className="text-sm text-[color:var(--muted)]">Members</p>
        </div>
        <div className="border-x border-[color:var(--line)]">
          <p className="text-xl font-semibold text-[color:var(--foreground)]">
            {community.onlineCount}
          </p>
          <p className="text-sm text-[color:var(--muted)]">Online</p>
        </div>
        <div>
          <p className="text-xl font-semibold text-[color:var(--foreground)]">
            3
          </p>
          <p className="text-sm text-[color:var(--muted)]">Hosts</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {community.sampleMembers.slice(0, 6).map((person) => (
          <div
            key={person.name}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] text-xs font-medium"
            title={person.name}
          >
            {initials(person.name)}
          </div>
        ))}
      </div>

      <Link
        href={actionHref}
        className="mt-5 flex h-12 items-center justify-center rounded-[8px] bg-[#f3cc72] text-sm font-semibold text-[#1f1d1a] transition hover:brightness-95"
      >
        {member ? "OPEN GROUP" : signedIn ? "JOIN GROUP" : "LOG IN TO JOIN"}
      </Link>
    </aside>
  );
}

export function CommunityTopBar({
  community,
  signedIn,
  communityHref,
}: {
  community: CommunityData;
  signedIn: boolean;
  communityHref: string;
}) {
  return (
    <header className="border-b border-[color:var(--line)] bg-[color:var(--surface-raised)]">
      <div className="mx-auto flex w-[90vw] max-w-[1084px] items-center gap-4 py-2">
        <Link href={communityHref} className="flex items-center gap-3">
          <CommunityLogo community={community} size="sm" />
          <span className="text-[1.75rem] leading-none text-[color:var(--muted)]">
            ›
          </span>
          <span className="whitespace-nowrap text-xl font-medium">
            {community.name}
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 rounded-[8px] border border-[color:var(--line)] bg-[#ece7dd] px-4 py-3">
            <span className="text-sm text-[color:var(--muted)]">⌕</span>
            <input
              readOnly
              value=""
              placeholder="Search"
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-[color:var(--muted)]"
            />
          </div>
        </div>

        <Link
          href={signedIn ? "/dashboard" : "/auth/signin"}
          className="rounded-[8px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-4 py-3 text-sm font-semibold text-[color:var(--muted)]"
        >
          {signedIn ? "WORKSPACE" : "LOG IN"}
        </Link>
      </div>
    </header>
  );
}
