export const dynamic = 'force-dynamic'
import { gql } from '../../lib/hasura'

async function fetchScenarios(ownerId: string) {
  const q = `
    query Q($ownerId: String!) { Scenario(where: { ownerId: { _eq: $ownerId } }, order_by: { createdAt: asc }) { id name createdAt } }
  `
  const data = await gql<{ Scenario: Array<{ id: string; name: string; createdAt: string }> }>(q, { ownerId })
  return data.Scenario
}

async function createScenario(ownerId: string, name: string) {
  const m = `
    mutation M($name: String!, $ownerId: String!) { insert_Scenario_one(object: { name: $name, ownerId: $ownerId }) { id } }
  `
  await gql(m, { name, ownerId })
}

export default async function ScenariosPage() {
  const ownerId = 'owner-dev'
  const scenarios = await fetchScenarios(ownerId)

  async function action(formData: FormData) {
    'use server'
    const name = String(formData.get('name') || '').trim()
    if (!name) return
    await createScenario(ownerId, name)
  }

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <section>
        <h1 className="text-2xl font-semibold">Scenarios</h1>
        <ul className="mt-4 space-y-2">
          {scenarios.map(s => (
            <li key={s.id} className="rounded border border-neutral-800 p-3">
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-neutral-400">{new Date(s.createdAt).toLocaleString()}</div>
            </li>
          ))}
          {scenarios.length === 0 && (
            <li className="text-neutral-400">No scenarios yet</li>
          )}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Create Scenario</h2>
        <form action={action} className="mt-4 flex gap-2">
          <input name="name" placeholder="Scenario name" className="w-64 rounded border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-emerald-600" />
          <button className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white">Create</button>
        </form>
      </section>
    </main>
  )
}


