export const metadata = {
  title: 'Family CFO',
  description: 'Scenario-first, dual-ledger financial planning (MVP shell)'
}

import './globals.css'
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  )
}

