# Skool Codebase Migration Plan

This document converts the current audit into an execution map.
It is aligned with:
- [docs/SOFTWARE_CONCEPTION.md](/Users/jaffa/Desktop/skool/docs/SOFTWARE_CONCEPTION.md)
- [docs/SKOOL_UML_REPLACEMENT.md](/Users/jaffa/Desktop/skool/docs/SKOOL_UML_REPLACEMENT.md)
- [.team-review/roadmap-3-month.md](/Users/jaffa/Desktop/skool/.team-review/roadmap-3-month.md)

Goal:
- migrate the current hybrid LMS/community codebase into a coherent Skool-style community platform
- preserve reusable work
- avoid rewriting good UI surfaces without reason

## Decision Labels

- `KEEP`: already aligned enough with the Skool clone direction
- `RENAME`: mostly keep structure, but change product vocabulary and UX wording
- `REFACTOR`: keep partial logic, but redesign the module or contract
- `REMOVE`: actively phase out because it reinforces the wrong product identity
- `DEPRIORITIZE`: keep temporarily if needed, but stop treating it as core product scope

## Priority Levels

- `P0`: foundational and blocking; should happen before broader feature work
- `P1`: high-value migration work for product alignment
- `P2`: useful cleanup after core migration
- `P3`: optional or later cleanup

## 1. Documentation And Planning

| File | Action | Priority | Reason | Replacement target |
|---|---|---:|---|---|
| [docs/SOFTWARE_CONCEPTION.md](/Users/jaffa/Desktop/skool/docs/SOFTWARE_CONCEPTION.md) | KEEP | P0 | Already rewritten as Skool-first source of truth | Keep as main conception source |
| [docs/SKOOL_UML_REPLACEMENT.md](/Users/jaffa/Desktop/skool/docs/SKOOL_UML_REPLACEMENT.md) | KEEP | P0 | Already defines replacement actors, use cases, and sequences | Use for UML/PDF regeneration |
| [.team-review/roadmap-3-month.md](/Users/jaffa/Desktop/skool/.team-review/roadmap-3-month.md) | KEEP | P0 | Already aligned to Skool-style milestones | Use as roadmap anchor |
| [docs/team-plan/sprint-01-current.md](/Users/jaffa/Desktop/skool/docs/team-plan/sprint-01-current.md) | KEEP | P0 | Already rewritten to Skool direction | Use as planning baseline |
| [docs/team-plan/sprint-02-current.md](/Users/jaffa/Desktop/skool/docs/team-plan/sprint-02-current.md) | KEEP | P0 | Already rewritten to Skool direction | Use as planning baseline |
| [docs/team-plan/sprint-03-current.md](/Users/jaffa/Desktop/skool/docs/team-plan/sprint-03-current.md) | KEEP | P0 | Already rewritten to Skool direction | Use as planning baseline |
| [docs/team-plan/sprint-04-current.md](/Users/jaffa/Desktop/skool/docs/team-plan/sprint-04-current.md) | KEEP | P0 | Already rewritten to Skool direction | Use as planning baseline |
| [docs/team-plan/sprint-05-current.md](/Users/jaffa/Desktop/skool/docs/team-plan/sprint-05-current.md) | KEEP | P0 | Already rewritten to Skool direction | Use as planning baseline |
| [docs/team-plan/sprint-06-current.md](/Users/jaffa/Desktop/skool/docs/team-plan/sprint-06-current.md) | KEEP | P0 | Already rewritten to Skool direction | Use as planning baseline |
| [docs/Conception du projet.pdf](/Users/jaffa/Desktop/skool/docs/Conception%20du%20projet.pdf) | REMOVE | P0 | Still likely carries old LMS-first UML and wording | Replace with regenerated Skool-style PDF |

## 2. Domain Schema And Auth

