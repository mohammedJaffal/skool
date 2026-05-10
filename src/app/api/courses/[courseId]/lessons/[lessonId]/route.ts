import { NextResponse } from "next/server";
import { getLessonDetailById } from "@/lib/platform-data";

type Params = { params: Promise<{ courseId: string; lessonId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { courseId, lessonId } = await params;
  const lesson = await getLessonDetailById(courseId, lessonId);

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  return NextResponse.json(lesson);
}
