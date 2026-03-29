# Barter Platform PRD
## Working Name: SkillSwap

## 1. Product Summary

SkillSwap is a local-first barter marketplace where people exchange services, skills, and hobbies instead of money.

Examples:
- Hairstyling in exchange for photography
- Furniture refinishing in exchange for garage organization
- Soccer lessons in exchange for guitar lessons
- Window tinting in exchange for fence painting

Users post:
- what they can offer
- what they need
- where they are located
- when they are available

The platform helps users discover each other, connect, chat, negotiate, and document a mutual agreement. No payments happen between users. The platform makes money through membership subscriptions.

The core differentiator is trust:
- reviews and ratings
- verified profiles
- an IKS network, short for "I Know Someone", where users can vouch for people they trust

The product will launch as a website with a strong mobile-friendly responsive experience. The system should be designed so it can expand to additional cities and regions easily.

---

## 2. Vision

Create a trusted platform where people can get real value from their time, skills, and reputation without spending money.

The long-term goal is to make barter feel modern, credible, and practical for everyday life.

---

## 3. Problem Statement

People often need help with tasks, projects, hobbies, and services but may not want or be able to spend money.

At the same time, many people have useful skills they could exchange but do not have a trusted system to:
- find a good match
- know whether the other person is reliable
- safely communicate
- document what was agreed
- build local reputation over time

Existing marketplaces are mostly cash-based, and informal barter is fragmented, awkward, and risky.

---

## 4. Goals

### Business Goals
- Launch a local-first barter marketplace in one pilot area
- Build a trusted community with strong retention
- Create a subscription revenue model through premium trust and visibility features
- Expand city by city using a repeatable geographic model

### User Goals
- Find someone local who offers a skill or service they need
- Offer their own skill or service in return
- Negotiate directly without being forced into monetary value comparisons
- Feel safe using the platform because of identity, reputation, and social trust signals

### Product Goals
- Make listing, matching, and messaging simple
- Build a strong trust and credibility layer
- Keep barter focused on skill plus need rather than cash equivalency
- Support both desktop and mobile web usage well

---

## 5. Non-Goals for MVP

The MVP will not:
- process payments between users
- recommend exact trade values
- offer guaranteed dispute resolution
- support every possible service category at launch
- act as an employer, staffing platform, or contractor of record
- provide insurance coverage between users
- guarantee performance or safety of any trade

---

## 6. Target Market

### Launch Market
Local only at launch, with architecture and operations designed to support adding cities and regions easily.

Recommended launch model:
- start with one city or county-level region
- use neighborhoods or zip-based discovery
- expand only after trust and supply-demand density are healthy

### Initial User Type Recommendation
**Recommendation: start with individuals first.**

Reason:
- easier onboarding
- simpler trust model
- lower moderation complexity
- fewer business licensing edge cases
- cleaner MVP experience

Small businesses and solo professionals can be added later as a second phase once trust, policy, and category moderation are stronger.

---

## 7. User Personas

### 1. Skilled Local Helper
A person with a practical or creative skill who wants to trade value instead of charging money.

Examples:
- photographer
- guitar teacher
- handyman
- organizer
- graphic designer

Needs:
- visibility
- credibility
- simple posting
- easy local discovery

### 2. Need-Based Seeker
A person who needs help but would rather offer a skill or time than spend cash.

Examples:
- parent needing tutoring
- homeowner needing minor help
- hobbyist needing coaching
- freelancer needing branding help

Needs:
- trusted matches
- easy communication
- confidence in fairness
- safety signals

### 3. Community Connector
A trusted local person who knows many people and can strengthen network effects through vouching.

Examples:
- coach
- community organizer
- hairstylist
- neighborhood volunteer
- small creative business owner in a later phase

Needs:
- reputation visibility
- ability to vouch thoughtfully
- confidence that their vouch matters

---

## 8. Core Product Principles

1. No money between users
2. Fairness is decided by users, not by the platform
3. Trust is the real product advantage
4. Local density matters more than broad scale early
5. Safety and moderation must be built in from day one
6. Mobile-friendly experience is mandatory even if native apps come later
7. Expansion should be city-ready, not city-dependent

