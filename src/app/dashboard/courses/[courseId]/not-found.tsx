import Link from "next/link";

export default function CourseNotFound() {
  return (
    <section className="rounded-[24px] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-soft)] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
        Course error
      </p>
      <h1 className="mt-2 text-2xl font-bold">Course not found</h1>
      <p className="mt-2 text-sm text-[color:var(--muted)]">
        The requested classroom folder does not exist or is no longer available.
      </p>
      <Link
        href="/dashboard/courses"
        className="mt-4 inline-block rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold"
      >
        Back to classroom
      </Link>
    </section>
  );
}
