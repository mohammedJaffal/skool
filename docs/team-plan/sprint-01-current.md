# Sprint 01 - Current

Window: March 30, 2026 to April 12, 2026

Status: Active

Roadmap anchor:
- Sprint 01
- Auth/shell foundation plus first public discovery and community read flows

Conception impact:
- Modules: Authentication And Account, Discovery And About Pages, Dashboard Shell, Classroom, Review / Integration / Deployment
- Entities/APIs: `User`, `Community`, community discovery payloads, classroom preview payloads, `GET /api/communities`, `GET /api/communities/[communityId]`

Workload target:
- P1 about `125`
- P3 about `100`
- P2 about `75`

Status rules:
- `[ ]` not done
- `[x]` validated and accepted
- Do not mark complete before review

## P1 - Frontend - Sadik

### 1. Discovery Homepage UI
- [ ] Community card grid UI
- [ ] Community search and filter UI
- [ ] Public empty/loading/error states for discovery
- Done means: a visitor can discover communities from the homepage through a coherent public-facing UI.

### 2. Community About Page UI
- [ ] Public about page layout
- [ ] Community summary, pricing, and highlights UI
- [ ] Classroom preview block on the about page
- Done means: a visitor can open a community page and understand the offer before joining.

### 3. Shared Public UX Foundation
- [ ] Stable responsive behavior on homepage and about page
- [ ] Clear CTA entry points for sign in, sign up, and join actions
- [ ] Consistent Skool-style naming in public UI
- Done means: the public-facing layer looks like one product, not disconnected screens.

## P2 - Backend - Sabri

### 1. Community Read Foundation Schema
- [ ] Add or stabilize `Community`
- [ ] Add or stabilize public community metadata fields
- [ ] Keep naming aligned with `docs/SOFTWARE_CONCEPTION.md`
- Done means: the first Skool-style community object is stable enough for public discovery work.

### 2. Read Foundation APIs
- [ ] `GET /api/communities`
- [ ] `GET /api/communities/[communityId]`
- [ ] Stable community preview contract for the public homepage
- Done means: P1 can fetch discovery and about-page data without guessing payloads.

### 3. Classroom Preview Contracts
- [ ] Provide classroom preview shape tied to a community
- [ ] Keep preview data lightweight and public-safe
- [ ] Confirm response shape with P1 and P3
- Done means: the about page can show classroom preview content without exposing the full protected classroom.

## P3 - Integration - Jaffal

P3 starts first.

### 1. Auth And Route Protection Pass
- [ ] Verify auth config and protected routes
- [ ] Keep public discovery routes open and protected routes closed
- [ ] Fix redirect or guard issues found during integration
- Done means: the product supports both public discovery and authenticated private surfaces without route confusion.

### 2. Shared Shell And Route Foundation
- [ ] Keep protected dashboard shell stable
- [ ] Prepare route structure for communities and classroom tabs
- [ ] Prevent route collisions between public and protected flows
- Done means: Sprint 01 pages fit into a stable route structure that can grow into the Skool-style product.

### 3. Review And Deploy Foundation
- [ ] Keep deploy checklist and branch workflow current
- [ ] Prepare branch review flow for incoming P1 and P2 work
- [ ] Validate that public and protected surfaces coexist safely
- Done means: Sprint 01 work can be reviewed, integrated, and demonstrated cleanly.

## Sprint 01 Acceptance Gate

Sprint 01 is accepted only when:
- visitors can discover communities publicly
- at least one community about page is readable and coherent
- the protected shell still works without regressions
- the first community and classroom preview contracts are stable
