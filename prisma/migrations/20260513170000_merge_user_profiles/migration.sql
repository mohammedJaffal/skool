CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialty" TEXT,
    "track" TEXT,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

ALTER TABLE "UserProfile"
ADD CONSTRAINT "UserProfile_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "UserProfile" ("id", "userId", "specialty", "track", "bio", "createdAt", "updatedAt")
SELECT
    'uprofile_' || COALESCE(tp."userId", lp."userId") AS "id",
    COALESCE(tp."userId", lp."userId") AS "userId",
    tp."specialty" AS "specialty",
    lp."track" AS "track",
    COALESCE(tp."bio", lp."bio") AS "bio",
    COALESCE(tp."createdAt", lp."createdAt", CURRENT_TIMESTAMP) AS "createdAt",
    COALESCE(tp."updatedAt", lp."updatedAt", CURRENT_TIMESTAMP) AS "updatedAt"
FROM "TeacherProfile" tp
FULL OUTER JOIN "LearnerProfile" lp
    ON tp."userId" = lp."userId";

DROP TABLE "TeacherProfile";
DROP TABLE "LearnerProfile";
