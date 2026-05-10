import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, jsonError } from "@/lib/request-auth";

type Params = { params: Promise<{ invitationId: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const { invitationId } = await params;
  const invitation = await db.courseInvitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) {
    return jsonError("Invitation not found.", 404);
  }

  if (invitation.learnerId !== user.id && user.role !== "ADMIN") {
    return jsonError("You cannot update this invitation.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | { status?: "ACCEPTED" | "REJECTED" | "CANCELLED" }
    | null;
  const status = body?.status;

  if (!status) {
    return jsonError("status is required.", 400);
  }

  const updated = await db.courseInvitation.update({
    where: { id: invitation.id },
    data: {
      status,
      respondedAt: new Date(),
    },
  });

  if (status === "ACCEPTED") {
    await db.courseMembership.upsert({
      where: {
        courseId_learnerId: {
          courseId: invitation.courseId,
          learnerId: invitation.learnerId,
        },
      },
      update: {
        status: "ACTIVE",
        endedAt: null,
      },
      create: {
        courseId: invitation.courseId,
        learnerId: invitation.learnerId,
        status: "ACTIVE",
      },
    });
  }

  return NextResponse.json({ invitation: updated });
}

