import { NextRequest, NextResponse } from "next/server";

interface AdminCourse {
  id: string;
  title: string;
  description: string;
}

const courses: AdminCourse[] = [];

export async function GET() {
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const { title, description } = (await req.json()) as {
    title: string;
    description: string;
  };
  const course: AdminCourse = { id: `c-${Date.now()}`, title, description };
  courses.push(course);
  return NextResponse.json(course);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const idx = courses.findIndex((c) => c.id === id);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  courses.splice(idx, 1);
  return NextResponse.json({ ok: true });
}
