import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getCourseDetailById,
  listAnnouncementsByCourseId,
} from "@/lib/platform-data";
import {
  getManagedCourse,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";

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
    announcements: await listAnnouncementsByCourseId(courseId),
  });
}

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["TEACHER", "ADMIN"])) {
    return jsonError("Only teachers or admins can publish announcements.", 403);
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
        status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
      }
    | null;

  const title = body?.title?.trim();
  const content = body?.content?.trim();

  if (!title || !content) {
    return jsonError("title and content are required.", 400);
  }

  const announcement = await db.announcement.create({
    data: {
      courseId,
      authorId: user.id,
      title,
      content,
      status: body?.status ?? "PUBLISHED",
      publishedAt:
        body?.status === "DRAFT" ? null : new Date(),
    },
  });

  return NextResponse.json({ announcement }, { status: 201 });
}
