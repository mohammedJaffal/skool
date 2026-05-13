import { redirect } from "next/navigation";
import { getCommunityBySlugOrCourse } from "@/lib/community-data";

export default async function CommunityEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const community = await getCommunityBySlugOrCourse(slug);

  if (!community) {
    redirect("/");
  }

  redirect(`/communities/${slug}/about`);
}
