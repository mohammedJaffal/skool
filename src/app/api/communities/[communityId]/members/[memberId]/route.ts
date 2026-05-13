import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getManagedCommunity,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ communityId: string; memberId: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["OWNER", "ADMIN"])) {
    return jsonError("Only owners or admins can remove community members.", 403);
  }

  const { communityId, memberId } = await params;
  const community = await getManagedCommunity(communityId, user);

  if (!community) {
    return jsonError("Community not found or not manageable by you.", 404);
  }

  const membership = await db.communityMembership.findUnique({
    where: {
      communityId_memberId: {
        communityId: communityId,
        memberId: memberId,
      },
    },
  });

  if (!membership) {
    return jsonError("Membership not found.", 404);
  }

  const updated = await db.communityMembership.update({
    where: { id: membership.id },
    data: {
      status: "REMOVED",
      endedAt: new Date(),
    },
  });

  return NextResponse.json({ membership: updated });
}
