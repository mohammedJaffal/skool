import { redirect } from "next/navigation";

type LessonPageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params;
  redirect(`/dashboard/communities/${courseId}/classroom/${lessonId}`);
}
