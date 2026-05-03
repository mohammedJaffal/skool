# Sprint 06 - Current

Window: June 8, 2026 to June 21, 2026

Status: Planned - not active yet

Roadmap anchor:
- Sprint 06
- Final integration, demo readiness, and release safety

Conception impact:
- Modules: Authentication And Account, Dashboard Shell, Course Catalog And Course Workspace, Lesson Management, Invitations And Join Requests, Course Communication, Evaluation And Progress, Platform Administration, Review / Integration / Deployment
- Entities/APIs: all accepted MVP entities and routes must be integrated, stabilized, and demo-ready

Workload target:
- P1 about `125`
- P3 about `100`
- P2 about `75`

Status rules:
- `[ ]` not done
- `[x]` validated and accepted
- This sprint is a plan only until Sprint 05 is accepted

## P1 - Frontend - Sadik

### 1. Final UX Polish
- [ ] Improve visual consistency across major protected flows
- [ ] Clean obvious spacing, hierarchy, and route-to-route UI mismatches
- [ ] Keep the final product presentation coherent
- Done means: the MVP looks like one product instead of a set of disconnected sprint screens.

### 2. Empty, Loading, And Error Consistency
- [ ] Standardize empty states on key pages
- [ ] Standardize loading states on key pages
- [ ] Standardize obvious error-state UX on key pages
- Done means: the main demo flow behaves predictably when data or actions are missing or delayed.

### 3. Demo-Ready Page Cleanup
- [ ] Improve readability on core learner flows
- [ ] Improve readability on core teacher flows
- [ ] Improve readability on core admin flows
- Done means: the most important demo screens are clear and stable for presentation use.

Validation:
- Branch: `sadik`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P2 - Backend - Sabri

### 1. API Cleanup Pass
- [ ] Remove or reduce obvious contract inconsistencies
- [ ] Verify route naming coherence across accepted MVP flows
- [ ] Close backend gaps that still block stable demo behavior
- Done means: the accepted backend surface is coherent enough for final testing and presentation.

### 2. Demo And Seed Data Strategy
- [ ] Define stable sample data needed for demo paths
- [ ] Prepare seed/demo data support for core roles and flows
- [ ] Ensure demo data matches the Campus Digital domain model
- Done means: the team can reliably demonstrate the product without manual data repair.

### 3. Domain Bug-Fix Pass
- [ ] Fix accepted high-priority bugs found during final testing
- [ ] Clean obvious route/data edge cases on MVP flows
- [ ] Keep fixes aligned with the conception, not ad hoc shortcuts
- Done means: backend behavior is reliable enough for delivery and presentation.

Validation:
- Branch: `sabri`
- Reviewer:
- Review date:
- Result:
- Merge status:

## P3 - Integration - Jaffal

### 1. Deployment Checklist
- [ ] Final deploy-readiness pass
- [ ] Environment and route protection sanity checks
- [ ] Confirm the team can present one stable branch state
- Done means: the project is ready for final deployment and handoff.

### 2. Smoke-Test Matrix
- [ ] Define the critical learner smoke tests
- [ ] Define the critical teacher smoke tests
- [ ] Define the critical admin smoke tests
- Done means: the final MVP has one repeatable manual test flow before presentation.

### 3. Final Merge Gate And Demo Runbook
- [ ] Review all final accepted work against the sprint sequence
- [ ] Merge only validated work into the final demo state
- [ ] Prepare the demo order and presentation flow for the team
- Done means: the team can show the full MVP without confusion about what to click, who logs in, or what is supposed to work.

Validation:
- Branch: `jaffal`
- Reviewer:
- Review date:
- Result:
- Merge status:

## Final Delivery Gate

Sprint 06 is complete only when:
- the core Campus Digital MVP flows are integrated and stable
- learner, teacher, and admin roles all have a demo-ready path
- the project can be deployed and smoke-tested without confusion
