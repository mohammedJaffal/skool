import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getSessionUser,
  hasActiveCourseAccess,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ lessonId: string }> };

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const { lessonId } = await params;
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      courseId: true,
    },
  });

  if (!lesson) {
    return jsonError("Lesson not found.", 404);
  }

  if (!(await hasActiveCourseAccess(lesson.courseId, user))) {
    return jsonError("You do not have access to this lesson.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | { completed?: boolean }
    | null;
  const completed = body?.completed !== false;

  const progress = await db.lessonProgress.upsert({
    where: {
      lessonId_learnerId: {
        lessonId,
        learnerId: user.id,
      },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
      lastViewedAt: new Date(),
    },
    create: {
      lessonId,
      learnerId: user.id,
      completed,
      completedAt: completed ? new Date() : null,
      lastViewedAt: new Date(),
    },
  });

  return NextResponse.json({ progress }, { status: 201 });
}

