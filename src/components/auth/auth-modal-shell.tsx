"use client";

import { usePathname, useRouter } from "next/navigation";

export function AuthModalShell({
  children,
  closeHref,
}: {
  children: React.ReactNode;
  closeHref: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  if (!pathname?.startsWith("/auth/signin")) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(21,18,14,0.55)] px-4 py-10">
      <div className="absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-[560px]">
        <button
          type="button"
          aria-label="Close authentication dialog"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl font-semibold text-[color:var(--foreground)] shadow-sm"
          onClick={() => router.replace(closeHref, { scroll: false })}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
