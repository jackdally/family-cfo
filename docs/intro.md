# Welcome to FamilyCFO

> A luxury-grade, CFO-level personal finance platform that treats a household like a boutique family office—providing month-by-month forecasting, liquidity intelligence, scenario planning, and long-term wealth optimization.

## 🎯 What is FamilyCFO?

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
| **Backend Logic** | Next.js API routes \| Python micro-svcs | JS for dev; Py for math optimization |
| **Frontend** | Next.js 14 (App Router) + Tailwind + shadcn/ui | SSR, server components, modern UI kit |
| **Auth** | Supabase Auth | magic-link + OAuth, wires to PG roles |
| **DevOps** | Docker Compose (local) → Vercel (+ managed PG) → GitHub Actions CI | fast local start, painless deploy |

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

## 📊 Core Concepts

### Dual-Ledger Model

Every financial event can be "Projected" or "Actual." Nothing is overwritten; variance analysis is first-class. This enables:

- Auditable financial history
- Scenario comparison and analysis
- Early warning of trends and variances
- Confidence in financial decision-making

### Scenario Engine

Branch, clone, and diff any future—job loss, home purchase, sabbatical—then compare outcomes. Each scenario is a complete financial universe that can be:

- Independently modified
- Compared against baselines
- Merged with actual data
- Used for contingency planning

## 📚 Documentation Structure

### Core Documentation
- **[Data Dictionary](./data-dictionary.md)** - Complete database schema documentation
- **[Entity Relationship Diagram](./erd.svg)** - Visual database schema

### Project Documentation
- **[Project Overview](./project-overview.md)** - Vision, architecture, and value proposition
- **[Roadmap](./roadmap.md)** - Development phases and milestones
- **[API Documentation](./api.md)** - GraphQL endpoints and patterns
- **[Development Guide](./development.md)** - Coding standards and workflow

## 🎨 Design Philosophy

### Visual Identity
- **Dark-mode default** for reduced eye strain
- **Jewel greens** for positive financial indicators
- **Copper tones** for negative indicators
- **Elegant serif headings** with Inter body text

### User Experience
- **12-column fluid grid** system
- **Maximum width 1280px** for optimal readability
- **One metric per chart** for clarity
- **Multi-step wizards** for complex entries
- **Real-time validation** with helpful error messages

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

## 🗺️ Current Status

**Phase 0: Bootstrap** - Infrastructure and development environment setup

**Next Steps:**
1. Complete Docker development environment
2. Set up Hasura GraphQL
3. Create basic Next.js application
4. Implement authentication
5. Build MVP dashboard

## 🤝 Contributing

We welcome contributions! Please see our [Development Guide](./development.md) for:

- Coding standards and best practices
- Git workflow and commit conventions
- Testing requirements
- Documentation guidelines

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/jackdally/family-cfo/issues)
- **Discussions**: [Join the community](https://github.com/jackdally/family-cfo/discussions)
- **Documentation**: This site contains comprehensive guides and references

---

**Built with ❤️ for families who want to manage their wealth like a boutique family office.** 