"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CommunityJoinButtonProps = {
  communityId: string | null;
  slug: string;
  signedIn: boolean;
  isMember: boolean;
  isFree: boolean;
  className?: string;
};

export function CommunityJoinButton({
  communityId,
  slug,
  signedIn,
  isMember,
  isFree,
  className = "",
}: CommunityJoinButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  if (isMember) {
    return (
      <Link
        href={`/communities/${slug}/community`}
        className={className}
      >
        Open community
      </Link>
    );
  }

  if (!communityId) {
    return null;
  }

  if (!signedIn) {
    return (
      <Link
        href={`/auth/signin?callbackUrl=${encodeURIComponent(`/communities/${slug}/about`)}`}
        className={className}
      >
        {isFree ? "Join group" : "Sign in to join"}
      </Link>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={status === "loading" || status === "done"}
        onClick={async () => {
          setStatus("loading");
          setError("");

          const response = await fetch(`/api/communities/${communityId}/join-requests`, {
            method: "POST",
          });

          const payload = (await response.json().catch(() => null)) as
            | { joined?: boolean; error?: string }
            | null;

          if (!response.ok) {
            setStatus("idle");
            setError(payload?.error ?? "Could not join this community.");
            return;
          }

          setStatus("done");
          router.refresh();
          router.push(`/communities/${slug}/community`);
        }}
        className={className}
      >
        {status === "loading"
          ? "Joining..."
          : status === "done"
            ? "Opening..."
            : isFree
              ? "Join group"
              : "Request access"}
      </button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
