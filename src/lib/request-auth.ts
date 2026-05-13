import type { Community as CommunityRecord, UserRole } from "@prisma/client";
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
      session.user.role === "ADMIN" || session.user.role === "OWNER"
        ? session.user.role
        : "MEMBER",
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

export async function getManagedCommunity(
  communityId: string,
  user: SessionUser,
): Promise<CommunityRecord | null> {
  const community = await db.community.findUnique({
    where: { id: communityId },
  });

  if (!community) {
    return null;
  }

  if (user.role === "ADMIN" || community.ownerId === user.id) {
    return community;
  }

  return null;
}

export async function hasActiveCommunityAccess(
  communityId: string,
  user: SessionUser,
) {
  if (user.role === "ADMIN") {
    return true;
  }

  const community = await db.community.findUnique({
    where: { id: communityId },
    select: { ownerId: true },
  });

  if (!community) {
    return false;
  }

  if (community.ownerId === user.id) {
    return true;
  }

  const membership = await db.communityMembership.findUnique({
    where: {
      communityId_memberId: {
        communityId: communityId,
        memberId: user.id,
      },
    },
    select: { status: true },
  });

  return membership?.status === "ACTIVE";
}

export async function getManagedCourse(
  communityId: string,
  user: SessionUser,
): Promise<CommunityRecord | null> {
  return getManagedCommunity(communityId, user);
}

export async function hasActiveCourseAccess(
  communityId: string,
  user: SessionUser,
) {
  return hasActiveCommunityAccess(communityId, user);
}
