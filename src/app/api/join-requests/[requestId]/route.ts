import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, jsonError } from "@/lib/request-auth";

type Params = { params: Promise<{ requestId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const { requestId } = await params;
  const joinRequest = await db.communityJoinRequest.findUnique({
    where: { id: requestId },
    include: {
      community: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  if (!joinRequest) {
    return jsonError("Join request not found.", 404);
  }

  const body = (await request.json().catch(() => null)) as
    | { status?: "ACCEPTED" | "REJECTED" | "CANCELLED" }
    | null;
  const status = body?.status;

  if (!status) {
    return jsonError("status is required.", 400);
  }

  const isTeacherSide =
    user.role === "ADMIN" || joinRequest.community.ownerId === user.id;
  const isLearnerSide = joinRequest.memberId === user.id;

  if (
    (status === "ACCEPTED" || status === "REJECTED") &&
    !isTeacherSide
  ) {
    return jsonError("Only the owner or admin can review requests.", 403);
  }

  if (status === "CANCELLED" && !isLearnerSide && !isTeacherSide) {
    return jsonError("You cannot cancel this request.", 403);
  }

  const updated = await db.communityJoinRequest.update({
    where: { id: joinRequest.id },
    data: {
      status,
      reviewedAt: new Date(),
      reviewedById:
        status === "ACCEPTED" || status === "REJECTED" ? user.id : null,
    },
  });

  if (status === "ACCEPTED") {
    await db.communityMembership.upsert({
      where: {
        communityId_memberId: {
          communityId: joinRequest.communityId,
          memberId: joinRequest.memberId,
        },
      },
      update: {
        status: "ACTIVE",
        endedAt: null,
      },
      create: {
        communityId: joinRequest.communityId,
        memberId: joinRequest.memberId,
        status: "ACTIVE",
      },
    });
  }

  return NextResponse.json({ request: updated });
}
