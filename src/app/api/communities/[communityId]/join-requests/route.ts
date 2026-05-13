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
    return jsonError("Only owners or admins can read join requests.", 403);
  }

  const { communityId } = await params;
  const community = await getManagedCommunity(communityId, user);

  if (!community) {
    return jsonError("Community not found or not manageable by you.", 404);
  }

  const requests = await db.communityJoinRequest.findMany({
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
  });

  return NextResponse.json({ requests });
}

export async function POST(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const { communityId } = await params;
  const community = await db.community.findUnique({
    where: { id: communityId },
    select: { id: true, title: true, ownerId: true },
  });

  if (!community) {
    return jsonError("Community not found.", 404);
  }

  const membership = await db.communityMembership.findUnique({
    where: {
      communityId_memberId: {
        communityId: communityId,
        memberId: user.id,
      },
    },
  });

  if (membership?.status === "ACTIVE") {
    return jsonError("You already have access to this community.", 400);
  }

  if (community.ownerId === user.id) {
    return jsonError("You already own this community.", 400);
  }

  const activeInvitation = await db.communityInvitation.findFirst({
    where: {
      communityId,
      memberId: user.id,
      status: "PENDING",
    },
    orderBy: { sentAt: "desc" },
  });

  if (activeInvitation) {
    const acceptedMembership = membership
      ? await db.communityMembership.update({
          where: { id: membership.id },
          data: {
            status: "ACTIVE",
            endedAt: null,
            joinedAt: membership.joinedAt ?? new Date(),
          },
        })
      : await db.communityMembership.create({
          data: {
            communityId,
            memberId: user.id,
            status: "ACTIVE",
          },
        });

    return NextResponse.json(
      { membership: acceptedMembership, joined: true, source: "invitation" },
      { status: 201 },
    );
  }

  const directMembership = membership
    ? await db.communityMembership.update({
        where: { id: membership.id },
        data: {
          status: "ACTIVE",
          endedAt: null,
          joinedAt: membership.joinedAt ?? new Date(),
        },
      })
    : await db.communityMembership.create({
        data: {
          communityId,
          memberId: user.id,
          status: "ACTIVE",
        },
      });

  return NextResponse.json(
    { membership: directMembership, joined: true, source: "public_free" },
    { status: 201 },
  );
}
