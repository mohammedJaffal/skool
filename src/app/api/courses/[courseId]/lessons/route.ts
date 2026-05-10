import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getManagedCourse,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";
import { getCourseDetailById } from "@/lib/platform-data";

type Params = { params: Promise<{ courseId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { courseId } = await params;
  const course = await getCourseDetailById(courseId);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({
    courseId,
    title: course.title,
    lessons: course.lessons,
  });
}

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["TEACHER", "ADMIN"])) {
    return jsonError("Only teachers or admins can create lessons.", 403);
  }

  const { courseId } = await params;
  const course = await getManagedCourse(courseId, user);

  if (!course) {
    return jsonError("Course not found or not manageable by you.", 404);
  }

  const body = (await request.json().catch(() => null)) as
    | {
        title?: string;
        content?: string;
        contentType?: string;
        position?: number;
      }
    | null;

  const title = body?.title?.trim();
  const content = body?.content?.trim();

  if (!title || !content) {
    return jsonError("title and content are required.", 400);
  }

  const maxPosition =
    (
      await db.lesson.aggregate({
        where: { courseId },
        _max: { position: true },
      })
    )._max.position ?? 0;

  const lesson = await db.lesson.create({
    data: {
      courseId,
      title,
      content,
      contentType: body?.contentType?.trim() || "lesson",
      position:
        typeof body?.position === "number" && body.position > 0
          ? body.position
          : maxPosition + 1,
    },
  });

  return NextResponse.json({ lesson }, { status: 201 });
}