---

## 9. Product Scope

## Free Tier
Free users can:
- create an account
- build a profile
- post offers
- post needs
- browse listings
- search within their local area
- match with other users
- send limited messages or chats
- express interest in a trade

Purpose:
- reduce friction
- encourage early marketplace liquidity
- build top-of-funnel user growth

## Paid Tier
Paid users can access:
- verified profile badge
- advanced messaging and agreement tools
- reviews and ratings
- IKS network visibility and endorsements
- increased profile visibility
- preferred placement in search or discovery
- higher posting limits
- stronger trust indicators
- access to more complete match context
- optional future features like background screening integrations if added later

Purpose:
- monetize trust and visibility
- create a premium reputation layer
- strengthen conversion from browsing to real trades

**Target price:** approximately $20/month

---

## 10. User Stories

### Discovery
- As a user, I want to browse people who offer skills near me so I can find someone relevant.
- As a user, I want to search by category, distance, and type of need so I can narrow results.
- As a user, I want to see what someone offers and what they need in one place.

### Matching
- As a user, I want to express interest in another user’s listing so we can start a conversation.
- As a user, I want to propose a barter trade directly from a listing.
- As a user, I want to see whether someone’s offer and need overlap with mine.

### Messaging
- As a user, I want to chat on-platform so I do not need to share my phone number immediately.
- As a paid user, I want agreement tracking in the chat so we can document what was agreed.
- As a user, I want to stop communication or block someone if needed.

### Trust
- As a user, I want to read reviews so I can judge reliability.
- As a user, I want to know whether someone is verified.
- As a user, I want to see who vouched for someone through IKS.
- As a user, I want my own good history to improve my credibility over time.

### Reputation
- As a user, I want reviews after a completed barter.
- As a user, I want to build my standing through successful trades.
- As a user, I want endorsements from people who actually know me.

---

## 11. Feature Requirements

## 11.1 Account and Profile
### Requirements
- user registration and login
- email verification
- profile photo
- display name
- location
- about section
- offered skills/services
- requested skills/services
- availability preferences
- optional social links
- trust indicators shown on profile

### Future
- profile completion score
- portfolio or photo gallery
- skill tags
- service radius
- language preferences

---

## 11.2 Listings
### Offer Listing
User posts what they can offer.

Fields:
- title
- category
- description
- location
- remote or in-person
- availability
- optional photos
- optional examples of past work
- what they are looking for in return

### Need Listing
User posts what they need.

Fields:
- title
- category
- description
- location
- timing
- remote or in-person
- what they can offer in exchange

### Requirements
- easy create/edit/archive
- local search indexing
- flag/report listing
- moderation status
- category tagging

---

## 11.3 Matching and Search
### Requirements
- search by keyword
- filter by category
- filter by location
- filter by distance
- filter by remote vs in-person
- filter by verification status
- filter by review rating in paid experience
- listing suggestions based on offer/need overlap

### Notes
At MVP, fairness is not computed by the platform.
Matching logic should prioritize relevance, geography, and trust indicators rather than monetary equivalence.

---

## 11.4 Messaging
### Free Version
- basic chat or limited conversation initiation
- simple barter proposal message
- basic notifications

### Paid Version
- persistent messaging history
- richer proposal flow
- structured agreement summary
- completion confirmation
- ability to reopen or revise trade terms before completion
- read receipts or delivery status if desired
- optional attachments or reference photos later

### Important
Messaging should be designed with moderation and abuse controls in mind.

---

## 11.5 Agreement Tracking
### Purpose
Users need a lightweight way to document what both sides believe they agreed to.

### Requirements
- one user proposes agreement terms
- other user accepts or requests changes
- final agreement snapshot is stored in-thread
- agreement includes:
  - service A
  - service B
  - expected timing
  - optional conditions or notes
- both users can mark completed
- review prompt after completion

### Product Position
This is not a legal contract platform.
It is a mutual-record feature to reduce misunderstandings.

---

