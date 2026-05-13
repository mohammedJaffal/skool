import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getSessionUser,
  hasActiveCommunityAccess,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ itemId: string }> };

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const { itemId } = await params;
  const classroomItem = await db.classroomItem.findUnique({
    where: { id: itemId },
    select: {
      id: true,
      communityId: true,
    },
  });

  if (!classroomItem) {
    return jsonError("Classroom item not found.", 404);
  }

  if (!(await hasActiveCommunityAccess(classroomItem.communityId, user))) {
    return jsonError("You do not have access to this classroom item.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | { completed?: boolean }
    | null;
  const completed = body?.completed !== false;

  const progress = await db.classroomItemProgress.upsert({
    where: {
      classroomItemId_memberId: {
        classroomItemId: itemId,
        memberId: user.id,
      },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
      lastViewedAt: new Date(),
    },
    create: {
      classroomItemId: itemId,
      memberId: user.id,
      completed,
      completedAt: completed ? new Date() : null,
      lastViewedAt: new Date(),
    },
  });

  return NextResponse.json({ progress }, { status: 201 });
}

