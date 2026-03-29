# hobby2hobby Architecture

## Purpose

This document defines the recommended technical architecture for hobby2hobby based on the current product direction:

- responsive web app first
- Docker-deployed backend
- microservices, not a monolith
- local-first barter marketplace with trust, moderation, and subscriptions

The goal is to keep service boundaries real and useful without over-splitting the MVP.

## Architecture Summary

### Frontend

- `Next.js` + TypeScript
- Tailwind CSS
- `shadcn/ui`
- frontend calls a single API gateway
### Backend

- microservices in Docker
- `NestJS` for API-facing and domain services
- REST for frontend-facing APIs
- async event-driven communication between services where eventual consistency is acceptable

### Data and Infra

- `PostgreSQL` as the primary system of record
- `PostGIS` for geo queries
- `Redis` for cache, rate limits, ephemeral state, and jobs
- `RabbitMQ` or `Kafka` for inter-service events
- `S3`-compatible object storage for images and attachments
- `Stripe` for subscriptions

## Design Principles

- services align to business domains, not tables
- frontend should not call domain services directly
- each service owns its own data contract
- synchronous calls are used only when the user must get an immediate answer
- asynchronous events are used for derived state, notifications, and cross-domain updates
- trust and moderation data must be auditable
- auth and entitlements must be consistent across services

## Service Topology

### 1. Web App

Responsibilities:

- user-facing website
- server-rendered and client-side UI
- session management on the client
- calls `api-gateway`

Does not own:

- business logic
- direct database access

### 2. API Gateway

Responsibilities:

- single public backend entry point
- auth token validation
- request routing to internal services
- response aggregation for frontend screens
- rate limiting and request tracing
- OpenAPI surface for public API

Why it exists:

- keeps frontend integration simple
- isolates internal service layout from external clients
- allows consistent auth, logging, throttling, and versioning

### 3. Identity Service

Responsibilities:

- user accounts
- profile core data
- email verification state
- login/session token support
- subscription and entitlement state
- identity verification state

Owns data such as:

- users
- profiles
- profile photos
- verification records
- plan entitlements
- subscription snapshots

External integrations:

- auth provider implementation
- Stripe webhooks
- email provider

### 4. Marketplace Service

Responsibilities:

- offer listings
- need listings
- categories
- region and geography metadata
- search/filter support
- listing lifecycle

Owns data such as:

- offers
- needs
- categories
- listing tags
- locations
- regions
- listing moderation status shadow fields

Notes:

- use `PostGIS` for radius and location queries
- start with Postgres full-text search
- only add a dedicated search engine later if needed

### 5. Messaging Service

Responsibilities:

- conversations
- barter proposals
- agreement snapshots
- message history
- unread counts
- notification triggers

Owns data such as:

- threads
- participants
- messages
- proposal revisions
- agreement versions
- completion confirmations

Notes:

- this service is the source of truth for agreement state
- notification delivery may be delegated to worker processes

### 6. Trust Service

Responsibilities:

- reviews
- ratings
- IKS vouches
- trust summary generation
- review eligibility checks based on completed barter events

Owns data such as:

- reviews
- rating dimensions
- vouches
- trust aggregates
- review eligibility records

Notes:

- reviews and vouches should remain distinct concepts
- trust scores should be explainable; avoid black-box scoring in MVP

### 7. Moderation Service

Responsibilities:

- reports for users, listings, messages, and reviews
- block relationships
- enforcement actions
- moderation queues
- abuse and fraud signals
- audit logs

Owns data such as:

- reports
- report evidence references
- blocks
- suspensions
- takedowns
- moderator actions
- audit events

Notes:

- this service should be able to act on content owned by other services through domain APIs or events

## Suggested Data Ownership

Preferred production direction:

- database per service

Pragmatic MVP starting option:

- one Postgres cluster
- separate database or schema per service
- strict ownership rules enforced at the application level

Do not:

- let multiple services write to the same tables
- share one giant ORM schema across all services

## Synchronous vs Asynchronous Communication

### Use Synchronous Calls For

- login and token validation
- profile fetch for current user
- creating or updating listings
- sending a message
- loading inbox or listing detail pages
- checking entitlements during paid feature access

### Use Events For

- `user.created`
- `profile.updated`
- `listing.created`
- `listing.reported`
- `agreement.completed`
- `review.created`
- `vouch.created`
- `subscription.updated`
- `user.blocked`
- `moderation.action_taken`

Why:

- notifications, trust summaries, moderation signals, and analytics do not all need to complete in the request path

## Core User Flows

### 1. User Registration

1. Web app sends sign-up request to `api-gateway`.
2. Gateway forwards to `identity-service`.
3. Identity service creates user and profile shell.
4. Identity service emits `user.created`.
5. Notification/email worker sends verification email.

### 2. Listing Creation

