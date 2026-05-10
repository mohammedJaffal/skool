export default function AnnouncementLoading() {
  return (
    <section className="space-y-6 animate-pulse">
      <div className="h-4 w-56 rounded bg-[color:var(--line)]" />
      <div className="rounded-[24px] border border-[color:var(--line)] bg-white p-6">
        <div className="h-3 w-32 rounded bg-[color:var(--line)]" />
        <div className="mt-3 h-8 w-3/4 rounded bg-[color:var(--line)]" />
        <div className="mt-6 h-24 rounded-[18px] bg-[color:var(--line)]" />
      </div>
      <div className="rounded-[24px] border border-[color:var(--line)] bg-white p-6">
        <div className="h-6 w-40 rounded bg-[color:var(--line)]" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[18px] bg-[color:var(--surface-soft)] p-4"
            >
              <div className="h-4 w-32 rounded bg-[color:var(--line)]" />
              <div className="mt-3 h-4 w-full rounded bg-[color:var(--line)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
