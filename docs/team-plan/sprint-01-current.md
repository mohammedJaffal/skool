# Sprint 01 - Current

Window: March 30, 2026 to April 12, 2026

Status: Active

Roadmap anchor:
- Sprint 01
- Auth/shell foundation plus read-side course, lesson, and announcement foundation

Conception impact:
- Modules: Authentication And Account, Dashboard Shell, Course Catalog And Course Workspace, Lesson Management, Course Communication, Review / Integration / Deployment
- Entities/APIs: `TeacherProfile`, `LearnerProfile`, `Course`, `Lesson`, `Announcement`, `Comment`, `GET /api/courses`, `GET /api/courses/:courseId`, `GET /api/courses/:courseId/lessons`, `GET /api/lessons/:lessonId`, `GET /api/courses/:courseId/announcements`

Workload target:
- P1 about `125`
- P3 about `100`
- P2 about `75`

Status rules:
- `[ ]` not done
- `[x]` validated and accepted
- Do not mark complete before review

## P1 - Frontend - Sadik

### 1. Course List And Course Detail
- [x] Course list page UI
- [x] Course detail page UI
- [x] Shared loading, empty, and error states for course read pages
- Done means: learners can browse from course list to course detail with stable UI against mock or real read contracts.

### 2. Lesson Viewer
- [x] Lesson content layout
- [x] Lesson page UI
- [x] Lesson navigation or lesson position handling
- Done means: one lesson can be opened clearly from a course flow and viewed without layout confusion.

### 3. Announcement Read Flow
- [x] Announcement list/read UI inside course flow
- [x] Comment read UI for announcement discussions
- [x] Loading and empty states for course communication reads
- Done means: a learner can open course communication pages and read announcements and existing comments clearly.

### 4. UI Quality Pass For Read Foundation
- [x] Route-to-route consistency across course, lesson, and announcement pages
- [ ] Basic mobile polish on the new read-side pages
- [x] Stable mock-data fallback until backend contracts are accepted
- Done means: the Sprint 01 learner read experience feels like one connected protected product flow.

Validation:
- Branch: `sadik`
- Reviewer: `jaffal`
- Review date: `2026-05-10`
- Result: `Mostly complete (read-side flow is integrated; mobile polish still open)`
- Merge status: `Merged to main`

## P2 - Backend - Sabri

### 1. Domain Foundation Schema
- [x] Add `TeacherProfile`
- [x] Add `LearnerProfile`
- [x] Add `Course`
- [x] Add `Lesson`
- [x] Add `Announcement`
- [x] Add `Comment`
- Done means: the first Campus Digital domain structure exists in Prisma with stable names for the team.

### 2. Migration And Stable Field Contracts
- [x] Create migration for the new domain schema
- [x] Publish stable field names and relations for frontend/integration work
- [x] Keep naming aligned with `docs/SOFTWARE_CONCEPTION.md`
- Done means: the team can build against the same model vocabulary without guessing or drift.

### 3. Read Foundation APIs
- [x] `GET /api/courses`
- [x] `GET /api/courses/:courseId`
- [x] `GET /api/courses/:courseId/lessons`
- [x] `GET /api/lessons/:lessonId`
- [x] `GET /api/courses/:courseId/announcements`
- Done means: the protected frontend can fetch first read-side classroom and communication data with stable payloads.

### 4. Shared Read Contracts
- [x] Publish example payloads for courses, lessons, announcements, and comments
- [x] Confirm response shapes with P1 and P3
- [x] Keep comment structure ready for later write-side flow
- Done means: read-side integration can proceed without route or payload ambiguity.

Validation:
- Branch: `sabri`
- Reviewer: `jaffal`
- Review date: `2026-05-10`
- Result: `Complete for foundation scope`
- Merge status: `Merged to main`

## P3 - Integration - Jaffal

P3 starts first.

### 1. Auth And Route Protection Pass
- [x] Verify auth config and auth routes
- [x] Verify protected dashboard behavior
- [x] Fix auth or redirect issues found during integration
- Done means: login and protected routes work consistently across the main dashboard flow.

### 2. Role-Aware Dashboard Shell
- [x] Sidebar and top navigation stability
- [x] Shared layout connects current sprint pages
- [x] Keep route placeholders ready for course, lesson, and announcement reads
- Done means: the protected shell can host Sprint 01 read pages without route-level breaks.

### 3. Review And Deploy Foundation
- [x] Keep deploy checklist and branch workflow current
- [x] Prepare branch review flow for incoming P1 and P2 work
- [x] Keep shared routes, navigation, and layout ready for incoming page/API work
- Done means: P3 is ready to validate, merge, and stabilize incoming Sprint 01 work.

### 4. Sprint 01 Acceptance Gate
- [x] Run branch review and merge checks for P1 and P2
- [x] Integrate accepted P1 and P2 work into the protected shell
- [x] Validate role-aware navigation against accepted read-side routes
- Done means: accepted Sprint 01 work behaves as one protected read-side MVP slice.

Validation:
- Branch: `jaffal`
- Reviewer: `jaffal`
- Review date: `2026-05-10`
- Result: `Complete for Sprint 01 integration scope`
- Merge status: `Merged to main`

## Dependency Gate For Sprint 02

Do not start Sprint 02 until:
- read-side schema and migration are accepted
- course, lesson, and announcement read routes are accepted
- protected shell hosts the accepted read pages without integration breaks
- the team is building against one stable Campus Digital domain vocabulary
