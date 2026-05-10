import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";
import { getLessonDetailByIdGlobal } from "@/lib/platform-data";

type Params = { params: Promise<{ lessonId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { lessonId } = await params;
  const lesson = await getLessonDetailByIdGlobal(lessonId);

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json(lesson);
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["TEACHER", "ADMIN"])) {
    return jsonError("Only teachers or admins can update lessons.", 403);
  }

  const { lessonId } = await params;
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: {
        select: {
          teacherId: true,
        },
      },
    },
  });

  if (!lesson) {
    return jsonError("Lesson not found.", 404);
  }

  if (user.role !== "ADMIN" && lesson.course.teacherId !== user.id) {
    return jsonError("You cannot update this lesson.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | {
        title?: string;
        content?: string;
        contentType?: string;
        position?: number;
      }
    | null;

  const updated = await db.lesson.update({
    where: { id: lesson.id },
    data: {
      title: body?.title?.trim() || undefined,
      content: body?.content?.trim() || undefined,
      contentType: body?.contentType?.trim() || undefined,
      position:
        typeof body?.position === "number" && body.position > 0
          ? body.position
          : undefined,
    },
  });

  return NextResponse.json({ lesson: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["TEACHER", "ADMIN"])) {
    return jsonError("Only teachers or admins can delete lessons.", 403);
  }

  const { lessonId } = await params;
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: {
        select: {
          teacherId: true,
        },
      },
    },
  });

  if (!lesson) {
    return jsonError("Lesson not found.", 404);
  }

  if (user.role !== "ADMIN" && lesson.course.teacherId !== user.id) {
    return jsonError("You cannot delete this lesson.", 403);
  }

  await db.lesson.delete({
    where: { id: lesson.id },
  });

  return NextResponse.json({ success: true, lessonId: lesson.id });
}
