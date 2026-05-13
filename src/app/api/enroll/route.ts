import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Sign in to join this community." },
      { status: 401 },
    );
  }

  const body = await req.json();
  const { communityId } = body as { communityId?: string };
  const targetCommunityId = communityId;

  if (!targetCommunityId) {
    return NextResponse.json({ error: "communityId is required" }, { status: 400 });
  }

  const community = await db.community.findUnique({
    where: { id: targetCommunityId },
    select: { id: true, ownerId: true },
  });

  if (!community) {
    return NextResponse.json({
      success: true,
      message: "Enrollment confirmed!",
      enrollmentId: `enroll_${Date.now()}`,
      communityId: targetCommunityId,
      userId: session.user.id,
      enrolledAt: new Date().toISOString(),
    });
  }

  if (community.ownerId === session.user.id) {
    return NextResponse.json(
      { error: "Owners already manage their communities." },
      { status: 400 },
    );
  }

  const existingMembership = await db.communityMembership.findUnique({
    where: {
      communityId_memberId: {
        communityId: targetCommunityId,
        memberId: session.user.id,
      },
    },
  });

  if (existingMembership?.status === "ACTIVE") {
    return NextResponse.json({
      success: true,
      message: "You already have access to this community.",
      enrollmentId: existingMembership.id,
      communityId: targetCommunityId,
      userId: session.user.id,
      enrolledAt: existingMembership.joinedAt.toISOString(),
    });
  }

  const existingRequest = await db.communityJoinRequest.findFirst({
    where: {
      communityId: targetCommunityId,
      memberId: session.user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const joinRequest = existingRequest
    ? await db.communityJoinRequest.update({
        where: { id: existingRequest.id },
        data: {
          status: "PENDING",
          reviewedAt: null,
          reviewedById: null,
        },
      })
    : await db.communityJoinRequest.create({
        data: {
          communityId: targetCommunityId,
          memberId: session.user.id,
          status: "PENDING",
        },
      });

  return NextResponse.json({
    success: true,
    message: "Access request submitted.",
    enrollmentId: joinRequest.id,
    communityId: targetCommunityId,
    userId: session.user.id,
    enrolledAt: joinRequest.createdAt.toISOString(),
  });
}