## 11.6 Reviews and Ratings
### Requirements
- only users in a completed barter can review each other
- numeric rating plus text review
- moderation pipeline for abuse
- fraud detection rules
- ability to report suspicious reviews
- reviews shown on profile
- review count shown separately from average score

### Review Dimensions
Possible structure:
- reliability
- communication
- quality of service
- fairness of exchange
- would trade again

### Important
Trust claims must be authentic, verifiable, and moderated.

---

## 11.7 Identity Verification
### Initial Direction
Identity verification is part of the paid experience.

### Requirements
- optional verification during paid onboarding
- visible verification badge
- clear explanation of what verification means and does not mean
- secure handling of personal data
- ability to revoke or expire verification state
- support third-party provider integration later

### Important
Verification should not imply:
- safety guarantee
- service quality guarantee
- legal qualification
- insurance coverage

The meaning of the badge must be precise and limited.

---

## 11.8 IKS List: "I Know Someone"
### Concept
A trust-layer feature where users can vouch for people they know and trust.

### Recommended MVP Version
Keep IKS simple and controlled:
- a user can vouch for another user
- vouching requires an existing relationship assertion
- each profile shows a count of vouches
- users can see who vouched for whom if privacy rules allow
- vouches are separate from reviews
- vouches are not proof of professional qualification

### Rules
- one account cannot vouch for the same user multiple times
- fake-account abuse detection is required
- users can remove their vouch later
- the system should record when the vouch was made
- ideally, the platform prompts the voucher to select why they vouch:
  - know personally
  - traded with before
  - worked with before
  - community trust

### Important
IKS should be framed as social trust, not certification.

---

## 11.9 Notifications
### Requirements
- new message
- new match interest
- agreement update
- review request
- review received
- verification update
- listing status update
- report/moderation result if appropriate

Channels:
- in-app
- email
- push later if native/mobile app is added

---

## 11.10 Safety and Moderation
### Requirements
- user reporting
- listing reporting
- message reporting
- block user
- mute or hide user
- admin moderation queue
- category restrictions
- suspicious behavior detection
- account suspension
- profile takedown flows

### Safety Expectations
- keep initial categories lower risk
- prevent obvious harmful or illegal services
- do not promise outcomes the platform cannot enforce

---

## 12. Category Strategy

### User Input
You are leaning toward allowing all service categories eventually.

### Recommendation
Do **not** launch with all service categories in MVP.

### Recommended MVP Categories
Safer starting categories:
- tutoring and lessons
- music lessons
- sports coaching
- photography
- design and creative work
- admin help
- language help
- organizing
- light non-regulated hobby services
- non-specialized help that does not trigger licensing risk

### Delay or Restrict Early
Higher-risk categories should be delayed, heavily moderated, or excluded until policy is mature:
- childcare
- medical-related services
- legal advice
- tax preparation
- licensed construction or electrical work
- high-risk home repair
- cosmetology or beauty where licensing applies
- transportation of people
- moving heavy goods
- anything adult or explicit
- any service that may create major injury or liability risk

### Why
Open category access sounds inclusive, but it creates immediate trust, compliance, and safety problems. A phased rollout is the safer and more realistic path.

---

## 13. Business Model

## Free Plan
Purpose:
- acquire users
- seed network liquidity
- encourage browsing and casual participation

Possible limits:
- limited active listings
- limited message starts
- no reviews shown or limited trust depth
- no verification badge
- lower visibility

## Paid Plan
Price target:
- around $20/month

Value proposition:
- trusted identity
- stronger visibility
- reputation features
- access to reviews
- access to IKS trust network
- richer in-platform interaction tools

### Future Revenue Options
Potential later options:
- business profile tier
- featured local spotlight placement
- premium community membership
- team or neighborhood group plans
- optional partner services such as background checks or insurance partnerships

### Not Recommended for MVP
- transaction commissions
- cash-based escrow
- paid dispute mediation
- success fees

---

## 14. Trust and Reputation Design

Trust is the product moat.

### Trust Inputs
- verified identity
- completed barter count
- review average
- review recency
- IKS vouches
- profile completeness
- responsiveness
- moderation history
- repeat barter history

