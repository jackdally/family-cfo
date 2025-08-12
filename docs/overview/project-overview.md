---
slug: "/"
title: "Project Overview: Family CFO (by Steward)"
---

# Project Overview: Family CFO (by Steward)

## 🎯 Mission & Vision

Family CFO is the flagship application of **Steward**, a long-term company focused on building enduring tools for families to manage their legacy across generations. This application transforms personal finance from reactive, spreadsheet-driven budgeting into **proactive, scenario-based financial modeling**—mirroring the rigor of corporate financial systems, but redesigned for real life.

Our mission is to empower households with tools that promote **clarity, confidence, and control** through:

- **Month-by-month forecasting** with dual-ledger actual vs. projected tracking
- **Liquidity intelligence** that anticipates timing mismatches and recommends buffer management strategies
- **Scenario planning** for branching futures like sabbaticals, home purchases, job transitions, or retirement
- **Long-term wealth optimization** for saving, spending, investing, and intergenerational planning

## 🌐 Platform Vision

- Family CFO will launch as a **web application**, built for modern browsers with responsive UI for tablets and mobile-first use cases.
- The platform will expand into a **native mobile app** to support daily financial check-ins, notifications, and offline capabilities.
- All development must support this **multi-platform scalability**, using component libraries, state management, and authentication that seamlessly work across web and mobile surfaces.

## 🏗️ Architecture & Stack

### Core Philosophy

**Dual-Ledger Model**: Every financial event can be "Projected" or "Actual." Nothing is overwritten; variance analysis is first-class. This enables:
- Auditable financial history
- Scenario comparison and analysis
- Early warning of trends and variances
- Confidence in financial decision-making

**Scenario Engine**: Branch, clone, and diff any future—job loss, home purchase, sabbatical—then compare outcomes. Each scenario is a complete financial universe that can be:
- Independently modified
- Compared against baselines
- Merged with actual data
- Used for contingency planning

### Technical Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 14    │    │   Hasura        │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (GraphQL API) │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   Supabase      │◄─────────────┘
                        │   (Auth)        │
                        └─────────────────┘
```

### Stack Highlights
- **Frontend**: Next.js 14, shadcn/ui, Tailwind, TypeScript
- **Backend**: Hasura + Supabase (Postgres), Prisma ORM
- **Infra**: Docker, GitHub Actions, Railway/Fly.io for Python services
- **Auth**: Supabase (RLS, JWT, optional OTP)
- **Mobile**: React Native or Expo-compatible components to be evaluated

## Development Workflow & Branching Model

- **Main branch**: Always production-ready, deployed to production environment.
- **Develop branch**: Integration branch for completed features, deployed to staging environment.
- **Feature branches**: Named `feature/<name>` for new features, merged into develop via Pull Request after review.
- **Fix branches**: Named `fix/<name>` for bug fixes, same PR process as features.
- **Cleanup/Chore branches**: Named `chore/<name>` for refactors, docs updates, or dependency upgrades.
- **Pull Requests**: All changes require PRs reviewed by Jack before merging to develop or main.
- **CI/CD**: GitHub Actions pipeline runs build, lint, type-check, tests, and deploys automatically.
- **Versioning**: Semantic Versioning `MAJOR.MINOR.PATCH` with changelog updates in docs.
- **Code Reviews**: No direct commits to main or develop — all changes go through PRs.

## ⚙️ Initial Database Schema

```prisma
model Scenario {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  accounts  Account[]
}

model Account {
  id        String   @id @default(uuid())
  name      String
  type      String
  scenario  Scenario @relation(fields: [scenarioId], references: [id])
  scenarioId String
  balances  AccountBalance[]
  incomeEvents IncomeEvent[]
  expenseEvents ExpenseEvent[]
}

model AccountBalance {
  id        String   @id @default(uuid())
  date      DateTime
  balance   Decimal
  account   Account @relation(fields: [accountId], references: [id])
  accountId String
}

model IncomeEvent {
  id        String   @id @default(uuid())
  date      DateTime
  amount    Decimal
  accountId String
  label     String
  account   Account @relation(fields: [accountId], references: [id])
}

model ExpenseEvent {
  id        String   @id @default(uuid())
  date      DateTime
  amount    Decimal
  accountId String
  category  String
  account   Account @relation(fields: [accountId], references: [id])
}

