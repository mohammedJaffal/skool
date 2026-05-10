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

  return NextResponse.json(course);
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["TEACHER", "ADMIN"])) {
    return jsonError("Only teachers or admins can update courses.", 403);
  }

  const { courseId } = await params;
  const course = await getManagedCourse(courseId, user);

  if (!course) {
    return jsonError("Course not found or not manageable by you.", 404);
  }

  const body = (await request.json().catch(() => null)) as
    | {
        title?: string;
        description?: string;
        type?: string;
        status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      }
    | null;

  const updated = await db.course.update({
    where: { id: course.id },
    data: {
      title: body?.title?.trim() || undefined,
      description: body?.description?.trim() || undefined,
      type: body?.type?.trim() || undefined,
      status: body?.status,
    },
  });

  return NextResponse.json({ course: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["TEACHER", "ADMIN"])) {
    return jsonError("Only teachers or admins can delete courses.", 403);
  }

  const { courseId } = await params;
  const course = await getManagedCourse(courseId, user);

  if (!course) {
    return jsonError("Course not found or not manageable by you.", 404);
  }

  await db.course.delete({
    where: { id: course.id },
  });

  return NextResponse.json({ success: true, courseId: course.id });
}
