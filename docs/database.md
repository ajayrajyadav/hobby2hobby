# hobby2hobby Database Design

## Purpose

This document defines the recommended database approach for hobby2hobby.

Current accepted direction:

- `PostgreSQL` from the start
- `PostGIS` enabled
- microservices architecture
- Docker-deployed backend

The goal is to keep the system consistent with microservice boundaries while avoiding unnecessary early fragmentation.

## Primary Recommendation

Use `PostgreSQL 16 + PostGIS`.

Why:

- relational data is central to the product
- barter agreements, reviews, vouches, and moderation require transactional integrity
- location-based search is core product behavior
- PostGIS gives you reliable geo querying for radius and area-based discovery

## Database Strategy for Microservices

### Recommended Long-Term Direction

- database per service

### Recommended MVP Starting Point

- one PostgreSQL cluster
- separate schema per service
- strict write ownership by service

This gives you:

- lower operational cost
- easier local development
- cleaner migration path to database-per-service later

Do not:

- let multiple services write to the same table
- create one shared global schema that every service treats as its own

## PostgreSQL Schemas

Recommended starting schemas:

- `identity`
- `marketplace`
- `messaging`
- `trust`
- `moderation`

Optional shared operational schemas later:

- `audit`
- `analytics`

## Extensions

Enable:

- `postgis`
- `pgcrypto`
- `citext`

Useful later if needed:

- `pg_trgm`

Why:

- `postgis` supports geo search
- `pgcrypto` is useful for UUID generation and crypto helpers
- `citext` helps with case-insensitive email handling
- `pg_trgm` improves fuzzy search

## ID Strategy

Use UUIDs across service tables.

Why:

- easier cross-service reference handling
- safer distributed creation patterns
- no dependence on sequential IDs across domains

## Time and Audit Strategy

Every primary table should include:

- `id`
- `created_at`
- `updated_at`

Sensitive workflow tables should also include:

- `created_by`
- `updated_by`
- `deleted_at` where soft delete is needed

Trust and moderation records should never rely on silent hard deletes.

## Service Data Ownership

### Identity Schema

Owns:

- users
- profiles
- verification states
- subscriptions
- entitlements
- profile media references

Does not own:

- listings
- messages
- reviews
- reports

### Marketplace Schema

Owns:

- listings
- listing media references
- categories
- regions
- geolocation metadata
- listing status

Does not own:

- user profile truth
- review truth

### Messaging Schema

Owns:

- threads
- participants
- messages
- barter proposals
- agreement versions
- completion confirmations

### Trust Schema

Owns:

- reviews
- review dimensions
- vouches
- trust summaries
- review eligibility

### Moderation Schema

Owns:

- reports
- blocks
- enforcement actions
- moderation notes
- audit events

## Core Tables by Schema

### Identity

#### `identity.users`

- `id uuid pk`
- `email citext unique`
- `password_hash text nullable`
- `email_verified_at timestamptz nullable`
- `status text`
- `created_at timestamptz`
- `updated_at timestamptz`

#### `identity.profiles`

- `id uuid pk`
- `user_id uuid unique`
- `display_name text`
- `about text nullable`
- `city text nullable`
- `region_code text nullable`
- `avatar_url text nullable`
- `availability_summary text nullable`
- `plan_type text`
- `created_at timestamptz`
- `updated_at timestamptz`

#### `identity.verification_states`

- `id uuid pk`
- `user_id uuid`
- `status text`
- `provider text nullable`
- `verified_at timestamptz nullable`
- `expires_at timestamptz nullable`
- `notes text nullable`
- `created_at timestamptz`
- `updated_at timestamptz`

#### `identity.subscriptions`

- `id uuid pk`
- `user_id uuid`
- `provider text`
- `provider_customer_id text nullable`
- `provider_subscription_id text nullable`
- `status text`
- `current_period_start timestamptz nullable`
- `current_period_end timestamptz nullable`
- `created_at timestamptz`
- `updated_at timestamptz`

#### `identity.entitlements`

- `id uuid pk`
- `user_id uuid`
- `code text`
- `status text`
- `source text`
- `effective_at timestamptz`
- `expires_at timestamptz nullable`

### Marketplace

#### `marketplace.categories`

- `id uuid pk`
- `slug text unique`
- `name text`
- `risk_level text`
- `is_active boolean`
- `created_at timestamptz`
- `updated_at timestamptz`

#### `marketplace.regions`

- `id uuid pk`
- `slug text unique`
- `name text`
- `country_code text`
- `state_code text nullable`
- `is_active boolean`
- `created_at timestamptz`
- `updated_at timestamptz`

#### `marketplace.listings`

- `id uuid pk`
- `user_id uuid`
- `listing_type text`
- `title text`
- `description text`
- `category_id uuid`
- `region_id uuid`
- `location_label text nullable`
- `location geography(point, 4326) nullable`
- `service_mode text`
- `availability_text text nullable`
- `what_in_exchange text nullable`
- `status text`
- `moderation_status text`
- `created_at timestamptz`
- `updated_at timestamptz`