1. User submits an offer or need.
2. Gateway routes to `marketplace-service`.
3. Marketplace service stores listing and geodata.
4. Marketplace service emits `listing.created`.
5. Moderation service may create automated review tasks for flagged categories or heuristics.

### 3. Match to Conversation

1. User expresses interest from a listing.
2. Gateway routes to `messaging-service`.
3. Messaging service creates or reuses a thread and a proposal record.
4. Messaging service emits `proposal.created`.
5. Notification pipeline informs the recipient.

### 4. Agreement Completion to Review

1. Both users mark an agreement complete in `messaging-service`.
2. Messaging service emits `agreement.completed`.
3. Trust service creates review eligibility for both users.
4. Trust service accepts post-trade reviews.
5. Trust service emits `review.created` and updates trust aggregates.

### 5. Reporting and Enforcement

1. A user reports content through the web app.
2. Gateway routes to `moderation-service`.
3. Moderation service records the report and evidence reference.
4. If needed, moderation service calls target services or emits enforcement events.
5. Affected services update visibility or access state and emit confirmation events.

## API Shape

### External API

Expose a versioned public API through the gateway:

- `/api/v1/auth/*`
- `/api/v1/me/*`
- `/api/v1/profiles/*`
- `/api/v1/listings/*`
- `/api/v1/search/*`
- `/api/v1/messages/*`
- `/api/v1/agreements/*`
- `/api/v1/reviews/*`
- `/api/v1/vouches/*`
- `/api/v1/reports/*`
- `/api/v1/subscriptions/*`

### Internal Service APIs

Keep these private within the Docker network:

- identity internal profile lookups
- entitlement checks
- moderation enforcement endpoints
- trust aggregate refresh endpoints
- notification job endpoints if needed

## Recommended Tech by Layer

### Frontend

- `Next.js`
- TypeScript
- Tailwind CSS
- `shadcn/ui`
- `react-hook-form`
- `zod`

### Backend Services

- `NestJS`
- TypeScript
- `Drizzle ORM`
- `zod` or class-validator for DTO validation
- OpenAPI/Swagger for gateway and service contracts

### Data and Messaging

- PostgreSQL 16
- PostGIS
- Redis
- RabbitMQ for simpler MVP operations

Use Kafka later only if event volume and replay requirements justify it.

### Storage and Billing

- S3-compatible object storage
- Stripe subscriptions and webhook handling

## Docker and Deployment

### Local Development

Use `docker-compose` or equivalent for:

- `web`
- `api-gateway`
- `identity-service`
- `marketplace-service`
- `messaging-service`
- `trust-service`
- `moderation-service`
- `postgres`
- `redis`
- `rabbitmq`
- optional `mailhog`

### Production

Deploy each service as a separate containerized workload.

Minimum production concerns:

- environment-specific secrets management
- health checks and readiness probes
- horizontal scaling for gateway and messaging first
- managed Postgres backups
- object storage lifecycle rules
- separate worker processes for async jobs if traffic grows

## Observability

Required from the start:

- structured logs
- request IDs and correlation IDs
- metrics for API latency, error rate, and queue depth
- audit logs for trust and moderation actions

Recommended tools:

- OpenTelemetry
- Prometheus + Grafana
- centralized log aggregation

## Security and Auth

- JWT-based access tokens or equivalent session tokens validated by the gateway
- service-to-service auth for internal requests
- role-based access for admin and moderation actions
- rate limiting at the gateway
- signed upload flow for images
- encryption in transit everywhere

Trust-sensitive rules:

- only completed barter participants can review each other
- vouches cannot be duplicated by the same account for the same user
- verification badges must reflect exact verification state, not vague trust language

## Data Model Domains

### Identity

- users
- profiles
- profile_media
- verification_states
- subscriptions
- entitlements

### Marketplace

- listings
- listing_offers
- listing_needs
- categories
- regions
- locations
- listing_media

### Messaging

- threads
- thread_participants
- messages
- proposals
- agreement_versions
- completion_confirmations

### Trust

- reviews
- review_dimensions
- vouches
- trust_aggregates
- review_eligibility

### Moderation

- reports
- block_relationships
- enforcement_actions
- moderation_notes
- audit_logs

## MVP Delivery Guidance

Even with microservices, keep the first release constrained:

- start with 5 core domain services plus one gateway
- avoid a dedicated search service initially
- avoid a dedicated notification service initially
- avoid splitting billing from identity in MVP

This gives you real service boundaries without turning every feature into distributed coordination work.

## Open Architecture Decisions

- auth provider choice
- exact event bus choice: RabbitMQ vs Kafka
- database-per-service now vs schema-per-service first
- whether realtime chat uses WebSockets immediately or starts with polling
- whether verification is implemented manually first or through a vendor
- whether search stays entirely in Postgres for MVP

## Recommended Next Technical Artifacts

1. service contract document for each microservice
2. initial database schema per service
3. event catalog with payload definitions
4. Docker Compose setup for local development
5. API endpoint spec for `api-gateway`
