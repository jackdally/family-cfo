## ADR 0001: Core Architecture for Family CFO MVP

### Status
Accepted — 2025-08-11

### Context
Family CFO (by Steward) targets a dual-ledger, scenario-driven personal finance system. MVP decisions confirmed by product:
- Single-user household owner for MVP (no shared roles yet)
- Scenarios are full snapshot copies (branches), coexisting with actuals via a dual-ledger model
- In-app alerts only for MVP
- Data ingestion via a single, generic CSV template
- Background jobs OK via lightweight scheduling (pg_cron) initially
- Advisor access deferred

Open question resolved here: business logic placement for scalability vs speed.

### Decision
1) API and Data
   - Use Postgres as the system of record.
   - Expose CRUD and queries via Hasura GraphQL over Postgres for rapid iteration and strong authorization.
   - Enforce Row Level Security (RLS) in Postgres aligned with Hasura permissions. Supabase will provide Auth (user identities) in later phases; for local, we’ll use a JWT/dev stub.

2) Business Logic
   - Phase 0/1: Prefer Hasura-native constructs (Actions, Event Triggers, Scheduled Triggers) for orchestration that touches the DB and is transactional.
   - Introduce a small Node/TypeScript service only where domain logic becomes complex (e.g., materializing recurring rules, batch projections). Expose it behind Hasura Actions to keep the public API unified.
   - Optimizer/solver workloads will be separate Python microservices later, invoked asynchronously via Actions/Events.

3) Frontend
   - Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui. Web-first with responsive design; mobile via Expo later.

4) Dev Experience & Infra
   - Local dev via Docker Compose: Postgres + Hasura. Prisma for schema and migrations.
   - CI via GitHub Actions: build, lint, type-check, unit tests. Preview deployments for PRs when hosting is configured.

### Consequences
- Short-term: Fast CRUD/API via Hasura; minimal custom servers to maintain.
- Medium-term: When logic grows, add a focused Node service without breaking clients by routing via Hasura Actions.
- Long-term: Python services for optimization can scale independently; DB remains single source of truth.

### Alternatives Considered
- Pure Node GraphQL/REST API now: More control but slower MVP; higher maintenance.
- Pure Hasura forever: Limits complex domain logic organization; Actions bridge the gap.

### Implementation Notes
- Configure Hasura with JWT auth for local, then switch to Supabase Auth in staging/prod.
- Use Prisma Migrate to evolve schema; Hasura tracks metadata on top.