### Trust Output on Profile
Recommended visible trust section:
- verified badge
- X completed barters
- star rating
- number of reviews
- IKS count
- joined date
- response rate
- last active

### Important Principle
Do not overstate what trust signals mean.
The platform should display signals without implying full endorsement or safety.

---

## 15. Geographic Expansion Strategy

The product launches local-first, but expansion should be easy.

### Requirements
- city and neighborhood support in architecture
- local search boundaries
- localized discovery feeds
- admin tools by region
- category moderation by region if needed
- ability to open waitlists for new cities

### Suggested Rollout
1. pilot one local market
2. validate supply-demand density
3. identify strongest categories
4. refine trust system
5. expand to adjacent areas
6. launch city kits operationally

---

## 16. Website and Mobile Experience

### Platform Direction
Build as a responsive website first with a mobile-first interface.

### Why
- faster launch
- lower development cost
- easier iteration
- one codebase
- supports both desktop and phone users well
- keeps path open for future native apps

### UX Priorities
- strong mobile browsing
- fast listing creation
- easy profile editing
- seamless chat
- clean local search
- simple trust indicators
- low-friction onboarding

### Future
Native iOS and Android apps may come later once:
- retention is proven
- messaging usage is strong
- local density exists
- premium conversion is validated

---

## 17. Technical Recommendation

### Frontend
- responsive web app
- mobile-first design
- accessible interface
- modern web stack such as React/Next.js

### Backend
- marketplace backend with:
  - auth
  - profiles
  - listings
  - messaging
  - trust/reviews
  - verification state
  - moderation
  - regional settings

### Infrastructure
- multi-region not required at launch
- region-aware data model
- modular services or clean modular monolith
- audit logs for trust and moderation events

### Data Model Areas
- users
- profiles
- listings
- categories
- messages
- barter agreements
- reviews
- vouches
- moderation reports
- verification states
- city/region configs

---

## 18. Legal and Compliance Considerations

**Important:** This section identifies issues to plan for. It is not legal advice.

## 18.1 Tax and Barter Reporting
Even though users are not paying each other in cash, barter transactions can still create taxable income for users.

Risks to review with counsel and tax advisor:
- how barter income should be disclosed to users
- whether platform structure could trigger barter exchange reporting obligations
- what user disclosures are needed in Terms and FAQs
- whether business users change the analysis later

Product implication:
- include clear disclosures that users are responsible for their own tax obligations
- avoid implying barter is tax-free

---

## 18.2 Reviews, Testimonials, and Trust Claims
Reviews, ratings, endorsements, and IKS-style vouching create risk if they are misleading or manipulated.

Product implication:
- only allow reviews after a completed barter
- define exactly what verification means
- prohibit fake reviews and fake vouches
- build moderation and abuse reporting
- avoid deceptive marketing language such as "fully trusted" or "guaranteed safe"

---

## 18.3 Licensed and Regulated Services
Many service categories may be licensed, restricted, or regulated depending on state and city.

Examples of concern:
- construction and contracting
- cosmetology and beauty services
- legal advice
- tax preparation
- childcare
- medical-related services

Product implication:
- create category restrictions
- require user attestations where needed
- avoid positioning the platform as endorsing licensure
- consider restricting or delaying regulated categories at launch

---

## 18.4 Liability and Safety
The platform connects users but does not perform the services.

Product implication:
- Terms of Service must define the platform as a connector, not service provider
- waivers and disclaimers should be reviewed by counsel
- community standards are required
- reporting and blocking are essential
- emergency and safety guidance may be needed for in-person exchanges

---

## 18.5 Privacy and Verification Data
If identity verification is offered, the app will handle more sensitive personal data.

Product implication:
- data minimization
- secure storage and vendor review
- privacy policy with clear disclosure
- retention and deletion rules
- extra care for California privacy compliance

---

## 18.6 Communications and Content Moderation
Messaging creates harassment, abuse, and evidence-handling issues.

Product implication:
- user reporting tools
- moderation workflows
- internal audit logs
- policy enforcement
- lawful access and retention considerations reviewed with counsel

---

## 19. Risks

### Marketplace Risk
Low liquidity in a local area can make the experience feel empty.

