# Software Conception

Project:
- Campus Digital

Product position:
- a simplified Skool-style community platform
- community-first, not LMS-first
- intended to clone the core Skool product shape at MVP level, not every mature feature of Skool

Time box:
- 3 months
- 6 sprints of 2 weeks

Stack target:
- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma
- NextAuth

Scope note:
- this document replaces the previous teacher/learner LMS-first conception
- when code, UML, task plans, or earlier notes conflict with this document, this document wins
- this is a delivery document, not a wish list
- features are separated below into `Current MVP`, `Planned Extensions`, and `Out Of Scope`

## 1. System Overview

Campus Digital is a Skool-style platform where creators run communities that combine:
- a public about page
- a gated community space
- a classroom tab
- a members area
- a feed for posts and comments
- owner/community management workflows
- platform-level admin governance

The product should feel like a simplified Skool clone, not like a generic LMS.
That means the main user journey is:
- discover a community
- inspect its about page
- sign up or sign in
- join a free community or accept an invitation
- enter the community space
- consume classroom material
- participate in posts and comments

Architecture:
- `Next.js` serves frontend pages and API routes
- `PostgreSQL` stores authentication and product data
- `Prisma` is the schema and query layer
- `NextAuth` handles authentication and sessions

## 2. Product Scope

### Current MVP

The current MVP target is:
- authentication and account management
- public community discovery homepage
- public community about pages
- community-first protected navigation
- popup authentication from community pages
- direct join for free communities
- owner community creation and update
- classroom item creation, update, delete
- document and video resource support for classroom content
- invitations
- member management inside communities
- community posts and comments
- classroom progress tracking
- community evaluation on a `0..20` scale
- platform admin user management
- platform admin community management

### Planned Extensions

These are aligned with Skool, but are not required to claim MVP completion:
- calendar or events inside communities
- leaderboard, points, and levels
- richer community branding and public offer controls
- better owner analytics and participation metrics
- stronger moderation workflows
- improved mobile polish

### Out Of Scope For Current MVP

These are not part of the current professional delivery target unless the conception changes again:
- full subscription billing and recurring payments
- production-grade notification system
- advanced analytics dashboard
- livestream or webinar stack
- deep third-party integration marketplace
- complex gamification engine beyond lightweight future support

## 3. Actors And Permissions

### Visitor

Can:
- view the landing page
- browse discoverable communities
- open a community about page
- sign up or sign in
- join a free community after authentication

Cannot:
- access private community tabs
- post in communities
- open gated classroom content
- appear in member-only areas

### Member

Can:
- sign in and access joined communities
- view the community feed for communities they belong to
- add comments and interact with posts
- open the classroom tab and consume content
- view joined community members
- edit or delete their own account
- accept invitations to join a community
- track their own classroom progress
- evaluate a community classroom experience

Cannot:
- manage community configuration unless elevated later to moderator or owner
- delete other users
- change platform-wide settings

### Community Owner

Can:
- create and edit communities they own
- manage classroom items and classroom resources
- upload or link documents and video resources
- publish community posts
- invite members
- remove members
- inspect member classroom progress

Cannot:
- manage communities owned by others unless also admin
- perform platform-wide governance tasks by default

### Platform Admin

Can:
- inspect users platform-wide
- delete users platform-wide
- inspect communities platform-wide
- delete communities platform-wide
- supervise platform health through protected admin surfaces

Admin note:
- admin is a platform governance role, not the owner of every community
- the normal product experience should still center on community owners

## 4. Domain Model

This section is intentionally split into what is implemented now versus what is planned later.

### 4.1 Schema-Aligned Current Domain

#### User

Represents an authenticated person on the platform.

Current fields:
- `id`
- `name`
- `email`
- `image`
- `passwordHash`
- `failedSignInAttempts`
- `signInLockedAt`
- `birthDate`
- `role` as `MEMBER`, `OWNER`, or `ADMIN`
- `createdAt`
- `updatedAt`

Related current objects:
- one optional `UserProfile`
- owned communities
- community memberships
- invitations sent and received
- legacy join-request records may still exist in storage
- posts, comments, evaluations, and classroom progress

#### UserProfile

Unified profile object for both owners and members.

Current fields:
- `id`
- `userId`
- `specialty` nullable
- `track` nullable
- `bio` nullable
- `createdAt`
- `updatedAt`

Notes:
- `specialty` is currently owner-oriented profile metadata
- `track` is currently member-oriented profile metadata
- this unified model replaces the old teacher/learner profile split

#### Community

Top-level product object.

