import { FoundationPlaceholder } from "@/components/shared/foundation-placeholder";

type LessonPageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params;

  return (
    <FoundationPlaceholder
      eyebrow="Sprint 01 Foundation"
      title="Lesson Viewer"
      summary="Shared lesson route for the viewer experience. This route is ready for P1 to build the layout and for P2 to later connect lesson data."
      owner="P1"
      routeId={`/dashboard/courses/${courseId}/lessons/${lessonId}`}
      implementationNotes={[
        "Use this page for lesson title, content, and optional video area.",
        "Treat lesson navigation as UI-only first if backend ordering is not ready.",
        "Keep the viewer readable on normal desktop screens before mobile polish.",
      ]}
      dependencyNotes={[
        "P2 must provide GET /api/lessons/:id in Sprint 01.",
        "Video upload and richer lesson media can wait until later sprint work.",
        "Route protection already comes from the dashboard shell.",
      ]}
    />
  );
}
