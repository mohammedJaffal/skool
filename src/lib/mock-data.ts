export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  order: number;
  content: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: Lesson[];
};

export type Comment = {
  id: string;
  authorName: string;
  authorInitials: string;
  content: string;
  createdAt: string;
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

export const COURSES: Course[] = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Learn React from scratch with modern hooks and patterns. Build real projects and understand the core concepts that power today's web apps.",
    instructor: "John Doe",
    price: 49,
    duration: "6h 30min",
    level: "Beginner",
    lessons: [
      { id: "1", courseId: "1", title: "Introduction to React", duration: "15min", order: 1, content: "React is a JavaScript library for building user interfaces. It was created by Facebook and is now one of the most popular front-end libraries in the world.\n\nIn this lesson, we'll cover:\n- What React is and why it exists\n- The virtual DOM and how React uses it\n- Setting up your first React project with Vite\n- Understanding JSX syntax" },
      { id: "2", courseId: "1", title: "Components & Props", duration: "25min", order: 2, content: "Components are the building blocks of any React application. A component is a self-contained piece of UI that can be reused throughout your app.\n\nKey concepts:\n- Function components vs class components\n- Passing data with props\n- PropTypes for type checking\n- Children props and composition" },
      { id: "3", courseId: "1", title: "State & Lifecycle", duration: "30min", order: 3, content: "State is what makes React components dynamic. Unlike props, state is managed within the component and can change over time.\n\nTopics covered:\n- What is state and why we need it\n- The useState hook\n- Updating state correctly\n- Understanding re-renders" },
      { id: "4", courseId: "1", title: "Hooks: useState & useEffect", duration: "35min", order: 4, content: "Hooks let you use state and other React features without writing a class. They were introduced in React 16.8 and have become the standard way to write React code.\n\nIn this lesson:\n- useState for local component state\n- useEffect for side effects\n- Cleanup functions\n- Dependency arrays" },
      { id: "5", courseId: "1", title: "Event Handling", duration: "20min", order: 5, content: "Handling events in React is similar to handling DOM events, but with some key differences.\n\nCovered topics:\n- Synthetic events in React\n- onClick, onChange, onSubmit handlers\n- Preventing default behavior\n- Passing arguments to event handlers" },
    ],
  },
  {
    id: "2",
    title: "Next.js 15 Deep Dive",
    description: "Master the App Router, Server Components, and full-stack capabilities of Next.js 15. Build production-ready applications from day one.",
    instructor: "Jane Smith",
    price: 79,
    duration: "9h 15min",
    level: "Intermediate",
    lessons: [
      { id: "1", courseId: "2", title: "App Router Overview", duration: "20min", order: 1, content: "The Next.js App Router is a new paradigm for building React applications. It builds on top of React Server Components to give you a powerful, flexible routing system.\n\nTopics:\n- File-based routing in the app directory\n- Layout and page files\n- Route groups and dynamic segments\n- Parallel and intercepting routes" },
      { id: "2", courseId: "2", title: "Server vs Client Components", duration: "30min", order: 2, content: "One of the biggest concepts in Next.js 15 is understanding when to use Server Components vs Client Components.\n\nServer Components:\n- Run on the server only\n- Can access databases directly\n- Zero client-side JavaScript\n\nClient Components:\n- Run in the browser\n- Can use hooks and browser APIs\n- Add interactivity" },
      { id: "3", courseId: "2", title: "Data Fetching Patterns", duration: "40min", order: 3, content: "Next.js provides several ways to fetch data in your application. Each has trade-offs around performance, flexibility, and complexity.\n\nPatterns covered:\n- fetch() with caching options\n- Server-side data fetching in Server Components\n- Client-side fetching with SWR or React Query\n- Route handlers as API endpoints" },
      { id: "4", courseId: "2", title: "Authentication with NextAuth", duration: "45min", order: 4, content: "Adding authentication to a Next.js app is straightforward with NextAuth.js (Auth.js).\n\nIn this lesson:\n- Setting up NextAuth v5\n- Configuring OAuth providers (GitHub, Google)\n- Session management\n- Protecting routes with middleware" },
    ],
  },
  {
    id: "3",
    title: "TypeScript Essentials",
    description: "Write safer, more maintainable JavaScript with TypeScript. Learn types, interfaces, generics and integrate TS into real projects.",
    instructor: "Bob Johnson",
    price: 39,
    duration: "5h 45min",
    level: "Beginner",
    lessons: [
      { id: "1", courseId: "3", title: "Why TypeScript?", duration: "12min", order: 1, content: "TypeScript adds static type checking to JavaScript. It catches errors at compile time rather than at runtime, making your code more reliable and easier to maintain.\n\nBenefits:\n- Catch bugs before they reach production\n- Better IDE support and autocomplete\n- Self-documenting code\n- Easier refactoring" },
      { id: "2", courseId: "3", title: "Basic Types & Interfaces", duration: "30min", order: 2, content: "TypeScript has a rich type system that lets you describe the shape of your data.\n\nCovered:\n- Primitive types: string, number, boolean\n- Arrays and tuples\n- Objects and interfaces\n- Type aliases vs interfaces\n- Union and intersection types" },
      { id: "3", courseId: "3", title: "Generics", duration: "35min", order: 3, content: "Generics allow you to write reusable, type-safe code that works with multiple types.\n\nTopics:\n- Generic functions\n- Generic interfaces and classes\n- Constraints with extends\n- Built-in utility types: Partial, Required, Pick, Omit" },
    ],
  },
  {
    id: "4",
    title: "Tailwind CSS Mastery",
    description: "Build beautiful, responsive user interfaces fast with Tailwind CSS. From basics to advanced component patterns and design systems.",
    instructor: "Alice Brown",
    price: 29,
    duration: "4h 20min",
    level: "Beginner",
    lessons: [
      { id: "1", courseId: "4", title: "Utility-First Approach", duration: "18min", order: 1, content: "Tailwind CSS is a utility-first CSS framework. Instead of pre-built components, you compose designs using small utility classes.\n\nCore concepts:\n- Utility classes vs component classes\n- Responsive design with breakpoint prefixes\n- Dark mode support\n- Customizing the design system" },
      { id: "2", courseId: "4", title: "Layout with Flexbox & Grid", duration: "25min", order: 2, content: "Tailwind provides comprehensive utilities for CSS Flexbox and Grid layout.\n\nFlexbox utilities: flex, justify-*, items-*, gap-*\nGrid utilities: grid, grid-cols-*, col-span-*\n\nWe'll build several real layouts from scratch." },
      { id: "3", courseId: "4", title: "Building a Component Library", duration: "40min", order: 3, content: "Let's build reusable UI components using Tailwind classes.\n\nComponents we'll build:\n- Buttons with variants\n- Form inputs and labels\n- Cards and modals\n- Navigation bars\n\nWe'll also look at the @apply directive for extracting repeated patterns." },
    ],
  },
];

