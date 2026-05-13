import { db } from "@/lib/db";
import {
  ANNOUNCEMENTS,
  COURSES,
  getAnnouncementById,
  getCourseById,
  getLessonById,
  getLessonByIdGlobal,
} from "@/lib/mock-data";

export type CommunityCard = {
  id: string;
  slug?: string;
  title: string;
  description: string;
  ownerName: string;
  level: string;
  duration: string;
  price: number;
  type: string;
  status: string;
  classroomItemCount: number;
};

export type CommunityDocumentDetail = {
  id: string;
  label: string;
  url: string;
};

export type ClassroomItemDetail = {
  id: string;
  communityId: string;
  title: string;
  duration: string;
  order: number;
  content: string;
  contentType?: string;
};

export type CommunityDetail = CommunityCard & {
  classroomItems: ClassroomItemDetail[];
  documents: CommunityDocumentDetail[];
};

export type CommentDetail = {
  id: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
};

export type PostDetail = {
  id: string;
  communityId: string;
  title: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
  status?: string;
  comments: CommentDetail[];
};

export type CourseCard = CommunityCard & {
  instructor: string;
  lessonCount: number;
};

export type CourseDocumentDetail = CommunityDocumentDetail;

export type LessonDetail = ClassroomItemDetail & {
  courseId: string;
};

export type CourseDetail = CourseCard & {
  lessons: LessonDetail[];
  documents: CourseDocumentDetail[];
};

export type AnnouncementDetail = PostDetail & {
  courseId: string;
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
    return "No classroomItems yet";
  }

  return `${count} lesson${count > 1 ? "s" : ""}`;
}

async function hasDatabaseCommunities() {
  return (await db.community.count()) > 0;
}

export async function listCommunityCards(): Promise<CommunityCard[]> {
  if (!(await hasDatabaseCommunities())) {
    return COURSES.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      ownerName: course.instructor,
      level: course.level,
      duration: course.duration,
      price: course.price,
      type: course.level,
      status: "PUBLISHED",
      classroomItemCount: course.lessons.length,
    }));
  }

  const courses = await db.community.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          classroomItems: true,
        },
      },
    },
  });

  return courses.map((course) => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    ownerName:
      course.owner.name ??
      course.owner.email?.split("@")[0] ??
      "Campus Digital",
    level: humanizeCourseType(course.type),
    duration: durationLabelFromLessons(course._count.classroomItems),
    price: 0,
    type: course.type,
    status: course.status,
    classroomItemCount: course._count.classroomItems,
  }));
}

