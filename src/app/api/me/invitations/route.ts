import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, jsonError } from "@/lib/request-auth";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const invitations = await db.courseInvitation.findMany({
    where: { learnerId: user.id },
    orderBy: { sentAt: "desc" },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      teacher: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({ invitations });
}

