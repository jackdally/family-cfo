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
| `name` | `String` | Yes | Human-readable name for the scenario (e.g., "Baseline 2025", "Home Purchase 2029") |
| `description` | `String` | No | Optional detailed description of the scenario |
| `startDate` | `DateTime` | Yes | Start date for the scenario's financial planning period |
| `isPrimary` | `Boolean` | Yes | Whether this is the primary scenario (only one per user) |
| `accounts` | `Account[]` | Yes | Related entities |
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
| `name` | `String` | Yes | Human-readable account name (e.g., "Chase Checking", "Vanguard 401k") |
| `type` | `String` | Yes | Account type (e.g., "checking", "savings", "investment", "loan") |
| `owner` | `String` | Yes | Account owner (e.g., "John", "Jane", "Joint") |
| `isActive` | `Boolean` | Yes | Whether the account is currently active |
| `scenario` | `Scenario` | Yes |  |
| `scenarioId` | `String` | Yes |  |
| `balances` | `AccountBalance[]` | Yes |  |
| `sentTransfers` | `AccountTransfer[]` | Yes |  |
| `receivedTransfers` | `AccountTransfer[]` | Yes |  |

#### Relationships

- **sentTransfers**: from with `AccountTransfer`
- **receivedTransfers**: to with `AccountTransfer`

#### Indexes

- `scenarioId, type`

---

### AccountBalance

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `String` | Yes |  |
| `date` | `DateTime` | Yes | Date of the balance snapshot |
| `value` | `Decimal` | Yes | Account balance amount (positive for assets, negative for liabilities) |
| `isActual` | `Boolean` | Yes | Whether this is an actual balance (true) or projected (false) |
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
| `date` | `DateTime` | Yes | Date of the income event |
| `amount` | `Decimal` | Yes | Income amount (positive) |
| `isActual` | `Boolean` | Yes | Whether this is an actual income (true) or projected (false) |
| `owner` | `String` | Yes | Income source owner (e.g., "John", "Jane") |
| `label` | `String` | No | Income description (e.g., "Salary", "Bonus", "Dividends") |
| `scenario` | `Scenario` | Yes |  |
| `scenarioId` | `String` | Yes |  |

---

### ExpenseEvent

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `String` | Yes |  |
| `date` | `DateTime` | Yes | Date of the expense event |
| `amount` | `Decimal` | Yes | Expense amount (positive) |
| `isActual` | `Boolean` | Yes | Whether this is an actual expense (true) or projected (false) |
| `category` | `String` | Yes | Expense category (e.g., "groceries", "entertainment", "utilities") |
| `notes` | `String` | No | Optional notes about the expense |
| `scenario` | `Scenario` | Yes |  |
| `scenarioId` | `String` | Yes |  |

---

### AccountTransfer

─────────── Internal transfers

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `String` | Yes |  |
| `date` | `DateTime` | Yes | Date of the transfer |
| `amount` | `Decimal` | Yes | Transfer amount (positive) |
| `isActual` | `Boolean` | Yes | Whether this is an actual transfer (true) or projected (false) |
| `fromAccount` | `Account` | Yes | Source account |
| `fromAccountId` | `String` | Yes |  |
| `toAccount` | `Account` | Yes | Destination account |
| `toAccountId` | `String` | Yes |  |
| `scenario` | `Scenario` | Yes |  |
| `scenarioId` | `String` | Yes |  |

#### Indexes

- `fromAccountId, date`
- `toAccountId, date`

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

