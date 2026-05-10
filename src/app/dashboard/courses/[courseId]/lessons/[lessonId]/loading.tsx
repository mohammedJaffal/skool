export default function LessonLoading() {
  return (
    <section className="space-y-6 animate-pulse">
      <div className="h-4 w-56 rounded bg-[color:var(--line)]" />
      <div className="aspect-video rounded-[24px] bg-[color:var(--line)]" />
      <div className="h-8 w-72 rounded bg-[color:var(--line)]" />
      <div className="rounded-[24px] border border-[color:var(--line)] bg-white p-6">
        <div className="h-5 w-32 rounded bg-[color:var(--line)]" />
        <div className="mt-4 h-4 w-full rounded bg-[color:var(--line)]" />
        <div className="mt-2 h-4 w-5/6 rounded bg-[color:var(--line)]" />
      </div>
    </section>
  );
}
