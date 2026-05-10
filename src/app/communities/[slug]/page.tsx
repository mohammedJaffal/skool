import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getCommunityBySlugOrCourse,
  isCommunityMember,
} from "@/lib/community-data";

export default async function CommunityEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const community = await getCommunityBySlugOrCourse(slug);

  if (!community) {
    redirect("/");
  }

  const member = await isCommunityMember(slug, session?.user);

  if (member) {
    redirect(`/communities/${slug}/feed`);
  }

  redirect(`/communities/${slug}/about`);
}
