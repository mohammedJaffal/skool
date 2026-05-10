import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getManagedCourse,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ courseId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["TEACHER", "ADMIN"])) {
    return jsonError("Only teachers or admins can inspect members.", 403);
  }

  const { courseId } = await params;
  const course = await getManagedCourse(courseId, user);

  if (!course) {
    return jsonError("Course not found or not manageable by you.", 404);
  }

  const [memberships, invitations, joinRequests] = await Promise.all([
    db.courseMembership.findMany({
      where: { courseId },
      orderBy: { joinedAt: "desc" },
      include: {
        learner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    db.courseInvitation.findMany({
      where: { courseId },
      orderBy: { sentAt: "desc" },
      include: {
        learner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    db.courseJoinRequest.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
      include: {
        learner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    memberships,
    invitations,
    joinRequests,
  });
}

