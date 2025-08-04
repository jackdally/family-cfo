---
sidebar_position: 1
---

# FamilyCFO Development Guide

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm** - `npm install -g pnpm`
- **Docker & Docker Compose** - [Download](https://www.docker.com/)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:jackdally/family-cfo.git
   cd family-cfo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development environment**
   ```bash
   # Start database and Hasura
   docker compose up -d db hasura
   
   # Generate Prisma client
   pnpm exec prisma generate
   
   # Start development server
   pnpm --filter web dev
   ```

## 🏗️ Project Structure

```
family-cfo/
├── docs/                    # Documentation
│   ├── data-dictionary.md   # Database schema docs
│   ├── erd.svg             # Entity relationship diagram
│   ├── project-overview.md  # Project vision and roadmap
│   ├── api.md              # GraphQL API documentation
│   └── development.md      # This file
├── prisma/                 # Database schema and migrations
│   └── schema.prisma       # Prisma schema definition
├── scripts/                # Build and utility scripts
│   └── generate-docs.js    # Documentation generator
├── web/                    # Next.js frontend application
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── docker-compose.yml      # Local development services
├── package.json           # Project dependencies and scripts
└── README.md              # Project overview
```

## 🛠️ Development Workflow

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards below
   - Write tests for new functionality
   - Update documentation as needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

### Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add scenario cloning functionality"
git commit -m "fix: resolve account balance calculation error"
git commit -m "docs: update API documentation for new endpoints"
```

## 📝 Coding Standards

### TypeScript

- **Strict mode**: Always use `strict: true` in `tsconfig.json`
- **Type safety**: Avoid `any` types; use proper interfaces
- **Naming**: Use PascalCase for components, camelCase for functions/variables
- **Imports**: Use absolute imports from `@/` alias

```typescript
// ✅ Good
import { Account } from '@/types/account'
import { formatCurrency } from '@/lib/utils'

interface AccountBalance {
  id: string
  value: number
  date: Date
}

// ❌ Bad
import { Account } from '../../../types/account'
const account: any = { id: '123' }
```

### React Components

- **Functional components**: Use hooks and functional components
- **Props interface**: Define explicit prop interfaces
- **Error boundaries**: Wrap components that might fail
- **Accessibility**: Include proper ARIA labels and keyboard navigation

```typescript
interface AccountCardProps {
  account: Account
  onEdit?: (account: Account) => void
}

export function AccountCard({ account, onEdit }: AccountCardProps) {
  return (
    <div role="region" aria-label={`Account: ${account.name}`}>
      <h3>{account.name}</h3>
      <p>{formatCurrency(account.balance)}</p>
      {onEdit && (
        <button onClick={() => onEdit(account)}>
          Edit Account
        </button>
      )}
    </div>
  )
}
```

### Database & Prisma

- **Migrations**: Always create migrations for schema changes
- **Seeding**: Use Prisma seeding for test data
- **Relationships**: Use proper foreign key constraints
- **Indexes**: Add indexes for frequently queried fields

```prisma
// ✅ Good
model Account {
  id        String   @id @default(uuid())
  name      String
  type      String
  scenario  Scenario @relation(fields: [scenarioId], references: [id], onDelete: Cascade)
  scenarioId String

  @@index([scenarioId, type])
}

// ❌ Bad
model Account {
  id        String   @id @default(uuid())
  name      String
  type      String
  scenarioId String  // Missing relation
}
```

### GraphQL

- **Field selection**: Only request needed fields
- **Pagination**: Use cursor-based pagination for large datasets
- **Error handling**: Implement proper error boundaries
- **Caching**: Use Apollo Client caching strategies

```typescript
// ✅ Good - Specific field selection
const GET_ACCOUNTS = gql`
  query GetAccounts($scenarioId: uuid!) {
    accounts(where: { scenarioId: { _eq: $scenarioId } }) {
      id
      name
      type
      balances(order_by: { date: desc }, limit: 1) {
        value
        date
      }
    }
  }
`

// ❌ Bad - Selecting all fields
const GET_ACCOUNTS = gql`
  query GetAccounts($scenarioId: uuid!) {
    accounts(where: { scenarioId: { _eq: $scenarioId } }) {
      id
      name
      type
      owner
      isActive
      createdAt
      updatedAt
      balances {
        id
        date
        value
        isActual
        accountId
        scenarioId
      }
    }
  }
`
```

## 🧪 Testing

### Unit Tests

- **Framework**: Vitest (recommended) or Jest
- **Coverage**: Aim for 80%+ code coverage
- **Mocking**: Mock external dependencies
- **Naming**: Use descriptive test names

```typescript
import { describe, it, expect, vi } from 'vitest'
import { formatCurrency } from '@/lib/utils'

describe('formatCurrency', () => {
  it('formats positive amounts correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('formats negative amounts correctly', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
  })

  it('handles zero amounts', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
})
```

### Integration Tests

- **Database**: Use test database with Prisma
- **API**: Test GraphQL endpoints
- **Setup/Teardown**: Clean up test data

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Account API', () => {
  beforeAll(async () => {
    // Setup test database
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('creates an account successfully', async () => {
    // Test account creation
  })
})
```

### E2E Tests

- **Framework**: Playwright or Cypress
- **Scenarios**: Test critical user journeys
- **Data**: Use isolated test data

## 🔧 Development Tools

### VS Code Extensions

Install these recommended extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "graphql.vscode-graphql",
    "ms-vscode.vscode-json"
  ]
}
```

### Prettier Configuration

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

## 🚀 Deployment

### Local Development

```bash
# Start all services
docker compose up -d

# Run migrations
pnpm exec prisma migrate dev

# Start development server
pnpm --filter web dev
```

### Production Deployment

1. **Environment Setup**
   ```bash
   # Set production environment variables
   DATABASE_URL="postgresql://..."
   HASURA_GRAPHQL_ENDPOINT="https://..."
   ```

2. **Database Migration**
   ```bash
   pnpm exec prisma migrate deploy
   ```

3. **Build and Deploy**
   ```bash
   pnpm run build
   # Deploy to Vercel or your preferred platform
   ```

## 🔍 Debugging

### Database Debugging

```bash
# View database logs
docker compose logs db

# Connect to database
docker compose exec db psql -U postgres -d familycfo

# Reset database
pnpm exec prisma migrate reset
```

### GraphQL Debugging

```bash
# Access Hasura console
open http://localhost:8080/console

# View GraphQL queries in browser dev tools
# Check Network tab for GraphQL requests
```

### Frontend Debugging

```bash
# Start with debugging
NODE_OPTIONS='--inspect' pnpm --filter web dev

# Use React DevTools browser extension
# Check browser console for errors
```

## 📚 Resources

### Documentation

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Hasura Documentation](https://hasura.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Community

- [GitHub Issues](https://github.com/jackdally/family-cfo/issues)
- [Discord Community](https://discord.gg/your-community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/familycfo)

## 🆘 Getting Help

1. **Check the documentation** in the `/docs` folder
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information
4. **Join the community** for real-time help

### Issue Template

When creating issues, include:

- **Description**: What you're trying to accomplish
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, Node version, etc.
- **Screenshots**: If applicable 