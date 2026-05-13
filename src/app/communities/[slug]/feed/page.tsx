import { redirect } from "next/navigation";

export default async function CommunityFeedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/communities/${slug}/community`);
}
