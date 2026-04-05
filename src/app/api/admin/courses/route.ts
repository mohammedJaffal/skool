import { NextResponse } from "next/server";
import { auth } from "@/auth";

function deny(status: 401 | 403, error: string) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return deny(401, "You must be signed in.");
  }

  if (session.user.role !== "ADMIN") {
    return deny(403, "Only admins can create courses.");
  }

  const body = (await request.json().catch(() => null)) as
    | { title?: string; description?: string }
    | null;

  const title = body?.title?.trim();
  const description = body?.description?.trim() ?? "";

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  return NextResponse.json(
    {
      success: true,
      action: "created",
      course: {
        id: crypto.randomUUID(),
        title,
        description,
      },
    },
    { status: 201 },
  );
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return deny(401, "You must be signed in.");
  }

  if (session.user.role !== "ADMIN") {
    return deny(403, "Only admins can delete courses.");
  }

  const body = (await request.json().catch(() => null)) as
    | { courseId?: string }
    | null;

  const courseId = body?.courseId?.trim();

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    action: "deleted",
    courseId,
  });
}
