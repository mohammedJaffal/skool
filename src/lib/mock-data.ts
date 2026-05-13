export type ClassroomItem = {
  id: string;
  communityId: string;
  title: string;
  duration: string;
  order: number;
  content: string;
};

export type CommunityFixture = {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  price: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  classroomItems: ClassroomItem[];
};

export type Comment = {
  id: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
};

export type CommunityPostFixture = {
  id: string;
  communityId: string;
  title: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
  comments: Comment[];
};

export type Post = {
  id: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
};

export const COMMUNITY_FIXTURES: CommunityFixture[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description:
      "Learn React from scratch with modern hooks and patterns. Build real-world applications with confidence using the latest React 19 features.",
    ownerName: "John Doe",
    price: 49,
    duration: "6h 30min",
    level: "Beginner",
    classroomItems: [
      { id: "1-1", communityId: "1", title: "Introduction to React", duration: "45min", order: 1, content: "Overview of React, its ecosystem, and why it matters." },
      { id: "1-2", communityId: "1", title: "JSX and Components", duration: "1h", order: 2, content: "Learn JSX syntax, component structure, and props." },
      { id: "1-3", communityId: "1", title: "useState and useEffect", duration: "1h 30min", order: 3, content: "Master the two most important React hooks." },
      { id: "1-4", communityId: "1", title: "Props and Data Flow", duration: "1h", order: 4, content: "Understand unidirectional data flow in React." },
      { id: "1-5", communityId: "1", title: "Building a Real App", duration: "2h 15min", order: 5, content: "Put it all together in a real todo + dashboard project." },
    ],
  },
  {
    id: "2",
    title: "Next.js 15 Deep Dive",
    description:
      "Master Next.js 15 App Router, Server Components, Server Actions, and modern full-stack patterns. From zero to production-ready.",
    ownerName: "Jane Smith",
    price: 79,
    duration: "8h 45min",
    level: "Intermediate",
    classroomItems: [
      { id: "2-1", communityId: "2", title: "App Router Fundamentals", duration: "2h", order: 1, content: "Understanding the file-based routing and layout system." },
      { id: "2-2", communityId: "2", title: "Server vs Client Components", duration: "2h 30min", order: 2, content: "When and why to use each component type." },
      { id: "2-3", communityId: "2", title: "Data Fetching & Server Actions", duration: "2h 15min", order: 3, content: "fetch, caching strategies, and mutations with Server Actions." },
      { id: "2-4", communityId: "2", title: "Deployment & Performance", duration: "2h", order: 4, content: "Deploy to Vercel, optimize Core Web Vitals, and ship." },
    ],
  },
  {
    id: "3",
    title: "TypeScript Essentials",
    description:
      "From JavaScript to TypeScript — master the type system, generics, and real-world patterns used in production codebases.",
    ownerName: "Bob Johnson",
    price: 39,
    duration: "5h",
    level: "Beginner",
    classroomItems: [
      { id: "3-1", communityId: "3", title: "Types and Interfaces", duration: "1h 30min", order: 1, content: "Primitive types, unions, intersections, and interfaces." },
      { id: "3-2", communityId: "3", title: "Generics", duration: "1h 45min", order: 2, content: "Write reusable, type-safe functions and data structures." },
      { id: "3-3", communityId: "3", title: "TypeScript in React", duration: "1h 45min", order: 3, content: "Typing components, hooks, props, and events." },
    ],
  },
  {
    id: "4",
    title: "Tailwind CSS Mastery",
    description:
      "Build beautiful, responsive UIs fast with Tailwind CSS v4. Learn utility-first design and component patterns used in modern apps.",
    ownerName: "Alice Brown",
    price: 29,
    duration: "4h",
    level: "Beginner",
    classroomItems: [
      { id: "4-1", communityId: "4", title: "Utility-First Basics", duration: "1h 20min", order: 1, content: "The Tailwind philosophy, core utilities, and setup." },
      { id: "4-2", communityId: "4", title: "Responsive Design", duration: "1h 20min", order: 2, content: "Build layouts that work perfectly on every screen size." },
      { id: "4-3", communityId: "4", title: "Components & Customization", duration: "1h 20min", order: 3, content: "Create reusable patterns and extend the design system." },
    ],
  },
];

const now = new Date();
const hoursAgo = (h: number) =>
  new Date(now.getTime() - h * 3_600_000).toISOString();

