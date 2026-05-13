CREATE TABLE "CourseDocument" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CourseDocument_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CourseDocument_courseId_idx" ON "CourseDocument"("courseId");

ALTER TABLE "CourseDocument"
ADD CONSTRAINT "CourseDocument_courseId_fkey"
FOREIGN KEY ("courseId") REFERENCES "Course"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
