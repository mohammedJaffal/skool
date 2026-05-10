import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getManagedCourse,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ courseId: string }> };

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["TEACHER", "ADMIN"])) {
    return jsonError("Only teachers or admins can send invitations.", 403);
  }

  const { courseId } = await params;
  const course = await getManagedCourse(courseId, user);

  if (!course) {
    return jsonError("Course not found or not manageable by you.", 404);
  }

  const body = (await request.json().catch(() => null)) as
    | { learnerId?: string; email?: string }
    | null;

  let learnerId = body?.learnerId?.trim();

  if (!learnerId && body?.email?.trim()) {
    const learner = await db.user.findUnique({
      where: { email: body.email.trim().toLowerCase() },
      select: { id: true },
    });
    learnerId = learner?.id;
  }

  if (!learnerId) {
    return jsonError("learnerId or a valid email is required.", 400);
  }

  const invitation = await db.courseInvitation.create({
    data: {
      courseId,
      teacherId: user.id,
      learnerId,
      status: "PENDING",
    },
  });

  return NextResponse.json({ invitation }, { status: 201 });
}

