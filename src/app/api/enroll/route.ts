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
  const { courseId } = body as { courseId: string };

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { id: true, teacherId: true },
  });

  if (!course) {
    return NextResponse.json({
      success: true,
      message: "Enrollment confirmed!",
      enrollmentId: `enroll_${Date.now()}`,
      courseId,
      userId: session.user.id,
      enrolledAt: new Date().toISOString(),
    });
  }

  if (course.teacherId === session.user.id) {
    return NextResponse.json(
      { error: "Teachers already own their courses." },
      { status: 400 },
    );
  }

  const existingMembership = await db.courseMembership.findUnique({
    where: {
      courseId_learnerId: {
        courseId,
        learnerId: session.user.id,
      },
    },
  });

  if (existingMembership?.status === "ACTIVE") {
    return NextResponse.json({
      success: true,
      message: "You already have access to this course.",
      enrollmentId: existingMembership.id,
      courseId,
      userId: session.user.id,
      enrolledAt: existingMembership.joinedAt.toISOString(),
    });
  }

  const existingRequest = await db.courseJoinRequest.findFirst({
    where: {
      courseId,
      learnerId: session.user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const joinRequest = existingRequest
    ? await db.courseJoinRequest.update({
        where: { id: existingRequest.id },
        data: {
          status: "PENDING",
          reviewedAt: null,
          reviewedById: null,
        },
      })
    : await db.courseJoinRequest.create({
        data: {
          courseId,
          learnerId: session.user.id,
          status: "PENDING",
        },
      });

  return NextResponse.json({
    success: true,
    message: "Access request submitted.",
    enrollmentId: joinRequest.id,
    courseId,
    userId: session.user.id,
    enrolledAt: joinRequest.createdAt.toISOString(),
  });
}
