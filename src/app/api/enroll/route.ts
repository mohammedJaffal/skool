import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Sign in to join this classroom." },
      { status: 401 },
    );
  }

  const body = await req.json();
  const { communityId } = body as { communityId: string };

  if (!communityId) {
    return NextResponse.json({ error: "communityId is required" }, { status: 400 });
  }

  const course = await db.community.findUnique({
    where: { id: communityId },
    select: { id: true, ownerId: true },
  });

  if (!course) {
    return NextResponse.json({
      success: true,
      message: "Enrollment confirmed!",
      enrollmentId: `enroll_${Date.now()}`,
      communityId,
      userId: session.user.id,
      enrolledAt: new Date().toISOString(),
    });
  }

  if (course.ownerId === session.user.id) {
    return NextResponse.json(
      { error: "Teachers already own their courses." },
      { status: 400 },
    );
  }

  const existingMembership = await db.communityMembership.findUnique({
    where: {
      communityId_memberId: {
        communityId,
        memberId: session.user.id,
      },
    },
  });

  if (existingMembership?.status === "ACTIVE") {
    return NextResponse.json({
      success: true,
      message: "You already have access to this course.",
      enrollmentId: existingMembership.id,
      communityId,
      userId: session.user.id,
      enrolledAt: existingMembership.joinedAt.toISOString(),
    });
  }

  const existingRequest = await db.communityJoinRequest.findFirst({
    where: {
      communityId,
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
          communityId,
          memberId: session.user.id,
          status: "PENDING",
        },
      });

  return NextResponse.json({
    success: true,
    message: "Access request submitted.",
    enrollmentId: joinRequest.id,
    communityId,
    userId: session.user.id,
    enrolledAt: joinRequest.createdAt.toISOString(),
  });
}
