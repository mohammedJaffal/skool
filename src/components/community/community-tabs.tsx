"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type CommunityTabsProps = {
  slug: string;
};

const tabs = [
  { segment: "community", label: "Community" },
  { segment: "classroom", label: "Classroom" },
  { segment: "members", label: "Members" },
  { segment: "about", label: "About" },
];

export function CommunityTabs({ slug }: CommunityTabsProps) {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex w-[90vw] max-w-[1084px] gap-8 text-base">
      {tabs.map((tab) => {
        const href = `/communities/${slug}/${tab.segment}`;
        const active = pathname === href;

        return (
          <Link
            key={tab.segment}
            href={href}
            className={`border-b-[4px] px-1 py-4 font-medium ${
              active
                ? "border-[color:var(--foreground)] text-[color:var(--foreground)]"
                : "border-transparent text-[color:var(--muted)]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
