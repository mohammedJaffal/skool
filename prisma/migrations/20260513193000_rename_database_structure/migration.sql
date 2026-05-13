-- Rename enum types to match the community-first domain.
ALTER TYPE "CourseStatus" RENAME TO "CommunityStatus";
ALTER TYPE "AnnouncementStatus" RENAME TO "PostStatus";

-- Rename core tables.
ALTER TABLE "Course" RENAME TO "Community";
ALTER TABLE "Lesson" RENAME TO "ClassroomItem";
ALTER TABLE "CourseMembership" RENAME TO "CommunityMembership";
ALTER TABLE "CourseInvitation" RENAME TO "CommunityInvitation";
ALTER TABLE "CourseJoinRequest" RENAME TO "CommunityJoinRequest";
ALTER TABLE "Announcement" RENAME TO "CommunityPost";
ALTER TABLE "CourseEvaluation" RENAME TO "CommunityEvaluation";
ALTER TABLE "LessonProgress" RENAME TO "ClassroomItemProgress";
ALTER TABLE "CourseDocument" RENAME TO "CommunityDocument";

-- Rename core columns to match the new structure.
ALTER TABLE "Community" RENAME COLUMN "teacherId" TO "ownerId";
ALTER TABLE "ClassroomItem" RENAME COLUMN "courseId" TO "communityId";
ALTER TABLE "CommunityMembership" RENAME COLUMN "courseId" TO "communityId";
ALTER TABLE "CommunityMembership" RENAME COLUMN "learnerId" TO "memberId";
ALTER TABLE "CommunityInvitation" RENAME COLUMN "courseId" TO "communityId";
ALTER TABLE "CommunityInvitation" RENAME COLUMN "teacherId" TO "ownerId";
ALTER TABLE "CommunityInvitation" RENAME COLUMN "learnerId" TO "memberId";
ALTER TABLE "CommunityJoinRequest" RENAME COLUMN "courseId" TO "communityId";
ALTER TABLE "CommunityJoinRequest" RENAME COLUMN "learnerId" TO "memberId";
ALTER TABLE "CommunityPost" RENAME COLUMN "courseId" TO "communityId";
ALTER TABLE "Comment" RENAME COLUMN "announcementId" TO "postId";
ALTER TABLE "CommunityEvaluation" RENAME COLUMN "courseId" TO "communityId";
ALTER TABLE "CommunityEvaluation" RENAME COLUMN "learnerId" TO "memberId";
ALTER TABLE "ClassroomItemProgress" RENAME COLUMN "lessonId" TO "classroomItemId";
ALTER TABLE "ClassroomItemProgress" RENAME COLUMN "learnerId" TO "memberId";
ALTER TABLE "CommunityDocument" RENAME COLUMN "courseId" TO "communityId";

-- Rename primary keys and indexes so the physical database no longer carries legacy names.
ALTER TABLE "Community" RENAME CONSTRAINT "Course_pkey" TO "Community_pkey";
ALTER INDEX "Course_slug_key" RENAME TO "Community_slug_key";
ALTER INDEX "Course_teacherId_idx" RENAME TO "Community_ownerId_idx";
ALTER INDEX "Course_status_idx" RENAME TO "Community_status_idx";
ALTER TABLE "Community" RENAME CONSTRAINT "Course_teacherId_fkey" TO "Community_ownerId_fkey";

ALTER TABLE "ClassroomItem" RENAME CONSTRAINT "Lesson_pkey" TO "ClassroomItem_pkey";
ALTER INDEX "Lesson_courseId_idx" RENAME TO "ClassroomItem_communityId_idx";
ALTER INDEX "Lesson_courseId_position_key" RENAME TO "ClassroomItem_communityId_position_key";
ALTER TABLE "ClassroomItem" RENAME CONSTRAINT "Lesson_courseId_fkey" TO "ClassroomItem_communityId_fkey";

ALTER TABLE "CommunityMembership" RENAME CONSTRAINT "CourseMembership_pkey" TO "CommunityMembership_pkey";
ALTER INDEX "CourseMembership_learnerId_idx" RENAME TO "CommunityMembership_memberId_idx";
ALTER INDEX "CourseMembership_status_idx" RENAME TO "CommunityMembership_status_idx";
ALTER INDEX "CourseMembership_courseId_learnerId_key" RENAME TO "CommunityMembership_communityId_memberId_key";
ALTER TABLE "CommunityMembership" RENAME CONSTRAINT "CourseMembership_courseId_fkey" TO "CommunityMembership_communityId_fkey";
ALTER TABLE "CommunityMembership" RENAME CONSTRAINT "CourseMembership_learnerId_fkey" TO "CommunityMembership_memberId_fkey";

