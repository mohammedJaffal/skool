import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ClassroomProgressToggle } from "@/components/community/classroom-progress-toggle";
import { getCommunityDetailById } from "@/lib/platform-data";

type ClassroomItemPageProps = {
  params: Promise<{ communityId: string; itemId: string }>;
};

export default async function ClassroomItemPage({
  params,
}: ClassroomItemPageProps) {
  const session = await auth();
  const { communityId, itemId } = await params;
  const community = await getCommunityDetailById(communityId);

  if (!community) {
    notFound();
  }

  const classroomItem = community.classroomItems.find((item) => item.id === itemId);

  if (!classroomItem) {
    notFound();
  }

  const currentIndex = community.classroomItems.findIndex((item) => item.id === itemId);
  const prev = community.classroomItems[currentIndex - 1];
  const next = community.classroomItems[currentIndex + 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
        <Link
          href="/dashboard/communities"
          className="transition hover:text-[color:var(--foreground)]"
        >
          Communities
        </Link>
        <span>/</span>
        <Link
          href={`/dashboard/communities/${communityId}`}
          className="transition hover:text-[color:var(--foreground)]"
        >
          {community.title}
        </Link>
        <span>/</span>
        <span className="font-medium text-[color:var(--foreground)] truncate">
          {classroomItem.title}
        </span>
      </div>

      <div className="aspect-video rounded-[24px] bg-gradient-to-br from-[#202430] via-[#2e3f72] to-[#10161f] flex items-center justify-center shadow-[0_18px_50px_rgba(23,28,41,0.18)]">
        <div className="space-y-2 text-center text-white/80">
          <div className="text-5xl">▶</div>
          <p className="text-sm uppercase tracking-[0.18em] text-white/60">
            Video placeholder
          </p>
          <p className="text-xs text-white/50">
            {classroomItem.title} · {classroomItem.duration}
          </p>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Classroom item {classroomItem.order} of {community.classroomItems.length}
          </p>
          <h1 className="text-3xl font-black tracking-[-0.04em]">
            {classroomItem.title}
          </h1>
        </div>
        <span className="shrink-0 rounded-full bg-[color:var(--chip)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
          {classroomItem.duration}
        </span>
      </div>

      <section className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-6 shadow-[0_14px_38px_rgba(32,33,39,0.06)] space-y-3">
        <h2 className="font-semibold text-[color:var(--foreground)]">Classroom notes</h2>
        <div className="text-sm whitespace-pre-line leading-7 text-[color:var(--muted)]">
          {classroomItem.content}
        </div>
      </section>

      <ClassroomProgressToggle
        itemId={classroomItem.id}
        signedIn={Boolean(session?.user)}
      />

      <div className="flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/dashboard/communities/${communityId}/classroom/${prev.id}`}
            className="flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 py-3 text-sm font-medium transition hover:border-[color:var(--brand)]"
          >
            ← {prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/dashboard/communities/${communityId}/classroom/${next.id}`}
            className="flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            {next.title} →
          </Link>
        ) : (
          <Link
            href={`/dashboard/communities/${communityId}`}
            className="flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Community complete ✓
          </Link>
        )}
      </div>
    </div>
  );
}
