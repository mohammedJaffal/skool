import Link from "next/link";
import { auth } from "@/auth";
import { COURSES, POSTS } from "@/lib/mock-data";

export default async function HomePage() {
  const session = await auth();
  const featuredCourses = COURSES.slice(0, 3);
  const latestPosts = POSTS.slice(0, 3);

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-8">
      <header className="rounded-3xl border border-[color:var(--line)] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Campus Digital
          </p>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Go To Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Sign In
            </Link>
          )}
        </div>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">
          Learn in communities. Follow lessons. Share progress.
        </h1>
        <p className="mt-3 max-w-2xl text-[color:var(--muted)]">
          Public browsing is open. Authentication is only required when you
          enter protected workspace actions.
        </p>
      </header>

      <section className="mt-6 rounded-3xl border border-[color:var(--line)] bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Featured Courses</h2>
          <Link
            href="/dashboard/courses"
            className="text-sm font-semibold text-[color:var(--brand)] hover:underline"
          >
            Open Course Workspace
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {featuredCourses.map((course) => (
            <article
              key={course.id}
              className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
            >
              <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">
                {course.level}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{course.title}</h3>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                {course.description}
              </p>
              <p className="mt-3 text-sm font-medium">
                {course.lessons.length} lessons · {course.duration}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-[color:var(--line)] bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Community Feed</h2>
          <Link
            href="/dashboard/community"
            className="text-sm font-semibold text-[color:var(--brand)] hover:underline"
          >
            Open Community Workspace
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {latestPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-xs font-semibold">
                  {post.authorInitials}
                </div>
                <p className="font-semibold">{post.authorName}</p>
              </div>
              <p className="mt-3 text-sm text-[color:var(--foreground)]">{post.content}</p>
              <p className="mt-2 text-xs text-[color:var(--muted)]">
                {post.likes} likes · {post.comments.length} comments
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