model AccountTransfer {
  id            String   @id @default(uuid())
  fromAccountId String
  toAccountId   String
  amount        Decimal
  date          DateTime
}
```

### Phase 0: Core Foundation (Current)

**Core Models**:
- `Scenario`: Root context for financial planning
- `Account`: Financial buckets (checking, mortgage, 401k)
- `AccountBalance`: Historical balance tracking
- `IncomeEvent`: Income transactions with owner/label
- `ExpenseEvent`: Expense transactions with categorization
- `AccountTransfer`: Internal account movements

**Key Features**:
- All IDs are UUID strings
- Cascade deletes maintain data integrity
- Dual-ledger actual vs. projected tracking
- Scenario-based data isolation

### Phase 1: Liquidity Brain

**New Models**:
- `BufferRule`: Desired floor/ceiling per account
- `LiquidityAlert`: Generated when rules are violated

**Features**:
- Daily "days-of-cash" projections
- Automatic paycheck-split suggestions
- Buffer violation alerts
- Allocation recommendations

### Phase 1.5: Scenario Engine

**Features**:
- Scenario cloning and branching
- Diff visualization between scenarios
- Merge actual data into projections
- Scenario comparison tools

### Phase 2: Asset Valuation

**New Models**:
- `Asset`: Depreciation/appreciation parameters

**Features**:
- Asset lifecycle tracking
- Depreciation/appreciation curves
- "Replace vs repair" crossover alerts
- Net worth impact visualization

### Phase 2.5: Optimizer

**New Models**:
- `Goal`: Financial objectives (purchase, retirement, etc.)
- `OptimizerRun`: Solver execution snapshots

**Features**:
- Goal wizard with quantified options
- Linear programming optimization
- Funding path recommendations
- Confidence-ranked alternatives

### Phase 3: Advisor & Notifications

**New Models**:
- `Notification`: Central message system

**Features**:
- Digest emails and alerts
- Natural-language scenario entry
- LLM-powered explanations
- Proactive financial advice

### Phase 4: Tax & Estate

**New Models**:
- `TaxRule`: Tax calculation parameters
- `EstateObject`: Inheritance planning

**Features**:
- Tax projection and optimization
- Inheritance planning tools
- Stepped-basis calculations
- Estate continuity planning

### Phase-to-Milestone Mapping

- Each roadmap phase will be mirrored as a **GitHub Milestone** with linked issues.
- Each feature or task will have its own branch and PR linked to the milestone.
- At milestone completion, merge develop into main, tag the release, and deploy.
- All milestone completions will be documented in `/docs/changelog` and on the public documentation site.

## 🎨 Design System & UX

### Visual Identity

**Color Palette**:
- **Primary**: Jewel greens for positive financial indicators
- **Secondary**: Copper tones for negative indicators
- **Background**: Dark-mode default for reduced eye strain
- **Accent**: Elegant serif headings with Inter body text

**Layout Principles**:
- 12-column fluid grid system
- Collapsible sidebar navigation
- Maximum width of 1280px for optimal readability
- Responsive design for all screen sizes

### User Experience Guidelines

**Charts & Data Visualization**:
- One metric per chart for clarity
- Recharts library for consistency
- No hard-coded colors; use design system
- Export functionality for all visualizations

**Forms & Input**:
- Multi-step wizards for complex entries
- Smart defaults based on user patterns
- Real-time validation with helpful error messages
- Progressive disclosure for advanced features

**Accessibility**:
- WCAG 2.1 AA compliance
- Full keyboard navigation support
- Reduced-motion friendly animations
- Screen reader optimization

### ✅ Phase 0: Bootstrap (Foundational Build)
- Project repo setup, schema design, Docker infra
- Prisma schema, Supabase, GraphQL, CI/CD

### 🔨 Phase 1: MVP Dashboard
- Dual-ledger tracking with CRUD for accounts and events
- Scenario management and Net Worth dashboard
- Data validation, dark mode UI, mobile-responsive design

### 🧠 Phase 1.5: Liquidity Brain
- Buffer rules and alerts
- Days-of-cash projection
- Allocation engine for optimizing transfers and paycheck splits

### 🪞 Phase 1.75: Scenario Engine
- Scenario clone, diff, merge, and visualization tools
- “What if” branching interface and side-by-side projections

### 💎 Phase 2: Asset Valuation
- Asset entry with depreciation/appreciation models
- Lifecycle tracking and replacement forecasting
- Budget and net worth impact estimation

### 🧮 Phase 2.5: Goal Optimizer
- LP solver for multiple financial goals with constraints
- Confidence scoring and funding path analysis
- Wizard UX and long-form explanations

### 🧭 Phase 3: Advisor & Notifications
- LLM-powered summaries, suggestions, and financial trend detection
- Digest emails, alerts, push notifications (mobile-ready)
- Financial journaling and semantic querying

### 📜 Phase 4: Tax & Estate Planning
- Tax rules and filing optimization
- Inheritance modeling and estate continuity tools
- Legacy vault for secure documents and succession guidance

## 💻 Technology Principles

- Use **future-proofed, well-supported open source** tooling wherever possible
- Prioritize **developer ergonomics** to allow fast iteration
- Infrastructure costs must remain affordable for 10K+ users (~$300–500/month max)
- Use **AI responsibly** to assist, not automate, financial decisions

## Planning & Review Cadence

- **Weekly planning session** (live or async) to approve priorities for the next sprint.
- **Mid-sprint check-in** to review progress and resolve blockers.
- **Pre-merge sign-off** by Jack on all PRs to develop or main.
- **End-of-sprint demo** deployed to staging for live testing.
- All roadmap or scope changes require approval before implementation.

## Documentation Requirements

- Documentation site built with Docusaurus (or similar), stored in `/docs`, deployed to GitHub Pages or Vercel.
- **Sections**:
  1. Project Overview
  2. Feature Roadmap
  3. Development Guidelines
  4. Changelog
  5. User Guides
  6. API Reference
  7. Decision Log
- Docs must be updated as part of every PR.

## Environments & Deployment

- **Local**: Developer machines via Docker Compose.
- **Staging**: Auto-deployed from develop branch for QA and demos.
- **Production**: Auto-deployed from main branch after approved release.
- **Data**: Anonymized seed data for dev/staging; production data never used outside production.

## Acceptance Criteria

Each phase is considered “done” when:
- All listed features and models are implemented.
- API endpoints have tests with 80%+ coverage.
- UI components are responsive and meet design specs.
- Documentation is updated for all changes.
- All work passes QA on staging before production merge.

## Issue & PR Templates

- **Feature Request** — user story format with acceptance criteria.
- **Bug Report** — reproduction steps, expected vs. actual results.
- **Pull Request** — change summary, linked issue/milestone, testing notes, screenshots/GIFs, docs/tests checklist.

## Security, Privacy, and Compliance

- No secrets or credentials committed to repo; use environment variables.
- All sensitive data encrypted at rest (Postgres) and in transit (TLS).
- Role-based access control for all APIs.
- Privacy-by-design principles followed throughout development.

## Testing Strategy

- **Unit Tests** — backend logic, utilities.
- **Integration Tests** — GraphQL API endpoints.
- **UI Snapshot Tests** — for components.
- **End-to-End Tests** — for core flows in staging.
- Automated tests run on all PRs.

## 💰 Cost & Monetization Philosophy

### Bootstrapped Strategy
- No salaries in Year 1 — part-time build by founders (Jack + wife)
- No legal entity until revenue exists
- &lt;$1,000 total infra cost target before launch

### Monetization Plan
- $5–10/month subscription for power users
- Freemium tier for households just getting started
- Waitlist-based user cap to prevent scaling too fast

## 📊 Success Metrics

- Net income positive by Year 2 with 1,250 paid users
 - Break-even possible with $75K revenue and &lt;$115K OpEx
- Gradual scaling with focus on retention and trust

## 🌱 Long-Term Vision

Family CFO is just the beginning. As part of the **Steward** platform, this tool will be the financial modeling and decision engine for a suite of household systems — including:

- **Nestboard**: Family goal dashboard for shared saving and planning
- **Legacy Ledger**: Estate and inheritance coordination
- **Heirloom OS**: Final directives, instructions, and account transfer orchestration
- **Steward Beacon**: Physical device for in-home financial signal display

This is not a startup to flip. This is a generational tool — built to outlast us.

