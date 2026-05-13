import { redirect } from "next/navigation";
import { getCommunityBySlug } from "@/lib/community-data";

export default async function CommunityEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);

  if (!community) {
    redirect("/");
  }

  redirect(`/communities/${slug}/about`);
}
