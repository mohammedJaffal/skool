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
  const joinRequest = await db.courseJoinRequest.findUnique({
    where: { id: requestId },
    include: {
      course: {
        select: {
          teacherId: true,
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
    user.role === "ADMIN" || joinRequest.course.teacherId === user.id;
  const isLearnerSide = joinRequest.learnerId === user.id;

  if (
    (status === "ACCEPTED" || status === "REJECTED") &&
    !isTeacherSide
  ) {
    return jsonError("Only the teacher or admin can review requests.", 403);
  }

  if (status === "CANCELLED" && !isLearnerSide && !isTeacherSide) {
    return jsonError("You cannot cancel this request.", 403);
  }

  const updated = await db.courseJoinRequest.update({
    where: { id: joinRequest.id },
    data: {
      status,
      reviewedAt: new Date(),
      reviewedById:
        status === "ACCEPTED" || status === "REJECTED" ? user.id : null,
    },
  });

  if (status === "ACCEPTED") {
    await db.courseMembership.upsert({
      where: {
        courseId_learnerId: {
          courseId: joinRequest.courseId,
          learnerId: joinRequest.learnerId,
        },
      },
      update: {
        status: "ACTIVE",
        endedAt: null,
      },
      create: {
        courseId: joinRequest.courseId,
        learnerId: joinRequest.learnerId,
        status: "ACTIVE",
      },
    });
  }

  return NextResponse.json({ request: updated });
}
