import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getManagedCourse,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ courseId: string; learnerId: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["TEACHER", "ADMIN"])) {
    return jsonError("Only teachers or admins can remove course members.", 403);
  }

  const { courseId, learnerId } = await params;
  const course = await getManagedCourse(courseId, user);

  if (!course) {
    return jsonError("Course not found or not manageable by you.", 404);
  }

  const membership = await db.courseMembership.findUnique({
    where: {
      courseId_learnerId: {
        courseId,
        learnerId,
      },
    },
  });

  if (!membership) {
    return jsonError("Membership not found.", 404);
  }

  const updated = await db.courseMembership.update({
    where: { id: membership.id },
    data: {
      status: "REMOVED",
      endedAt: new Date(),
    },
  });

  return NextResponse.json({ membership: updated });
}

