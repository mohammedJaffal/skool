# Sprint 01 - Current

Window: March 30, 2026 to April 12, 2026

Status rules:
- `[ ]` not done
- `[x]` validated and accepted
- Do not mark complete before review

## P1 - Frontend - Sadik

### 1. Courses
- [ ] UI list page
- [ ] UI detail page
- [ ] Use shared loading and empty states
- Done means: courses can be browsed from list to detail with stable UI using mock or real data.

### 2. Lessons Viewer
- [ ] Video and content layout
- [ ] Lesson page UI
- [ ] Lesson navigation or lesson state handling
- Done means: one lesson can be opened and viewed clearly with stable UI states.

### 3. Community Feed
- [ ] Posts UI
- [ ] Comments UI
- [ ] Create post form UI
- [ ] Feed loading and empty states
- Done means: posts, comments, and post creation are all represented in the interface.

### 4. Fake Checkout
- [ ] Checkout page UI
- [ ] Enroll button flow
- [ ] Success and failure UI states
- Done means: the fake checkout flow can be completed visually from the interface.

Validation:
- Branch: `sadik`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P2 - Backend - Sabri

### 1. Core Data Foundation
- [ ] Add first schema for courses, lessons, enrollments, posts, and comments
- [ ] Create migration for the new schema
- [ ] Prepare stable model names and field names for the team
- Done means: the database structure needed by Sprint 01 features exists and is shared clearly.

### 2. Courses and Lessons Foundation API
- [ ] `GET /courses`
- [ ] `GET /lessons/:id`
- [ ] Stable response shapes for frontend
- Done means: frontend can fetch course lists and lesson details without guessing field names.

### 3. Community Foundation API
- [ ] `GET /posts`
- [ ] `POST /posts`
- [ ] Prepare comment-ready payload structure for Sprint 02
- Done means: the first community feed API exists and is stable enough for frontend integration.

### 4. Shared Foundation Contracts
- [ ] Publish example payloads for courses, lessons, and posts
- [ ] Define enroll request/response contract for Sprint 02
- [ ] Confirm route names and field names with P1 and P3
- Done means: the team can keep building against stable backend contracts before full integration.

Validation:
- Branch: `sabri`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P3 - Integration - Jaffal

P3 starts first.

### 1. Auth and Route Protection Pass
- [x] Verify auth config and auth routes
- [x] Verify protected dashboard behavior
- [x] Fix auth or redirect issues found during integration
- Done means: login and protected routes work consistently across the main dashboard flow.

### 2. Dashboard Layout
- [x] Sidebar
- [x] Top navigation
- [x] Shared layout connects current sprint pages
- Done means: main dashboard pages use one consistent shell without route-level breaks.

### 3. Review and Deploy Foundation
- [x] Keep deploy checklist and branch workflow current
- [x] Prepare branch review flow for incoming P1 and P2 work
- [x] Keep shared routes and layout ready for incoming P1 and P2 pages
- Done means: P3 is ready to validate, merge, and stabilize incoming Sprint 01 work.

### 4. Sprint 01 Acceptance Gate
- [ ] Run branch review and merge checks
- [ ] Integrate accepted P1 and P2 work into the shared flow
- Done means: accepted work can be reviewed, merged, and prepared for deployment without confusion.

Validation:
- Branch: `jaffal`
- Reviewer:
- Review date:
- Result:
- Merge status:

## Deferred From Sprint 01

- `GET /users`
  Moved to Sprint 02 with the first members area.
- `POST /enroll` as a usable backend flow
  Moved to Sprint 02 when the enroll path becomes connected end-to-end.
- `GET /courses?q=`
  Deferred until core course navigation is stable; this is not a foundation requirement.
- `GET /notifications`
  Deferred to later as a stretch feature; it is not part of Sprint 01 foundation.
- Full admin product scope
  Deferred to later sprints; the current admin page is internal scaffolding, not a Sprint 01 acceptance requirement.
