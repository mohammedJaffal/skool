import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCommunityDetailById } from "@/lib/platform-data";
import {
  getManagedCommunity,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ communityId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { communityId } = await params;
  const community = await getCommunityDetailById(communityId);

  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  return NextResponse.json({
    communityId,
    title: community.title,
    classroomItems: community.classroomItems,
  });
}

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["OWNER", "ADMIN"])) {
    return jsonError("Only owners or admins can add classroom items.", 403);
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
        contentType?: string;
        position?: number;
      }
    | null;

  const title = body?.title?.trim();
  const content = body?.content?.trim();
  const contentType =
    body?.contentType?.trim() === "lesson"
      ? "text"
      : body?.contentType?.trim() || "text";

  if (!title || !content) {
    return jsonError("title and content are required.", 400);
  }

  const lastClassroomItem = await db.classroomItem.findFirst({
    where: { communityId: communityId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const classroomItem = await db.classroomItem.create({
    data: {
      communityId: communityId,
      title,
      content,
      contentType,
      position:
        typeof body?.position === "number" && body.position > 0
          ? body.position
        : (lastClassroomItem?.position ?? 0) + 1,
    },
  });

  return NextResponse.json({ classroomItem }, { status: 201 });
}
