# Decision Log

This file records product and planning decisions for hobby2hobby. Entries below reflect the current accepted direction captured in the PRD and the planning decisions made while creating the execution plan.

## Decision Rules

- Append new decisions instead of rewriting history.
- If a decision changes, add a new entry that supersedes the earlier one.
- Record status as `accepted`, `open`, `changed`, or `rejected`.

## Decisions

| ID | Date | Status | Decision | Rationale | Source |
| --- | --- | --- | --- | --- | --- |
| D-001 | 2026-03-28 | accepted | Product is a barter marketplace with no payments between users. | Keeps the platform focused on exchange of skills and services rather than cash transactions. | PRD |
| D-002 | 2026-03-28 | accepted | Trust is the core product differentiator. | Reviews, verification, vouches, and moderation are central to adoption and retention. | PRD |
| D-003 | 2026-03-28 | accepted | MVP launches as a responsive website, not a native mobile app. | Faster launch, lower cost, and one codebase with strong mobile web support. | PRD |
| D-004 | 2026-03-28 | accepted | Launch starts in one local pilot geography. | Marketplace density and trust are easier to validate in a narrow region first. | PRD |
| D-005 | 2026-03-28 | accepted | Initial user focus is individuals, not businesses. | Simpler onboarding, lower moderation complexity, and fewer policy edge cases. | PRD |
| D-006 | 2026-03-28 | accepted | The MVP will not compute barter value equivalency. | Fairness should be negotiated by users, not assigned by the platform. | PRD |
| D-007 | 2026-03-28 | accepted | Restricted lower-risk service categories will be used at launch. | Broad category access increases safety, compliance, and liability risk too early. | PRD |
| D-008 | 2026-03-28 | accepted | Messaging, agreement tracking, reviews, and basic IKS vouching are in MVP scope. | These features are required to move from discovery to trusted completed trades. | PRD |
| D-009 | 2026-03-28 | accepted | Paid tier target pricing is approximately $20 per month. | Monetization is based on trust and visibility features rather than transaction fees. | PRD |
| D-010 | 2026-03-28 | accepted | Verification is part of the paid experience and must be precisely framed. | The badge should signal limited identity assurance without implying safety or quality guarantees. | PRD |
| D-011 | 2026-03-28 | accepted | Safety, reporting, blocking, and moderation are day-one requirements. | Trust signals are not credible without abuse controls and policy enforcement. | PRD |
| D-012 | 2026-03-28 | accepted | The execution plan will be maintained separately from the PRD in `docs/plan.md`. | Keeps strategy and implementation planning distinct while preserving the PRD as source direction. | Planning |
| D-013 | 2026-03-28 | accepted | Ongoing product and planning decisions will be recorded in `docs/decisions-logs.md`. | Creates a durable history of decisions, rationale, and future changes. | Planning |
| D-014 | 2026-03-28 | accepted | The app name is `hobby2hobby`. | Establishes the product identity for planning, design, and implementation work. | User decision |
| D-015 | 2026-03-28 | accepted | The API will be deployed in Docker. | This requires a clean separation between frontend and backend service boundaries. | User decision |
| D-016 | 2026-03-28 | accepted | The backend architecture will be microservices, not a monolith. | This is the preferred system design direction for the product. | User decision |
| D-017 | 2026-03-28 | accepted | The system architecture will be documented in `docs/architecture.md`. | Keeps implementation guidance separate from the product plan and decision history. | Planning |
| D-018 | 2026-03-28 | accepted | The project will use PostgreSQL from the start, not migrate to it later. | Aligns development and production on the same database and avoids unnecessary migration work. | User decision |
| D-019 | 2026-03-28 | accepted | The database design will be documented in `docs/database.md`. | Keeps service data ownership and Postgres schema planning explicit before persistence work begins. | Planning |
| D-020 | 2026-03-28 | accepted | The MVP web client will use Next.js App Router against the API gateway. | Keeps the browser talking to one public backend surface while preserving the microservice split behind the gateway. | Implementation |
| D-021 | 2026-03-28 | accepted | The MVP browser session model will use bearer tokens stored client-side until production auth is upgraded. | Matches the current dev token backend contract and unblocks end-to-end frontend work without inventing a second auth system. | Implementation |

## Open Decisions To Resolve Next

| ID | Date | Status | Decision Needed | Notes |
| --- | --- | --- | --- | --- |
| O-001 | 2026-03-28 | open | Final pilot geography | Needed for discovery boundaries, seeding, and launch operations. |
| O-002 | 2026-03-28 | open | Final MVP category list | Needs a concrete allowlist and moderation policy. |
| O-003 | 2026-03-28 | open | Free-tier message and listing limits | Affects liquidity, abuse prevention, and paid conversion. |
| O-004 | 2026-03-28 | open | Exact paid entitlements at launch | Needed for packaging, UX, and subscription logic. |
| O-005 | 2026-03-28 | open | Verification implementation approach | Decide between manual review, third-party integration, or future-ready placeholder. |
| O-006 | 2026-03-28 | open | Visibility of reviews and vouches by plan level | Needed to define the trust layer and monetization balance. |
| O-007 | 2026-03-28 | open | Initial microservice boundaries and ownership | Needed to avoid over-splitting the system before launch. |
