import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProgressWorkspace } from "@/components/progress/progress-workspace";

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const learnerMemberships = await db.courseMembership.findMany({
    where: {
      learnerId: session.user.id,
      status: "ACTIVE",
    },
    include: {
      course: {
        include: {
          lessons: {
            orderBy: { position: "asc" },
          },
          evaluations: {
            where: {
              learnerId: session.user.id,
            },
          },
        },
      },
    },
  });

  const learnerCourses = await Promise.all(
    learnerMemberships.map(async (membership) => {
      const progress = await db.lessonProgress.findMany({
        where: {
          learnerId: session.user.id,
          lesson: {
            courseId: membership.courseId,
          },
        },
      });

      const progressMap = new Map(
        progress.map((item) => [item.lessonId, item.completed]),
      );
      const completed = progress.filter((item) => item.completed).length;

      return {
        courseId: membership.courseId,
        title: membership.course.title,
        totalLessons: membership.course.lessons.length,
        completed,
        percentage:
          membership.course.lessons.length > 0
            ? Math.round((completed / membership.course.lessons.length) * 100)
            : 0,
        lessons: membership.course.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          completed: progressMap.get(lesson.id) ?? false,
        })),
        evaluation: membership.course.evaluations[0]
          ? {
              rating: membership.course.evaluations[0].rating,
              feedback: membership.course.evaluations[0].feedback,
            }
          : null,
      };
    }),
  );

  const teacherCourses =
    session.user.role === "TEACHER" || session.user.role === "ADMIN"
      ? await Promise.all(
          (
            await db.course.findMany({
              where:
                session.user.role === "ADMIN"
                  ? undefined
                  : { teacherId: session.user.id },
              orderBy: { createdAt: "desc" },
            })
          ).map(async (course) => {
            const activeMemberships = await db.courseMembership.findMany({
              where: {
                courseId: course.id,
                status: "ACTIVE",
              },
              include: {
                learner: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            });

            const totalLessons = await db.lesson.count({
              where: { courseId: course.id },
            });

            const learners = await Promise.all(
              activeMemberships.map(async (membership) => {
                const completed = await db.lessonProgress.count({
                  where: {
                    learnerId: membership.learnerId,
                    completed: true,
                    lesson: { courseId: course.id },
                  },
                });

                return {
                  learnerId: membership.learnerId,
                  learnerName:
                    membership.learner.name ??
                    membership.learner.email?.split("@")[0] ??
                    "Learner",
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
              courseId: course.id,
              title: course.title,
              learners,
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

