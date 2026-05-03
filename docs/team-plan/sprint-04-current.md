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
- [ ] Teacher announcement create UI
- [ ] Teacher announcement edit/read flow UI where needed
- [ ] Clear published vs draft presentation in teacher screens
- Done means: a teacher can manage course announcements from the UI without leaving the course context.

### 2. Course Discussion Refinement
- [ ] Comment interaction polish
- [ ] Clear announcement-thread reading flow
- [ ] Success/error/empty states for discussion pages
- Done means: course communication is understandable and stable for repeated use.

### 3. Teacher Communication Screens
- [ ] Teacher-facing communication overview inside course workspace
- [ ] Links from course manager to communication screens
- [ ] Basic learner/teacher context differences in UI
- Done means: communication is fully attached to course management, not isolated.

### 4. UX Cleanup On Access And Participation Flows
- [ ] Cleaner transitions between membership state and communication state
- [ ] Guard against confusing UI after invitation/request decisions
- [ ] Mobile polish on communication screens
- Done means: the participation flow from access to communication feels coherent.

Validation:
- Branch: `sadik`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P2 - Backend - Sabri

### 1. Announcement Write Endpoints
- [ ] Create announcement endpoint
- [ ] Update announcement endpoint if needed for MVP teacher flow
- [ ] Teacher/admin authorization enforcement
- Done means: teachers can publish course communication through stable backend routes.

### 2. Membership Removal And Update Flows
- [ ] Remove learner from course endpoint
- [ ] Membership status update flow where needed
- [ ] Stable membership response shapes for teacher member screens
- Done means: course participation can be managed after initial access is granted.

### 3. Request And Invitation Completion
- [ ] Finish any missing accept/reject/cancel flow pieces
- [ ] Clean up status transitions for invitation/request models
- [ ] Ensure payload shapes support final integrated UI
- Done means: access-control flows no longer have partial states blocking communication usage.

### 4. Communication And Participation Contracts
- [ ] Confirm announcement/comment payloads for integrated pages
- [ ] Confirm member-status payloads for teacher communication screens
- [ ] Keep API naming aligned with the conception
- Done means: P1 and P3 can integrate stable communication and participation flows.

Validation:
- Branch: `sabri`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P3 - Integration - Jaffal

### 1. Communication Integration Hardening
- [ ] Validate membership-aware access for communication routes
- [ ] Keep teacher and learner communication entry points coherent
- [ ] Check for regressions against lesson and membership flows
- Done means: communication routes behave correctly inside the protected product shell.

### 2. Validation And Error Handling Pass
- [ ] Review accepted access-control and communication flows together
- [ ] Standardize obvious route-level error handling gaps
- [ ] Catch role/ownership regressions before merge
- Done means: Sprint 04 is stable enough for repeated demo testing on communication paths.

### 3. Acceptance Gate Across Teacher And Learner Flows
- [ ] Integrate accepted P1 and P2 work into one usable communication slice
- [ ] Validate teacher publish flow and learner participation flow together
- [ ] Confirm the sprint milestone is ready before progress/evaluation work begins
- Done means: course communication is a reliable integrated product flow.

Validation:
- Branch: `jaffal`
- Reviewer:
- Review date:
- Result:
- Merge status:

## Dependency Gate For Sprint 05

Do not start Sprint 05 until:
- announcements and comments work end-to-end
- course communication is membership-aware
- teacher participation management is usable
- route-level validation and integration issues are no longer blocking normal use
