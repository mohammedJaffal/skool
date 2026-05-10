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
    return jsonError("Only teachers or admins can read join requests.", 403);
  }

  const { courseId } = await params;
  const course = await getManagedCourse(courseId, user);

  if (!course) {
    return jsonError("Course not found or not manageable by you.", 404);
  }

  const requests = await db.courseJoinRequest.findMany({
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
  });

  return NextResponse.json({ requests });
}

export async function POST(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const { courseId } = await params;

  const membership = await db.courseMembership.findUnique({
    where: {
      courseId_learnerId: {
        courseId,
        learnerId: user.id,
      },
    },
  });

  if (membership?.status === "ACTIVE") {
    return jsonError("You already have access to this course.", 400);
  }

  const existingRequest = await db.courseJoinRequest.findFirst({
    where: {
      courseId,
      learnerId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const request = existingRequest
    ? await db.courseJoinRequest.update({
        where: { id: existingRequest.id },
        data: {
          status: "PENDING",
          reviewedAt: null,
          reviewedById: null,
        },
      })
    : await db.courseJoinRequest.create({
        data: {
          courseId,
          learnerId: user.id,
          status: "PENDING",
        },
      });

  return NextResponse.json({ request }, { status: 201 });
}