export async function getCommunityDetailById(
  communityId: string,
): Promise<CommunityDetail | null> {
  if (!(await hasDatabaseCommunities())) {
    const course = getCourseById(communityId);

    if (!course) {
      return null;
    }

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      ownerName: course.instructor,
      level: course.level,
      duration: course.duration,
      price: course.price,
      type: course.level,
      status: "PUBLISHED",
      classroomItemCount: course.lessons.length,
      documents: [],
      classroomItems: course.lessons.map((lesson) => ({
        id: lesson.id,
        communityId: lesson.courseId,
        title: lesson.title,
        duration: lesson.duration,
        order: lesson.order,
        content: lesson.content,
        contentType: "lesson",
      })),
    };
  }

  const course = await db.community.findUnique({
    where: { id: communityId },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      classroomItems: {
        orderBy: { position: "asc" },
      },
      documents: {
        orderBy: { createdAt: "desc" },
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
    ownerName:
      course.owner.name ??
      course.owner.email?.split("@")[0] ??
      "Campus Digital",
    level: humanizeCourseType(course.type),
    duration: durationLabelFromLessons(course.classroomItems.length),
    price: 0,
    type: course.type,
    status: course.status,
    classroomItemCount: course.classroomItems.length,
    documents: course.documents.map((document) => ({
      id: document.id,
      label: document.label,
      url: document.url,
    })),
    classroomItems: course.classroomItems.map((lesson) => ({
      id: lesson.id,
      communityId: lesson.communityId,
      title: lesson.title,
      duration: `${humanizeContentType(lesson.contentType)} ${lesson.position}`,
      order: lesson.position,
      content: lesson.content,
      contentType: lesson.contentType,
    })),
  };
}

export async function getClassroomItemDetailById(
  communityId: string,
  itemId: string,
): Promise<ClassroomItemDetail | null> {
  if (!(await hasDatabaseCommunities())) {
    const lesson = getLessonById(communityId, itemId);

    if (!lesson) {
      return null;
    }

    return {
      id: lesson.id,
      communityId: lesson.courseId,
      title: lesson.title,
      duration: lesson.duration,
      order: lesson.order,
      content: lesson.content,
      contentType: "lesson",
    };
  }

  const lesson = await db.classroomItem.findFirst({
    where: {
      id: itemId,
      communityId: communityId,
    },
  });

  if (!lesson) {
    return null;
  }

  return {
    id: lesson.id,
    communityId: lesson.communityId,
    title: lesson.title,
    duration: `${humanizeContentType(lesson.contentType)} ${lesson.position}`,
    order: lesson.position,
    content: lesson.content,
    contentType: lesson.contentType,
  };
}

export async function getClassroomItemDetailByIdGlobal(
  itemId: string,
): Promise<ClassroomItemDetail | null> {
  if (!(await hasDatabaseCommunities())) {
    const lesson = getLessonByIdGlobal(itemId);

    if (!lesson) {
      return null;
    }

    return {
      id: lesson.id,
      communityId: lesson.courseId,
      title: lesson.title,
      duration: lesson.duration,
      order: lesson.order,
      content: lesson.content,
      contentType: "lesson",
    };
  }

  const lesson = await db.classroomItem.findUnique({
    where: { id: itemId },
  });

  if (!lesson) {
    return null;
  }

  return {
    id: lesson.id,
    communityId: lesson.communityId,
    title: lesson.title,
    duration: `${humanizeContentType(lesson.contentType)} ${lesson.position}`,
    order: lesson.position,
    content: lesson.content,
    contentType: lesson.contentType,
  };
}

export async function listPostsByCommunityId(
  communityId: string,
): Promise<PostDetail[]> {
  if (!(await hasDatabaseCommunities())) {
    return ANNOUNCEMENTS.filter((announcement) => announcement.courseId === communityId).map(
      (announcement) => ({
        ...announcement,
        communityId: announcement.courseId,
      }),
    );
  }

  const posts = await db.communityPost.findMany({
    where: { communityId: communityId },
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

  return posts.map((announcement) => ({
    id: announcement.id,
    communityId: announcement.communityId,
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

export async function getPostDetailById(
  communityId: string,
  postId: string,
): Promise<PostDetail | null> {
  if (!(await hasDatabaseCommunities())) {
    const announcement = getAnnouncementById(communityId, postId);
    return announcement ? { ...announcement, communityId: announcement.courseId } : null;
  }

  const posts = await listPostsByCommunityId(communityId);
  return (
    posts.find((announcement) => announcement.id === postId) ??
    null
  );
}

export async function listCourseCards(): Promise<CourseCard[]> {
  const communities = await listCommunityCards();
  return communities.map((community) => ({
    ...community,
    instructor: community.ownerName,
    lessonCount: community.classroomItemCount,
  }));
}

export async function getCourseDetailById(
  communityId: string,
): Promise<CourseDetail | null> {
  const community = await getCommunityDetailById(communityId);

  if (!community) {
    return null;
  }

  return {
    ...community,
    instructor: community.ownerName,
    lessonCount: community.classroomItems.length,
    lessons: community.classroomItems.map((item) => ({
      ...item,
      courseId: item.communityId,
    })),
  };
}

export async function getLessonDetailById(
  communityId: string,
  classroomItemId: string,
): Promise<LessonDetail | null> {
  const item = await getClassroomItemDetailById(communityId, classroomItemId);

  if (!item) {
    return null;
  }

  return {
    ...item,
    courseId: item.communityId,
  };
}

export async function getLessonDetailByIdGlobal(
  classroomItemId: string,
): Promise<LessonDetail | null> {
  const item = await getClassroomItemDetailByIdGlobal(classroomItemId);

  if (!item) {
    return null;
  }

  return {
    ...item,
    courseId: item.communityId,
  };
}

export async function listAnnouncementsByCourseId(
  communityId: string,
): Promise<AnnouncementDetail[]> {
  const posts = await listPostsByCommunityId(communityId);
  return posts.map((post) => ({
    ...post,
    courseId: post.communityId,
  }));
}

export async function getAnnouncementDetailById(
  communityId: string,
  announcementId: string,
): Promise<AnnouncementDetail | null> {
  const post = await getPostDetailById(communityId, announcementId);

  if (!post) {
    return null;
  }

  return {
    ...post,
    courseId: post.communityId,
  };
}
