# Sprint 04 - Current

Window: May 11, 2026 to May 24, 2026

Status: Planned - not active yet

Roadmap anchor:
- Sprint 04
- Course communication becomes fully usable and course participation is stable

Conception impact:
- Modules: Course Communication, Invitations And Join Requests, Course Catalog And Course Workspace, Dashboard Shell, Review / Integration / Deployment
- Entities/APIs: `Announcement`, `Comment`, membership-aware communication rules, request/invitation completion routes, membership update/removal flows

Workload target:
- P1 about `125`
- P3 about `100`
- P2 about `75`

Status rules:
- `[ ]` not done
- `[x]` validated and accepted
- This sprint is a plan only until Sprint 03 is accepted

## P1 - Frontend - Sadik

### 1. Announcement Publishing UI
- [x] Teacher announcement create UI
- [ ] Teacher announcement edit/read flow UI where needed
- [ ] Clear published vs draft presentation in teacher screens
- Done means: a teacher can manage course announcements from the UI without leaving the course context.

### 2. Course Discussion Refinement
- [ ] Comment interaction polish
- [x] Clear announcement-thread reading flow
- [x] Success/error/empty states for discussion pages
- Done means: course communication is understandable and stable for repeated use.

### 3. Teacher Communication Screens
- [x] Teacher-facing communication overview inside course workspace
- [ ] Links from course manager to communication screens
- [x] Basic learner/teacher context differences in UI
- Done means: communication is fully attached to course management, not isolated.

### 4. UX Cleanup On Access And Participation Flows
- [ ] Cleaner transitions between membership state and communication state
- [ ] Guard against confusing UI after invitation/request decisions
- [ ] Mobile polish on communication screens
- Done means: the participation flow from access to communication feels coherent.

Validation:
- Branch: `sadik`
- Reviewer: `jaffal`
- Review date: `2026-05-10`
- Result: `Partially complete (announcement publishing and discussion flow are in; final polish is still open)`
- Merge status: `Implemented in main`

## P2 - Backend - Sabri

### 1. Announcement Write Endpoints
- [x] Create announcement endpoint
- [ ] Update announcement endpoint if needed for MVP teacher flow
- [x] Teacher/admin authorization enforcement
- Done means: teachers can publish course communication through stable backend routes.

### 2. Membership Removal And Update Flows
- [x] Remove learner from course endpoint
- [x] Membership status update flow where needed
- [x] Stable membership response shapes for teacher member screens
- Done means: course participation can be managed after initial access is granted.

### 3. Request And Invitation Completion
- [x] Finish any missing accept/reject/cancel flow pieces
- [x] Clean up status transitions for invitation/request models
- [x] Ensure payload shapes support final integrated UI
- Done means: access-control flows no longer have partial states blocking communication usage.

### 4. Communication And Participation Contracts
- [x] Confirm announcement/comment payloads for integrated pages
- [x] Confirm member-status payloads for teacher communication screens
- [x] Keep API naming aligned with the conception
- Done means: P1 and P3 can integrate stable communication and participation flows.

Validation:
- Branch: `sabri`
- Reviewer: `jaffal`
- Review date: `2026-05-10`
- Result: `Mostly complete (communication and participation routes are live; announcement edit is still open)`
- Merge status: `Implemented in main`

## P3 - Integration - Jaffal

### 1. Communication Integration Hardening
- [x] Validate membership-aware access for communication routes
- [x] Keep teacher and learner communication entry points coherent
- [ ] Check for regressions against lesson and membership flows
- Done means: communication routes behave correctly inside the protected product shell.

### 2. Validation And Error Handling Pass
- [x] Review accepted access-control and communication flows together
- [x] Standardize obvious route-level error handling gaps
- [x] Catch role/ownership regressions before merge
- Done means: Sprint 04 is stable enough for repeated demo testing on communication paths.

### 3. Acceptance Gate Across Teacher And Learner Flows
- [x] Integrate accepted P1 and P2 work into one usable communication slice
- [x] Validate teacher publish flow and learner participation flow together
- [ ] Confirm the sprint milestone is ready before progress/evaluation work begins
- Done means: course communication is a reliable integrated product flow.

Validation:
- Branch: `jaffal`
- Reviewer: `jaffal`
- Review date: `2026-05-10`
- Result: `Mostly complete (the integrated communication slice is usable; final regression cleanup is still open)`
- Merge status: `Implemented in main`

## Dependency Gate For Sprint 05

Do not start Sprint 05 until:
- announcements and comments work end-to-end
- course communication is membership-aware
- teacher participation management is usable
- route-level validation and integration issues are no longer blocking normal use
