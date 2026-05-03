import { auth } from "@/auth";
import { POSTS } from "@/lib/mock-data";
import { PostFeed } from "@/components/community/post-feed";

export default async function CommunityPage() {
  const session = await auth();
  const userName = session?.user?.name ?? session?.user?.email ?? "Member";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-sm text-gray-500 mt-1">Share questions, tips, and wins with the group.</p>
      </div>
      <PostFeed initialPosts={[...POSTS].reverse()} userName={userName} />
    </div>
  );
}
