# Sprint 03 - Current

Window: April 27, 2026 to May 10, 2026

Status: Planned - not active yet

Roadmap anchor:
- Sprint 03
- Community access control through memberships, invitations, and join requests

Conception impact:
- Modules: Members And Access Control, Classroom, Owner Workspace, Dashboard Shell, Review / Integration / Deployment
- Entities/APIs: `CommunityMembership`, `Invitation`, `JoinRequest`, membership-aware community access, invitation and join request routes

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
- [ ] Join request action on community about pages
- [ ] Pending, approved, rejected, and blocked UI states
- [ ] Member-facing feedback screens for access requests
- Done means: a user can understand and trigger the community join-request flow from the UI.

### 2. Invitation Inbox UI
- [ ] Invitation list or inbox screen
- [ ] Accept and decline actions
- [ ] Stable empty/loading/error states for invitations
- Done means: an invited user can manage invitations through one clear protected flow.

### 3. Membership-Aware Access UI
- [ ] Gated states for community tabs
- [ ] Clear “already member” and “pending request” feedback
- [ ] Route-safe member access messaging
- Done means: the user can clearly tell why a private community or classroom is available or blocked.

## P2 - Backend - Sabri

### 1. Membership Domain Foundation
- [ ] Add or stabilize `CommunityMembership`
- [ ] Add or stabilize `Invitation`
- [ ] Add or stabilize `JoinRequest`
- Done means: access control has a stable backend model aligned with the conception.

### 2. Access-Control APIs
- [ ] `POST /api/communities/[communityId]/join-requests`
- [ ] `PATCH /api/join-requests/[requestId]`
- [ ] `POST /api/communities/[communityId]/invitations`
- [ ] `PATCH /api/invitations/[invitationId]`
- Done means: invitation and join-request flows are usable through stable contracts.

### 3. Membership Guards
- [ ] Membership-aware checks for private community access
- [ ] Membership-aware checks for classroom access
- [ ] Stable status handling across membership lifecycle
- Done means: private community surfaces are protected by real access rules.

## P3 - Integration - Jaffal

### 1. Access Guard Integration
- [ ] Validate membership-aware protection for community and classroom routes
- [ ] Keep public about pages accessible while private tabs remain protected
- [ ] Catch role or ownership regressions before merge
- Done means: public discovery and private membership spaces coexist correctly.

### 2. Invitation And Request Flow Review
- [ ] Review accepted P1 and P2 access-control flows together
- [ ] Standardize obvious access-state UX and route behavior
- [ ] Verify payload consistency against the conception
- Done means: Sprint 03 produces one usable gated-community flow.

### 3. Acceptance Gate Across Public And Private Paths
- [ ] Integrate accepted work into one coherent access slice
- [ ] Validate visitor-to-member transition behavior
- [ ] Confirm the milestone is ready before feed/community participation work begins
- Done means: the product can control who enters a community and how.

## Dependency Gate For Sprint 04

Do not start Sprint 04 until:
- invitation flow works
- join request flow works
- private community access respects membership state
- classroom access respects membership state
