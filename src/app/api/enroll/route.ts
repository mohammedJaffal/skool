import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { courseId, userId } = body as { courseId: string; userId?: string };

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  // Fake enrollment — no DB write in Sprint 01
  return NextResponse.json({
    success: true,
    message: "Enrollment confirmed!",
    enrollmentId: `enroll_${Date.now()}`,
    courseId,
    userId: userId ?? "guest",
    enrolledAt: new Date().toISOString(),
  });
}
