# Sprint 02 - Current

Window: April 13, 2026 to April 26, 2026

Status: Planned - not active yet

Roadmap anchor:
- Sprint 02
- Owner-side community and classroom management

Conception impact:
- Modules: Owner Workspace, Classroom, Discovery And About Pages, Dashboard Shell, Review / Integration / Deployment
- Entities/APIs: `Community`, `ClassroomItem`, `ClassroomAttachment`, `POST /api/communities`, `PATCH /api/communities/[communityId]`, `POST /api/communities/[communityId]/classroom-items`, `PATCH /api/classroom-items/[itemId]`

Workload target:
- P1 about `125`
- P3 about `100`
- P2 about `75`

Status rules:
- `[ ]` not done
- `[x]` validated and accepted
- This sprint is a plan only until Sprint 01 is accepted

## P1 - Frontend - Sadik

### 1. Owner Community Manager UI
- [ ] Community management page structure
- [ ] Community create form UI
- [ ] Community edit form UI
- Done means: an owner has one clear screen to create and update community data from the protected shell.

### 2. Classroom Item Management UI
- [ ] Add classroom item form UI
- [ ] Edit classroom item form UI
- [ ] Stable classroom item ordering controls in the UI
- Done means: an owner can manage classroom content flow from the owner-facing interface.

### 3. Resource Attachment UI
- [ ] Document attachment UI
- [ ] Video attachment or link UI
- [ ] Clear success/error states for resource attachment actions
- Done means: classroom items can include Skool-style learning resources, not only plain text.

### 4. Public/About Reflection
- [ ] Ensure owner edits can reflect in public community/about views
- [ ] Loading and error states for owner write flows
- [ ] Mobile polish on owner screens
- Done means: owner write-side changes are usable and visible where expected.

## P2 - Backend - Sabri

### 1. Community Write APIs
- [ ] `POST /api/communities`
- [ ] `PATCH /api/communities/[communityId]`
- [ ] Owner/admin authorization checks for community ownership
- Done means: communities can be created and updated through stable server routes with ownership enforcement.

### 2. Classroom Item Write APIs
- [ ] `POST /api/communities/[communityId]/classroom-items`
- [ ] `PATCH /api/classroom-items/[itemId]`
- [ ] Stable classroom item position handling in server logic
- Done means: classroom items can be created and updated with stable contracts for owner workflows.

### 3. Attachment Contracts
- [ ] Support classroom item document attachments
- [ ] Support classroom item video or resource links
- [ ] Keep payload shapes stable for P1 and P3
- Done means: resource-rich classroom items can be managed without payload ambiguity.

## P3 - Integration - Jaffal

### 1. Owner And Admin Ownership Guards
- [ ] Enforce owner/admin ownership checks across new write-side routes
- [ ] Validate route protection for owner-facing pages
- [ ] Check that normal members do not see owner-only actions
- Done means: write-side community management is protected by role and ownership rules, not only by UI hiding.

### 2. Shell And Navigation Updates
- [ ] Add owner-facing route entry points to the shared shell
- [ ] Keep visitor/member/owner navigation coherent
- [ ] Prevent collisions with Sprint 01 public/read flows
- Done means: owner write flows fit into the product without navigation confusion.

### 3. Integration And Review Pass
- [ ] Review accepted P1 and P2 owner-side work
- [ ] Integrate community, classroom item, and attachment flows into one protected slice
- [ ] Verify payload and route consistency against the conception
- Done means: Sprint 02 produces one usable owner-side community management flow.

## Dependency Gate For Sprint 03

Do not start Sprint 03 until:
- owner community create/update works
- classroom item create/update works
- document and video attachment support works at MVP level
- protected owner routes are stable inside the shell
