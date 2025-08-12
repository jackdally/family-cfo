import { gql } from '../../lib/hasura'

export const dynamic = 'force-dynamic'

async function listAccounts(ownerId: string) {
  const q = `
    query Q($ownerId: String!) { Account(where: { ownerId: { _eq: $ownerId } }, order_by: { name: asc }) { id name type scenarioId } }
  `
  const data = await gql<{ Account: Array<{ id: string; name: string; type: string; scenarioId: string }> }>(q, { ownerId })
  return data.Account
}

async function createAccount(ownerId: string, name: string, type: string, scenarioId: string) {
  const m = `
    mutation M($object: Account_insert_input!) { insert_Account_one(object: $object) { id } }
  `
  await gql(m, { object: { ownerId, name, type, scenarioId } })
}

async function listScenarios(ownerId: string) {
  const q = `query Q($ownerId: String!) { Scenario(where: { ownerId: { _eq: $ownerId } }) { id name } }`
  const data = await gql<{ Scenario: Array<{ id: string; name: string }> }>(q, { ownerId })
  return data.Scenario
}

export default async function AccountsPage() {
  const ownerId = 'owner-dev'
  const [accounts, scenarios] = await Promise.all([listAccounts(ownerId), listScenarios(ownerId)])

  async function action(formData: FormData) {
    'use server'
    const name = String(formData.get('name') || '').trim()
    const type = String(formData.get('type') || 'checking')
    const scenarioId = String(formData.get('scenarioId') || '')
    if (!name || !scenarioId) return
    await createAccount(ownerId, name, type, scenarioId)
  }

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <section>
        <h1 className="text-2xl font-semibold">Accounts</h1>
        <ul className="mt-4 divide-y divide-neutral-800 rounded border border-neutral-800">
          {accounts.map(a => (
            <li key={a.id} className="flex items-center justify-between p-3">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-neutral-400">{a.type} · scenario {a.scenarioId.slice(0,8)}</div>
              </div>
            </li>
          ))}
          {accounts.length === 0 && (
            <li className="p-3 text-neutral-400">No accounts</li>
          )}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Create Account</h2>
        <form action={action} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <input name="name" placeholder="Name" className="rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-emerald-600" />
          <select name="type" className="rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-emerald-600">
            <option value="checking">checking</option>
            <option value="savings">savings</option>
            <option value="brokerage">brokerage</option>
            <option value="credit">credit</option>
          </select>
          <select name="scenarioId" className="rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-emerald-600">
            <option value="">Select scenario</option>
            {scenarios.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white">Create</button>
        </form>
      </section>
    </main>
  )
}


