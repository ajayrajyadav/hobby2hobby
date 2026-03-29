# hobby2hobby Plan

## Purpose

This plan translates the PRD into an execution document for the MVP. It keeps hobby2hobby focused on a local-first, trust-centered barter marketplace and separates committed direction from open questions that still need decisions.

## Planning Assumptions

- The PRD is the current source of truth for product direction.
- The MVP is a responsive website, not a native mobile app.
- The API will be deployed in Docker.
- Launch starts in one pilot geography with individuals only.
- Trust, moderation, and category safety are core MVP requirements, not later enhancements.
- The platform supports barter only. No cash payments are processed between users.

## Product Outcome

Deliver an MVP that lets local users:

- create profiles
- publish offers and needs
- discover relevant people nearby
- express interest and message on-platform
- document a lightweight barter agreement
- complete a trade and leave reviews
- use early trust signals such as verification foundations and IKS vouching

The first release should prove three things:

- users can find enough relevant local matches
- users trust the platform enough to start conversations and complete trades
- paid trust and visibility features are compelling enough to test subscription conversion

## MVP Scope

### In Scope

- auth and email verification
- profile creation and editing
- offer listings
- need listings
- local search and discovery
- category and distance filters
- basic matching intent
- on-platform messaging
- lightweight agreement summary in-thread
- trade completion flow
- post-trade reviews and ratings
- basic IKS vouching
- reporting, blocking, and moderation workflows
- subscription support for paid features
- verification badge foundation
- responsive mobile-friendly web experience

### Out of Scope

- native iOS or Android apps
- monetary payments, escrow, or commissions
- automated barter valuation
- dispute mediation
- nationwide launch
- business accounts in MVP
- unrestricted category access
- advanced AI matching
- insurance or background-check integrations

## Release Phases

### Phase 0: Product and Policy Foundations

Goal: lock scope, reduce legal/safety ambiguity, and prepare implementation.

- finalize MVP categories and launch geography
- define free vs paid feature access
- define moderation policy, reporting reasons, and category restrictions
- define trust language for reviews, vouches, and verification
- outline legal copy requirements for Terms, Privacy, and safety disclaimers
- confirm success metrics for pilot launch

### Phase 1: Core Marketplace

Goal: make the marketplace functional end to end.

- implement auth and profile setup
- implement offer and need listings
- implement local search, filtering, and discovery
- implement listing lifecycle: create, edit, archive, report
- implement basic match interest flow

Exit criteria:

- a user can onboard, create a profile, publish listings, and browse local results

### Phase 2: Conversation and Agreement

Goal: make barter coordination possible without off-platform contact.

- implement messaging threads
- implement simple barter proposal flow
- implement agreement summary with revision and acceptance states
- implement notifications for message and agreement events
- implement blocking and message reporting

Exit criteria:

- two users can connect from a listing, discuss terms, and record an agreement

### Phase 3: Trust Layer

Goal: make the platform credible enough for real-world exchange.

- implement completed trade confirmation
- implement reviews and ratings after completion
- implement basic IKS vouching
- implement visible trust signals on profile
- implement verification badge data model and initial paid gating
- implement moderation queue and audit logging for trust events

Exit criteria:

- users can evaluate credibility through authentic, moderated trust signals

### Phase 4: Paid Experience and Pilot Readiness

Goal: test monetization and prepare for launch operations.

- implement subscription gating and entitlement checks
- enable paid trust and visibility features
- add pilot-region admin controls
- prepare seed-user onboarding workflows
- finalize launch analytics and dashboards

Exit criteria:

- the pilot can launch with measurable conversion, moderation, and trust workflows

## Workstreams

### Product

- finalize MVP feature acceptance criteria
- maintain scope discipline around categories, geography, and trust
- prioritize user flows that reduce friction from listing to conversation

### Design

- create mobile-first flows for onboarding, search, profile, chat, and reviews
- design trust presentation carefully to avoid overclaiming safety or quality
- keep moderation and reporting accessible from key surfaces

### Engineering

- build a modular architecture with a separate Docker-deployed API for auth, profiles, listings, messaging, trust, and moderation
- use a region-aware data model from day one
- add audit logging for sensitive trust and moderation events

### Operations and Policy

- define launch playbook for one region
- define category review rules and moderation SLAs
- prepare disclosures for taxes, liability, privacy, and verification meaning

## Success Metrics for the Pilot

- profile completion rate
- listing creation rate
- search-to-message conversion
- agreement creation rate
- barter completion rate
- review submission rate
- paid conversion rate
- moderation incident volume
- retention in the pilot geography

## Key Risks and Mitigations

- Low liquidity in the pilot area
  - seed supply before launch and keep geography narrow
- Low trust between strangers
  - prioritize verification foundations, reviews, vouches, and moderation visibility
- Safety and compliance issues from risky categories
  - launch with restricted lower-risk categories only
- Weak paid conversion
  - make premium value clearly tied to trust and visibility, not core access lockout

## Open Decisions

- exact pilot geography
- final MVP category list
- exact free-tier messaging and listing limits
- exact paid entitlements at launch
- whether verification is manual, vendor-backed, or placeholder-only in MVP
- review visibility rules for free users vs paid users
- privacy rules for displaying who vouched for whom
- initial moderation staffing and tooling depth

## Immediate Next Steps

1. Convert this plan into epics and stories by phase.
2. Draft wireframes for onboarding, listings, search, chat, agreement flow, and trust surfaces.
3. Draft the initial data model for users, profiles, listings, messages, agreements, reviews, vouches, subscriptions, moderation, and regions.
4. Define pilot-market success metrics and launch thresholds.
5. Resolve the open decisions in [`decisions-logs.md`](/Users/ajayyadav/code/hobby2hobby/docs/decisions-logs.md).
