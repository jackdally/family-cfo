"use client"
import { useState } from 'react'

export default function ImportPage() {
  const [result, setResult] = useState<any>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setBusy(true)
    try {
      const res = await fetch('/api/import', { method: 'POST', body: data })
      const json = await res.json()
      setResult(json)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">CSV Import</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <input type="file" name="file" accept=".csv,text/csv" required className="block" />
        <button disabled={busy} className="rounded bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">
          {busy ? 'Importing…' : 'Import CSV'}
        </button>
      </form>
      {result && (
        <pre className="mt-6 whitespace-pre-wrap rounded bg-neutral-900 p-4 text-sm text-neutral-300">
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  )
}


