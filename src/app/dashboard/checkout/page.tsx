import { EnrollForm } from "@/components/checkout/enroll-form";
import { getCourseDetailById, listCourseCards } from "@/lib/platform-data";

interface Props {
  searchParams: Promise<{ courseId?: string }>;
}

export default async function CheckoutPage({ searchParams }: Props) {
  const { courseId } = await searchParams;
  const cards = await listCourseCards();
  const firstCourseId = cards[0]?.id;
  const course = courseId
    ? await getCourseDetailById(courseId)
    : firstCourseId
      ? await getCourseDetailById(firstCourseId)
      : null;
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
        <EnrollForm
          course={{
            id: course.id,
            title: course.title,
            price: course.price,
            instructor: course.instructor,
            duration: course.duration,
            level: course.level,
            lessons: course.lessons,
          }}
        />
      </div>
    </div>
  );
}
