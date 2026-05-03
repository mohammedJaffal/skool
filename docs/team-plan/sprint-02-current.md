# Sprint 02 - Current

Window: April 13, 2026 to April 26, 2026

Status: Planned - not active yet

Roadmap anchor:
- Sprint 02
- Teacher course management and first write-side classroom flow

Conception impact:
- Modules: Course Catalog And Course Workspace, Lesson Management, Course Communication, Dashboard Shell, Review / Integration / Deployment
- Entities/APIs: `Course`, `Lesson`, `Comment`, `POST /api/courses`, `PATCH /api/courses/:courseId`, `POST /api/courses/:courseId/lessons`, `PATCH /api/lessons/:lessonId`, comment read/write completion

Workload target:
- P1 about `125`
- P3 about `100`
- P2 about `75`

Status rules:
- `[ ]` not done
- `[x]` validated and accepted
- This sprint is a plan only until Sprint 01 is accepted

## P1 - Frontend - Sadik

### 1. Teacher Course Manager UI
- [ ] Course management page structure
- [ ] Course create form UI
- [ ] Course edit form UI
- Done means: a teacher has one clear screen to start and update course data from the protected shell.

### 2. Lesson Create And Edit UI
- [ ] Add lesson form UI
- [ ] Edit lesson form UI
- [ ] Stable lesson ordering and position controls in the UI
- Done means: a teacher can manage lesson content flow from the teacher-facing interface.

### 3. Comment Interaction UI
- [ ] Comment create form UI
- [ ] Comment list rendering aligned with announcement pages
- [ ] Basic success and error states for comment actions
- Done means: course communication is no longer read-only on the frontend.

### 4. Loading And Mobile Polish
- [ ] Loading states for teacher write flows
- [ ] Error handling states for create/edit screens
- [ ] Mobile polish on teacher course and lesson pages
- Done means: the teacher write-side flow is usable without obvious UI breakage.

Validation:
- Branch: `sadik`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P2 - Backend - Sabri

### 1. Course Write APIs
- [ ] `POST /api/courses`
- [ ] `PATCH /api/courses/:courseId`
- [ ] Teacher/admin authorization checks for course ownership
- Done means: course creation and update can happen through stable server routes with ownership enforcement.

### 2. Lesson Write APIs
- [ ] `POST /api/courses/:courseId/lessons`
- [ ] `PATCH /api/lessons/:lessonId`
- [ ] Stable lesson position handling in server logic
- Done means: lessons can be created and updated with stable contracts for teacher workflows.

### 3. Comment Flow Completion
- [ ] Complete comment read contract where needed
- [ ] Add comment create endpoint
- [ ] Keep payload shapes stable for course communication UI
- Done means: the first write-side communication action works end-to-end.

### 4. Shared Write Contracts
- [ ] Publish example payloads for course create/update
- [ ] Publish example payloads for lesson create/update
- [ ] Confirm all write-side contracts with P1 and P3
- Done means: teacher write flows can integrate without guessing field names or route behavior.

Validation:
- Branch: `sabri`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P3 - Integration - Jaffal

### 1. Teacher And Admin Ownership Guards
- [ ] Enforce teacher/admin ownership checks across new write-side routes
- [ ] Validate route protection for teacher-facing pages
- [ ] Check that learner-facing users do not see teacher-only actions
- Done means: write-side classroom flow is protected by role and ownership rules, not only by UI hiding.

### 2. Shell And Navigation Updates
- [ ] Add teacher-facing route entry points to the shared shell
- [ ] Keep learner and teacher navigation coherent
- [ ] Prevent route collisions with Sprint 01 read-side pages
- Done means: teacher write flows fit into the protected dashboard without navigation confusion.

### 3. Integration And Review Pass
- [ ] Review accepted P1 and P2 write-side work
- [ ] Integrate course, lesson, and comment flows into one protected slice
- [ ] Verify payload and route consistency against the conception
- Done means: Sprint 02 produces one usable teacher-side classroom management flow.

Validation:
- Branch: `jaffal`
- Reviewer:
- Review date:
- Result:
- Merge status:

## Dependency Gate For Sprint 03

Do not start Sprint 03 until:
- teacher course create/update works at MVP level
- teacher lesson create/update works at MVP level
- comment flow is no longer read-only
- teacher-only navigation and ownership guards are accepted
