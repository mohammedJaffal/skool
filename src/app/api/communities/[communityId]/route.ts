import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCommunityDetailById } from "@/lib/platform-data";
import {
  getManagedCommunity,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ communityId: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { communityId } = await params;
  const community = await getCommunityDetailById(communityId);

  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  return NextResponse.json(community);
}

export async function PATCH(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["OWNER", "ADMIN"])) {
    return jsonError("Only owners or admins can update communities.", 403);
  }

  const { communityId } = await params;
  const community = await getManagedCommunity(communityId, user);

  if (!community) {
    return jsonError("Community not found or not manageable by you.", 404);
  }

  const body = (await request.json().catch(() => null)) as
    | {
        title?: string;
        description?: string;
        type?: string;
        status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
        documents?: { label?: string; url?: string }[];
      }
    | null;

  const documents =
    body?.documents
      ?.map((document) => ({
        label: document.label?.trim() || "",
        url: document.url?.trim() || "",
      }))
      .filter((document) => document.label && document.url) ?? null;

  const updated = await db.community.update({
    where: { id: community.id },
    data: {
      title: body?.title?.trim() || undefined,
      description: body?.description?.trim() || undefined,
      type: body?.type?.trim() || undefined,
      status: body?.status,
      documents: documents
        ? {
            deleteMany: {},
            create: documents,
          }
        : undefined,
    },
    include: {
      documents: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return NextResponse.json({ community: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["OWNER", "ADMIN"])) {
    return jsonError("Only owners or admins can delete communities.", 403);
  }

  const { communityId } = await params;
  const community = await getManagedCommunity(communityId, user);

  if (!community) {
    return jsonError("Community not found or not manageable by you.", 404);
  }

  await db.community.delete({
    where: { id: community.id },
  });

  return NextResponse.json({ success: true, communityId: community.id });
}
