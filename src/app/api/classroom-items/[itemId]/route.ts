import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClassroomItemDetailByIdGlobal } from "@/lib/platform-data";
import { getSessionUser, hasRole, jsonError } from "@/lib/request-auth";

type Params = { params: Promise<{ itemId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { itemId } = await params;
  const classroomItem = await getClassroomItemDetailByIdGlobal(itemId);

  if (!classroomItem) {
    return NextResponse.json(
      { error: "Classroom item not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(classroomItem);
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["OWNER", "ADMIN"])) {
    return jsonError("Only owners or admins can update classroom items.", 403);
  }

  const { itemId } = await params;
  const classroomItem = await db.classroomItem.findUnique({
    where: { id: itemId },
    include: {
      community: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  if (!classroomItem) {
    return jsonError("Classroom item not found.", 404);
  }

  if (user.role !== "ADMIN" && classroomItem.community.ownerId !== user.id) {
    return jsonError("You cannot update this classroom item.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | {
        title?: string;
        content?: string;
        contentType?: string;
        position?: number;
      }
    | null;

  const updated = await db.classroomItem.update({
    where: { id: classroomItem.id },
    data: {
      title: body?.title?.trim() || undefined,
      content: body?.content?.trim() || undefined,
      contentType: body?.contentType?.trim() || undefined,
      position:
        typeof body?.position === "number" && body.position > 0
          ? body.position
          : undefined,
    },
  });

  return NextResponse.json({ classroomItem: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["OWNER", "ADMIN"])) {
    return jsonError("Only owners or admins can delete classroom items.", 403);
  }

  const { itemId } = await params;
  const classroomItem = await db.classroomItem.findUnique({
    where: { id: itemId },
    include: {
      community: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  if (!classroomItem) {
    return jsonError("Classroom item not found.", 404);
  }

  if (user.role !== "ADMIN" && classroomItem.community.ownerId !== user.id) {
    return jsonError("You cannot delete this classroom item.", 403);
  }

  await db.classroomItem.delete({
    where: { id: classroomItem.id },
  });

  return NextResponse.json({ success: true, itemId: classroomItem.id });
}
