export const metadata = {
  title: 'Family CFO',
  description: 'Scenario-first, dual-ledger financial planning (MVP shell)'
}

import './globals.css'
import React from 'react'
import HealthPill from '../components/HealthPill'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <header className="border-b border-neutral-900">
          <div className="mx-auto flex max-w-5xl items-center justify-between p-4 text-sm">
            <a href="/" className="font-semibold">Family CFO</a>
            <nav className="flex items-center gap-4">
              <a href="/scenarios" className="text-neutral-300 hover:text-white">Scenarios</a>
              <a href="/accounts" className="text-neutral-300 hover:text-white">Accounts</a>
              <a href="/import" className="text-neutral-300 hover:text-white">Import</a>
              <a href="https://jackdally.github.io/family-cfo/" target="_blank" rel="noreferrer" className="text-neutral-300 hover:text-white">Docs</a>
              <HealthPill />
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}