ALTER TABLE "CommunityInvitation" RENAME CONSTRAINT "CourseInvitation_pkey" TO "CommunityInvitation_pkey";
ALTER INDEX "CourseInvitation_courseId_idx" RENAME TO "CommunityInvitation_communityId_idx";
ALTER INDEX "CourseInvitation_teacherId_idx" RENAME TO "CommunityInvitation_ownerId_idx";
ALTER INDEX "CourseInvitation_learnerId_idx" RENAME TO "CommunityInvitation_memberId_idx";
ALTER INDEX "CourseInvitation_status_idx" RENAME TO "CommunityInvitation_status_idx";
ALTER INDEX "CourseInvitation_pending_courseId_learnerId_key" RENAME TO "CommunityInvitation_pending_communityId_memberId_key";
ALTER TABLE "CommunityInvitation" RENAME CONSTRAINT "CourseInvitation_courseId_fkey" TO "CommunityInvitation_communityId_fkey";
ALTER TABLE "CommunityInvitation" RENAME CONSTRAINT "CourseInvitation_teacherId_fkey" TO "CommunityInvitation_ownerId_fkey";
ALTER TABLE "CommunityInvitation" RENAME CONSTRAINT "CourseInvitation_learnerId_fkey" TO "CommunityInvitation_memberId_fkey";

ALTER TABLE "CommunityJoinRequest" RENAME CONSTRAINT "CourseJoinRequest_pkey" TO "CommunityJoinRequest_pkey";
ALTER INDEX "CourseJoinRequest_courseId_idx" RENAME TO "CommunityJoinRequest_communityId_idx";
ALTER INDEX "CourseJoinRequest_learnerId_idx" RENAME TO "CommunityJoinRequest_memberId_idx";
ALTER INDEX "CourseJoinRequest_status_idx" RENAME TO "CommunityJoinRequest_status_idx";
ALTER INDEX "CourseJoinRequest_reviewedById_idx" RENAME TO "CommunityJoinRequest_reviewedById_idx";
ALTER INDEX "CourseJoinRequest_pending_courseId_learnerId_key" RENAME TO "CommunityJoinRequest_pending_communityId_memberId_key";
ALTER TABLE "CommunityJoinRequest" RENAME CONSTRAINT "CourseJoinRequest_courseId_fkey" TO "CommunityJoinRequest_communityId_fkey";
ALTER TABLE "CommunityJoinRequest" RENAME CONSTRAINT "CourseJoinRequest_learnerId_fkey" TO "CommunityJoinRequest_memberId_fkey";
ALTER TABLE "CommunityJoinRequest" RENAME CONSTRAINT "CourseJoinRequest_reviewedById_fkey" TO "CommunityJoinRequest_reviewedById_fkey";

ALTER TABLE "CommunityPost" RENAME CONSTRAINT "Announcement_pkey" TO "CommunityPost_pkey";
ALTER INDEX "Announcement_courseId_idx" RENAME TO "CommunityPost_communityId_idx";
ALTER INDEX "Announcement_authorId_idx" RENAME TO "CommunityPost_authorId_idx";
ALTER INDEX "Announcement_status_idx" RENAME TO "CommunityPost_status_idx";
ALTER TABLE "CommunityPost" RENAME CONSTRAINT "Announcement_courseId_fkey" TO "CommunityPost_communityId_fkey";

ALTER INDEX "Comment_announcementId_idx" RENAME TO "Comment_postId_idx";
ALTER TABLE "Comment" RENAME CONSTRAINT "Comment_announcementId_fkey" TO "Comment_postId_fkey";

ALTER TABLE "CommunityEvaluation" RENAME CONSTRAINT "CourseEvaluation_pkey" TO "CommunityEvaluation_pkey";
ALTER INDEX "CourseEvaluation_learnerId_idx" RENAME TO "CommunityEvaluation_memberId_idx";
ALTER INDEX "CourseEvaluation_courseId_learnerId_key" RENAME TO "CommunityEvaluation_communityId_memberId_key";
ALTER TABLE "CommunityEvaluation" RENAME CONSTRAINT "CourseEvaluation_courseId_fkey" TO "CommunityEvaluation_communityId_fkey";
ALTER TABLE "CommunityEvaluation" RENAME CONSTRAINT "CourseEvaluation_learnerId_fkey" TO "CommunityEvaluation_memberId_fkey";

ALTER TABLE "ClassroomItemProgress" RENAME CONSTRAINT "LessonProgress_pkey" TO "ClassroomItemProgress_pkey";
ALTER INDEX "LessonProgress_learnerId_idx" RENAME TO "ClassroomItemProgress_memberId_idx";
ALTER INDEX "LessonProgress_lessonId_learnerId_key" RENAME TO "ClassroomItemProgress_classroomItemId_memberId_key";
ALTER TABLE "ClassroomItemProgress" RENAME CONSTRAINT "LessonProgress_lessonId_fkey" TO "ClassroomItemProgress_classroomItemId_fkey";
ALTER TABLE "ClassroomItemProgress" RENAME CONSTRAINT "LessonProgress_learnerId_fkey" TO "ClassroomItemProgress_memberId_fkey";

ALTER TABLE "CommunityDocument" RENAME CONSTRAINT "CourseDocument_pkey" TO "CommunityDocument_pkey";
ALTER INDEX "CourseDocument_courseId_idx" RENAME TO "CommunityDocument_communityId_idx";
ALTER TABLE "CommunityDocument" RENAME CONSTRAINT "CourseDocument_courseId_fkey" TO "CommunityDocument_communityId_fkey";
