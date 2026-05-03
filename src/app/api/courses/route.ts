import { NextResponse } from "next/server";
import { COURSES } from "@/lib/mock-data";

export async function GET() {
  const summary = COURSES.map(({ id, title, description, instructor, price, duration, level, lessons }) => ({
    id,
    title,
    description,
    instructor,
    price,
    duration,
    level,
    lessonCount: lessons.length,
  }));

  return NextResponse.json(summary);
}
