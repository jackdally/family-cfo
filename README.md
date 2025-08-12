## Family CFO (Steward) — MVP Scaffold

### Prerequisites
- Node.js 18+
- Docker + Docker Compose

### Quick Start (Local)
1. Start Postgres and Hasura:
   - `npm run docker:up`
2. Install dependencies:
   - `npm install`
3. Apply database schema (ensure Postgres is up):
   - `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/familycfo npm run db:migrate`
4. Build the web app:
   - `npm run build:web`
5. Run the web app:
   - `npm run dev:web` then open `http://localhost:3000`

### Environment Variables
Create a `.env` at repo root and `apps/web/.env.local` based on the examples below.

Repo root `.env` example:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=familycfo
POSTGRES_PORT=5432

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/familycfo
HASURA_GRAPHQL_DATABASE_URL=postgresql://postgres:postgres@postgres:5432/familycfo

HASURA_GRAPHQL_ADMIN_SECRET=devadminsecret
HASURA_GRAPHQL_ENABLE_CONSOLE=true
HASURA_GRAPHQL_DEV_MODE=true
HASURA_GRAPHQL_JWT_SECRET='{"type":"HS256","key":"devsecret"}'

HASURA_URL=http://localhost:8080
```

`apps/web/.env.local` example:

```
NEXT_PUBLIC_HASURA_GRAPHQL_URL=http://localhost:8080/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=devadminsecret
```

### Hasura metadata (local)
- Apply tracked tables/relationships:
  - `HASURA_GRAPHQL_ADMIN_SECRET=devadminsecret npm run hasura:apply`
- Quick GraphQL check (should return empty array on fresh DB):
  - `curl -sS -H 'x-hasura-admin-secret: devadminsecret' -H 'Content-Type: application/json' -X POST http://localhost:8080/v1/graphql --data-binary '{"query":"query { Scenario(limit: 1) { id name } }"}'`

### Docs site
- `cd docs/site && npm install && npm run start`
 - Bootstrap checklist lives at `docs/overview/bootstrap-checklist.md` and on the docs site under Overview.

### Services
- Postgres: `localhost:5432`
- Hasura Console: `http://localhost:8080` (admin secret: `devadminsecret`)

### Notes
- Environment variables for containers are defined in `docker-compose.yml`. Create a local `.env` if you want to override defaults.
- Prisma schema lives in `prisma/schema.prisma`. Migrations use the `DATABASE_URL` env var.
- Next.js app lives in `apps/web`.

### Next Steps
- Add Hasura metadata and permissions (RLS alignment).
- Implement Accounts, Events, and Scenarios CRUD via GraphQL.
- Add CSV import mapper for initial data ingestion.


