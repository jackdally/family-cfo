---
sidebar_position: 3
---

# FamilyCFO API Documentation

## Overview

FamilyCFO uses **Hasura GraphQL** as the primary API layer, providing instant CRUD operations and real-time subscriptions. The API is built on top of PostgreSQL with Prisma as the ORM layer.

## GraphQL Endpoint

```
Production: https://your-hasura-instance.hasura.app/v1/graphql
Development: http://localhost:8080/v1/graphql
```

## Authentication

All API requests require authentication via Supabase Auth. Include the JWT token in the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

## Core Queries

### Scenarios

#### Get All Scenarios
```graphql
query GetScenarios {
  scenarios {
    id
    name
    description
    startDate
    isPrimary
    createdAt
    updatedAt
  }
}
```

#### Get Scenario with Related Data
```graphql
query GetScenarioWithData($id: uuid!) {
  scenarios_by_pk(id: $id) {
    id
    name
    description
    startDate
    isPrimary
    accounts {
      id
      name
      type
      owner
      isActive
      balances {
        id
        date
        value
        isActual
      }
    }
    incomeEvents {
      id
      date
      amount
      owner
      label
      isActual
    }
    expenseEvents {
      id
      date
      amount
      category
      notes
      isActual
    }
    accountTransfers {
      id
      date
      amount
      isActual
      fromAccount {
        id
        name
      }
      toAccount {
        id
        name
      }
    }
  }
}
```

### Accounts

#### Get Accounts by Scenario
```graphql
query GetAccountsByScenario($scenarioId: uuid!) {
  accounts(where: { scenarioId: { _eq: $scenarioId } }) {
    id
    name
    type
    owner
    isActive
    balances(order_by: { date: desc }, limit: 1) {
      id
      date
      value
      isActual
    }
  }
}
```

#### Get Account Balance History
```graphql
query GetAccountBalanceHistory($accountId: uuid!, $startDate: timestamptz!, $endDate: timestamptz!) {
  accountBalances(
    where: { 
      accountId: { _eq: $accountId },
      date: { _gte: $startDate, _lte: $endDate }
    },
    order_by: { date: asc }
  ) {
    id
    date
    value
    isActual
  }
}
```

### Income Events

#### Get Income Events by Date Range
```graphql
query GetIncomeEvents($scenarioId: uuid!, $startDate: timestamptz!, $endDate: timestamptz!) {
  incomeEvents(
    where: {
      scenarioId: { _eq: $scenarioId },
      date: { _gte: $startDate, _lte: $endDate }
    },
    order_by: { date: desc }
  ) {
    id
    date
    amount
    owner
    label
    isActual
  }
}
```

### Expense Events

#### Get Expense Events by Category
```graphql
query GetExpenseEventsByCategory($scenarioId: uuid!, $category: String!) {
  expenseEvents(
    where: {
      scenarioId: { _eq: $scenarioId },
      category: { _eq: $category }
    },
    order_by: { date: desc }
  ) {
    id
    date
    amount
    category
    notes
    isActual
  }
}
```

### Account Transfers

#### Get Transfers by Account
```graphql
query GetTransfersByAccount($accountId: uuid!) {
  accountTransfers(
    where: {
      _or: [
        { fromAccountId: { _eq: $accountId } },
        { toAccountId: { _eq: $accountId } }
      ]
    },
    order_by: { date: desc }
  ) {
    id
    date
    amount
    isActual
    fromAccount {
      id
      name
    }
    toAccount {
      id
      name
    }
  }
}
```

## Mutations

### Create Scenario
```graphql
mutation CreateScenario($name: String!, $description: String, $startDate: timestamptz!, $isPrimary: Boolean!) {
  insert_scenarios_one(object: {
    name: $name,
    description: $description,
    startDate: $startDate,
    isPrimary: $isPrimary
  }) {
    id
    name
    description
    startDate
    isPrimary
  }
}
```

### Create Account
```graphql
mutation CreateAccount($name: String!, $type: String!, $owner: String!, $scenarioId: uuid!) {
  insert_accounts_one(object: {
    name: $name,
    type: $type,
    owner: $owner,
    scenarioId: $scenarioId
  }) {
    id
    name
    type
    owner
    isActive
  }
}
```

### Create Income Event
```graphql
mutation CreateIncomeEvent($date: timestamptz!, $amount: numeric!, $owner: String!, $label: String, $scenarioId: uuid!, $isActual: Boolean!) {
  insert_incomeEvents_one(object: {
    date: $date,
    amount: $amount,
    owner: $owner,
    label: $label,
    scenarioId: $scenarioId,
    isActual: $isActual
  }) {
    id
    date
    amount
    owner
    label
    isActual
  }
}
```

### Create Expense Event
```graphql
mutation CreateExpenseEvent($date: timestamptz!, $amount: numeric!, $category: String!, $notes: String, $scenarioId: uuid!, $isActual: Boolean!) {
  insert_expenseEvents_one(object: {
    date: $date,
    amount: $amount,
    category: $category,
    notes: $notes,
    scenarioId: $scenarioId,
    isActual: $isActual
  }) {
    id
    date
    amount
    category
    notes
    isActual
  }
}
```

### Create Account Balance
```graphql
mutation CreateAccountBalance($accountId: uuid!, $date: timestamptz!, $value: numeric!, $scenarioId: uuid!, $isActual: Boolean!) {
  insert_accountBalances_one(object: {
    accountId: $accountId,
    date: $date,
    value: $value,
    scenarioId: $scenarioId,
    isActual: $isActual
  }) {
    id
    date
    value
    isActual
  }
}
```

