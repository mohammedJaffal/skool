import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CourseMembersManager } from "@/components/courses/course-members-manager";

type MembersPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function MembersPage({ params }: MembersPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const { courseId } = await params;
  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    notFound();
  }

  if (
    session.user.role !== "ADMIN" &&
    course.teacherId !== session.user.id
  ) {
    notFound();
  }

  const [memberships, invitations, joinRequests, learnerOptions] =
    await Promise.all([
      db.courseMembership.findMany({
        where: { courseId },
        include: {
          learner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      db.courseInvitation.findMany({
        where: { courseId },
        include: {
          learner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      db.courseJoinRequest.findMany({
        where: { courseId },
        include: {
          learner: {
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
          role: "LEARNER",
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      }),
    ]);

  return (
    <CourseMembersManager
      courseId={course.id}
      courseTitle={course.title}
      memberships={memberships.map((membership) => ({
        learnerId: membership.learnerId,
        status: membership.status,
        learner: membership.learner,
      }))}
      invitations={invitations.map((invitation) => ({
        id: invitation.id,
        status: invitation.status,
        learner: invitation.learner,
      }))}
      joinRequests={joinRequests.map((request) => ({
        id: request.id,
        status: request.status,
        learner: request.learner,
      }))}
      learnerOptions={learnerOptions}
    />
  );
}
