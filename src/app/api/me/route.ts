import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser, jsonError } from "@/lib/request-auth";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const record = await db.user.findUnique({
    where: { id: user.id },
    include: {
      teacherProfile: true,
      learnerProfile: true,
    },
  });

  if (!record) {
    return jsonError("User not found.", 404);
  }

  return NextResponse.json({ user: record });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const body = (await request.json().catch(() => null)) as
    | {
        name?: string;
        bio?: string;
        specialty?: string;
        track?: string;
      }
    | null;

  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      name: body?.name?.trim() || undefined,
      teacherProfile:
        user.role === "TEACHER"
          ? {
              upsert: {
                create: {
                  specialty: body?.specialty?.trim() || "General teaching",
                  bio: body?.bio?.trim() || null,
                },
                update: {
                  specialty: body?.specialty?.trim() || undefined,
                  bio: body?.bio?.trim() || undefined,
                },
              },
            }
          : undefined,
      learnerProfile:
        user.role === "LEARNER"
          ? {
              upsert: {
                create: {
                  track: body?.track?.trim() || "General learner path",
                  bio: body?.bio?.trim() || null,
                },
                update: {
                  track: body?.track?.trim() || undefined,
                  bio: body?.bio?.trim() || undefined,
                },
              },
            }
          : undefined,
    },
    include: {
      teacherProfile: true,
      learnerProfile: true,
    },
  });

  return NextResponse.json({ user: updated });
}

export async function DELETE() {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  await db.user.delete({
    where: { id: user.id },
  });

  return NextResponse.json({ success: true });
}

