import { db } from "@/lib/db";
import {
  ANNOUNCEMENTS,
  COURSES,
  getAnnouncementById,
  getCourseById,
  getLessonById,
  getLessonByIdGlobal,
} from "@/lib/mock-data";

export type CourseCard = {
  id: string;
  slug?: string;
  title: string;
  description: string;
  instructor: string;
  level: string;
  duration: string;
  price: number;
  type: string;
  status: string;
  lessonCount: number;
};

export type CourseDetail = CourseCard & {
  lessons: LessonDetail[];
};

export type LessonDetail = {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  order: number;
  content: string;
  contentType?: string;
};

export type CommentDetail = {
  id: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
};

export type AnnouncementDetail = {
  id: string;
  courseId: string;
  title: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
  status?: string;
  comments: CommentDetail[];
};

function initialsFromName(name?: string | null, email?: string | null) {
  const source = (name?.trim() || email?.split("@")[0] || "CD").trim();
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function humanizeCourseType(type?: string | null) {
  if (!type) {
    return "General";
  }

  return type
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function humanizeContentType(type?: string | null) {
  if (!type) {
    return "Lesson";
  }

  return type
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function durationLabelFromLessons(count: number) {
  if (count <= 0) {
    return "No lessons yet";
  }

  return `${count} lesson${count > 1 ? "s" : ""}`;
}

async function hasDatabaseCourses() {
  return (await db.course.count()) > 0;
}

export async function listCourseCards(): Promise<CourseCard[]> {
  if (!(await hasDatabaseCourses())) {
    return COURSES.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      level: course.level,
      duration: course.duration,
      price: course.price,
      type: course.level,
      status: "PUBLISHED",
      lessonCount: course.lessons.length,
    }));
  }

  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      teacher: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  });

  return courses.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    instructor:
      course.teacher.name ??
      course.teacher.email?.split("@")[0] ??
      "Campus Digital",
    level: humanizeCourseType(course.type),
    duration: durationLabelFromLessons(course._count.lessons),
    price: 0,
    type: course.type,
    status: course.status,
    lessonCount: course._count.lessons,
  }));
}

export async function getCourseDetailById(
  courseId: string,
): Promise<CourseDetail | null> {
  if (!(await hasDatabaseCourses())) {
    const course = getCourseById(courseId);

    if (!course) {
      return null;
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      level: course.level,
      duration: course.duration,
      price: course.price,
      type: course.level,
      status: "PUBLISHED",
      lessonCount: course.lessons.length,
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        courseId: lesson.courseId,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        content: lesson.content,
        contentType: "lesson",
      })),
    };
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: {
        select: {
          name: true,
          email: true,
        },
      },
      lessons: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) {
    return null;
  }

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    instructor:
      course.teacher.name ??
      course.teacher.email?.split("@")[0] ??
      "Campus Digital",
    level: humanizeCourseType(course.type),
    duration: durationLabelFromLessons(course.lessons.length),
    price: 0,
    type: course.type,
    status: course.status,
    lessonCount: course.lessons.length,
    lessons: course.lessons.map((lesson) => ({
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      duration: `${humanizeContentType(lesson.contentType)} ${lesson.position}`,
      order: lesson.position,
      content: lesson.content,
      contentType: lesson.contentType,
    })),
  };
}

export async function getLessonDetailById(
  courseId: string,
  lessonId: string,
): Promise<LessonDetail | null> {
  if (!(await hasDatabaseCourses())) {
    const lesson = getLessonById(courseId, lessonId);

    if (!lesson) {
      return null;
    }

    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      duration: lesson.duration,
      order: lesson.order,
      content: lesson.content,
      contentType: "lesson",
    };
  }

  const lesson = await db.lesson.findFirst({
    where: {
      id: lessonId,
      courseId,
    },
  });

  if (!lesson) {
    return null;
  }

  return {
    id: lesson.id,
    courseId: lesson.courseId,
    title: lesson.title,
    duration: `${humanizeContentType(lesson.contentType)} ${lesson.position}`,
    order: lesson.position,
    content: lesson.content,
    contentType: lesson.contentType,
  };
}

export async function getLessonDetailByIdGlobal(
  lessonId: string,
): Promise<LessonDetail | null> {
  if (!(await hasDatabaseCourses())) {
    const lesson = getLessonByIdGlobal(lessonId);

    if (!lesson) {
      return null;
    }

    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      duration: lesson.duration,
      order: lesson.order,
      content: lesson.content,
      contentType: "lesson",
    };
  }

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) {
    return null;
  }

  return {
    id: lesson.id,
    courseId: lesson.courseId,
    title: lesson.title,
    duration: `${humanizeContentType(lesson.contentType)} ${lesson.position}`,
    order: lesson.position,
    content: lesson.content,
    contentType: lesson.contentType,
  };
}

export async function listAnnouncementsByCourseId(
  courseId: string,
): Promise<AnnouncementDetail[]> {
  if (!(await hasDatabaseCourses())) {
    return ANNOUNCEMENTS.filter((announcement) => announcement.courseId === courseId);
  }

  const announcements = await db.announcement.findMany({
    where: { courseId },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return announcements.map((announcement) => ({
    id: announcement.id,
    courseId: announcement.courseId,
    title: announcement.title,
    authorName:
      announcement.author.name ??
      announcement.author.email?.split("@")[0] ??
      "Campus Digital",
    authorInitials: initialsFromName(
      announcement.author.name,
      announcement.author.email,
    ),
    content: announcement.content,
    createdAt: announcement.publishedAt?.toISOString() ?? announcement.createdAt.toISOString(),
    status: announcement.status,
    comments: announcement.comments.map((comment) => ({
      id: comment.id,
      authorName:
        comment.author.name ??
        comment.author.email?.split("@")[0] ??
        "Campus Digital",
      authorInitials: initialsFromName(comment.author.name, comment.author.email),
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    })),
  }));
}

export async function getAnnouncementDetailById(
  courseId: string,
  announcementId: string,
): Promise<AnnouncementDetail | null> {
  if (!(await hasDatabaseCourses())) {
    return getAnnouncementById(courseId, announcementId) ?? null;
  }

  const announcements = await listAnnouncementsByCourseId(courseId);
  return (
    announcements.find((announcement) => announcement.id === announcementId) ??
    null
  );
}