| File | Action | Priority | Reason | Replacement target |
|---|---|---:|---|---|
| [prisma/schema.prisma](/Users/jaffa/Desktop/skool/prisma/schema.prisma) | REFACTOR | P0 | Core schema is still LMS-first: `TEACHER`, `LEARNER`, `Course`, `Lesson`, `Announcement`, `CourseEvaluation` | Migrate to `OWNER`, `MEMBER`, `Community`, `ClassroomItem`, `CommunityPost`, `PostComment`, `CommunityEvent`, `MemberActivityPoint` |
| [src/auth.ts](/Users/jaffa/Desktop/skool/src/auth.ts) | REFACTOR | P0 | Session role logic still encodes `TEACHER` and `LEARNER` | Switch to `OWNER`, `MEMBER`, `ADMIN` and later community-scoped roles |
| [src/lib/password.ts](/Users/jaffa/Desktop/skool/src/lib/password.ts) | KEEP | P2 | Generic utility, not product-identity specific | Keep as auth helper |
| [src/lib/db.ts](/Users/jaffa/Desktop/skool/src/lib/db.ts) | KEEP | P2 | Neutral infrastructure | Keep as DB access layer |
| [src/lib/request-auth.ts](/Users/jaffa/Desktop/skool/src/lib/request-auth.ts) | REFACTOR | P1 | Likely contains teacher/learner ownership helpers and route auth shortcuts | Replace with community ownership and membership helpers |

## 3. Public Discovery And Community Surfaces

| File | Action | Priority | Reason | Replacement target |
|---|---|---:|---|---|
| [src/app/page.tsx](/Users/jaffa/Desktop/skool/src/app/page.tsx) | KEEP | P0 | Homepage already behaves like public community discovery | Keep and later change search from courses to communities |
| [src/components/site/public-header.tsx](/Users/jaffa/Desktop/skool/src/components/site/public-header.tsx) | KEEP | P2 | Neutral public shell piece | Keep |
| [src/app/communities/[slug]/page.tsx](/Users/jaffa/Desktop/skool/src/app/communities/[slug]/page.tsx) | KEEP | P1 | Useful route entry redirect into community space | Keep with community-first redirects |
| [src/app/communities/[slug]/layout.tsx](/Users/jaffa/Desktop/skool/src/app/communities/[slug]/layout.tsx) | KEEP | P0 | Strong base for Skool-style tabbed community shell | Keep |
| [src/app/communities/[slug]/about/page.tsx](/Users/jaffa/Desktop/skool/src/app/communities/[slug]/about/page.tsx) | KEEP | P0 | Matches public About surface well | Keep and strengthen pricing/CTA editing |
| [src/app/communities/[slug]/community/page.tsx](/Users/jaffa/Desktop/skool/src/app/communities/[slug]/community/page.tsx) | KEEP | P0 | Right destination for community feed | Keep and feed-refactor underneath |
| [src/app/communities/[slug]/classroom/page.tsx](/Users/jaffa/Desktop/skool/src/app/communities/[slug]/classroom/page.tsx) | RENAME | P1 | Good surface, but implementation still maps to course/lesson model | Keep route, shift backing data to classroom items |
| [src/app/communities/[slug]/members/page.tsx](/Users/jaffa/Desktop/skool/src/app/communities/[slug]/members/page.tsx) | KEEP | P1 | Correct Skool-style surface exists | Keep and connect to real community memberships |
| [src/app/communities/[slug]/feed/page.tsx](/Users/jaffa/Desktop/skool/src/app/communities/[slug]/feed/page.tsx) | REMOVE | P2 | Redundant alias if `community` is the main feed tab | Prefer canonical `/community` tab |

## 4. Community Components And Mock Layer

