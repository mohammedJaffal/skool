import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProgressWorkspace } from "@/components/progress/progress-workspace";

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const learnerMemberships = await db.communityMembership.findMany({
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

  const learnerCourses = await Promise.all(
    learnerMemberships.map(async (membership) => {
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
        totalLessons: membership.community.classroomItems.length,
        completed,
        percentage:
          membership.community.classroomItems.length > 0
            ? Math.round((completed / membership.community.classroomItems.length) * 100)
            : 0,
        classroomItems: membership.community.classroomItems.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          completed: progressMap.get(lesson.id) ?? false,
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

  const teacherCourses =
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
          ).map(async (course) => {
            const activeMemberships = await db.communityMembership.findMany({
              where: {
                communityId: course.id,
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

            const totalLessons = await db.classroomItem.count({
              where: { communityId: course.id },
            });

            const members = await Promise.all(
              activeMemberships.map(async (membership) => {
                const completed = await db.classroomItemProgress.count({
                  where: {
                    memberId: membership.memberId,
                    completed: true,
                    classroomItem: { communityId: course.id },
                  },
                });

                return {
                  memberId: membership.memberId,
                  memberName:
                    membership.member.name ??
                    membership.member.email?.split("@")[0] ??
                    "Member",
                  completed,
                  totalLessons,
                  percentage:
                    totalLessons > 0
                      ? Math.round((completed / totalLessons) * 100)
                      : 0,
                };
              }),
            );

            return {
              communityId: course.id,
              title: course.title,
              members,
            };
          }),
        )
      : [];

  return (
    <ProgressWorkspace
      learnerCourses={learnerCourses}
      teacherCourses={teacherCourses}
    />
  );
}
