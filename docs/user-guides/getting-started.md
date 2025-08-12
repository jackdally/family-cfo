# Getting Started

Follow these steps to run Family CFO locally.

## Prerequisites
- Node.js 18+
- Docker + Docker Compose

## Setup
1. Copy environment files:
   - `cp .env.example .env`
   - `cp apps/web/.env.local.example apps/web/.env.local`
2. Start services:
   - `npm run docker:up`
3. Install dependencies:
   - `npm install`
4. Apply database schema (ensure Postgres is up):
   - `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/familycfo npm run db:migrate`
5. Apply Hasura metadata:
   - `HASURA_GRAPHQL_ADMIN_SECRET=devadminsecret npm run hasura:apply`
6. Run the web app:
   - `npm run dev:web` then open `http://localhost:3000`

## Verify
- Hasura Console: `http://localhost:8080` (admin secret: `devadminsecret`)
- Health: App header shows Hasura status; `/api/health` returns `{ ok: true }`
- Docs dev: `cd docs/site && npm install && npm run start`
