export function FoundationPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-dashed border-[color:var(--line)] p-12 text-sm text-[color:var(--muted)]">
      {label} — coming soon
    </div>
  );
}
