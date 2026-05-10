import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, jsonError } from "@/lib/request-auth";

export async function GET() {
  const user = await getSessionUser();

  if (user?.role !== "ADMIN") {
    return jsonError("Only admins can inspect users.", 403);
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      teacherProfile: true,
      learnerProfile: true,
      _count: {
        select: {
          coursesOwned: true,
          courseMemberships: true,
        },
      },
    },
  });

  return NextResponse.json({ users });
}

