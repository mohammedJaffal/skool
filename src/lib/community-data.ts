import { db } from "@/lib/db";
import { getCourseDetailById, listCourseCards } from "@/lib/platform-data";

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

export type CommunityThread = {
  id: string;
  authorName: string;
  authorInitials: string;
  postedAt: string;
  headline: string;
  body: string;
  replies: number;
  likes: number;
};

export type CommunityData = {
  slug: string;
  name: string;
  accessCourseSlug: string;
  heroImage: string;
  shortDescription: string;
  description: string;
  offerSummary: string;
  priceLabel: string;
  memberCount: string;
  onlineCount: string;
  coverTone: string;
  topics: string[];
  highlights: string[];
  rules: string[];
  sampleMembers: Array<{
    name: string;
    role: string;
    note: string;
  }>;
  threads: CommunityThread[];
};

export const COMMUNITIES: CommunityData[] = [
  {
    slug: "campus-builders",
    accessCourseSlug: "react-foundations-lab",
    name: "Campus Builders",
    heroImage: "https://picsum.photos/seed/campus-builders/1200/700",
    shortDescription:
      "Project-first learning with guided lessons, branch reviews, and weekly shipping targets.",
    description:
      "Campus Builders is the practical workspace for people who learn by shipping. Members work through structured lessons, share branch updates, and get pushed toward real implementation instead of passive watching.",
    offerSummary:
      "Includes a guided classroom, branch review rituals, weekly build checkpoints, and a public discussion feed.",
    priceLabel: "Free",
    memberCount: "1.8k",
    onlineCount: "146",
    coverTone: "#d9d3c7",
    topics: ["Full-stack builds", "Project reviews", "Frontend systems"],
    highlights: [
      "Weekly branch review checkpoints",
      "Structured classroom modules",
      "Public progress posts from active members",
    ],
    rules: [
      "Share work in progress, not vague plans.",
      "Keep posts concrete: what you shipped, what broke, what changed.",
      "Use comments to help unblock the next person.",
    ],
    sampleMembers: [
      {
        name: "Nadia Teacher",
        role: "Teacher",
        note: "Runs the classroom and weekly review thread.",
      },
      {
        name: "Yassine Learner",
        role: "Learner",
        note: "Posting progress from the React path.",
      },
      {
        name: "Sara Invitee",
        role: "Learner",
        note: "Waiting on invitation approval for the next cohort.",
      },
    ],
    threads: [
      {
        id: "cb-1",
        authorName: "Yassine Learner",
        authorInitials: "YL",
        postedAt: "2h ago",
        headline: "Finished the dashboard slice without waiting on the API",
        body:
          "I shipped the layout with fake data first, then swapped the routes once the contracts were stable. That removed most of the merge pain.",
        replies: 7,
        likes: 18,
      },
      {
        id: "cb-2",
        authorName: "Nadia Teacher",
        authorInitials: "NT",
        postedAt: "5h ago",
        headline: "Use the branch review checklist before asking for merge",
        body:
          "Check loading state, empty state, and auth behavior first. It keeps the reviews shorter and avoids back-and-forth on avoidable issues.",
        replies: 11,
        likes: 26,
      },
      {
        id: "cb-3",
        authorName: "Sara Invitee",
        authorInitials: "SI",
        postedAt: "1d ago",
        headline: "Question about keeping UI work unblocked before backend is ready",
        body:
          "I can finish the page structure, but I want to avoid inventing fields that will be wrong later. What is the cleanest contract-first approach here?",
        replies: 9,
        likes: 13,
      },
    ],
  },
  {
    slug: "ai-automation-society",
    accessCourseSlug: "nextjs-launchpad",
    name: "AI Automation Society",
    heroImage: "https://picsum.photos/seed/ai-automation-society/1200/700",
    shortDescription:
      "A focused group for people turning AI experiments into production-ready workflows.",
    description:
      "AI Automation Society is built around repeatable systems. The community combines guided modules, implementation notes, and member discussions around routing, automation, and operational reliability.",
    offerSummary:
      "Includes automation teardown posts, implementation prompts, template walkthroughs, and a tighter member-only feed.",
    priceLabel: "$19/month",
    memberCount: "842",
    onlineCount: "63",
    coverTone: "#d4d0c8",
    topics: ["Automation systems", "Next.js implementation", "Workflow design"],
    highlights: [
      "Member-only implementation feed",
      "Workflow teardown posts",
      "Classroom modules tied to real build tasks",
    ],
    rules: [
      "Post workflows with enough detail to reproduce them.",
      "Do not market in the feed.",
      "Questions should include the current route, payload, or failure point.",
    ],
    sampleMembers: [
      {
        name: "Nadia Teacher",
        role: "Host",
        note: "Leads the weekly systems review.",
      },
      {
        name: "Campus Admin",
        role: "Admin",
        note: "Maintains the acceptance and deployment rules.",
      },
      {
        name: "Fouad Systems",
        role: "Member",
        note: "Shares teardown notes from AI workflow builds.",
      },
    ],
    threads: [
      {
        id: "aa-1",
        authorName: "Fouad Systems",
        authorInitials: "FS",
        postedAt: "35m ago",
        headline: "How I stopped my prompt pipeline from breaking on missing route params",
        body:
          "The fix was not another fallback. I narrowed the route contract and forced the caller to pass the slug before the agent could continue.",
        replies: 14,
        likes: 31,
      },
      {
        id: "aa-2",
        authorName: "Nadia Teacher",
        authorInitials: "NT",
        postedAt: "3h ago",
        headline: "Tonight’s module: default public routes vs member-only actions",
        body:
          "We are mapping exactly what should stay open for discovery and what must stay identity-bound. Bring examples from your own product.",
        replies: 18,
        likes: 42,
      },
      {
        id: "aa-3",
        authorName: "Campus Admin",
        authorInitials: "CA",
        postedAt: "8h ago",
        headline: "Template drop: review gate for teammate branches",
        body:
          "Posted a practical merge checklist with rejection rules, follow-up criteria, and the minimum acceptance path for sprint work.",
        replies: 6,
        likes: 22,
      },
    ],
  },
  {
    slug: "maker-sprint-lab",
    accessCourseSlug: "react-foundations-lab",
    name: "Maker Sprint Lab",
    heroImage: "https://picsum.photos/seed/maker-sprint-lab/1200/700",
    shortDescription:
      "Small-group execution with shipping logs, short feedback loops, and simple classroom structure.",
    description:
      "Maker Sprint Lab is the place for people who want pressure without noise. The focus is simple: pick a task, ship it, show the result, and move to the next sprint without losing structure.",
    offerSummary:
      "Includes sprint logs, execution check-ins, and a classroom organized around two-week delivery cycles.",
    priceLabel: "$9/month",
    memberCount: "620",
    onlineCount: "51",
    coverTone: "#d7cec4",
    topics: ["Sprint execution", "Peer feedback", "Delivery rhythm"],
    highlights: [
      "Two-week sprint rhythm",
      "Peer review queue",
      "Simple classroom structure around active tasks",
    ],
    rules: [
      "Post shipped work before asking for feedback.",
      "Keep updates short and testable.",
      "Do not move to the next task until the current one is checked.",
    ],
    sampleMembers: [
      {
        name: "Meriem Build",
        role: "Member",
        note: "Shares finished slices at the end of every sprint.",
      },
      {
        name: "Nadia Teacher",
        role: "Host",
        note: "Runs the checkpoint reviews.",
      },
      {
        name: "Yassine Learner",
        role: "Member",
        note: "Using the group to keep work moving every week.",
      },
    ],
    threads: [
      {
        id: "ms-1",
        authorName: "Meriem Build",
        authorInitials: "MB",
        postedAt: "1h ago",
        headline: "Sprint 3 wrap-up: three screens done, one blocker left",
        body:
          "The layout work is done. The only blocker left is ownership checks on the lesson route, so I’m isolating that before starting anything else.",
        replies: 5,
        likes: 17,
      },
      {
        id: "ms-2",
        authorName: "Yassine Learner",
        authorInitials: "YL",
        postedAt: "6h ago",
        headline: "Short note on not overdesigning internal pages",
        body:
          "I removed the decorative panels and the page became easier to scan immediately. Normal spacing solved more than another visual effect would have.",
        replies: 8,
        likes: 24,
      },
    ],
  },
  {
    slug: "creator-launch-club",
    accessCourseSlug: "nextjs-launchpad",
    name: "Creator Launch Club",
    heroImage: "https://picsum.photos/seed/creator-launch-club/1200/700",
    shortDescription:
      "Simple launch systems for creators who want a cleaner offer, audience, and weekly output rhythm.",
    description:
      "Creator Launch Club is a practical group for creators building repeatable publishing habits, small digital products, and better launch consistency.",
    offerSummary:
      "Includes weekly prompts, launch teardown notes, and lightweight classroom modules for shipping offers.",
    priceLabel: "$49/month",
    memberCount: "1.2k",
    onlineCount: "94",
    coverTone: "#d5cec1",
    topics: ["Publishing systems", "Offer design", "Launch reviews"],
    highlights: [
      "Weekly launch review prompts",
      "Simple offer-building worksheets",
      "Public examples from active creators",
    ],
    rules: [
      "Show the offer before asking for feedback.",
      "Use examples, not vague creator advice.",
      "Keep launch posts tied to real output.",
    ],
    sampleMembers: [
      { name: "Layla Creator", role: "Host", note: "Runs weekly launch reviews." },
      { name: "Omar Writer", role: "Member", note: "Sharing publishing experiments." },
      { name: "Rita Maker", role: "Member", note: "Testing small product offers." },
    ],
    threads: [
      {
        id: "cl-1",
        authorName: "Layla Creator",
        authorInitials: "LC",
        postedAt: "1h ago",
        headline: "A better launch page comes from a tighter promise",
        body:
          "Most landing pages fail because the promise is broad. Narrow the outcome first, then the structure becomes obvious.",
        replies: 10,
        likes: 22,
      },
      {
        id: "cl-2",
        authorName: "Omar Writer",
        authorInitials: "OW",
        postedAt: "4h ago",
        headline: "Weekly publishing system that stopped my content backlog",
        body:
          "I reduced the format options to two and my consistency improved immediately. Less choice removed most of the friction.",
        replies: 6,
        likes: 14,
      },
    ],
  },
  {
    slug: "wellness-habit-circle",
    accessCourseSlug: "react-foundations-lab",
    name: "Wellness Habit Circle",
    heroImage: "https://picsum.photos/seed/wellness-habit-circle/1200/700",
    shortDescription:
      "A calm accountability group for routines, habit tracking, and staying consistent without noise.",
    description:
      "Wellness Habit Circle is for people who want simple accountability around routines, movement, and health habits with less performance and more consistency.",
    offerSummary:
      "Includes daily check-in threads, habit templates, and reflection prompts that keep progress visible.",
    priceLabel: "$15/month",
    memberCount: "3.4k",
    onlineCount: "201",
    coverTone: "#d2cdc5",
    topics: ["Habit systems", "Consistency", "Routine reflection"],
    highlights: [
      "Daily accountability threads",
      "Habit reflection prompts",
      "Simple routine templates",
    ],
    rules: [
      "Keep updates honest and short.",
      "Track consistency, not perfect streaks.",
      "Share what helped, not generic motivation.",
    ],
    sampleMembers: [
      { name: "Imane Coach", role: "Host", note: "Leads the morning check-in." },
      { name: "Salma Habit", role: "Member", note: "Tracking recovery and movement." },
      { name: "Nour Focus", role: "Member", note: "Using the routine prompts daily." },
    ],
    threads: [
      {
        id: "wh-1",
        authorName: "Imane Coach",
        authorInitials: "IC",
        postedAt: "20m ago",
        headline: "What made your routine easier this week?",
        body:
          "Not bigger discipline. Usually one better setup choice. Share the small change that made consistency easier.",
        replies: 27,
        likes: 43,
      },
      {
        id: "wh-2",
        authorName: "Salma Habit",
        authorInitials: "SH",
        postedAt: "7h ago",
        headline: "Tracking bedtime instead of sleep goals helped more",
        body:
          "The input was easier to control than the outcome, and that made the habit finally stable.",
        replies: 13,
        likes: 28,
      },
    ],
  },
  {
    slug: "freelance-systems-forum",
    accessCourseSlug: "nextjs-launchpad",
    name: "Freelance Systems Forum",
    heroImage: "https://picsum.photos/seed/freelance-systems-forum/1200/700",
    shortDescription:
      "Operations, proposals, and delivery systems for freelancers who want cleaner client work.",
    description:
      "Freelance Systems Forum helps independent workers tighten proposals, delivery rituals, and client communication so projects stop feeling improvised.",
    offerSummary:
      "Includes proposal examples, review checklists, and delivery systems that make client work easier to run.",
    priceLabel: "$29/month",
    memberCount: "980",
    onlineCount: "72",
    coverTone: "#d6cdc2",
    topics: ["Client delivery", "Proposals", "Freelance operations"],
    highlights: [
      "Proposal teardown examples",
      "Delivery checklist library",
      "Scope control discussions",
    ],
    rules: [
      "Use real project examples where possible.",
      "Focus on systems, not freelancing clichés.",
      "Show the document, workflow, or scope issue clearly.",
    ],
    sampleMembers: [
      { name: "Hassan Ops", role: "Host", note: "Runs the delivery system reviews." },
      { name: "Maya Freelance", role: "Member", note: "Sharing scope-control templates." },
      { name: "Tariq PM", role: "Member", note: "Improving proposals and kickoff docs." },
    ],
    threads: [
      {
        id: "fs-1",
        authorName: "Hassan Ops",
        authorInitials: "HO",
        postedAt: "2h ago",
        headline: "The easiest proposal upgrade is a sharper scope section",
        body:
          "Most confusion later comes from fuzzy delivery boundaries. Tightening scope language early removes future friction.",
        replies: 9,
        likes: 19,
      },
      {
        id: "fs-2",
        authorName: "Maya Freelance",
        authorInitials: "MF",
        postedAt: "9h ago",
        headline: "My kickoff template now catches missing client inputs",
        body:
          "I added one mandatory checklist before project start and it prevented two timeline slips this month.",
        replies: 8,
        likes: 16,
      },
    ],
  },
];

