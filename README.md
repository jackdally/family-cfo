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

### Hasura metadata (local)
- Apply tracked tables/relationships:
  - `node scripts/hasura-apply.mjs`
- Quick GraphQL check (should return empty array on fresh DB):
  - `curl -sS -H 'x-hasura-admin-secret: devadminsecret' -H 'Content-Type: application/json' -X POST http://localhost:8080/v1/graphql --data-binary '{"query":"query { Scenario(limit: 1) { id name } }"}'`

### Docs site
- `cd docs/site && npm install && npm run start`

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

