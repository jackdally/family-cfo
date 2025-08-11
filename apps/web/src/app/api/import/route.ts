import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { ensureAccountByName, getOrCreateDefaultScenario, insertExpense, insertIncome } from '../../../lib/hasura'

type ImportRow = {
  date: string
  amount: string
  type: 'income' | 'expense' | 'transfer'
  account: string
  category?: string
  label?: string
  ledger: 'ACTUAL' | 'PROJECTED'
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || ''
  if (!contentType.includes('text/csv') && !contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Upload CSV (text/csv)' }, { status: 400 })
  }

  let csvText = ''
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'file missing' }, { status: 400 })
    csvText = await file.text()
  } else {
    csvText = await req.text()
  }

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as ImportRow[]

  // TODO: Map accounts, insert rows via GraphQL mutation
  const ownerId = 'owner-dev'
  const scenario = await getOrCreateDefaultScenario(ownerId)

  // Group by account name
  const byAccount = new Map<string, ImportRow[]>()
  for (const r of records) {
    const key = r.account || 'Checking'
    if (!byAccount.has(key)) byAccount.set(key, [])
    byAccount.get(key)!.push(r)
  }

  let totalIncome = 0
  let totalExpense = 0

  for (const [accountName, rows] of byAccount) {
    const account = await ensureAccountByName(ownerId, scenario.id, accountName, 'checking')
    const incomeRows = rows
      .filter(r => r.type === 'income')
      .map(r => ({ date: r.date, amount: Number(r.amount), label: r.label || 'income', ledger: r.ledger }))
    const expenseRows = rows
      .filter(r => r.type === 'expense')
      .map(r => ({ date: r.date, amount: Math.abs(Number(r.amount)), category: r.category || 'uncategorized', ledger: r.ledger }))

    if (incomeRows.length) {
      const res = await insertIncome(ownerId, account.id, incomeRows)
      totalIncome += res.insert_IncomeEvent.affected_rows
    }
    if (expenseRows.length) {
      const res = await insertExpense(ownerId, account.id, expenseRows)
      totalExpense += res.insert_ExpenseEvent.affected_rows
    }
  }

  const summary = { total: records.length, income: totalIncome, expense: totalExpense, transfer: records.filter(r => r.type === 'transfer').length }
  return NextResponse.json({ ok: true, scenarioId: scenario.id, summary })
}


