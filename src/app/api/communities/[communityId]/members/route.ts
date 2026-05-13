import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getManagedCommunity,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ communityId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["OWNER", "ADMIN"])) {
    return jsonError("Only owners or admins can inspect community members.", 403);
  }

  const { communityId } = await params;
  const community = await getManagedCommunity(communityId, user);

  if (!community) {
    return jsonError("Community not found or not manageable by you.", 404);
  }

  const [memberships, invitations, communityJoinRequests] = await Promise.all([
    db.communityMembership.findMany({
      where: { communityId: communityId },
      orderBy: { joinedAt: "desc" },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    db.communityInvitation.findMany({
      where: { communityId: communityId },
      orderBy: { sentAt: "desc" },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    db.communityJoinRequest.findMany({
      where: { communityId: communityId },
      orderBy: { createdAt: "desc" },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    memberships,
    invitations,
    communityJoinRequests,
  });
}
