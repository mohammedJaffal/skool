import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getManagedCommunity,
  getSessionUser,
  hasActiveCommunityAccess,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ communityId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const { communityId } = await params;
  const itemCount = await db.classroomItem.count({
    where: { communityId: communityId },
  });

  if (itemCount === 0) {
    return NextResponse.json({ totalClassroomItems: 0, progress: [] });
  }

  if (user.role === "OWNER" || user.role === "ADMIN") {
    const community = await getManagedCommunity(communityId, user);

    if (!community) {
      return jsonError("Community not found or not manageable by you.", 404);
    }

    const memberships = await db.communityMembership.findMany({
      where: {
        communityId: communityId,
        status: "ACTIVE",
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const progress = await Promise.all(
      memberships.map(async (membership) => {
        const completed = await db.classroomItemProgress.count({
          where: {
            memberId: membership.memberId,
            completed: true,
            classroomItem: {
              communityId: communityId,
            },
          },
        });

        return {
          memberId: membership.memberId,
          memberName:
            membership.member.name ??
            membership.member.email?.split("@")[0] ??
            "Member",
          completed,
          totalClassroomItems: itemCount,
          percentage: Math.round((completed / itemCount) * 100),
        };
      }),
    );

    return NextResponse.json({ totalClassroomItems: itemCount, progress });
  }

  if (!(await hasActiveCommunityAccess(communityId, user))) {
    return jsonError("You do not have access to this community.", 403);
  }

  const completed = await db.classroomItemProgress.count({
    where: {
      memberId: user.id,
      completed: true,
      classroomItem: {
        communityId: communityId,
      },
    },
  });

  return NextResponse.json({
    totalClassroomItems: itemCount,
    progress: {
      memberId: user.id,
      completed,
      percentage: Math.round((completed / itemCount) * 100),
    },
  });
}