Current fields:
- `id`
- `title`
- `slug`
- `description`
- `type`
- `status` as `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `ownerId`
- `createdAt`
- `updatedAt`

Current relations:
- `classroomItems`
- `documents`
- `memberships`
- `invitations`
- `accessRequests`
- `posts`
- `evaluations`

#### ClassroomItem

Represents a classroom entry inside a community.

Current fields:
- `id`
- `communityId`
- `title`
- `content`
- `contentType`
- `position`
- `createdAt`
- `updatedAt`

Notes:
- this is the current classroom-item model used by the MVP
- `contentType` is already broad enough to support text, video, and linked resources

#### CommunityDocument

Represents a document or resource attached at the community/classroom management level.

Current fields:
- `id`
- `communityId`
- `label`
- `url`
- `createdAt`
- `updatedAt`

#### CommunityMembership

Represents a user belonging to a community.

Current fields:
- `id`
- `communityId`
- `memberId`
- `status` as `PENDING`, `ACTIVE`, `REMOVED`, `REJECTED`
- `joinedAt`
- `endedAt`

#### CommunityInvitation

Represents owner-to-member invitation flow.

Current fields:
- `id`
- `communityId`
- `ownerId`
- `memberId`
- `status` as `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`, `EXPIRED`
- `sentAt`
- `respondedAt`

#### CommunityJoinRequest

Represents member request to enter a community.

Current fields:
- `id`
- `communityId`
- `memberId`
- `status` as `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`
- `createdAt`
- `reviewedAt`
- `reviewedById`

#### CommunityPost

Represents feed content or owner announcement.

Current fields:
- `id`
- `communityId`
- `authorId`
- `title`
- `content`
- `status` as `DRAFT`, `PUBLISHED`, `ARCHIVED`
- `publishedAt`
- `createdAt`
- `updatedAt`

#### Comment

Represents discussion under a community post.

Current fields:
- `id`
- `postId`
- `authorId`
- `content`
- `createdAt`
- `updatedAt`

#### CommunityEvaluation

Represents member evaluation of a community classroom experience.

Current fields:
- `id`
- `communityId`
- `memberId`
- `rating`
- `feedback`
- `createdAt`
- `updatedAt`

#### ClassroomItemProgress

Represents member progress through classroom content.

Current fields:
- `id`
- `classroomItemId`
- `memberId`
- `completed`
- `completedAt`
- `lastViewedAt`
- `createdAt`
- `updatedAt`

### 4.2 Planned Domain Extensions

These are product-aligned but not fully implemented yet.

#### CommunityEvent
nPlanned fields:
- `id`
- `communityId`
- `title`
- `description`
- `startsAt`
- `endsAt`
- `joinUrl`
- `createdById`

#### MemberActivityPoint
Planned fields:
- `id`
- `communityId`
- `memberId`
- `actionType`
- `points`
- `createdAt`

#### Leaderboard View
Planned derived view:
- rank members by points within a community
- expose current user rank and top members

## 5. Functional Modules

### Authentication And Account
- sign up
- sign in
- sign-in attempt limiting
- unified profile editing
- account deletion

### Public Discovery And About
- discover communities from the homepage
- search communities
- open public about pages
- preview classroom positioning before access

### Community Access Control
- invitation inbox
- popup authentication before join
- direct join for free communities
- membership checks before protected community access

### Community Feed
- owner post publishing
- member comments
- feed viewing inside joined communities

### Classroom
- classroom item creation and editing
- document and video resource support
- classroom item progress
- member evaluation

### Owner Workspace
- create community
- edit community
- manage classroom items
- manage documents
- publish posts
- manage members
- inspect member progress

### Platform Admin
- inspect users
- delete users
- inspect communities
- delete communities

## 6. API Direction

### Current Primary API Surface

The active API should be community-first.
Primary route families:
- `/api/communities`
- `/api/communities/[communityId]`
- `/api/communities/[communityId]/classroom-items`
- `/api/classroom-items/[itemId]`
- `/api/classroom-items/[itemId]/progress`
- `/api/communities/[communityId]/posts`
- `/api/communities/[communityId]/members`
- `/api/communities/[communityId]/join-requests`
- `/api/communities/[communityId]/invitations`
- `/api/communities/[communityId]/evaluations`
- `/api/communities/[communityId]/progress`
- `/api/admin/users`
- `/api/admin/communities`
- `/api/me`

### API Rules
- new product work should use community-first route names
- compatibility route families should not be reintroduced
- protected operations must check role and membership explicitly

## 7. Business Rules

- a visitor cannot access protected community content
- a free public community can be joined directly after authentication
- a member must have active membership or accepted invitation before entering private community surfaces
- only owners or admins can manage a community
- only admins can perform platform-wide user deletion
- classroom progress is member-scoped and classroom-item-scoped
- evaluation is allowed only for members with active access
- documents and videos are treated as classroom-supporting resources, not as standalone modules

## 8. Current Reality Check

This repo is already beyond pure idea stage.
It currently contains working implementation for:
- authentication
- public community discovery
- community about routing
- popup authentication from community pages
- direct join for free communities
- owner community management
- classroom items
- documents
- invitations
- member management
- posts and comments
- admin user management
- admin community management
- progress tracking
- unified user profile handling

What is not yet fully present as first-class product capability:
- calendar/events
- leaderboard and points
- payments or paid-access billing
- moderator role implementation

## 9. Conception Discipline

This conception is correct only if future planning follows these rules:
- do not describe unimplemented features as if they already exist
- do not reintroduce teacher/learner/course-platform framing
- do not expand scope by copying every Skool feature blindly
- keep the MVP centered on a simplified but coherent Skool-style community product
