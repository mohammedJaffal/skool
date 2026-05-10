import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, jsonError } from "@/lib/request-auth";

type Params = { params: Promise<{ userId: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (user?.role !== "ADMIN") {
    return jsonError("Only admins can delete users.", 403);
  }

  const { userId } = await params;

  if (userId === user.id) {
    return jsonError("Admin self-delete is blocked here.", 400);
  }

  await db.user.delete({
    where: { id: userId },
  });

  return NextResponse.json({ success: true, userId });
}

