import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CommunityMembersManager } from "@/components/owner/community-members-manager";

type MembersPageProps = {
  params: Promise<{ communityId: string }>;
};

export default async function CommunityMembersPage({ params }: MembersPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const { communityId } = await params;
  const community = await db.community.findUnique({
    where: { id: communityId },
  });

  if (!community) {
    notFound();
  }

  if (session.user.role !== "ADMIN" && community.ownerId !== session.user.id) {
    notFound();
  }

  const [memberships, invitations, communityJoinRequests, learnerOptions] =
    await Promise.all([
      db.communityMembership.findMany({
        where: { communityId: communityId },
        include: {
          member: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      db.communityInvitation.findMany({
        where: { communityId: communityId },
        include: {
          member: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      db.communityJoinRequest.findMany({
        where: { communityId: communityId },
        include: {
          member: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      db.user.findMany({
        where: {
          role: "MEMBER",
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      }),
    ]);

  return (
    <CommunityMembersManager
      communityId={community.id}
      communityTitle={community.title}
      memberships={memberships.map((membership) => ({
        memberId: membership.memberId,
        status: membership.status,
        member: membership.member,
      }))}
      invitations={invitations.map((invitation) => ({
        id: invitation.id,
        status: invitation.status,
        member: invitation.member,
      }))}
      joinRequests={communityJoinRequests.map((request) => ({
        id: request.id,
        status: request.status,
        member: request.member,
      }))}
      memberOptions={learnerOptions}
      entityLabel="community"
      inviteeLabel="member"
      invitationEndpoint={`/api/communities/${community.id}/invitations`}
      memberRemovalEndpointBase={`/api/communities/${community.id}/members`}
    />
  );
}
