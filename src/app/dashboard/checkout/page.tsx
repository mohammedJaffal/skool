import { getCourseById, COURSES } from "@/lib/mock-data";
import { EnrollForm } from "@/components/checkout/enroll-form";

interface Props {
  searchParams: Promise<{ courseId?: string }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { courseId } = await searchParams;
  const course = courseId ? getCourseById(courseId) : COURSES[0];
  if (!course)
    return (
      <p className="text-[color:var(--muted)]">Course not found.</p>
    );

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Checkout
        </p>
        <h1 className="text-2xl font-semibold">Enroll in Course</h1>
      </div>
      <div className="mx-auto max-w-md">
        <EnrollForm course={course} />
      </div>
    </div>
  );
}
