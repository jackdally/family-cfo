# Family CFO Data Dictionary

This document describes the database schema for the Family CFO application, which helps families plan and track their financial scenarios.

## Overview

The application is built around the concept of **Scenarios** - different financial planning scenarios that can be compared and analyzed. Each scenario contains accounts, transactions, and balances.

## Models

### Scenario

─────────── Scenario (root context)

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `String` | Yes |  |
| `name` | `String` | Yes |  |
| `description` | `String` | No |  |
| `startDate` | `DateTime` | Yes |  |
| `isPrimary` | `Boolean` | Yes |  |
| `accounts` | `Account[]` | Yes |  |
| `incomeEvents` | `IncomeEvent[]` | Yes |  |
| `expenseEvents` | `ExpenseEvent[]` | Yes |  |
| `accountTransfers` | `AccountTransfer[]` | Yes |  |
| `accountBalances` | `AccountBalance[]` | Yes |  |

---

### Account

─────────── Account + Balances

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `String` | Yes |  |
| `name` | `String` | Yes |  |
| `type` | `String` | Yes |  |
| `owner` | `String` | Yes |  |
| `isActive` | `Boolean` | Yes |  |
| `scenario` | `Scenario` | Yes |  |
| `scenarioId` | `String` | Yes |  |
| `balances` | `AccountBalance[]` | Yes |  |
| `sentTransfers` | `AccountTransfer[]` | Yes |  |
| `receivedTransfers` | `AccountTransfer[]` | Yes |  |

#### Relationships

- **sentTransfers**: One-to-Many relationship with `AccountTransfer`
- **receivedTransfers**: One-to-Many relationship with `AccountTransfer`

#### Indexes

- `scenarioId, type`

---

### AccountBalance

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `String` | Yes |  |
| `date` | `DateTime` | Yes |  |
| `value` | `Decimal` | Yes |  |
| `isActual` | `Boolean` | Yes |  |
| `account` | `Account` | Yes |  |
| `accountId` | `String` | Yes |  |
| `scenario` | `Scenario` | Yes |  |
| `scenarioId` | `String` | Yes |  |

#### Indexes

- `accountId, date`

---

### IncomeEvent

─────────── Income & Expense events

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `String` | Yes |  |
| `date` | `DateTime` | Yes |  |
| `amount` | `Decimal` | Yes |  |
| `isActual` | `Boolean` | Yes |  |
| `owner` | `String` | Yes |  |
| `label` | `String` | No |  |
| `scenario` | `Scenario` | Yes |  |
| `scenarioId` | `String` | Yes |  |

---

### ExpenseEvent

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `String` | Yes |  |
| `date` | `DateTime` | Yes |  |
| `amount` | `Decimal` | Yes |  |
| `isActual` | `Boolean` | Yes |  |
| `category` | `String` | Yes |  |
| `notes` | `String` | No |  |
| `scenario` | `Scenario` | Yes |  |
| `scenarioId` | `String` | Yes |  |

---

### AccountTransfer

─────────── Internal transfers

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `String` | Yes |  |
| `date` | `DateTime` | Yes |  |
| `amount` | `Decimal` | Yes |  |
| `isActual` | `Boolean` | Yes |  |
| `fromAccount` | `Account` | Yes |  |
| `fromAccountId` | `String` | Yes |  |
| `toAccount` | `Account` | Yes |  |
| `toAccountId` | `String` | Yes |  |
| `scenario` | `Scenario` | Yes |  |
| `scenarioId` | `String` | Yes |  |

---

## Relationships Overview

### Scenario (Root Entity)
- **Scenario** is the root entity that contains all other data
- Each scenario represents a different financial planning scenario
- All other entities belong to a specific scenario

### Account Management
- **Account** represents financial accounts (checking, savings, investment, etc.)
- **AccountBalance** tracks historical balances for each account
- **AccountTransfer** handles internal transfers between accounts

### Transaction Tracking
- **IncomeEvent** records income transactions
- **ExpenseEvent** records expense transactions with categorization

### Data Flow
1. Create a **Scenario** for your financial planning
2. Add **Accounts** to the scenario
3. Record **IncomeEvent** and **ExpenseEvent** transactions
4. Track **AccountBalance** over time
5. Use **AccountTransfer** for internal account movements

## Data Types

- **String**: Text data, often UUIDs for IDs
- **DateTime**: Date and time values
- **Decimal**: Financial amounts (precise decimal arithmetic)
- **Boolean**: True/false values
- **UUID**: Unique identifiers generated automatically

## Constraints and Rules

- All entities cascade delete when their parent scenario is deleted
- Account transfers must have different source and destination accounts
- Balance tracking supports both actual and projected values
- Expense events include categorization for analysis
- Income events can be associated with specific owners

