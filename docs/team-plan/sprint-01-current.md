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
- [ ] Add first schema for courses, lessons, enrollments, and posts
- [ ] Create migration for the new schema
- [ ] Prepare stable model names and field names for the team
- Done means: the database structure needed by Sprint 01 features exists and is shared clearly.

### 2. Courses and Lessons API
- [ ] `GET /courses`
- [ ] `GET /lessons/:id`
- [ ] Stable response shapes for frontend
- Done means: frontend can fetch course lists and lesson details without guessing field names.

### 3. Community and Enroll API
- [ ] `GET /posts`
- [ ] `POST /posts`
- [ ] `POST /enroll`
- Done means: community creation/listing and fake enroll flow have working backend support.

### 4. Utility API
- [ ] `GET /users`
- [ ] `GET /notifications`
- [ ] `GET /courses?q=`
- Done means: supporting APIs for members, notifications, and course search are usable and predictable.

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

### 3. Admin Panel
- [x] Manage courses UI
- [x] `POST` course flow
- [x] `DELETE` course flow
- Done means: admin can create and remove courses from the panel and the page remains usable after integration.

### 4. Integration, Review, and Deploy Pass
- [ ] Integrate accepted P1 and P2 work into the shared flow
- [ ] Run branch review and merge checks
- [x] Keep deploy checklist and branch workflow current
- Done means: accepted work can be reviewed, merged, and prepared for deployment without confusion.

Validation:
- Branch: `jaffal`
- Reviewer:
- Review date:
- Result:
- Merge status:
