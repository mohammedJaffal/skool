import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getSessionUser,
  hasActiveCourseAccess,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ announcementId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { announcementId } = await params;
  const announcement = await db.announcement.findUnique({
    where: { id: announcementId },
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

  if (!announcement) {
    return jsonError("Announcement not found.", 404);
  }

  return NextResponse.json({
    comments: announcement.comments.map((comment) => ({
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

  const { announcementId } = await params;
  const announcement = await db.announcement.findUnique({
    where: { id: announcementId },
    select: {
      id: true,
      courseId: true,
    },
  });

  if (!announcement) {
    return jsonError("Announcement not found.", 404);
  }

  if (!(await hasActiveCourseAccess(announcement.courseId, user))) {
    return jsonError("You do not have access to this course thread.", 403);
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
      announcementId,
      authorId: user.id,
      content,
    },
  });

  return NextResponse.json({ comment }, { status: 201 });
}