Indexes:

- `gist(location)`
- `btree(category_id, status)`
- full-text index on title and description

#### `marketplace.listing_media`

- `id uuid pk`
- `listing_id uuid`
- `storage_key text`
- `media_url text`
- `sort_order int`
- `created_at timestamptz`

### Messaging

#### `messaging.threads`

- `id uuid pk`
- `listing_id uuid nullable`
- `created_by uuid`
- `status text`
- `created_at timestamptz`
- `updated_at timestamptz`

#### `messaging.thread_participants`

- `id uuid pk`
- `thread_id uuid`
- `user_id uuid`
- `role text`
- `joined_at timestamptz`

#### `messaging.messages`

- `id uuid pk`
- `thread_id uuid`
- `sender_user_id uuid`
- `body text`
- `message_type text`
- `created_at timestamptz`

#### `messaging.proposals`

- `id uuid pk`
- `thread_id uuid`
- `proposed_by uuid`
- `status text`
- `created_at timestamptz`
- `updated_at timestamptz`

#### `messaging.agreement_versions`

- `id uuid pk`
- `proposal_id uuid`
- `version_number int`
- `service_a text`
- `service_b text`
- `expected_timing text nullable`
- `conditions text nullable`
- `snapshot_status text`
- `created_by uuid`
- `created_at timestamptz`

#### `messaging.completion_confirmations`

- `id uuid pk`
- `proposal_id uuid`
- `user_id uuid`
- `confirmed_at timestamptz`

### Trust

#### `trust.review_eligibility`

- `id uuid pk`
- `proposal_id uuid`
- `reviewer_user_id uuid`
- `reviewee_user_id uuid`
- `status text`
- `created_at timestamptz`

#### `trust.reviews`

- `id uuid pk`
- `proposal_id uuid`
- `reviewer_user_id uuid`
- `reviewee_user_id uuid`
- `rating int`
- `comment text nullable`
- `status text`
- `created_at timestamptz`
- `updated_at timestamptz`

#### `trust.review_dimensions`

- `id uuid pk`
- `review_id uuid`
- `dimension text`
- `score int`

#### `trust.vouches`

- `id uuid pk`
- `voucher_user_id uuid`
- `vouched_user_id uuid`
- `reason text nullable`
- `status text`
- `created_at timestamptz`

Constraint:

- unique on `voucher_user_id, vouched_user_id`

#### `trust.trust_summaries`

- `user_id uuid pk`
- `review_count int`
- `average_rating numeric(3,2)`
- `vouch_count int`
- `completed_barter_count int`
- `last_active_at timestamptz nullable`
- `updated_at timestamptz`

### Moderation

#### `moderation.reports`

- `id uuid pk`
- `reporter_user_id uuid`
- `target_type text`
- `target_id uuid`
- `reason_code text`
- `details text nullable`
- `status text`
- `created_at timestamptz`
- `updated_at timestamptz`

#### `moderation.block_relationships`

- `id uuid pk`
- `blocker_user_id uuid`
- `blocked_user_id uuid`
- `created_at timestamptz`

Constraint:

- unique on `blocker_user_id, blocked_user_id`

#### `moderation.enforcement_actions`

- `id uuid pk`
- `target_type text`
- `target_id uuid`
- `action_type text`
- `reason text nullable`
- `status text`
- `created_by uuid nullable`
- `created_at timestamptz`

#### `moderation.audit_logs`

- `id uuid pk`
- `actor_user_id uuid nullable`
- `action text`
- `target_type text`
- `target_id uuid nullable`
- `payload jsonb`
- `created_at timestamptz`

## Cross-Service Reference Rules

Because services are separate:

- store foreign IDs from other services as references only
- do not enforce cross-schema foreign keys between service-owned domains
- validate cross-service existence through service APIs or event-fed projections

Example:

- `marketplace.listings.user_id` references a user owned by `identity`
- the marketplace service should not directly depend on a hard database foreign key into `identity.users`

## Search Strategy

For MVP:

- Postgres full-text search on title and description
- category filtering
- region filtering
- radius filtering with PostGIS

Add dedicated search infrastructure later only if:

- relevance requirements outgrow Postgres
- cross-domain ranking becomes much more complex
- search latency becomes a production bottleneck

## Migration Strategy

Each service should own its own migrations.

Recommended pattern:

- one migration folder per service
- one database schema per service
- schema changes applied only by the owning service

## Backup and Recovery

Minimum production requirements:

- automated backups
- point-in-time recovery if supported
- tested restore path

This matters especially for:

- messages
- agreement records
- reviews
- moderation and audit data

## Recommendation

Use:

- `PostgreSQL 16`
- `PostGIS`
- one cluster initially
- one schema per service
- service-owned migrations

This is the cleanest way to support your microservice architecture without adding unnecessary database operations complexity at MVP stage.