| File | Action | Priority | Reason | Replacement target |
|---|---|---:|---|---|
| [src/components/community/community-branding.tsx](/Users/jaffa/Desktop/skool/src/components/community/community-branding.tsx) | KEEP | P0 | Strong Skool-style UI foundation | Keep |
| [src/components/community/community-tabs.tsx](/Users/jaffa/Desktop/skool/src/components/community/community-tabs.tsx) | REFACTOR | P1 | Missing future tabs like `calendar` and `leaderboard` | Extend to final community navigation model |
| [src/components/community/community-live-feed.tsx](/Users/jaffa/Desktop/skool/src/components/community/community-live-feed.tsx) | KEEP | P1 | Fits community feed direction | Keep, but back it with real `CommunityPost` data |
| [src/components/community/post-feed.tsx](/Users/jaffa/Desktop/skool/src/components/community/post-feed.tsx) | KEEP | P1 | Good feed-oriented direction | Keep and connect to new feed APIs |
| [src/components/community/announcement-comment-composer.tsx](/Users/jaffa/Desktop/skool/src/components/community/announcement-comment-composer.tsx) | RENAME | P1 | Current name is tied to announcements, but interaction should be post comments | Rename toward post-comment composer |
| [src/lib/community-data.ts](/Users/jaffa/Desktop/skool/src/lib/community-data.ts) | KEEP | P1 | Strong transitional adapter between current code and Skool-style UX | Keep, but evolve from mock/static bridge into real community-domain adapter |
| [src/lib/mock-data.ts](/Users/jaffa/Desktop/skool/src/lib/mock-data.ts) | REFACTOR | P2 | Contains useful seed ideas but may still mirror old course assumptions | Rebuild demo data around communities, posts, classroom items, events, members |

## 5. Dashboard Shell And Navigation

| File | Action | Priority | Reason | Replacement target |
|---|---|---:|---|---|
| [src/app/dashboard/layout.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/layout.tsx) | KEEP | P1 | Protected shell is still useful | Keep |
| [src/components/layout/app-shell.tsx](/Users/jaffa/Desktop/skool/src/components/layout/app-shell.tsx) | KEEP | P1 | Neutral shell layer | Keep |
| [src/components/layout/sidebar.tsx](/Users/jaffa/Desktop/skool/src/components/layout/sidebar.tsx) | REFACTOR | P1 | Navigation still exposes LMS-centered destinations and wording | Shift to owner/member/community-focused labels |
| [src/components/layout/top-nav.tsx](/Users/jaffa/Desktop/skool/src/components/layout/top-nav.tsx) | KEEP | P2 | Mostly neutral top shell | Keep |
| [src/config/dashboard-nav.ts](/Users/jaffa/Desktop/skool/src/config/dashboard-nav.ts) | REFACTOR | P0 | Encodes `TEACHER`, `courses`, and wrong product summaries | Rewrite around member, owner, community, classroom, admin |
| [src/app/dashboard/page.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/page.tsx) | RENAME | P1 | Messaging still references old product framing | Rewrite copy around joined communities and owner spaces |
| [src/app/dashboard/community/page.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/community/page.tsx) | REFACTOR | P1 | Likely useful as default joined-community jump point, but depends on old assumptions | Reposition as member shortcut into joined communities |

## 6. Owner Workspace And Classroom Management

| File | Action | Priority | Reason | Replacement target |
|---|---|---:|---|---|
| [src/app/dashboard/teach/page.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/teach/page.tsx) | RENAME | P0 | Route name `teach` reinforces LMS model | Move concept toward `/dashboard/owned-communities` or keep route temporarily with owner-facing UX |
| [src/components/teacher/teacher-workspace.tsx](/Users/jaffa/Desktop/skool/src/components/teacher/teacher-workspace.tsx) | REFACTOR | P0 | Contains valuable management logic, but the entire module is conceptually owner/community management, not teacher/course management | Transform into owner workspace for communities, classroom items, attachments, posts, events |
| [src/app/dashboard/courses/page.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/courses/page.tsx) | RENAME | P1 | Could remain a member-facing classroom browser, but wording and data model are wrong | Reposition as joined classroom access or joined communities classroom directory |
| [src/app/dashboard/courses/[courseId]/page.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/courses/[courseId]/page.tsx) | REFACTOR | P1 | Useful protected classroom detail page, but tied to course identity | Rebuild as community classroom detail or classroom item access view |
| [src/app/dashboard/courses/[courseId]/loading.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/courses/[courseId]/loading.tsx) | RENAME | P2 | Follows old route naming | Keep behavior, rename with route migration |
| [src/app/dashboard/courses/[courseId]/not-found.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/courses/[courseId]/not-found.tsx) | RENAME | P2 | Follows old route naming and wording | Update for classroom/community wording |
| [src/app/dashboard/courses/[courseId]/lessons/[lessonId]/page.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/courses/[courseId]/lessons/[lessonId]/page.tsx) | REFACTOR | P1 | Strong classroom-item viewer base, but domain object is still `Lesson` | Convert to classroom item page |
| [src/app/dashboard/courses/[courseId]/announcements/[announcementId]/page.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/courses/[courseId]/announcements/[announcementId]/page.tsx) | REFACTOR | P1 | Announcement-specific page belongs to old course-communication model | Replace with post detail flow in the community feed |
| [src/components/courses/lesson-progress-toggle.tsx](/Users/jaffa/Desktop/skool/src/components/courses/lesson-progress-toggle.tsx) | RENAME | P2 | Functionally useful but wrong object naming | Convert to classroom-item progress toggle |

