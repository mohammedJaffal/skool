import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getCommunityDetailById,
  listPostsByCommunityId,
} from "@/lib/platform-data";
import {
  getManagedCommunity,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ communityId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { communityId } = await params;
  const community = await getCommunityDetailById(communityId);

  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  return NextResponse.json({
    communityId,
    title: community.title,
    posts: await listPostsByCommunityId(communityId),
  });
}

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["OWNER", "ADMIN"])) {
    return jsonError("Only owners or admins can publish community posts.", 403);
  }

  const { communityId } = await params;
  const community = await getManagedCommunity(communityId, user);

  if (!community) {
    return jsonError("Community not found or not manageable by you.", 404);
  }

  const body = (await request.json().catch(() => null)) as
    | {
        title?: string;
        content?: string;
        status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      }
    | null;

  const title = body?.title?.trim();
  const content = body?.content?.trim();

  if (!title || !content) {
    return jsonError("title and content are required.", 400);
  }

  const post = await db.communityPost.create({
    data: {
      communityId: communityId,
      authorId: user.id,
      title,
      content,
      status: body?.status ?? "PUBLISHED",
      publishedAt: body?.status === "DRAFT" ? null : new Date(),
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