export function listCommunities() {
  return COMMUNITIES;
}

export function getCommunityBySlug(slug: string) {
  return COMMUNITIES.find((community) => community.slug === slug) ?? null;
}

export async function getCommunityBySlugOrCourse(slug: string) {
  const staticCommunity = getCommunityBySlug(slug);

  if (staticCommunity) {
    return staticCommunity;
  }

  const course = await db.course.findUnique({
    where: { slug },
    include: {
      teacher: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          memberships: true,
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  const teacherName =
    course.teacher.name ?? course.teacher.email?.split("@")[0] ?? "Campus Digital";

  return {
    slug: course.slug,
    accessCourseSlug: course.slug,
    name: course.title,
    heroImage: `https://picsum.photos/seed/${encodeURIComponent(course.slug)}/1200/700`,
    shortDescription: course.description,
    description: course.description,
    offerSummary: `Guided by ${teacherName}. Includes classroom lessons, announcements, and member access.`,
    priceLabel: "Free",
    memberCount: String(course._count.memberships),
    onlineCount: "0",
    coverTone: "#d9d3c7",
    topics: [course.type, "Classroom", "Discussion"],
    highlights: [
      "Structured classroom lessons",
      "Teacher announcements",
      "Member access and progress tracking",
    ],
    rules: [
      "Keep questions connected to the lesson or course task.",
      "Share progress clearly before asking for review.",
      "Use comments for concrete feedback and blockers.",
    ],
    sampleMembers: [
      {
        name: teacherName,
        role: "Teacher",
        note: "Runs the classroom and reviews member progress.",
      },
    ],
    threads: [
      {
        id: `${course.slug}-welcome`,
        authorName: teacherName,
        authorInitials: initialsFromName(teacherName, course.teacher.email),
        postedAt: "today",
        headline: `Welcome to ${course.title}`,
        body: "Start with the classroom, post blockers clearly, and keep progress visible for review.",
        replies: 0,
        likes: 0,
      },
    ],
  } satisfies CommunityData;
}

export async function listCommunityCards() {
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
          memberships: true,
        },
      },
    },
  });

  const databaseCards = courses.map((course) => {
    const fallback = COMMUNITIES.find(
      (community) => community.accessCourseSlug === course.slug,
    );
    const teacherName =
      course.teacher.name ?? course.teacher.email?.split("@")[0] ?? "Campus Digital";

    return {
      slug: fallback?.slug ?? course.slug,
      name: course.title,
      shortDescription: course.description,
      memberCount:
        course._count.memberships > 0
          ? String(course._count.memberships)
          : fallback?.memberCount ?? "0",
      onlineCount: fallback?.onlineCount ?? "0",
      priceLabel: fallback?.priceLabel ?? "Free",
      heroImage:
        fallback?.heroImage ??
        `https://picsum.photos/seed/${encodeURIComponent(course.slug)}/1200/700`,
      courseTitle: course.title,
      courseMeta: `${course._count.lessons} lesson${course._count.lessons === 1 ? "" : "s"}`,
      latestHeadline:
        fallback?.threads[0]?.headline ?? `New classroom by ${teacherName}`,
      latestAuthor: fallback?.threads[0]?.authorName ?? teacherName,
      coverTone: fallback?.coverTone ?? "#d9d3c7",
    };
  });

  const usedSlugs = new Set(databaseCards.map((card) => card.slug));
  const fillerCards = COMMUNITIES.filter(
    (community) => !usedSlugs.has(community.slug),
  ).map((community) => {
    const latestThread = community.threads[0];

    return {
      slug: community.slug,
      name: community.name,
      shortDescription: community.shortDescription,
      memberCount: community.memberCount,
      onlineCount: community.onlineCount,
      priceLabel: community.priceLabel,
      heroImage: community.heroImage,
      courseTitle: "Structured classroom",
      courseMeta: "Guided modules",
      latestHeadline: latestThread?.headline ?? "",
      latestAuthor: latestThread?.authorName ?? "",
      coverTone: community.coverTone,
    };
  });

  return [...databaseCards, ...fillerCards].slice(0, 6);
}

