import { auth } from "@/auth";
import { db } from "@/lib/db";
import { InvitationsWorkspace } from "@/components/invitations/invitations-workspace";
import { listCommunityCards } from "@/lib/platform-data";

export default async function InvitationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const [invitations, communityJoinRequests, memberships, communities] = await Promise.all([
    db.communityInvitation.findMany({
      where: { memberId: session.user.id },
      orderBy: { sentAt: "desc" },
      include: {
        community: { select: { id: true, title: true } },
        owner: { select: { name: true, email: true } },
      },
    }),
    db.communityJoinRequest.findMany({
      where: { memberId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    db.communityMembership.findMany({
      where: { memberId: session.user.id, status: "ACTIVE" },
      select: { communityId: true },
    }),
    listCommunityCards(),
  ]);

  return (
    <InvitationsWorkspace
      invitations={invitations.map((invitation) => ({
        id: invitation.id,
        status: invitation.status,
        community: invitation.community,
        owner: invitation.owner,
      }))}
      communityJoinRequests={communityJoinRequests}
      activeCommunityIds={memberships.map((membership) => membership.communityId)}
      communities={communities.map((community) => ({
        id: community.id,
        title: community.title,
        description: community.description,
        classroomItemCount: community.classroomItemCount,
        isFree: community.price === 0,
      }))}
  />
  );
}