Mitigation:
- launch with one geography
- focus on dense categories
- seed supply first
- tightly manage early growth

### Trust Risk
Fake users, false reviews, and vouch abuse can damage credibility.

Mitigation:
- paid verification
- review controls
- anti-abuse rules
- moderation tools
- clear trust definitions

### Legal Risk
Some categories or platform behavior may create licensing, liability, or reporting problems.

Mitigation:
- phased category rollout
- startup counsel review
- strong Terms and policies
- local-first launch
- careful marketing language

### Safety Risk
In-person service exchange can create real-world safety issues.

Mitigation:
- messaging controls
- user education
- reporting and blocking
- category exclusions
- moderation

### Conversion Risk
Users may not pay for premium if free already feels sufficient.

Mitigation:
- reserve the strongest trust and credibility features for paid
- make visibility and verification meaningfully valuable
- avoid giving away the entire trust system for free

---

## 20. Success Metrics

### Marketplace Health
- active users by city
- active listings
- offer-to-need match rate
- message start rate
- agreement creation rate
- completed barter rate

### Trust Metrics
- percent of paid verified users
- review completion rate
- IKS participation rate
- report rate
- moderation turnaround time
- repeat barter rate

### Monetization
- free-to-paid conversion
- paid retention
- monthly recurring revenue
- cost to acquire paid user

### Experience
- onboarding completion
- search-to-message conversion
- message-to-agreement conversion
- mobile engagement rate

---

## 21. MVP Recommendation

### Included in MVP
- responsive website
- local-only launch
- individual users only
- profile creation
- offer and need listings
- search and filter
- match initiation
- basic messaging
- paid verification badge
- review system after completion
- simple IKS vouching
- block/report tools
- basic moderation backend
- regional architecture for future expansion

### Excluded from MVP
- all categories
- businesses as first-class profiles
- native mobile apps
- advanced dispute handling
- monetary balancing
- barter fairness scoring
- escrow
- background checks
- deep analytics for users
- insurance integrations

---

## 22. Roadmap

## Phase 1: Pilot MVP
- one local market
- individuals only
- narrow category set
- free + paid plans
- profile, listings, chat, reviews, IKS, verification

## Phase 2: Trust Expansion
- stronger agreement tools
- more review dimensions
- anti-fraud improvements
- better local recommendation engine
- waitlist for additional cities

## Phase 3: Market Expansion
- multi-city support
- additional categories
- business/solo-pro profiles
- premium visibility tools
- stronger admin and moderation controls

## Phase 4: Platform Maturity
- native apps if justified
- local ambassador/community model
- advanced reputation graph
- optional partner services
- deeper network-based discovery

---

## 23. Open Questions

These still need final product decisions:
1. What exact launch geography should be first?
2. Should remote digital services be allowed in a local-first launch?
3. How many free messages or active listings should free users get?
4. How public should IKS relationships be?
5. Should reviews be visible only to paid users, or visible to everyone while only paid users can collect them?
6. What categories are definitely allowed in MVP?
7. What categories are definitely blocked in MVP?
8. How lightweight or detailed should the agreement tracker be?
9. Should profile verification be monthly subscription only, or also available annually?
10. Should users be able to pause, hide, or archive their reputation if inactive?

---

## 24. Final Recommendation

This product is viable, but it should be positioned as a **trusted local barter network**, not just a listing board.

The strongest version of this idea is:
- local-first
- mobile-friendly web product
- individuals first
- no money between users
- trust as premium value
- phased category rollout
- simple but meaningful agreement tracking
- careful legal and moderation design from the beginning

The real moat is not barter alone.
The moat is a credible reputation system that makes barter feel safe, modern, and practical.

---
## 25. Founder Notes

### Best Near-Term Positioning
"Trade skills, not cash."

### Strongest Premium Value
Users are not paying for barter.
They are paying for:
- credibility
- visibility
- trust
- better connections
- stronger tools to make barter actually work

### Most Important Launch Discipline
Do not try to launch:
- every category
- every city
- every user type
- every trust feature

Start narrow, build trust, and expand from a position of credibility.