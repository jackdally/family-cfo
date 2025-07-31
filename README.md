# FamilyCFO

> A luxury-grade, CFO-level personal finance platform that treats a household like a boutique family office—providing month-by-month forecasting, liquidity intelligence, scenario planning, and long-term wealth optimization.

## 🎯 Mission & Vision

FamilyCFO transforms personal finance from reactive budgeting to proactive wealth management. Built for households who want:

- **Liquidity Foresight**: Daily "days-of-cash" projections and buffer alerts
- **Stress-Free Big-Purchase Planning**: Goal wizards with quantified funding options
- **Variance Early-Warning**: Actual-vs-plan roll-ups that catch trends early
- **Scenario Agility**: One-click branching for life changes (job loss, new baby, relocation)
- **Evidence-Based Investment Discipline**: Rules engine that enforces contribution cadence
- **Unified Source of Truth**: All data normalized in Postgres—no more siloed Excel, Mint, PDFs

## 🏗️ Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **DB** | Postgres 15 | relational + JSONB + RLS |
| **ORM** | Prisma | type-safe TS client, migrations |
| **Instant API** | Hasura GraphQL | zero-boilerplate CRUD & subscriptions |
| **Backend Logic** | Next.js API routes \| Python micro-svcs | JS for frictionless dev; Py for math optimization |
| **Frontend** | Next.js 14 (App Router) + Tailwind + shadcn/ui | SSR, server components, modern UI kit |
| **Auth** | Supabase Auth | magic-link + OAuth, wires to PG roles |
| **DevOps** | Docker Compose (local) → Vercel (+ managed PG) → GitHub Actions CI | fast local start, painless deploy |
| **Docs** | Markdown in `/docs`, ERD via prisma-erd-generator | single-source schema docs |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose
- Git

### Local Development

```bash
# Clone & install
git clone git@github.com:jackdally/family-cfo.git
cd family-cfo
pnpm install

# Start DB + Hasura
docker compose up -d db hasura

# Generate Prisma client (ERD optional, requires Chrome)
pnpm exec prisma generate

# Dev server
pnpm --filter web dev
```

### Environment Setup

Create a `.env` file based on `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/familycfo"

# Hasura
HASURA_GRAPHQL_ENDPOINT="http://localhost:8080"
HASURA_GRAPHQL_ADMIN_SECRET="your-admin-secret"

# Supabase (for auth)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## 📊 Database Schema

### Core v0 Models

All models cascade delete when their parent scenario is removed.

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **Scenario** | Root context (Baseline 2025, Home-Purchase 2029, etc.) | `id`, `name`, `startDate`, `isPrimary` |
| **Account** | Any financial bucket—checking, mortgage loan, 401k | `name`, `type`, `owner`, `isActive`, `scenarioId` |
| **AccountBalance** | End-of-month balance per account | `accountId`, `date`, `value`, `isActual`, `scenarioId` |
| **IncomeEvent** | Salaries, bonuses, RSUs, etc. | `date`, `amount`, `owner`, `label`, `isActual`, `scenarioId` |
| **ExpenseEvent** | Recurring or one-off spending | `date`, `amount`, `category`, `notes`, `isActual`, `scenarioId` |
| **AccountTransfer** | Internal re-allocations (checking → brokerage) | `fromAccountId`, `toAccountId`, `amount`, `date`, `isActual`, `scenarioId` |

### Dual-Ledger Model

Every event can be "Projected" or "Actual." Nothing is overwritten; variance analysis is first-class.

## 🗺️ Roadmap

| Phase | Goal | Key Deliverables |
|-------|------|------------------|
| **0 Bootstrap** | Local Docker (Postgres + Hasura), Prisma schema, CI | `docker-compose.yml`, `ci.yml` |
| **MVP** | Replicate Excel net-worth dashboard | Next.js app `/dashboard`, GraphQL queries |
| **v1 Liquidity Brain** | Buffer rules & allocation recommendations | `buffer_rules` table, edge function, banner UI |
| **v1.5 Scenario Engine** | Clone, diff, merge-actuals | API route & diff viewer |
| **v2 Assets** | Depreciation/appreciation logic | `assets` table, valuation job, toggle on charts |
| **v2.5 Optimizer** | LP/heuristic engine for funding paths | Python micro-svc, goal wizard |
| **v3 Advisor** | Notifications & LLM explanations | Digest emails, natural-language scenario entry |
| **v4 Tax & Estate** | Projection & inheritance planning | `tax_rules`, estate objects |

## 🎨 Design System

### Visual Style
- **Dark-mode default**; elegant serif headings, Inter body
- **Jewel greens** for positive, **copper** for negative
- **12-column fluid** layout; collapsible sidebar; max-width 1280px

### UX Rules
- **Charts**: one metric per chart; Recharts; no hard-coded colors; export buttons
- **Forms**: multi-step wizard for complex entries; smart defaults; validation
- **Accessibility**: WCAG 2.1 AA; keyboard paths; reduced-motion friendly

## 📈 Value Proposition

### Concrete Benefits (5-Year ROI: ~$29,250)
- **Overdraft/late-fee avoidance**: $1,750
- **Tax timing/harvesting**: $6,000
- **Investment discipline** (1% excess return on $300k): $15,000
- **Better loan/down-payment decisions**: $4,000
- **Reduced advisor/prep fees**: $2,500

### Intangible Benefits
- **Faster Decisions**: big moves go from week-long spreadsheet scrambles to single-evening data reviews
- **Relationship Harmony**: transparent, automated rules reduce blame and cognitive load
- **Confidence to Take Calculated Risks**: knowing six months of liquidity is locked-in frees you for sabbaticals, startups, relocations
- **Legacy Continuity**: children inherit not just assets but a stewardship framework

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- **Git workflow**: PRs → develop; merges → main; CI runs tests + lint + prisma format
- **Conventions**: Money stored as `numeric(18,2)` (two-decimals); all timestamps in UTC
- **Testing**: Unit tests with Vitest or Jest (TBD)
- **Documentation**: Update docs when adding new features

### Database Migrations

- **Schema changes**: Create new Prisma migration
- **Data integrity**: `isActual = true` rows are immutable after entry (auditable)
- **Documentation**: Regenerate ERD and data dictionary: `pnpm run generate:all`

## 📚 Documentation

- **[Data Dictionary](./docs/data-dictionary.md)**: Complete database schema documentation
- **[Entity Relationship Diagram](./docs/erd.svg)**: Visual database schema
- **[Project Overview](./docs/project-overview.md)**: Detailed project vision and implementation plan
- **[API Documentation](./docs/api.md)**: GraphQL schema and endpoints
- **[Development Guide](./docs/development.md)**: Detailed development setup and guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ for families who want to manage their wealth like a boutique family office.
