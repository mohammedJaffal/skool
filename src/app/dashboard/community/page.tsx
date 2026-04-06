import { FoundationPlaceholder } from "@/components/shared/foundation-placeholder";

export default function CommunityPage() {
  return (
    <FoundationPlaceholder
      eyebrow="Sprint 01 Foundation"
      title="Community"
      summary="Shared route scaffold for the first community feed. The route is ready now so feed UI, post form UI, and later comment integration all land in one agreed location."
      owner="P1"
      routeId="/dashboard/community"
      implementationNotes={[
        "Build the first post list and create-post form here.",
        "Comments can start as UI structure first and become connected later.",
        "Keep loading and empty states visible from the start.",
      ]}
      dependencyNotes={[
        "P2 must provide GET /api/posts and POST /api/posts in Sprint 01.",
        "Comment backend is not required to be fully connected yet.",
        "Notifications are deferred and should not shape this page now.",
      ]}
    />
  );
}
