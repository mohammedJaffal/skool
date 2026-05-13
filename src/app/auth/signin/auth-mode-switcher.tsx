"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AuthModeSwitcher({
  mode,
  callbackUrl,
}: {
  mode: "signin" | "signup";
  callbackUrl: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchMode(nextMode: "signin" | "signup") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("callbackUrl", callbackUrl);
    params.set("mode", nextMode);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mt-8 grid grid-cols-2 rounded-full bg-[color:var(--surface-soft)] p-1">
      <button
        type="button"
        onClick={() => switchMode("signin")}
        className={`rounded-full px-4 py-3 text-center text-sm font-semibold transition ${
          mode === "signin"
            ? "bg-white text-[color:var(--foreground)] shadow-sm"
            : "text-[color:var(--muted)]"
        }`}
      >
        Log in
      </button>
      <button
        type="button"
        onClick={() => switchMode("signup")}
        className={`rounded-full px-4 py-3 text-center text-sm font-semibold transition ${
          mode === "signup"
            ? "bg-white text-[color:var(--foreground)] shadow-sm"
            : "text-[color:var(--muted)]"
        }`}
      >
        Sign up
      </button>
    </div>
  );
}
