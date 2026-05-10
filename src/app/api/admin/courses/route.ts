import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, jsonError } from "@/lib/request-auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  if (user.role !== "ADMIN") {
    return jsonError("Only admins can inspect courses.", 403);
  }

  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  if (user.role !== "ADMIN") {
    return jsonError("Only admins can create courses.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | { title?: string; description?: string; type?: string }
    | null;

  const title = body?.title?.trim();
  const description = body?.description?.trim() ?? "";
  const type = body?.type?.trim() ?? "general";

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const baseSlug = slugify(title);
  const slugExists = await db.course.findUnique({
    where: { slug: baseSlug },
    select: { id: true },
  });

  const course = await db.course.create({
    data: {
      title,
      slug: slugExists ? `${baseSlug}-${Date.now()}` : baseSlug,
      description,
      type,
      status: "DRAFT",
      teacherId: user.id,
    },
  });

  return NextResponse.json(
    {
      success: true,
      action: "created",
      course,
    },
    { status: 201 },
  );
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  if (user.role !== "ADMIN") {
    return jsonError("Only admins can delete courses.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | { courseId?: string }
    | null;

  const courseId = body?.courseId?.trim();

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  await db.course.delete({
    where: { id: courseId },
  });

  return NextResponse.json({
    success: true,
    action: "deleted",
    courseId,
  });
}