## 7. Access Control, Invitations, And Member Management

| File | Action | Priority | Reason | Replacement target |
|---|---|---:|---|---|
| [src/components/invitations/invitations-workspace.tsx](/Users/jaffa/Desktop/skool/src/components/invitations/invitations-workspace.tsx) | REFACTOR | P1 | Good flow base, but still talks about courses and lessons | Convert to community invitations and community access requests |
| [src/components/courses/course-members-manager.tsx](/Users/jaffa/Desktop/skool/src/components/courses/course-members-manager.tsx) | RENAME | P1 | Good member-management feature, wrong product object naming | Convert into community members manager |
| [src/app/dashboard/invitations/page.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/invitations/page.tsx) | KEEP | P1 | Appropriate protected inbox surface | Keep with community vocabulary |
| [src/app/dashboard/checkout/page.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/checkout/page.tsx) | REFACTOR | P2 | `checkout` can fit Skool paid access later, but current join flow is course-based | Reposition as access/purchase flow for communities |
| [src/components/checkout/enroll-form.tsx](/Users/jaffa/Desktop/skool/src/components/checkout/enroll-form.tsx) | RENAME | P2 | Conceptually useful if access is paid or gated, but `enroll` is LMS vocabulary | Convert into join/access form for communities |

## 8. Progress, Evaluation, And Secondary Modules

| File | Action | Priority | Reason | Replacement target |
|---|---|---:|---|---|
| [src/app/dashboard/progress/page.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/progress/page.tsx) | REFACTOR | P1 | Progress is usable as a supporting classroom signal, but current framing is LMS-heavy | Keep as member/owner classroom progress surface |
| [src/components/progress/progress-workspace.tsx](/Users/jaffa/Desktop/skool/src/components/progress/progress-workspace.tsx) | REFACTOR | P1 | Useful logic exists, but owner/member/classroom framing must replace teacher/learner/course framing | Convert to community classroom progress workspace |
| [src/app/api/courses/[courseId]/evaluations/route.ts](/Users/jaffa/Desktop/skool/src/app/api/courses/[courseId]/evaluations/route.ts) | DEPRIORITIZE | P2 | Course evaluation is not a core Skool pillar | Keep only if explicitly desired as extra feature |
| [src/app/api/courses/[courseId]/progress/route.ts](/Users/jaffa/Desktop/skool/src/app/api/courses/[courseId]/progress/route.ts) | REFACTOR | P1 | Useful progress logic but wrong domain naming and ownership model | Convert to community/classroom progress APIs |
| [src/app/api/lessons/[lessonId]/progress/route.ts](/Users/jaffa/Desktop/skool/src/app/api/lessons/[lessonId]/progress/route.ts) | RENAME | P1 | Same logic can survive under classroom item progress | Move to classroom-item progress route |

## 9. Admin And Governance

| File | Action | Priority | Reason | Replacement target |
|---|---|---:|---|---|
| [src/app/dashboard/admin/page.tsx](/Users/jaffa/Desktop/skool/src/app/dashboard/admin/page.tsx) | KEEP | P1 | Correct platform-level surface | Keep |
| [src/components/admin/admin-user-manager.tsx](/Users/jaffa/Desktop/skool/src/components/admin/admin-user-manager.tsx) | KEEP | P0 | Strong match for platform admin user governance | Keep |
| [src/components/admin/admin-course-manager.tsx](/Users/jaffa/Desktop/skool/src/components/admin/admin-course-manager.tsx) | REFACTOR | P1 | Useful moderation surface, but should govern communities, not courses | Convert to admin community manager |
| [src/app/api/admin/users/route.ts](/Users/jaffa/Desktop/skool/src/app/api/admin/users/route.ts) | KEEP | P0 | Good platform-admin search endpoint | Keep |
| [src/app/api/admin/users/[userId]/route.ts](/Users/jaffa/Desktop/skool/src/app/api/admin/users/[userId]/route.ts) | KEEP | P0 | Good platform-admin inspect/delete endpoint | Keep |
| [src/app/api/admin/courses/route.ts](/Users/jaffa/Desktop/skool/src/app/api/admin/courses/route.ts) | REFACTOR | P1 | Admin content governance is needed, but object name is wrong | Replace with admin communities moderation route |

