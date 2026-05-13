import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProgressWorkspace } from "@/components/progress/progress-workspace";

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const memberMemberships = await db.communityMembership.findMany({
    where: {
      memberId: session.user.id,
      status: "ACTIVE",
    },
    include: {
      community: {
        include: {
          classroomItems: {
            orderBy: { position: "asc" },
          },
          evaluations: {
            where: {
              memberId: session.user.id,
            },
          },
        },
      },
    },
  });

  const memberCommunities = await Promise.all(
    memberMemberships.map(async (membership) => {
      const progress = await db.classroomItemProgress.findMany({
        where: {
          memberId: session.user.id,
          classroomItem: {
            communityId: membership.communityId,
          },
        },
      });

      const progressMap = new Map(
        progress.map((item) => [item.classroomItemId, item.completed]),
      );
      const completed = progress.filter((item) => item.completed).length;

      return {
        communityId: membership.communityId,
        title: membership.community.title,
        totalClassroomItems: membership.community.classroomItems.length,
        completed,
        percentage:
          membership.community.classroomItems.length > 0
            ? Math.round((completed / membership.community.classroomItems.length) * 100)
            : 0,
        classroomItems: membership.community.classroomItems.map((item) => ({
          id: item.id,
          title: item.title,
          completed: progressMap.get(item.id) ?? false,
        })),
        evaluation: membership.community.evaluations[0]
          ? {
              rating: membership.community.evaluations[0].rating,
              feedback: membership.community.evaluations[0].feedback,
            }
          : null,
      };
    }),
  );

  const ownerCommunities =
    session.user.role === "OWNER" || session.user.role === "ADMIN"
      ? await Promise.all(
          (
            await db.community.findMany({
              where:
                session.user.role === "ADMIN"
                  ? undefined
                  : { ownerId: session.user.id },
              orderBy: { createdAt: "desc" },
            })
          ).map(async (community) => {
            const activeMemberships = await db.communityMembership.findMany({
              where: {
                communityId: community.id,
                status: "ACTIVE",
              },
              include: {
                member: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            });

            const totalClassroomItems = await db.classroomItem.count({
              where: { communityId: community.id },
            });

            const members = await Promise.all(
              activeMemberships.map(async (membership) => {
                const completed = await db.classroomItemProgress.count({
                  where: {
                    memberId: membership.memberId,
                    completed: true,
                    classroomItem: { communityId: community.id },
                  },
                });

                return {
                  memberId: membership.memberId,
                  memberName:
                    membership.member.name ??
                    membership.member.email?.split("@")[0] ??
                    "Member",
                  completed,
                  totalClassroomItems,
                  percentage:
                    totalClassroomItems > 0
                      ? Math.round((completed / totalClassroomItems) * 100)
                      : 0,
                };
              }),
            );

            return {
              communityId: community.id,
              title: community.title,
              members,
            };
          }),
        )
      : [];

  return (
    <ProgressWorkspace
      memberCommunities={memberCommunities}
      ownerCommunities={ownerCommunities}
    />
  );
}
