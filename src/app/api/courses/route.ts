import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";
import { listCourseCards } from "@/lib/platform-data";

export async function GET() {
  return NextResponse.json(await listCourseCards());
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!hasRole(user, ["TEACHER", "ADMIN"])) {
    return jsonError("Only teachers or admins can create courses.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | {
        title?: string;
        description?: string;
        type?: string;
      }
    | null;

  const title = body?.title?.trim();
  const description = body?.description?.trim();
  const type = body?.type?.trim() || "general";

  if (!title || !description) {
    return jsonError("title and description are required.", 400);
  }

  const baseSlug = slugify(title);
  const candidate = await db.course.findUnique({
    where: { slug: baseSlug },
    select: { id: true },
  });

  const slug = candidate ? `${baseSlug}-${Date.now()}` : baseSlug;

  const course = await db.course.create({
    data: {
      title,
      slug,
      description,
      type,
      status: "DRAFT",
      teacherId: user.id,
    },
    include: {
      teacher: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        instructor:
          course.teacher.name ??
          course.teacher.email?.split("@")[0] ??
          "Campus Digital",
        level: type
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase()),
        duration: course._count.lessons
          ? `${course._count.lessons} lessons`
          : "No lessons yet",
        price: 0,
        type: course.type,
        status: course.status,
        lessonCount: course._count.lessons,
      },
    },
    { status: 201 },
  );
}
