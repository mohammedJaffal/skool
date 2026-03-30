import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { title?: string }
    | null;

  if (!body?.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  return NextResponse.json(
    { success: true, action: "created", title: body.title },
    { status: 201 },
  );
}

export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { courseId?: string }
    | null;

  if (!body?.courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  return NextResponse.json({ success: true, action: "deleted", courseId: body.courseId });
}
