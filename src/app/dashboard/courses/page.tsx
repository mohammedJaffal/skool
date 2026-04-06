import { FoundationPlaceholder } from "@/components/shared/foundation-placeholder";

export default function CoursesPage() {
  return (
    <FoundationPlaceholder
      eyebrow="Sprint 01 Foundation"
      title="Courses"
      summary="Shared route scaffold for the course list and future course detail flow. This exists now so P1 can work inside the dashboard shell without inventing route structure."
      owner="P1"
      routeId="/dashboard/courses"
      implementationNotes={[
        "Build the course list UI here first.",
        "Use mock data until GET /api/courses is ready.",
        "Link course cards to /dashboard/courses/[courseId].",
      ]}
      dependencyNotes={[
        "P2 must provide GET /api/courses with stable field names.",
        "Course detail data can start mocked in Sprint 01.",
        "Do not add search here yet; search is deferred from Sprint 01.",
      ]}
    />
  );
}
