"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CommunityAuthLink({
  signedIn,
  className,
}: {
  signedIn: boolean;
  className: string;
}) {
  const pathname = usePathname();
  const href = signedIn
    ? "/dashboard"
    : `/auth/signin?callbackUrl=${encodeURIComponent(pathname || "/")}`;

  return (
    <Link href={href} className={className}>
      {signedIn ? "WORKSPACE" : "LOG IN"}
    </Link>
  );
}
