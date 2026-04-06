import { FoundationPlaceholder } from "@/components/shared/foundation-placeholder";

type CourseDetailPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { courseId } = await params;

  return (
    <FoundationPlaceholder
      eyebrow="Sprint 01 Foundation"
      title="Course Detail"
      summary="Shared detail route for individual course pages. It can render mocked course content first and later switch to API-backed data without changing the route contract."
      owner="P1"
      routeId={`/dashboard/courses/${courseId}`}
      implementationNotes={[
        "Use this page for course description, lesson list, and enroll entry point.",
        "Link lessons to /dashboard/courses/[courseId]/lessons/[lessonId].",
        "Keep the route shape stable even if data is mocked initially.",
      ]}
      dependencyNotes={[
        "Sprint 01 only guarantees GET /api/courses for foundation work.",
        "P2 should publish stable course payload examples before full integration.",
        "A usable enroll backend flow is deferred to Sprint 02.",
      ]}
    />
  );
}
