import { redirect } from "next/navigation";

type AnnouncementPageProps = {
  params: Promise<{ courseId: string; announcementId: string }>;
};

export default async function AnnouncementPage({
  params,
}: AnnouncementPageProps) {
  const { courseId, announcementId } = await params;
  redirect(`/dashboard/communities/${courseId}/posts/${announcementId}`);
}
