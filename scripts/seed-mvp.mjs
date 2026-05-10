import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";

function readEnv(name) {
  if (process.env[name]) {
    return process.env[name];
  }

  const envFile = readFileSync(new URL("../.env", import.meta.url), "utf8");
  const match = envFile.match(new RegExp(`^${name}=\"?(.*)\"?$`, "m"));
  return match?.[1];
}

const connectionString = readEnv("DATABASE_URL");

if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding.");
}

const adapter = new PrismaPg(new Pool({ connectionString }));
const prisma = new PrismaClient({ adapter });

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

const PASSWORD = "Password123!";

async function upsertUser({ email, name, role, profile }) {
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role,
      passwordHash: hashPassword(PASSWORD),
    },
    create: {
      email,
      name,
      role,
      passwordHash: hashPassword(PASSWORD),
    },
  });

  if (role === "TEACHER") {
    await prisma.teacherProfile.upsert({
      where: { userId: user.id },
      update: {
        specialty: profile.specialty,
        bio: profile.bio,
      },
      create: {
        userId: user.id,
        specialty: profile.specialty,
        bio: profile.bio,
      },
    });
  }

  if (role === "LEARNER") {
    await prisma.learnerProfile.upsert({
      where: { userId: user.id },
      update: {
        track: profile.track,
        bio: profile.bio,
      },
      create: {
        userId: user.id,
        track: profile.track,
        bio: profile.bio,
      },
    });
  }

  return user;
}

async function replaceCourseBundle({ slug, title, description, type, teacherId, lessons, announcements }) {
  const existing = await prisma.course.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existing) {
    await prisma.course.delete({
      where: { id: existing.id },
    });
  }

  const course = await prisma.course.create({
    data: {
      slug,
      title,
      description,
      type,
      status: "PUBLISHED",
      teacherId,
      lessons: {
        create: lessons.map((lesson, index) => ({
          title: lesson.title,
          content: lesson.content,
          contentType: lesson.contentType,
          position: index + 1,
        })),
      },
      announcements: {
        create: announcements.map((announcement) => ({
          title: announcement.title,
          content: announcement.content,
          status: "PUBLISHED",
          publishedAt: new Date(),
          authorId: teacherId,
        })),
      },
    },
    include: {
      lessons: {
        orderBy: { position: "asc" },
      },
      announcements: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return course;
}

async function main() {
  const admin = await upsertUser({
    email: "admin@campus-digital.local",
    name: "Campus Admin",
    role: "ADMIN",
    profile: {},
  });

  const teacher = await upsertUser({
    email: "teacher@campus-digital.local",
    name: "Nadia Teacher",
    role: "TEACHER",
    profile: {
      specialty: "Frontend and product systems",
      bio: "Builds the core learning paths and guides the classroom.",
    },
  });

  const learner = await upsertUser({
    email: "learner@campus-digital.local",
    name: "Yassine Learner",
    role: "LEARNER",
    profile: {
      track: "Frontend engineering",
      bio: "Following the React and Next.js path.",
    },
  });

  const invitedLearner = await upsertUser({
    email: "invited@campus-digital.local",
    name: "Sara Invitee",
    role: "LEARNER",
    profile: {
      track: "Full-stack basics",
      bio: "Testing the invitation and request flow.",
    },
  });

  const reactCourse = await replaceCourseBundle({
    slug: "react-foundations-lab",
    title: "React Foundations Lab",
    description:
      "A guided React classroom with structured lessons, teacher announcements, and learner progress tracking.",
    type: "frontend",
    teacherId: teacher.id,
    lessons: [
      {
        title: "Component thinking",
        content:
          "Break UI into stable component boundaries and keep props clear from the start.",
        contentType: "video",
      },
      {
        title: "State and interaction",
        content:
          "Use state only where interaction requires it. Prefer predictable data flow over convenience.",
        contentType: "video",
      },
      {
        title: "Build the dashboard slice",
        content:
          "Apply the previous lessons in one dashboard implementation task with review checkpoints.",
        contentType: "workshop",
      },
    ],
    announcements: [
      {
        title: "Start here before lesson one",
        content:
          "Prepare your editor, run the project locally, and keep a short note of issues you hit while following the lesson.",
      },
      {
        title: "Weekly build checkpoint",
        content:
          "Push your branch before the end of the week and leave one short note about what is still blocked.",
      },
    ],
  });

  const nextCourse = await replaceCourseBundle({
    slug: "nextjs-launchpad",
    title: "Next.js Launchpad",
    description:
      "An App Router course focused on layouts, protected routes, and implementation discipline.",
    type: "fullstack",
    teacherId: teacher.id,
    lessons: [
      {
        title: "App Router structure",
        content:
          "Understand the route tree and use layouts to keep product structure coherent.",
        contentType: "video",
      },
      {
        title: "Protected route patterns",
        content:
          "Protect write-side actions server-side and keep read-side browsing flexible when possible.",
        contentType: "reading",
      },
      {
        title: "Deployment and review",
        content:
          "Prepare branch review, environment variables, and final integration checks.",
        contentType: "workshop",
      },
    ],
    announcements: [
      {
        title: "Read the route map first",
        content:
          "Map the pages and APIs before changing files. This reduces the chance of branch-level collisions.",
      },
    ],
  });

  await prisma.courseMembership.upsert({
    where: {
      courseId_learnerId: {
        courseId: reactCourse.id,
        learnerId: learner.id,
      },
    },
    update: {
      status: "ACTIVE",
      joinedAt: new Date(),
      endedAt: null,
    },
    create: {
      courseId: reactCourse.id,
      learnerId: learner.id,
      status: "ACTIVE",
      joinedAt: new Date(),
    },
  });

  await prisma.courseInvitation.create({
    data: {
      courseId: nextCourse.id,
      teacherId: teacher.id,
      learnerId: invitedLearner.id,
      status: "PENDING",
    },
  });

  await prisma.courseJoinRequest.create({
    data: {
      courseId: reactCourse.id,
      learnerId: invitedLearner.id,
      status: "PENDING",
    },
  });

  const firstAnnouncement = reactCourse.announcements[0];

  if (firstAnnouncement) {
    await prisma.comment.create({
      data: {
        announcementId: firstAnnouncement.id,
        authorId: learner.id,
        content:
          "The setup checklist helped. I was able to start following the lesson without getting blocked on local config.",
      },
    });
  }

  await prisma.lessonProgress.createMany({
    data: reactCourse.lessons.map((lesson, index) => ({
      lessonId: lesson.id,
      learnerId: learner.id,
      completed: index < 2,
      completedAt: index < 2 ? new Date() : null,
      lastViewedAt: new Date(),
    })),
    skipDuplicates: true,
  });

  await prisma.courseEvaluation.upsert({
    where: {
      courseId_learnerId: {
        courseId: reactCourse.id,
        learnerId: learner.id,
      },
    },
    update: {
      rating: 5,
      feedback: "Clear teacher guidance and useful branch review checkpoints.",
    },
    create: {
      courseId: reactCourse.id,
      learnerId: learner.id,
      rating: 5,
      feedback: "Clear teacher guidance and useful branch review checkpoints.",
    },
  });

  console.log("Seed completed.");
  console.log(`Admin: admin@campus-digital.local / ${PASSWORD}`);
  console.log(`Teacher: teacher@campus-digital.local / ${PASSWORD}`);
  console.log(`Learner: learner@campus-digital.local / ${PASSWORD}`);
  console.log(`Invitee: invited@campus-digital.local / ${PASSWORD}`);
  console.log(`Teacher owner: ${teacher.id}`);
  console.log(`Admin owner: ${admin.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
