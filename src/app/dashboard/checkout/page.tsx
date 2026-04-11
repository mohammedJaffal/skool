import Link from "next/link";
import { COURSES } from "@/lib/mock-data";
import { EnrollForm } from "@/components/checkout/enroll-form";

type CheckoutPageProps = {
  searchParams: Promise<{ courseId?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { courseId } = await searchParams;
  const course = COURSES.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center space-y-3">
          <p className="text-gray-500 text-sm">No course selected.</p>
          <Link
            href="/dashboard/courses"
            className="inline-block rounded-xl bg-black text-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-800 transition"
          >
            Browse courses
          </Link>
        </div>
      </div>
    );
  }

  const courseSummary = {
    id: course.id,
    title: course.title,
    instructor: course.instructor,
    price: course.price,
    duration: course.duration,
    level: course.level,
    lessonCount: course.lessons.length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/courses/${course.id}`}
          className="text-sm text-gray-500 hover:text-gray-800 transition"
        >
          ← Back to course
        </Link>
      </div>
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="max-w-lg">
        <EnrollForm course={courseSummary} />
      </div>
    </div>
  );
}