export const POSTS: Post[] = [
  {
    id: "1",
    authorName: "Sarah Mitchell",
    authorInitials: "SM",
    content: "Just finished the React Fundamentals course — the hooks section was a game changer. If anyone is stuck on useEffect dependencies, feel free to ask questions here!",
    createdAt: "2026-04-10T14:32:00Z",
    likes: 12,
    comments: [
      { id: "c1", authorName: "Tom Rivers", authorInitials: "TR", content: "Agreed! The cleanup function part was what clicked it for me.", createdAt: "2026-04-10T15:00:00Z" },
      { id: "c2", authorName: "Priya K.", authorInitials: "PK", content: "Would love a breakdown on stale closures if you have time!", createdAt: "2026-04-10T15:45:00Z" },
    ],
  },
  {
    id: "2",
    authorName: "Carlos Mendez",
    authorInitials: "CM",
    content: "Has anyone tried combining Next.js 15 Server Components with Prisma? Running into some issues with the Prisma client in server-only contexts.",
    createdAt: "2026-04-10T09:15:00Z",
    likes: 7,
    comments: [
      { id: "c3", authorName: "Lea Fontaine", authorInitials: "LF", content: "Yes! Make sure you're using the singleton pattern for the Prisma client — check the docs for the Next.js example.", createdAt: "2026-04-10T10:02:00Z" },
    ],
  },
  {
    id: "3",
    authorName: "Amara Osei",
    authorInitials: "AO",
    content: "Weekly tip: Use TypeScript's `satisfies` operator instead of type assertions when you want inference to work correctly. It's one of those features that sounds obscure but saves you constantly.",
    createdAt: "2026-04-09T16:00:00Z",
    likes: 24,
    comments: [],
  },
];

export function getCourseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getLessonById(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourseById(courseId);
  return course?.lessons.find((l) => l.id === lessonId);
}
