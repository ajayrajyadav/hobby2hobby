# hobby2hobby Testing Strategy

## Test Suite

The backend API test suite uses:

- `Jest`
- `@nestjs/testing`
- `supertest`

Why:

- this fits NestJS cleanly
- it gives fast endpoint-level coverage
- it avoids requiring full Docker orchestration for every API test run

## Test Levels

Current focus:

- API endpoint tests for each service controller
- gateway proxy tests
- repository integration tests against real PostgreSQL in Docker

Controller tests run Nest apps in memory and mock repository dependencies where appropriate.

This means:

- endpoint contracts are covered
- request routing is covered
- persistence behavior is now also being covered with repository integration tests

## Future Test Layers

Add later:

- gateway-to-service integration tests
- Docker-based end-to-end smoke tests

## Commands

After dependencies are installed:

```bash
pnpm test
pnpm test:watch
pnpm test:integration
```

## Coverage Target

The immediate target is full route coverage for the current MVP API surface:

- identity
- marketplace
- messaging
- trust
- moderation
- gateway

Repository integration coverage uses disposable `PostgreSQL + PostGIS` containers via `testcontainers`.