export async function listStaticCommunityCards() {
  const courseCards = await listCourseCards();
  const cardMap = new Map(courseCards.map((course) => [course.slug, course]));

  return COMMUNITIES.map((community) => {
    const course = cardMap.get(community.accessCourseSlug);
    const latestThread = community.threads[0];

    return {
      slug: community.slug,
      name: community.name,
      shortDescription: community.shortDescription,
      memberCount: community.memberCount,
      onlineCount: community.onlineCount,
      priceLabel: community.priceLabel,
      heroImage: community.heroImage,
      courseTitle: course?.title ?? "Structured classroom",
      courseMeta: course
        ? `${course.lessonCount} lessons`
        : "Guided modules",
      latestHeadline: latestThread?.headline ?? "",
      latestAuthor: latestThread?.authorName ?? "",
      coverTone: community.coverTone,
    };
  });
}

export async function getCommunityClassroomPreview(slug: string) {
  const community = getCommunityBySlug(slug);
  const accessCourseSlug = community?.accessCourseSlug ?? slug;

  const courses = await listCourseCards();
  const courseCard =
    courses.find((course) => course.slug === accessCourseSlug) ?? null;

  if (!courseCard) {
    return null;
  }

  return getCourseDetailById(courseCard.id);
}

export async function isCommunityMember(
  slug: string,
  viewer?: { id?: string | null; role?: string | null } | null,
) {
  if (!viewer?.id) {
    return false;
  }

  const community = getCommunityBySlug(slug);
  const accessCourseSlug = community?.accessCourseSlug ?? slug;

  const course = await db.course.findUnique({
    where: { slug: accessCourseSlug },
    select: {
      id: true,
      teacherId: true,
    },
  });

  if (!course) {
    return viewer.role === "ADMIN";
  }

  if (viewer.role === "ADMIN" || course.teacherId === viewer.id) {
    return true;
  }

  const membership = await db.courseMembership.findUnique({
    where: {
      courseId_learnerId: {
        courseId: course.id,
        learnerId: viewer.id,
      },
    },
    select: { status: true },
  });

  return membership?.status === "ACTIVE";
}

export async function getDefaultCommunitySlug(
  viewer?: { id?: string | null; role?: string | null } | null,
) {
  for (const community of COMMUNITIES) {
    if (await isCommunityMember(community.slug, viewer)) {
      return community.slug;
    }
  }

  return "ai-automation-society";
}
