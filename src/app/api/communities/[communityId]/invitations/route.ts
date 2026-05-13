import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getManagedCommunity,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ communityId: string }> };

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["OWNER", "ADMIN"])) {
    return jsonError("Only owners or admins can send invitations.", 403);
  }

  const { communityId } = await params;
  const community = await getManagedCommunity(communityId, user);

  if (!community) {
    return jsonError("Community not found or not manageable by you.", 404);
  }

  const body = (await request.json().catch(() => null)) as
    | { memberId?: string; email?: string }
    | null;

  let memberId = body?.memberId?.trim();

  if (!memberId && body?.email?.trim()) {
    const member = await db.user.findUnique({
      where: { email: body.email.trim().toLowerCase() },
      select: { id: true },
    });
    memberId = member?.id;
  }

  if (!memberId) {
    return jsonError("memberId or a valid email is required.", 400);
  }

  const existingMembership = await db.communityMembership.findUnique({
    where: {
      communityId_memberId: {
        communityId: communityId,
        memberId: memberId,
      },
    },
  });

  if (existingMembership?.status === "ACTIVE") {
    return jsonError("This member already has access to the community.", 400);
  }

  const existingInvitation = await db.communityInvitation.findFirst({
    where: {
      communityId: communityId,
      memberId: memberId,
      status: "PENDING",
    },
    orderBy: { sentAt: "desc" },
  });

  if (existingInvitation) {
    return jsonError("A pending invitation already exists for this member.", 400);
  }

  const invitation = await db.communityInvitation.create({
    data: {
      communityId: communityId,
      ownerId: user.id,
      memberId: memberId,
      status: "PENDING",
    },
  });

  return NextResponse.json({ invitation }, { status: 201 });
}
