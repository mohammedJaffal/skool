import { redirect } from "next/navigation";

type CoursesPageProps = {
  searchParams: Promise<{ query?: string; q?: string }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const query = params.q ?? params.query ?? "";

  if (query) {
    redirect(`/dashboard/communities?q=${encodeURIComponent(query)}`);
  }

  redirect("/dashboard/communities");
}
