import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, jsonError } from "@/lib/request-auth";

type Params = { params: Promise<{ courseId: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (user?.role !== "ADMIN") {
    return jsonError("Only admins can delete courses.", 403);
  }

  const { courseId } = await params;
  await db.course.delete({
    where: { id: courseId },
  });

  return NextResponse.json({ success: true, courseId });
}
