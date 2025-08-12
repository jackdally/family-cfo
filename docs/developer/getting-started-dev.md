# Developer: Getting Started (Local)

- Clone repo, copy `.env.example` → `.env` and `apps/web/.env.local.example` → `.env.local`.
- `npm run docker:up`
- `npm install`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/familycfo npm run db:migrate`
- `HASURA_GRAPHQL_ADMIN_SECRET=devadminsecret npm run hasura:apply`
- `npm run dev:web` → http://localhost:3000
