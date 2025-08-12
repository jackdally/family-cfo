# Bootstrap Checklist

This checklist tracks the remaining work to finish the `feature/bootstrap` branch. Items checked are complete; unchecked are pending.

## Completed

- [x] Docker Compose for Postgres and Hasura (`docker-compose.yml`)
- [x] Prisma schema for core models (`prisma/schema.prisma`)
- [x] Hasura metadata scaffold and apply script (`scripts/hasura-apply.mjs`, `hasura/metadata`)
- [x] Next.js 14 app scaffold with Tailwind (`apps/web`)
- [x] Basic pages for `Scenarios`, `Accounts`, and `CSV Import`
- [x] CSV Import API wired to Hasura for income/expense rows (`apps/web/src/app/api/import/route.ts`)
- [x] CI workflow for build and type-check (`.github/workflows/ci.yml`)
- [x] Docs site scaffold (`docs/site`)

## Remaining

### Environment & Configuration
- [x] Add `.env.example` (repo root) and `apps/web/.env.local.example` with required variables:
  - `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`
  - `DATABASE_URL`, `HASURA_GRAPHQL_DATABASE_URL`
  - `HASURA_GRAPHQL_ADMIN_SECRET`, `HASURA_GRAPHQL_ENABLE_CONSOLE`, `HASURA_GRAPHQL_DEV_MODE`, `HASURA_GRAPHQL_JWT_SECRET`
  - `NEXT_PUBLIC_HASURA_GRAPHQL_URL`, `HASURA_URL`
- [x] Update `README.md` with env copy/setup steps and quick-start verification

### Hasura Permissions
- [x] Ensure owner-based permissions on tables for role `user` and `public` where appropriate
- [x] Document permission model and how to apply metadata

### CSV Import
- [x] Handle `transfer` rows (or return clear validation errors with guidance)
- [x] Add a sample CSV and column definitions in `docs/csv/`

### Web App UX
- [x] Add local dev health check (Hasura connectivity) surfaced in the UI
- [x] Document `apps/web/.env.local` values in `README.md`

### CI
- [x] Add ESLint step for `apps/web`
- [x] Add docs site build step to catch breakage

### Docs Site
- [x] Exclude dependency READMEs under `docs/site/node_modules` from indexing (adjust Docusaurus config)
- [x] Publish docs to GitHub Pages from `develop`/`main` with a workflow
- [ ] Configure custom domain for docs (e.g., `docs.familycfo.com`) with CNAME and HTTPS
- [x] Split navigation: `User Guides` (product docs) vs `Developer Docs` (engineering)
- [x] Seed `User Guides`: Getting Started, Importing CSV, Scenarios & Accounts
- [x] Link to docs from the app (header/footer “Docs”)

### Prisma/DB
- [x] Add `db:reset` script for local development (drop/create + migrate)

## Links
- Project overview: `docs/overview/project-overview.md`
- Hasura permissions: `docs/overview/permissions.md`
- Accounts page: `apps/web/src/app/accounts/page.tsx`
- Scenarios page: `apps/web/src/app/scenarios/page.tsx`
- CSV Import page: `apps/web/src/app/import/page.tsx`
- Import API: `apps/web/src/app/api/import/route.ts`
- Hasura client: `apps/web/src/lib/hasura.ts`


