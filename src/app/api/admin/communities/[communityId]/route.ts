import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, jsonError } from "@/lib/request-auth";

type Params = { params: Promise<{ communityId: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (user?.role !== "ADMIN") {
    return jsonError("Only admins can delete communities.", 403);
  }

  const { communityId } = await params;
  await db.community.delete({
    where: { id: communityId },
  });

  return NextResponse.json({ success: true, communityId });
}
