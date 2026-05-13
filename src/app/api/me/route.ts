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
      userProfile: true,
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
        birthDate?: string;
        bio?: string;
        specialty?: string;
        track?: string;
      }
    | null;

  const updated = await db.user.update({
    where: { id: user.id },
    data: {
      name: body?.name?.trim() || undefined,
      birthDate: body?.birthDate?.trim()
        ? new Date(body.birthDate)
        : body?.birthDate === ""
          ? null
          : undefined,
      userProfile: {
        upsert: {
          create: {
            specialty:
              user.role === "OWNER"
                ? body?.specialty?.trim() || "General community leadership"
                : null,
            track:
              user.role === "MEMBER"
                ? body?.track?.trim() || "General member path"
                : null,
            bio: body?.bio?.trim() || null,
          },
          update: {
            specialty:
              user.role === "OWNER" ? body?.specialty?.trim() || null : undefined,
            track:
              user.role === "MEMBER" ? body?.track?.trim() || null : undefined,
            bio: body?.bio?.trim() || null,
          },
        },
      },
    },
    include: {
      userProfile: true,
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