export const POSTS: Post[] = [
  {
    id: "1",
    authorName: "Sarah Chen",
    authorInitials: "SC",
    content:
      "Just finished the React Fundamentals community path — the useState section finally clicked for me! The real app project at the end really tied everything together. Highly recommend for beginners 🙌",
    createdAt: hoursAgo(2),
    likes: 12,
    comments: [
      {
        id: "1-1",
        authorName: "Mike P",
        authorInitials: "MP",
        content: "Same here! The live coding examples made a huge difference.",
        createdAt: hoursAgo(1),
      },
    ],
  },
  {
    id: "2",
    authorName: "Alex Rivera",
    authorInitials: "AR",
    content:
      "Quick tip: if you're struggling with Server Components vs Client Components in Next.js, think of it this way — Server Components are for reading data, Client Components are for interacting with the user. Game changer once it clicks.",
    createdAt: hoursAgo(5),
    likes: 24,
    comments: [
      {
        id: "2-1",
        authorName: "Jordan K",
        authorInitials: "JK",
        content: "This is the clearest explanation I've seen. Bookmarked!",
        createdAt: hoursAgo(4),
      },
      {
        id: "2-2",
        authorName: "Taylor M",
        authorInitials: "TM",
        content:
          "Exactly! The mental model is everything with Next.js.",
        createdAt: hoursAgo(3),
      },
    ],
  },
  {
    id: "3",
    authorName: "Priya Nair",
    authorInitials: "PN",
    content:
      "Anyone working through the TypeScript community path? I'm on the generics section and it's pretty dense. Would love to connect with others and work through it together.",
    createdAt: hoursAgo(10),
    likes: 8,
    comments: [],
  },
];

export const COMMUNITY_POST_FIXTURES: CommunityPostFixture[] = [
  {
    id: "a-1",
    communityId: "1",
    title: "Start here before classroom item one",
    authorName: "John Doe",
    authorInitials: "JD",
    content:
      "Before you jump into the first React classroom item, make sure Node.js is installed and your editor is ready. The goal in this community is not just to watch the items, but to build along with them from the start.",
    createdAt: hoursAgo(26),
    comments: [
      {
        id: "a-1-c-1",
        authorName: "Sarah Chen",
        authorInitials: "SC",
        content:
          "I set up my editor and started coding with the video. Much better than passively watching.",
        createdAt: hoursAgo(22),
      },
      {
        id: "a-1-c-2",
        authorName: "Mike P",
        authorInitials: "MP",
        content: "The checklist helped. I was missing Node before this post.",
        createdAt: hoursAgo(20),
      },
    ],
  },
  {
    id: "a-2",
    communityId: "1",
    title: "Weekly build challenge",
    authorName: "John Doe",
    authorInitials: "JD",
    content:
      "Build a tiny component system using only props, state, and clear naming. Post screenshots of your result in the community once you finish the challenge.",
    createdAt: hoursAgo(8),
    comments: [
      {
        id: "a-2-c-1",
        authorName: "Priya Nair",
        authorInitials: "PN",
        content: "This made the props section click for me. I had to simplify a lot.",
        createdAt: hoursAgo(5),
      },
    ],
  },
  {
    id: "a-3",
    communityId: "2",
    title: "How to approach the App Router module",
    authorName: "Jane Smith",
    authorInitials: "JS",
    content:
      "Do not try to memorize the whole App Router at once. Follow the route tree while reading each classroom item and keep a small note of what is layout-level, page-level, and server-only behavior.",
    createdAt: hoursAgo(30),
    comments: [
      {
        id: "a-3-c-1",
        authorName: "Alex Rivera",
        authorInitials: "AR",
        content: "The route tree note-taking idea is solid. It reduced a lot of confusion.",
        createdAt: hoursAgo(18),
      },
    ],
  },
];

export function getCommunityFixtureById(id: string): CommunityFixture | undefined {
  return COMMUNITY_FIXTURES.find((community) => community.id === id);
}

export function getClassroomItemFixtureById(
  communityId: string,
  classroomItemId: string,
): ClassroomItem | undefined {
  return getCommunityFixtureById(communityId)?.classroomItems.find(
    (item) => item.id === classroomItemId,
  );
}

export function getClassroomItemFixtureByIdGlobal(
  classroomItemId: string,
): ClassroomItem | undefined {
  return COMMUNITY_FIXTURES.flatMap((community) => community.classroomItems).find(
    (item) => item.id === classroomItemId,
  );
}

export function getClassroomItemsByCommunityId(
  communityId: string,
): ClassroomItem[] {
  return [...(getCommunityFixtureById(communityId)?.classroomItems ?? [])].sort(
    (a, b) => a.order - b.order,
  );
}

export function getCommunityPostsByCommunityId(
  communityId: string,
): CommunityPostFixture[] {
  return COMMUNITY_POST_FIXTURES.filter((post) => post.communityId === communityId);
}

export function getCommunityPostFixtureById(
  communityId: string,
  postId: string,
): CommunityPostFixture | undefined {
  return COMMUNITY_POST_FIXTURES.find(
    (post) => post.communityId === communityId && post.id === postId,
  );
}
