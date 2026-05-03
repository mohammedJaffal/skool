# Sprint 03 - Current

Window: April 27, 2026 to May 10, 2026

Status: Planned - not active yet

Roadmap anchor:
- Sprint 03
- Course access control through memberships, invitations, and join requests

Conception impact:
- Modules: Invitations And Join Requests, Course Catalog And Course Workspace, Lesson Management, Dashboard Shell, Review / Integration / Deployment
- Entities/APIs: `CourseMembership`, `CourseInvitation`, `CourseJoinRequest`, membership-aware lesson access, invitation and join request routes

Workload target:
- P1 about `125`
- P3 about `100`
- P2 about `75`

Status rules:
- `[ ]` not done
- `[x]` validated and accepted
- This sprint is a plan only until Sprint 02 is accepted

## P1 - Frontend - Sadik

### 1. Join Request UI
- [ ] Join request action on course pages
- [ ] Pending, accepted, rejected, and blocked UI states
- [ ] Learner-facing feedback screens for access requests
- Done means: a learner can understand and trigger the course join request flow from the UI.

### 2. Invitation Inbox UI
- [ ] Invitation list or inbox screen
- [ ] Accept and reject actions in the UI
- [ ] Invitation status rendering
- Done means: a learner can process course invitations from one clear protected screen.

### 3. Course Members UI
- [ ] Teacher-facing course members page
- [ ] Membership status rendering
- [ ] Teacher action entry points for invitation/review/removal flows
- Done means: a teacher can see and act on course membership from one course context.

### 4. Access-State Screens
- [ ] Locked lesson state UI
- [ ] Not-yet-member course access UI
- [ ] Removed/rejected access state UI
- Done means: the product clearly communicates course access state instead of failing silently.

Validation:
- Branch: `sadik`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P2 - Backend - Sabri

### 1. Membership Domain Schema
- [ ] Add `CourseMembership`
- [ ] Add `CourseInvitation`
- [ ] Add `CourseJoinRequest`
- [ ] Create migration and stable relation names
- Done means: course access control has one clear backend model in Prisma.

### 2. Invitation APIs
- [ ] Teacher create invitation endpoint
- [ ] Learner accept/reject invitation endpoint
- [ ] Stable invitation status contract
- Done means: invitation lifecycle is usable at MVP level.

### 3. Join Request APIs
- [ ] Learner create join request endpoint
- [ ] Teacher accept/reject join request endpoint
- [ ] Stable join request status contract
- Done means: join request lifecycle is usable at MVP level.

### 4. Membership Access Contracts
- [ ] Course membership read contract for teacher/member screens
- [ ] Lesson access check contract for protected read pages
- [ ] Confirm access-state payloads with P1 and P3
- Done means: membership-aware frontend and protected route logic can integrate safely.

Validation:
- Branch: `sabri`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P3 - Integration - Jaffal

### 1. Membership-Based Lesson Protection
- [ ] Protect lesson routes based on accepted membership state
- [ ] Handle invitation and join-request edge routes cleanly
- [ ] Prevent direct access to locked lesson content
- Done means: protected lesson access follows backend membership rules.

### 2. Route Gating And Navigation Rules
- [ ] Update shell behavior for learner vs teacher access states
- [ ] Keep invitation and request pages coherent inside navigation
- [ ] Prevent dead-end or contradictory route flows
- Done means: the product guides each role through course access without navigation confusion.

### 3. Branch Validation And Merge Flow
- [ ] Review accepted P1 and P2 membership work
- [ ] Integrate access UI, membership APIs, and lesson protection
- [ ] Validate that course access state is stable enough for next-sprint communication work
- Done means: Sprint 03 produces one reliable course-access system slice.

Validation:
- Branch: `jaffal`
- Reviewer:
- Review date:
- Result:
- Merge status:

## Dependency Gate For Sprint 04

Do not start Sprint 04 until:
- membership schema and routes are accepted
- invitation and join request flows work end-to-end
- lesson access is protected by membership state
- learners and teachers can see correct access-state screens
