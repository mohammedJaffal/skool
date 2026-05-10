import { auth } from "@/auth";
import { db } from "@/lib/db";
import { InvitationsWorkspace } from "@/components/invitations/invitations-workspace";
import { listCourseCards } from "@/lib/platform-data";

export default async function InvitationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const [invitations, joinRequests, memberships, courses] = await Promise.all([
    db.courseInvitation.findMany({
      where: { learnerId: session.user.id },
      orderBy: { sentAt: "desc" },
      include: {
        course: { select: { id: true, title: true } },
        teacher: { select: { name: true, email: true } },
      },
    }),
    db.courseJoinRequest.findMany({
      where: { learnerId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    db.courseMembership.findMany({
      where: { learnerId: session.user.id, status: "ACTIVE" },
      select: { courseId: true },
    }),
    listCourseCards(),
  ]);

  return (
    <InvitationsWorkspace
      invitations={invitations}
      joinRequests={joinRequests}
      activeCourseIds={memberships.map((membership) => membership.courseId)}
      courses={courses.map((course) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        lessonCount: course.lessonCount,
      }))}
    />
  );
}

