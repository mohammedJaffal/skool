import { db } from "@/lib/db";
import {
  COMMUNITY_FIXTURES,
  getClassroomItemFixtureById,
  getClassroomItemFixtureByIdGlobal,
  getCommunityFixtureById,
  getCommunityPostFixtureById,
  getCommunityPostsByCommunityId,
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
    return "Text";
  }

  if (type === "lesson") {
    return "Text";
  }

  return type
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function durationLabelFromLessons(count: number) {
  if (count <= 0) {
    return "No classroom items yet";
  }

  return `${count} classroom item${count > 1 ? "s" : ""}`;
}

async function hasDatabaseCommunities() {
  return (await db.community.count()) > 0;
}

export async function listCommunityCards(): Promise<CommunityCard[]> {
  if (!(await hasDatabaseCommunities())) {
    return COMMUNITY_FIXTURES.map((community) => ({
      id: community.id,
      title: community.title,
      description: community.description,
      ownerName: community.ownerName,
      level: community.level,
      duration: community.duration,
      price: community.price,
      type: community.level,
      status: "PUBLISHED",
      classroomItemCount: community.classroomItems.length,
    }));
  }

  const communities = await db.community.findMany({
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

  return communities.map((community) => ({
    id: community.id,
    slug: community.slug,
    title: community.title,
    description: community.description,
    ownerName:
      community.owner.name ??
      community.owner.email?.split("@")[0] ??
      "Campus Digital",
    level: humanizeCourseType(community.type),
    duration: durationLabelFromLessons(community._count.classroomItems),
    price: 0,
    type: community.type,
    status: community.status,
    classroomItemCount: community._count.classroomItems,
  }));
}

export async function getCommunityDetailById(
  communityId: string,
): Promise<CommunityDetail | null> {
  if (!(await hasDatabaseCommunities())) {
    const community = getCommunityFixtureById(communityId);

    if (!community) {
      return null;
    }

    return {
      id: community.id,
      title: community.title,
      description: community.description,
      ownerName: community.ownerName,
      level: community.level,
      duration: community.duration,
      price: community.price,
      type: community.level,
      status: "PUBLISHED",
      classroomItemCount: community.classroomItems.length,
      documents: [],
      classroomItems: community.classroomItems.map((item) => ({
        id: item.id,
        communityId: item.communityId,
        title: item.title,
        duration: item.duration,
        order: item.order,
        content: item.content,
        contentType: "text",
      })),
    };
  }

  const community = await db.community.findUnique({
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

  if (!community) {
    return null;
  }

  return {
    id: community.id,
    slug: community.slug,
    title: community.title,
    description: community.description,
    ownerName:
      community.owner.name ??
      community.owner.email?.split("@")[0] ??
      "Campus Digital",
    level: humanizeCourseType(community.type),
    duration: durationLabelFromLessons(community.classroomItems.length),
    price: 0,
    type: community.type,
    status: community.status,
    classroomItemCount: community.classroomItems.length,
    documents: community.documents.map((document) => ({
      id: document.id,
      label: document.label,
      url: document.url,
    })),
    classroomItems: community.classroomItems.map((item) => ({
      id: item.id,
      communityId: item.communityId,
      title: item.title,
      duration: `${humanizeContentType(item.contentType)} ${item.position}`,
      order: item.position,
      content: item.content,
      contentType: item.contentType,
    })),
  };
}

export async function getClassroomItemDetailById(
  communityId: string,
  itemId: string,
): Promise<ClassroomItemDetail | null> {
  if (!(await hasDatabaseCommunities())) {
    const item = getClassroomItemFixtureById(communityId, itemId);

    if (!item) {
      return null;
    }

    return {
      id: item.id,
      communityId: item.communityId,
      title: item.title,
      duration: item.duration,
      order: item.order,
      content: item.content,
      contentType: "text",
    };
  }

  const classroomItem = await db.classroomItem.findFirst({
    where: {
      id: itemId,
      communityId: communityId,
    },
  });

  if (!classroomItem) {
    return null;
  }

  return {
    id: classroomItem.id,
    communityId: classroomItem.communityId,
    title: classroomItem.title,
    duration: `${humanizeContentType(classroomItem.contentType)} ${classroomItem.position}`,
    order: classroomItem.position,
    content: classroomItem.content,
    contentType: classroomItem.contentType,
  };
}

export async function getClassroomItemDetailByIdGlobal(
  itemId: string,
): Promise<ClassroomItemDetail | null> {
  if (!(await hasDatabaseCommunities())) {
    const item = getClassroomItemFixtureByIdGlobal(itemId);

    if (!item) {
      return null;
    }

    return {
      id: item.id,
      communityId: item.communityId,
      title: item.title,
      duration: item.duration,
      order: item.order,
      content: item.content,
      contentType: "text",
    };
  }

  const classroomItem = await db.classroomItem.findUnique({
    where: { id: itemId },
  });

  if (!classroomItem) {
    return null;
  }

  return {
    id: classroomItem.id,
    communityId: classroomItem.communityId,
    title: classroomItem.title,
    duration: `${humanizeContentType(classroomItem.contentType)} ${classroomItem.position}`,
    order: classroomItem.position,
    content: classroomItem.content,
    contentType: classroomItem.contentType,
  };
}

export async function listPostsByCommunityId(
  communityId: string,
): Promise<PostDetail[]> {
  if (!(await hasDatabaseCommunities())) {
    return getCommunityPostsByCommunityId(communityId).map((post) => ({
        ...post,
        communityId: post.communityId,
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

  return posts.map((post) => ({
    id: post.id,
    communityId: post.communityId,
    title: post.title,
    authorName:
      post.author.name ??
      post.author.email?.split("@")[0] ??
      "Campus Digital",
    authorInitials: initialsFromName(
      post.author.name,
      post.author.email,
    ),
    content: post.content,
    createdAt: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
    status: post.status,
    comments: post.comments.map((comment) => ({
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
    const post = getCommunityPostFixtureById(communityId, postId);
    return post ? { ...post, communityId: post.communityId } : null;
  }

  const posts = await listPostsByCommunityId(communityId);
  return posts.find((post) => post.id === postId) ?? null;
}
