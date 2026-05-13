import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listCommunityCards } from "@/lib/platform-data";
import { getSessionUser, hasRole, jsonError } from "@/lib/request-auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function GET() {
  return NextResponse.json(await listCommunityCards());
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!hasRole(user, ["OWNER", "ADMIN"])) {
    return jsonError("Only owners or admins can create communities.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | {
        title?: string;
        description?: string;
        type?: string;
        documents?: { label?: string; url?: string }[];
      }
    | null;

  const title = body?.title?.trim();
  const description = body?.description?.trim();
  const type = body?.type?.trim() || "general";
  const documents =
    body?.documents
      ?.map((document) => ({
        label: document.label?.trim() || "",
        url: document.url?.trim() || "",
      }))
      .filter((document) => document.label && document.url) ?? [];

  if (!title || !description) {
    return jsonError("title and description are required.", 400);
  }

  const baseSlug = slugify(title);
  const candidate = await db.community.findUnique({
    where: { slug: baseSlug },
    select: { id: true },
  });

  const slug = candidate ? `${baseSlug}-${Date.now()}` : baseSlug;

  const community = await db.community.create({
    data: {
      title,
      slug,
      description,
      type,
      status: "DRAFT",
      ownerId: user.id,
      documents: documents.length ? { create: documents } : undefined,
    },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      documents: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          classroomItems: true,
          documents: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      community: {
        id: community.id,
        slug: community.slug,
        title: community.title,
        description: community.description,
        ownerName:
          community.owner.name ??
          community.owner.email?.split("@")[0] ??
          "Campus Digital",
        level: type
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase()),
        duration: community._count.classroomItems
          ? `${community._count.classroomItems} classroom items`
          : "No classroom items yet",
        price: 0,
        type: community.type,
        status: community.status,
        lessonCount: community._count.classroomItems,
        classroomItemCount: community._count.classroomItems,
        documents: community.documents.map((document) => ({
          id: document.id,
          label: document.label,
          url: document.url,
        })),
        documentCount: community._count.documents,
      },
    },
    { status: 201 },
  );
}
