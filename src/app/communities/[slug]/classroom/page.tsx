import { notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  getCommunityBySlug,
  getCommunityClassroomPreview,
  isCommunityMember,
} from "@/lib/community-data";

export default async function CommunityClassroomPage({
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

  const classroom = await getCommunityClassroomPreview(community.slug);
  const member = await isCommunityMember(community.slug, session?.user);

  if (!classroom) {
    return (
      <section className="rounded-[8px] border border-[color:var(--line)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <h1 className="text-2xl font-semibold">Classroom</h1>
        <p className="mt-4 text-base text-[color:var(--muted)]">
          No classroom modules are available for this group yet.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[8px] border border-[color:var(--line)] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <h1 className="text-2xl font-semibold">Classroom</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-[color:var(--muted)]">
          {classroom.description}
        </p>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          {classroom.ownerName} · {classroom.duration} ·{" "}
          {classroom.classroomItems.length} modules
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
          {member ? "Member access" : "Preview"}
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {classroom.classroomItems.map((item, index) => {
          const progress = 0;
          const imageSeed = encodeURIComponent(`${community.slug}-${item.id}`);

          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-[16px] border border-[color:var(--line)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
              <div
                className="h-56 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://picsum.photos/seed/${imageSeed}/900/560)`,
                }}
              />
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    Module {index + 1}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold leading-tight">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-[color:var(--muted)]">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm font-semibold text-[color:var(--foreground)]">
                  <span>{progress}%</span>
                  <span>{item.duration}</span>
                </div>
                <div className="h-5 rounded-full bg-[#ececec]">
                  <div
                    className="h-5 rounded-full bg-[#d7d7d7]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
