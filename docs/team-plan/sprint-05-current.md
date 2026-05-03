# Sprint 05 - Current

Window: May 25, 2026 to June 7, 2026

Status: Planned - not active yet

Roadmap anchor:
- Sprint 05
- Learner progress, course evaluation, and platform admin quality

Conception impact:
- Modules: Evaluation And Progress, Platform Administration, Authentication And Account, Dashboard Shell, Review / Integration / Deployment
- Entities/APIs: `LessonProgress`, `CourseEvaluation`, admin user/course routes, account update/delete endpoints

Workload target:
- P1 about `125`
- P3 about `100`
- P2 about `75`

Status rules:
- `[ ]` not done
- `[x]` validated and accepted
- This sprint is a plan only until Sprint 04 is accepted

## P1 - Frontend - Sadik

### 1. Learner Progress UI
- [ ] Progress indicators on lesson/course flow
- [ ] Learner-facing progress view
- [ ] Stable empty/loading/error states for progress data
- Done means: a learner can understand their course progress from the protected UI.

### 2. Course Evaluation UI
- [ ] Evaluation form UI
- [ ] Post-completion evaluation state handling
- [ ] Evaluation success/error messaging
- Done means: a learner can submit a course evaluation through one clear protected flow.

### 3. Teacher Progress View
- [ ] Teacher-facing learner progress overview
- [ ] Course-level progress visibility for owned courses
- [ ] Stable teacher UI states for progress queries
- Done means: a teacher can monitor learner progress inside the course workspace.

### 4. Minimal Admin Screens
- [ ] Basic admin user/course supervision screens
- [ ] Clear admin route entry points in the shell
- [ ] Minimal UI polish on protected admin views
- Done means: admin supervision is visible and usable at MVP level.

Validation:
- Branch: `sadik`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P2 - Backend - Sabri

### 1. Progress Domain Schema
- [ ] Add `LessonProgress`
- [ ] Add progress-related migration updates
- [ ] Stable progress relation names and constraints
- Done means: learner progress has a persistent backend model aligned with the conception.

### 2. Evaluation Domain Schema And APIs
- [ ] Add `CourseEvaluation`
- [ ] Evaluation create/read endpoints
- [ ] Stable evaluation constraints for one learner per course
- Done means: course evaluation works through one coherent backend model and contract.

### 3. Progress APIs
- [ ] Lesson progress update endpoint
- [ ] Course progress read endpoint for learner/teacher use
- [ ] Stable payloads for progress summaries
- Done means: the frontend can track and render progress without guessing backend logic.

### 4. Admin And Account APIs
- [ ] Admin user/course supervision endpoints
- [ ] Account update endpoint
- [ ] Account delete endpoint
- Done means: the platform begins to support basic account and admin operations at MVP level.

Validation:
- Branch: `sabri`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P3 - Integration - Jaffal

### 1. Admin Protection Pass
- [ ] Validate admin-only route and action protection
- [ ] Keep teacher and learner routes isolated from admin-only tools
- [ ] Catch ownership or role leaks before merge
- Done means: admin supervision features are protected correctly inside the product shell.

### 2. Regression Review Pass
- [ ] Review accepted progress, evaluation, and admin work together
- [ ] Recheck earlier course, lesson, access, and communication flows
- [ ] Confirm no new protected-route regressions were introduced
- Done means: Sprint 05 expands the product without destabilizing earlier accepted slices.

### 3. Responsive Consistency Pass On Protected Flows
- [ ] Review the most important protected pages for layout consistency
- [ ] Standardize obvious cross-route UX gaps where needed
- [ ] Prepare the project for final demo/readiness sprint
- Done means: protected product flows are stable enough for final cleanup and demo work.

Validation:
- Branch: `jaffal`
- Reviewer:
- Review date:
- Result:
- Merge status:

## Dependency Gate For Sprint 06

Do not start Sprint 06 until:
- lesson progress works at MVP level
- course evaluation works at MVP level
- admin supervision routes are accepted
- protected flows are stable enough for final manual testing and polish
