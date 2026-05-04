import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { courseId } = (await req.json()) as { courseId: string };
  await new Promise((r) => setTimeout(r, 800));
  return NextResponse.json({
    enrollmentId: `ENR-${courseId}-${Date.now()}`,
  });
}
