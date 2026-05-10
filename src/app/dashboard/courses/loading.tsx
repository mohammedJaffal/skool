export default function CoursesLoading() {
  return (
    <section className="space-y-5 animate-pulse">
      <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
        <div className="h-3 w-28 rounded bg-[color:var(--line)]" />
        <div className="mt-3 h-8 w-56 rounded bg-[color:var(--line)]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[24px] border border-[color:var(--line)] bg-white p-4"
          >
            <div className="rounded-[18px] bg-[color:var(--surface-soft)] p-4">
              <div className="h-5 w-32 rounded bg-[color:var(--line)]" />
              <div className="mt-3 h-4 w-full rounded bg-[color:var(--line)]" />
              <div className="mt-2 h-4 w-4/5 rounded bg-[color:var(--line)]" />
            </div>
            <div className="mt-4 h-4 w-2/3 rounded bg-[color:var(--line)]" />
          </div>
        ))}
      </div>
    </section>
  );
}
