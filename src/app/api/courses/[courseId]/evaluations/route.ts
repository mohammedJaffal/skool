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
    return jsonError("Only teachers or admins can read evaluations.", 403);
  }

  const { courseId } = await params;
  const course = await getManagedCourse(courseId, user);

  if (!course) {
    return jsonError("Course not found or not manageable by you.", 404);
  }

  const evaluations = await db.courseEvaluation.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    include: {
      learner: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({ evaluations });
}

export async function POST(request: Request, { params }: Params) {
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

  if (membership?.status !== "ACTIVE") {
    return jsonError("You need course access before evaluating.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | { rating?: number; feedback?: string }
    | null;

  if (
    typeof body?.rating !== "number" ||
    !Number.isInteger(body.rating) ||
    body.rating < 1 ||
    body.rating > 5
  ) {
    return jsonError("rating must be an integer between 1 and 5.", 400);
  }

  const evaluation = await db.courseEvaluation.upsert({
    where: {
      courseId_learnerId: {
        courseId,
        learnerId: user.id,
      },
    },
    update: {
      rating: body.rating,
      feedback: body.feedback?.trim() || null,
    },
    create: {
      courseId,
      learnerId: user.id,
      rating: body.rating,
      feedback: body.feedback?.trim() || null,
    },
  });

  return NextResponse.json({ evaluation }, { status: 201 });
}