## 10. API Migration Map

| Current route family | Action | Priority | Replacement target |
|---|---|---:|---|
| `/api/courses` | REFACTOR | P0 | `/api/communities` |
| `/api/courses/[courseId]/lessons` | REFACTOR | P0 | `/api/communities/[communityId]/classroom-items` |
| `/api/courses/[courseId]/join-requests` | RENAME | P0 | `/api/communities/[communityId]/join-requests` |
| `/api/courses/[courseId]/invitations` | RENAME | P0 | `/api/communities/[communityId]/invitations` |
| `/api/courses/[courseId]/members` | RENAME | P0 | `/api/communities/[communityId]/members` |
| `/api/courses/[courseId]/announcements` | REFACTOR | P1 | `/api/communities/[communityId]/posts` |
| `/api/posts` | REFACTOR | P1 | keep route family but bind to `CommunityPost` instead of old disconnected assumptions |
| `/api/enroll` | RENAME | P2 | community access or checkout route |

## 11. Remove Or Freeze First

These should stop driving product direction immediately.

| File | Action | Priority | Reason |
|---|---|---:|---|
| [src/app/api/courses/[courseId]/evaluations/route.ts](/Users/jaffa/Desktop/skool/src/app/api/courses/[courseId]/evaluations/route.ts) | DEPRIORITIZE | P2 | LMS-only emphasis |
| [src/components/progress/progress-workspace.tsx](/Users/jaffa/Desktop/skool/src/components/progress/progress-workspace.tsx) evaluation-specific UI | DEPRIORITIZE | P2 | Not core Skool identity |
| [src/app/communities/[slug]/feed/page.tsx](/Users/jaffa/Desktop/skool/src/app/communities/[slug]/feed/page.tsx) | REMOVE | P2 | redundant alias for community feed |
| [src/components/teacher/teacher-workspace.tsx](/Users/jaffa/Desktop/skool/src/components/teacher/teacher-workspace.tsx) as a product label | REMOVE | P0 | the label itself keeps reinforcing the wrong model |

## 12. Execution Order

### Phase 1: P0 alignment
1. Rewrite Prisma schema around community-first naming and entities
2. Rewrite auth/session role vocabulary
3. Rewrite dashboard navigation vocabulary
4. Introduce `/api/communities` route family
5. Rename owner workspace concepts in the UI

### Phase 2: P1 migration
1. Convert classroom/lesson flows into classroom-item flows
2. Convert course membership/invitation/request flows into community access flows
3. Convert announcement/comment model into community post/comment model
4. Convert admin course governance into admin community governance
5. Reposition progress as classroom support, not LMS identity

### Phase 3: P2 cleanup
1. Deprioritize or remove evaluation emphasis
2. Replace redundant aliases and transitional route names
3. Refresh demo/seed data around communities, members, posts, classroom items, and events

## 13. Final Recommendation

Do not start by rewriting public community pages.
They are already the most Skool-aligned part of the app.

Start with:
- [prisma/schema.prisma](/Users/jaffa/Desktop/skool/prisma/schema.prisma)
- [src/auth.ts](/Users/jaffa/Desktop/skool/src/auth.ts)
- [src/config/dashboard-nav.ts](/Users/jaffa/Desktop/skool/src/config/dashboard-nav.ts)
- [src/components/teacher/teacher-workspace.tsx](/Users/jaffa/Desktop/skool/src/components/teacher/teacher-workspace.tsx)
- `/api/courses/*` route family

That is where the product identity is still most wrong.
