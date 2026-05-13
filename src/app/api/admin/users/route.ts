import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, jsonError } from "@/lib/request-auth";

export async function GET(request: Request) {
  const user = await getSessionUser();

  if (user?.role !== "ADMIN") {
    return jsonError("Only admins can inspect users.", 403);
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();

  const users = await db.user.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      userProfile: true,
      _count: {
        select: {
          ownedCommunities: true,
          communityMemberships: true,
        },
      },
    },
  });

  return NextResponse.json({ users });
}
