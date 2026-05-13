# Sprint 04 - Current

Window: May 11, 2026 to May 24, 2026

Status: Planned - not active yet

Roadmap anchor:
- Sprint 04
- Community feed participation and member-space flow

Conception impact:
- Modules: Community Feed, Members, Owner Workspace, Dashboard Shell, Review / Integration / Deployment
- Entities/APIs: `CommunityPost`, `PostComment`, member-space routes, `GET /api/communities/[communityId]/posts`, `POST /api/communities/[communityId]/posts`, `POST /api/posts/[postId]/comments`

Workload target:
- P1 about `125`
- P3 about `100`
- P2 about `75`

Status rules:
- `[ ]` not done
- `[x]` validated and accepted
- This sprint is a plan only until Sprint 03 is accepted

## P1 - Frontend - Sadik

### 1. Community Feed UI
- [ ] Feed list screen for a community
- [ ] Post detail/read states
- [ ] Pinned owner post or announcement rendering
- Done means: members can open the community tab and read a coherent feed.

### 2. Post And Comment Interaction UI
- [ ] Create post form UI
- [ ] Comment create form UI
- [ ] Success/error states for feed participation
- Done means: feed interaction is no longer read-only on the frontend.

### 3. Members Space UI
- [ ] Members list screen
- [ ] Basic member-card rendering
- [ ] Stable empty/loading/error states for member-space reads
- Done means: the community has a visible member space, not only classroom content.

### 4. Participation UX Pass
- [ ] Keep feed and members tabs visually coherent
- [ ] Membership-aware participation messaging
- [ ] Mobile polish on participation screens
- Done means: the participation flow from access to feed feels coherent.

## P2 - Backend - Sabri

### 1. Feed Endpoints
- [ ] `GET /api/communities/[communityId]/posts`
- [ ] `POST /api/communities/[communityId]/posts`
- [ ] Stable member-only posting checks
- Done means: members and owners can publish into a real community feed through stable routes.

### 2. Comment Endpoints
- [ ] `POST /api/posts/[postId]/comments`
- [ ] Stable payloads for post comments
- [ ] Membership-aware comment authorization
- Done means: feed discussion works through one coherent backend contract.

### 3. Members Read Contracts
- [ ] Community member list payloads
- [ ] Stable basic member profile fields for member-space rendering
- [ ] Keep API naming aligned with the conception
- Done means: the member-space UI can render stable member lists without guessing contracts.

## P3 - Integration - Jaffal

### 1. Feed Integration Hardening
- [ ] Validate membership-aware access for feed routes
- [ ] Keep owner and member participation entry points coherent
- [ ] Check for regressions against access-control flows
- Done means: feed routes behave correctly inside the protected community shell.

### 2. Validation And Error Handling Pass
- [ ] Review accepted participation flows together
- [ ] Standardize obvious route-level error handling gaps
- [ ] Catch role and membership regressions before merge
- Done means: Sprint 04 is stable enough for repeated demo testing on community participation paths.

### 3. Acceptance Gate Across Feed And Member Space
- [ ] Integrate accepted P1 and P2 work into one usable participation slice
- [ ] Validate owner publish flow and member participation flow together
- [ ] Confirm the sprint milestone is ready before owner oversight/admin work begins
- Done means: the product now feels like a community, not only a gated classroom.

## Dependency Gate For Sprint 05

Do not start Sprint 05 until:
- community feed works
- comments work
- member-space reads are stable
- membership-aware participation works end to end