### Create Account Transfer
```graphql
mutation CreateAccountTransfer($fromAccountId: uuid!, $toAccountId: uuid!, $amount: numeric!, $date: timestamptz!, $scenarioId: uuid!, $isActual: Boolean!) {
  insert_accountTransfers_one(object: {
    fromAccountId: $fromAccountId,
    toAccountId: $toAccountId,
    amount: $amount,
    date: $date,
    scenarioId: $scenarioId,
    isActual: $isActual
  }) {
    id
    date
    amount
    isActual
    fromAccount {
      id
      name
    }
    toAccount {
      id
      name
    }
  }
}
```

## Subscriptions

### Real-time Account Balance Updates
```graphql
subscription WatchAccountBalances($accountId: uuid!) {
  accountBalances(
    where: { accountId: { _eq: $accountId } },
    order_by: { date: desc },
    limit: 1
  ) {
    id
    date
    value
    isActual
  }
}
```

### Real-time Income Events
```graphql
subscription WatchIncomeEvents($scenarioId: uuid!) {
  incomeEvents(
    where: { scenarioId: { _eq: $scenarioId } },
    order_by: { date: desc }
  ) {
    id
    date
    amount
    owner
    label
    isActual
  }
}
```

## Data Types

### Scalar Types

| Type | Description | Example |
|------|-------------|---------|
| `uuid` | Unique identifier | `"123e4567-e89b-12d3-a456-426614174000"` |
| `timestamptz` | Timestamp with timezone | `"2025-01-15T10:30:00Z"` |
| `numeric` | Decimal number (18,2) | `"1500.50"` |
| `String` | Text string | `"General Checking"` |
| `Boolean` | True/false value | `true` |

### Enums

#### Account Types
```graphql
enum AccountType {
  CHECKING
  SAVINGS
  INVESTMENT
  CREDIT_CARD
  LOAN
  MORTGAGE
  RETIREMENT
  OTHER
}
```

#### Event Categories
```graphql
enum ExpenseCategory {
  HOUSING
  TRANSPORTATION
  FOOD
  UTILITIES
  INSURANCE
  HEALTHCARE
  ENTERTAINMENT
  SHOPPING
  TRAVEL
  OTHER
}
```

## Error Handling

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `JWT_INVALID` | Invalid or expired token | Re-authenticate with Supabase |
| `PERMISSION_DENIED` | Insufficient permissions | Check user role and permissions |
| `FOREIGN_KEY_VIOLATION` | Referenced record doesn't exist | Ensure parent records exist |
| `NOT_NULL_VIOLATION` | Required field is missing | Provide all required fields |
| `UNIQUE_VIOLATION` | Duplicate unique constraint | Use different value or update existing |

### Error Response Format
```json
{
  "errors": [
    {
      "message": "Error description",
      "extensions": {
        "code": "ERROR_CODE",
        "path": "$.queryName"
      }
    }
  ]
}
```

## Rate Limiting

- **Queries**: 1000 requests per minute per user
- **Mutations**: 100 requests per minute per user
- **Subscriptions**: 10 concurrent subscriptions per user

## Best Practices

### Query Optimization

1. **Use specific field selection** instead of selecting all fields
2. **Implement pagination** for large datasets
3. **Use filters** to limit data scope
4. **Leverage indexes** on frequently queried fields

### Security

1. **Always validate input** on the client side
2. **Use Row Level Security (RLS)** policies
3. **Implement proper error handling**
4. **Log sensitive operations**

### Performance

1. **Use subscriptions sparingly** - prefer polling for infrequent updates
2. **Batch mutations** when possible
3. **Cache frequently accessed data**
4. **Monitor query performance** with Hasura's analytics

## SDK Examples

### JavaScript/TypeScript

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Get user session
const { data: { session } } = await supabase.auth.getSession()

// Make GraphQL request
const response = await fetch('https://your-hasura-instance.hasura.app/v1/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token}`
  },
  body: JSON.stringify({
    query: `
      query GetScenarios {
        scenarios {
          id
          name
          description
        }
      }
    `
  })
})

const data = await response.json()
```

### Python

```python
import requests
import json

def get_scenarios(token):
    url = "https://your-hasura-instance.hasura.app/v1/graphql"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }
    
    query = """
    query GetScenarios {
        scenarios {
            id
            name
            description
        }
    }
    """
    
    response = requests.post(url, json={"query": query}, headers=headers)
    return response.json()
```

## Testing

### GraphQL Playground

Access the GraphQL playground at:
```
https://your-hasura-instance.hasura.app/console/api-explorer
```

### Example Test Queries

```graphql
# Test basic connectivity
query TestConnection {
  scenarios(limit: 1) {
    id
    name
  }
}

# Test authentication
query TestAuth {
  accounts(limit: 1) {
    id
    name
  }
}
```

## Monitoring & Analytics

### Hasura Console

- **API Explorer**: Test queries and mutations
- **Data Browser**: View and edit data directly
- **Schema**: Explore database schema
- **Actions**: Monitor custom actions
- **Events**: Track event triggers

### Performance Metrics

- **Query Response Time**: Monitor average response times
- **Error Rates**: Track API error frequencies
- **Usage Patterns**: Analyze query patterns
- **Resource Utilization**: Monitor database performance 