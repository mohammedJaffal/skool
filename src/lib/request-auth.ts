import type { Course, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export type SessionUser = {
  id: string;
  role: UserRole;
  email?: string | null;
  name?: string | null;
};

export function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    role:
      session.user.role === "ADMIN" || session.user.role === "TEACHER"
        ? session.user.role
        : "LEARNER",
    email: session.user.email,
    name: session.user.name,
  };
}

export function hasRole(
  user: SessionUser | null,
  roles: UserRole[],
): user is SessionUser {
  return Boolean(user && roles.includes(user.role));
}

export async function getManagedCourse(
  courseId: string,
  user: SessionUser,
): Promise<Course | null> {
  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return null;
  }

  if (user.role === "ADMIN" || course.teacherId === user.id) {
    return course;
  }

  return null;
}

export async function hasActiveCourseAccess(
  courseId: string,
  user: SessionUser,
) {
  if (user.role === "ADMIN") {
    return true;
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { teacherId: true },
  });

  if (!course) {
    return false;
  }

  if (course.teacherId === user.id) {
    return true;
  }

  const membership = await db.courseMembership.findUnique({
    where: {
      courseId_learnerId: {
        courseId,
        learnerId: user.id,
      },
    },
    select: { status: true },
  });

  return membership?.status === "ACTIVE";
}
