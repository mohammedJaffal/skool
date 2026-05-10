import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getManagedCourse,
  getSessionUser,
  hasActiveCourseAccess,
  jsonError,
} from "@/lib/request-auth";

type Params = { params: Promise<{ courseId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const user = await getSessionUser();

  if (!user) {
    return jsonError("You must be signed in.", 401);
  }

  const { courseId } = await params;
  const lessonCount = await db.lesson.count({
    where: { courseId },
  });

  if (lessonCount === 0) {
    return NextResponse.json({ totalLessons: 0, progress: [] });
  }

  if (user.role === "TEACHER" || user.role === "ADMIN") {
    const course = await getManagedCourse(courseId, user);

    if (!course) {
      return jsonError("Course not found or not manageable by you.", 404);
    }

    const memberships = await db.courseMembership.findMany({
      where: {
        courseId,
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

    const progress = await Promise.all(
      memberships.map(async (membership) => {
        const completed = await db.lessonProgress.count({
          where: {
            learnerId: membership.learnerId,
            completed: true,
            lesson: {
              courseId,
            },
          },
        });

        return {
          learnerId: membership.learnerId,
          learnerName:
            membership.learner.name ??
            membership.learner.email?.split("@")[0] ??
            "Learner",
          completed,
          totalLessons: lessonCount,
          percentage: Math.round((completed / lessonCount) * 100),
        };
      }),
    );

    return NextResponse.json({ totalLessons: lessonCount, progress });
  }

  if (!(await hasActiveCourseAccess(courseId, user))) {
    return jsonError("You do not have access to this course.", 403);
  }

  const completed = await db.lessonProgress.count({
    where: {
      learnerId: user.id,
      completed: true,
      lesson: {
        courseId,
      },
    },
  });

  return NextResponse.json({
    totalLessons: lessonCount,
    progress: {
      learnerId: user.id,
      completed,
      percentage: Math.round((completed / lessonCount) * 100),
    },
  });
}
