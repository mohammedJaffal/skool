import { redirect } from "next/navigation";

type MembersPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function MembersPage({ params }: MembersPageProps) {
  const { courseId } = await params;
  redirect(`/dashboard/communities/${courseId}/members`);
}
