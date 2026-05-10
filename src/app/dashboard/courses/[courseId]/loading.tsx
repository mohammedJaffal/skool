export default function CourseDetailLoading() {
  return (
    <section className="space-y-6 animate-pulse">
      <div className="h-4 w-32 rounded bg-[color:var(--line)]" />
      <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
        <div className="h-3 w-28 rounded bg-[color:var(--line)]" />
        <div className="mt-3 h-8 w-64 rounded bg-[color:var(--line)]" />
        <div className="mt-3 h-4 w-full rounded bg-[color:var(--line)]" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, section) => (
            <div
              key={section}
              className="rounded-[24px] border border-[color:var(--line)] bg-white p-5"
            >
              <div className="h-6 w-40 rounded bg-[color:var(--line)]" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 2 }).map((_, item) => (
                  <div
                    key={item}
                    className="rounded-[18px] bg-[color:var(--surface-soft)] p-4"
                  >
                    <div className="h-5 w-48 rounded bg-[color:var(--line)]" />
                    <div className="mt-3 h-4 w-full rounded bg-[color:var(--line)]" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-[24px] border border-[color:var(--line)] bg-white p-5">
          <div className="h-8 w-20 rounded bg-[color:var(--line)]" />
          <div className="mt-4 h-10 w-full rounded-full bg-[color:var(--line)]" />
        </div>
      </div>
    </section>
  );
}
