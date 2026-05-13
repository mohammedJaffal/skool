# Sprint 05 - Current

Window: May 25, 2026 to June 7, 2026

Status: Planned - not active yet

Roadmap anchor:
- Sprint 05
- Owner oversight, member progress visibility, and admin governance quality

Conception impact:
- Modules: Classroom, Owner Workspace, Platform Administration, Authentication And Account, Dashboard Shell, Review / Integration / Deployment
- Entities/APIs: `ClassroomProgress`, admin user routes, account update/delete endpoints, optional first `CommunityEvent` and `MemberActivityPoint` slices

Workload target:
- P1 about `125`
- P3 about `100`
- P2 about `75`

Status rules:
- `[ ]` not done
- `[x]` validated and accepted
- This sprint is a plan only until Sprint 04 is accepted

## P1 - Frontend - Sadik

### 1. Member Progress UI
- [ ] Progress indicators on classroom item flow
- [ ] Member-facing progress view
- [ ] Stable empty/loading/error states for progress data
- Done means: a member can understand progress through classroom content from the protected UI.

### 2. Owner Progress View
- [ ] Owner-facing member progress overview
- [ ] Community-level progress visibility for owned communities
- [ ] Stable owner UI states for progress queries
- Done means: an owner can monitor member classroom progress inside the owner workspace.

### 3. Minimal Admin Screens
- [ ] Basic admin user supervision screens
- [ ] Clear admin route entry points in the shell
- [ ] Minimal UI polish on protected admin views
- Done means: admin supervision is visible and usable at MVP level.

### 4. Optional MVP Calendar Or Leaderboard Slice
- [ ] If feasible, first event list UI or leaderboard UI
- [ ] Keep it lightweight and consistent with the conception
- [ ] Do not destabilize admin or progress work
- Done means: one secondary Skool-style module begins to appear in MVP form.

## P2 - Backend - Sabri

### 1. Progress Domain Schema
- [ ] Add or stabilize `ClassroomProgress`
- [ ] Add progress-related migration updates
- [ ] Stable progress relation names and constraints
- Done means: member progress has a persistent backend model aligned with the conception.

### 2. Progress APIs
- [ ] Classroom item progress update endpoint
- [ ] Community-level progress read endpoint for member/owner use
- [ ] Stable payloads for progress summaries
- Done means: the frontend can track and render progress without guessing backend logic.

### 3. Admin And Account APIs
- [ ] Admin user supervision endpoints
- [ ] Account update endpoint
- [ ] Account delete endpoint
- Done means: the platform supports basic account and admin operations at MVP level.

### 4. Optional MVP Calendar Or Leaderboard Backend Slice
- [ ] If feasible, first `CommunityEvent` endpoints or leaderboard read endpoint
- [ ] Keep the slice coherent and MVP-sized
- [ ] Confirm contracts with P1 and P3 before integration
- Done means: one Skool-style secondary pillar begins to exist beyond prose only.

## P3 - Integration - Jaffal

### 1. Admin Protection Pass
- [ ] Validate admin-only route and action protection
- [ ] Keep owner and member routes isolated from admin-only tools
- [ ] Catch ownership or role leaks before merge
- Done means: admin supervision features are protected correctly inside the product shell.

### 2. Regression Review Pass
- [ ] Review accepted progress, admin, and account work together
- [ ] Recheck earlier discovery, access, and feed flows
- [ ] Confirm no new protected-route regressions were introduced
- Done means: Sprint 05 expands the product without destabilizing earlier accepted slices.

### 3. Secondary Pillar Integration Review
- [ ] If calendar or leaderboard lands, validate it against the conception
- [ ] Prevent the new slice from drifting back into LMS-first assumptions
- [ ] Prepare the project for final demo/readiness sprint
- Done means: owner oversight and admin governance are stable enough for final cleanup and demo work.

## Dependency Gate For Sprint 06

Do not start Sprint 06 until:
- member progress works
- owner oversight works
- admin user supervision is usable
- account update/delete flows are stable
