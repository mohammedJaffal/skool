import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDefaultCommunitySlug } from "@/lib/community-data";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const session = await auth();
  const slug = await getDefaultCommunitySlug(session?.user);

  redirect(`/communities/${slug}`);
}
