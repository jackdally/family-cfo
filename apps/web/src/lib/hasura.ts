const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL || 'http://localhost:8080/v1/graphql'
const HASURA_ADMIN_SECRET = process.env.HASURA_GRAPHQL_ADMIN_SECRET

type GqlResponse<T> = { data?: T; errors?: Array<{ message: string }> }

export async function gql<T>(query: string, variables?: Record<string, any>): Promise<T> {
  if (!HASURA_ADMIN_SECRET) throw new Error('HASURA_GRAPHQL_ADMIN_SECRET not set')
  const res = await fetch(HASURA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  })
  const json = (await res.json()) as GqlResponse<T>
  if (json.errors && json.errors.length) {
    throw new Error(json.errors.map(e => e.message).join('; '))
  }
  return json.data as T
}

export async function getOrCreateDefaultScenario(ownerId: string): Promise<{ id: string; name: string }> {
  const query = `
    query Q($ownerId: String!) {
      Scenario(where: { ownerId: { _eq: $ownerId }, name: { _eq: "Default" } }, limit: 1) { id name }
    }
  `
  const data = await gql<{ Scenario: Array<{ id: string; name: string }> }>(query, { ownerId })
  if (data.Scenario.length) return data.Scenario[0]
  const mutation = `
    mutation M($name: String!, $ownerId: String!) {
      insert_Scenario_one(object: { name: $name, ownerId: $ownerId }) { id name }
    }
  `
  const created = await gql<{ insert_Scenario_one: { id: string; name: string } }>(mutation, {
    name: 'Default',
    ownerId,
  })
  return created.insert_Scenario_one
}

export async function ensureAccountByName(ownerId: string, scenarioId: string, name: string, type = 'checking'): Promise<{ id: string }> {
  const q = `
    query Q($ownerId: String!, $scenarioId: String!, $name: String!) {
      Account(where: { ownerId: { _eq: $ownerId }, scenarioId: { _eq: $scenarioId }, name: { _eq: $name } }, limit: 1) { id }
    }
  `
  const out = await gql<{ Account: Array<{ id: string }> }>(q, { ownerId, scenarioId, name })
  if (out.Account.length) return out.Account[0]
  const m = `
    mutation M($object: Account_insert_input!) { insert_Account_one(object: $object) { id } }
  `
  const created = await gql<{ insert_Account_one: { id: string } }>(m, {
    object: { name, type, scenarioId, ownerId },
  })
  return created.insert_Account_one
}

export type LedgerType = 'ACTUAL' | 'PROJECTED'

export async function insertIncome(ownerId: string, accountId: string, rows: Array<{ date: string; amount: number; label: string; ledger: LedgerType }>) {
  if (rows.length === 0) return { affected_rows: 0 }
  const m = `
    mutation M($objects: [IncomeEvent_insert_input!]!) { insert_IncomeEvent(objects: $objects) { affected_rows } }
  `
  return gql<{ insert_IncomeEvent: { affected_rows: number } }>(m, {
    objects: rows.map(r => ({ date: r.date, amount: r.amount, label: r.label, ledger: r.ledger, accountId, ownerId })),
  })
}

export async function insertExpense(ownerId: string, accountId: string, rows: Array<{ date: string; amount: number; category: string; ledger: LedgerType }>) {
  if (rows.length === 0) return { affected_rows: 0 }
  const m = `
    mutation M($objects: [ExpenseEvent_insert_input!]!) { insert_ExpenseEvent(objects: $objects) { affected_rows } }
  `
  return gql<{ insert_ExpenseEvent: { affected_rows: number } }>(m, {
    objects: rows.map(r => ({ date: r.date, amount: r.amount, category: r.category, ledger: r.ledger, accountId, ownerId })),
  })
}


