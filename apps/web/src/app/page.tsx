export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-semibold">Family CFO</h1>
      <p className="mt-4 text-neutral-300">
        MVP shell ready. Next steps: connect to Hasura GraphQL, scaffold auth, and build
        Accounts, Events, and Scenarios CRUD.
      </p>
      <div className="mt-8 space-x-4">
        <a className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white" href="/scenarios">Scenarios</a>
        <a className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white" href="/import">CSV Import</a>
        <a className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white" href="/accounts">Accounts</a>
      </div>
    </main>
  )
}

