import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getSessionUser,
  hasActiveCommunityAccess,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ postId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { postId } = await params;
  const post = await db.communityPost.findUnique({
    where: { id: postId },
    include: {
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    return jsonError("Post not found.", 404);
  }

  return NextResponse.json({
    comments: post.comments.map((comment) => ({
      id: comment.id,
      authorName:
        comment.author.name ??
        comment.author.email?.split("@")[0] ??
        "Campus Digital",
      content: comment.content,
      createdAt: comment.createdAt,
    })),
  });
}

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in to comment.", 401);
  }

  const { postId } = await params;
  const post = await db.communityPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      communityId: true,
    },
  });

  if (!post) {
    return jsonError("Post not found.", 404);
  }

  if (!(await hasActiveCommunityAccess(post.communityId, user))) {
    return jsonError("You do not have access to this community thread.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | { content?: string }
    | null;
  const content = body?.content?.trim();

  if (!content) {
    return jsonError("content is required.", 400);
  }

  const comment = await db.comment.create({
    data: {
      postId,
      authorId: user.id,
      content,
    },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
