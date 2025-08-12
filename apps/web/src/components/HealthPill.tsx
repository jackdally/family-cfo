"use client"
import { useEffect, useState } from 'react'

export default function HealthPill() {
  const [ok, setOk] = useState<boolean | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch('/api/health', { cache: 'no-store' })
      .then(res => setOk(res.ok))
      .catch(() => setOk(false))
    return () => {
      cancelled = true
    }
  }, [])

  const cls = ok === null ? 'bg-neutral-700' : ok ? 'bg-emerald-700' : 'bg-rose-700'
  const text = ok === null ? 'Checking…' : ok ? 'Connected' : 'Hasura error'
  return <span className={`rounded px-2 py-1 text-xs text-white ${cls}`}>{text}</span>
}


