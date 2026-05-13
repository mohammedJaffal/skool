"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function AuthModeLink({
  mode,
  callbackUrl,
  children,
  className,
}: {
  mode: "signin" | "signup";
  callbackUrl: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <button
      type="button"
      onClick={() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("callbackUrl", callbackUrl);
        params.set("mode", mode);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }}
      className={className}
    >
      {children}
    </button>
  );
}
