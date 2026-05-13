import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getManagedCommunity,
  getSessionUser,
  hasRole,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ communityId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!hasRole(user, ["OWNER", "ADMIN"])) {
    return jsonError("Only owners or admins can read evaluations.", 403);
  }

  const { communityId } = await params;
  const community = await getManagedCommunity(communityId, user);

  if (!community) {
    return jsonError("Community not found or not manageable by you.", 404);
  }

  const evaluations = await db.communityEvaluation.findMany({
    where: { communityId },
    orderBy: { createdAt: "desc" },
    include: {
      member: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json({ evaluations });
}

export async function POST(request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const { communityId } = await params;
  const membership = await db.communityMembership.findUnique({
    where: {
      communityId_memberId: {
        communityId,
        memberId: user.id,
      },
    },
  });

  if (membership?.status !== "ACTIVE") {
    return jsonError("You need community access before evaluating.", 403);
  }

  const body = (await request.json().catch(() => null)) as
    | { rating?: number; feedback?: string }
    | null;

  if (
    typeof body?.rating !== "number" ||
    !Number.isInteger(body.rating) ||
    body.rating < 0 ||
    body.rating > 20
  ) {
    return jsonError("rating must be an integer between 0 and 20.", 400);
  }

  const evaluation = await db.communityEvaluation.upsert({
    where: {
      communityId_memberId: {
        communityId,
        memberId: user.id,
      },
    },
    update: {
      rating: body.rating,
      feedback: body.feedback?.trim() || null,
    },
    create: {
      communityId,
      memberId: user.id,
      rating: body.rating,
      feedback: body.feedback?.trim() || null,
    },
  });

  return NextResponse.json({ evaluation }, { status: 201 });
}
